// ===================================
// iAM Capital - Investment Properties
// Google Maps & Data Integration
// ===================================

// Configuration
const PROPERTIES_API_URL = 'https://script.google.com/macros/s/AKfycbyY3TsuK56cyYpxZ22p9VLCwROthD4mYLmL9Jvb9M-TukPqbsmabsnI49DAjRSGZ4qKAA/exec';

// Global state
let map;
let markers = [];
let geocoder;
let allProperties = [];
let activeFilters = {
    propertyType: 'all',
    country: 'all'
};

// ===================================
// Map Initialization
// ===================================

/**
 * Initialize Google Maps
 * Called by Google Maps API callback
 */
function initMap() {
    // Center on Europe (Italy/France focus)
    const defaultCenter = { lat: 45.0, lng: 10.0 };

    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 5,
        center: defaultCenter,
        styles: getMapStyles(),
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        zoomControl: true
    });

    geocoder = new google.maps.Geocoder();

    // Load properties after map initializes
    loadProperties();
}

/**
 * Custom map styling - Navy/Lime theme
 */
function getMapStyles() {
    return [
        {
            "featureType": "all",
            "elementType": "geometry",
            "stylers": [{ "color": "#19375F" }]
        },
        {
            "featureType": "all",
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#FFFFFF" }]
        },
        {
            "featureType": "all",
            "elementType": "labels.text.stroke",
            "stylers": [{ "color": "#19375F" }]
        },
        {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [{ "color": "#0F2A3F" }]
        },
        {
            "featureType": "road",
            "elementType": "geometry",
            "stylers": [{ "color": "#2A4A6A" }]
        },
        {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [{ "color": "#19375F" }]
        }
    ];
}

// ===================================
// Data Loading
// ===================================

/**
 * Load properties from Google Apps Script API
 */
async function loadProperties() {
    const mapLoading = document.getElementById('mapLoading');
    const mapError = document.getElementById('mapError');
    const propertiesLoading = document.getElementById('propertiesLoading');
    const propertiesError = document.getElementById('propertiesError');

    try {
        const response = await fetch(PROPERTIES_API_URL);

        if (!response.ok) {
            throw new Error('Failed to fetch properties');
        }

        const data = await response.json();

        // Handle API error response
        if (data.error) {
            throw new Error(data.message);
        }

        // Hide loading states
        mapLoading.style.display = 'none';
        propertiesLoading.style.display = 'none';

        // Process properties
        if (data.properties && data.properties.length > 0) {
            allProperties = data.properties;
            await geocodeAndRenderProperties(data.properties);
            renderPropertyCards(data.properties);
            renderFilterPills(data.properties);
        } else {
            // No properties case
            mapError.style.display = 'flex';
            propertiesError.style.display = 'block';
        }

    } catch (error) {
        console.error('Properties load error:', error);
        mapLoading.style.display = 'none';
        mapError.style.display = 'flex';
        propertiesLoading.style.display = 'none';
        propertiesError.style.display = 'block';
    }
}

// ===================================
// Geocoding & Markers
// ===================================

/**
 * Geocode addresses and add map markers
 */
async function geocodeAndRenderProperties(properties) {
    const bounds = new google.maps.LatLngBounds();

    for (const property of properties) {
        try {
            const result = await geocodeAddress(property.fullAddress);

            if (result) {
                // Create marker with drop animation
                const marker = new google.maps.Marker({
                    position: result,
                    map: map,
                    title: property.name,
                    animation: google.maps.Animation.DROP,
                    icon: {
                        path: google.maps.SymbolPath.CIRCLE,
                        scale: 8,
                        fillColor: '#FFFFFF',
                        fillOpacity: 1,
                        strokeColor: '#19375F',
                        strokeWeight: 2
                    }
                });

                // Create info window
                const infoWindow = new google.maps.InfoWindow({
                    content: createInfoWindowContent(property)
                });

                // Marker click handler
                marker.addListener('click', () => {
                    // Close all other info windows
                    markers.forEach(m => {
                        if (m.infoWindow) {
                            m.infoWindow.close();
                        }
                    });
                    infoWindow.open(map, marker);
                });

                marker.infoWindow = infoWindow;
                markers.push(marker);
                bounds.extend(result);
            }
        } catch (error) {
            console.warn(`Geocoding failed for ${property.name}:`, error);
            // Continue with other properties
        }
    }

    // Fit map to show all markers
    if (markers.length > 0) {
        map.fitBounds(bounds);

        // Adjust zoom if too close
        const listener = google.maps.event.addListener(map, 'idle', () => {
            if (map.getZoom() > 12) map.setZoom(12);
            google.maps.event.removeListener(listener);
        });
    }
}

/**
 * Geocode single address
 */
function geocodeAddress(address) {
    return new Promise((resolve, reject) => {
        geocoder.geocode({ address: address }, (results, status) => {
            if (status === 'OK' && results[0]) {
                resolve(results[0].geometry.location);
            } else {
                reject(new Error(`Geocoding failed: ${status}`));
            }
        });
    });
}

/**
 * Create info window HTML content
 */
function createInfoWindowContent(property) {
    const portfolioButton = property.portfolioUrl
        ? `<a href="${escapeHtml(property.portfolioUrl)}" class="info-window__button">View Portfolio</a>`
        : '';

    return `
        <div class="info-window">
            <h3 class="info-window__title">${escapeHtml(property.name)}</h3>
            <p class="info-window__address">${escapeHtml(property.fullAddress)}</p>
            <p class="info-window__type">${escapeHtml(property.propertyType)}</p>
            <p class="info-window__size">${escapeHtml(property.unitsSize)}</p>
            ${portfolioButton}
        </div>
    `;
}

// ===================================
// Property Cards Rendering
// ===================================

/**
 * Render property cards grid
 */
function renderPropertyCards(properties) {
    const grid = document.getElementById('propertiesGrid');
    grid.innerHTML = '';

    properties.forEach(property => {
        const card = document.createElement('div');
        card.className = 'property-card';

        card.innerHTML = `
            <div class="property-card__header">
                <h3 class="property-card__name">${escapeHtml(property.name)}</h3>
                <span class="property-card__type">${escapeHtml(property.propertyType)}</span>
            </div>
            <div class="property-card__body">
                <p class="property-card__location">
                    <svg class="property-card__icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#FFFFFF"/>
                        <circle cx="12" cy="9" r="2.5" fill="#19375F"/>
                    </svg>
                    ${escapeHtml(property.city)}, ${escapeHtml(property.country)}
                </p>
                <p class="property-card__size">${escapeHtml(property.unitsSize)}</p>
                <p class="property-card__date">Acquired: ${escapeHtml(property.acquisitionDate)}</p>
            </div>
        `;

        // Card click handler - zoom to marker on map
        card.addEventListener('click', () => {
            const marker = markers.find(m => m.title === property.name);
            if (marker) {
                map.panTo(marker.getPosition());
                map.setZoom(12);

                // Close all info windows
                markers.forEach(m => {
                    if (m.infoWindow) {
                        m.infoWindow.close();
                    }
                });

                // Open this marker's info window
                marker.infoWindow.open(map, marker);

                // Smooth scroll to map
                document.getElementById('map').scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
        });

        grid.appendChild(card);
    });
}

// ===================================
// Utility Functions
// ===================================

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ===================================
// Error Handling
// ===================================

/**
 * Handle Google Maps loading errors
 */
window.gm_authFailure = function() {
    console.error('Google Maps authentication failed');
    document.getElementById('mapLoading').style.display = 'none';
    document.getElementById('mapError').style.display = 'flex';
};

// ===================================
// Filter Pills Rendering
// ===================================

/**
 * Render filter pills from property data
 */
function renderFilterPills(properties) {
    // Get unique property types and countries
    const propertyTypes = [...new Set(properties.map(p => p.propertyType).filter(Boolean))];
    const countries = [...new Set(properties.map(p => p.country).filter(Boolean))];

    const filterContainer = document.getElementById('filterPills');
    if (!filterContainer) return;

    filterContainer.innerHTML = `
        <div class="filter-pills__group">
            <span class="filter-pills__label">Type:</span>
            <button class="filter-pill filter-pill--active" data-filter-type="propertyType" data-filter-value="all">All</button>
            ${propertyTypes.map(type => `
                <button class="filter-pill" data-filter-type="propertyType" data-filter-value="${type}">${type}</button>
            `).join('')}
        </div>
        <div class="filter-pills__group">
            <span class="filter-pills__label">Country:</span>
            <button class="filter-pill filter-pill--active" data-filter-type="country" data-filter-value="all">All</button>
            ${countries.map(country => `
                <button class="filter-pill" data-filter-type="country" data-filter-value="${country}">${country}</button>
            `).join('')}
        </div>
    `;

    // Add click handlers
    filterContainer.querySelectorAll('.filter-pill').forEach(pill => {
        pill.addEventListener('click', handleFilterClick);
    });
}

/**
 * Handle filter pill clicks
 */
function handleFilterClick(e) {
    const pill = e.target;
    const filterType = pill.dataset.filterType;
    const filterValue = pill.dataset.filterValue;

    // Update active state for this filter group
    const group = pill.closest('.filter-pills__group');
    group.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('filter-pill--active'));
    pill.classList.add('filter-pill--active');

    // Update active filters
    activeFilters[filterType] = filterValue;

    // Filter properties
    applyFilters();

    // Close filter menu on mobile after selection
    if (window.innerWidth <= 767) {
        const filterPills = document.getElementById('filterPills');
        const filterToggle = document.getElementById('filterToggle');

        if (filterPills && filterToggle) {
            filterPills.classList.remove('active');
            filterToggle.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="4" y1="6" x2="20" y2="6"></line>
                    <line x1="4" y1="12" x2="20" y2="12"></line>
                    <line x1="4" y1="18" x2="20" y2="18"></line>
                </svg>
                Filters
            `;
        }
    }
}

/**
 * Apply active filters to map and cards
 */
function applyFilters() {
    const filtered = allProperties.filter(property => {
        const typeMatch = activeFilters.propertyType === 'all' || property.propertyType === activeFilters.propertyType;
        const countryMatch = activeFilters.country === 'all' || property.country === activeFilters.country;
        return typeMatch && countryMatch;
    });

    // Update markers visibility
    markers.forEach(marker => {
        const property = allProperties.find(p => p.name === marker.title);
        if (property) {
            const typeMatch = activeFilters.propertyType === 'all' || property.propertyType === activeFilters.propertyType;
            const countryMatch = activeFilters.country === 'all' || property.country === activeFilters.country;
            marker.setVisible(typeMatch && countryMatch);
        }
    });

    // Update property cards
    renderPropertyCards(filtered);

    // Fit map to visible markers
    const bounds = new google.maps.LatLngBounds();
    let hasVisibleMarkers = false;
    markers.forEach(marker => {
        if (marker.getVisible()) {
            bounds.extend(marker.getPosition());
            hasVisibleMarkers = true;
        }
    });
    if (hasVisibleMarkers) {
        map.fitBounds(bounds);
    }
}

// ===================================
// Mobile Filter Toggle
// ===================================

/**
 * Setup mobile filter toggle button
 */
document.addEventListener('DOMContentLoaded', () => {
    const filterToggle = document.getElementById('filterToggle');
    const filterPills = document.getElementById('filterPills');

    if (filterToggle && filterPills) {
        filterToggle.addEventListener('click', () => {
            filterPills.classList.toggle('active');

            // Update button text
            if (filterPills.classList.contains('active')) {
                filterToggle.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                    Close
                `;
            } else {
                filterToggle.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="4" y1="6" x2="20" y2="6"></line>
                        <line x1="4" y1="12" x2="20" y2="12"></line>
                        <line x1="4" y1="18" x2="20" y2="18"></line>
                    </svg>
                    Filters
                `;
            }
        });

        // Close filters when clicking outside
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 767 &&
                !filterToggle.contains(e.target) &&
                !filterPills.contains(e.target) &&
                filterPills.classList.contains('active')) {
                filterPills.classList.remove('active');
                filterToggle.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="4" y1="6" x2="20" y2="6"></line>
                        <line x1="4" y1="12" x2="20" y2="12"></line>
                        <line x1="4" y1="18" x2="20" y2="18"></line>
                    </svg>
                    Filters
                `;
            }
        });
    }
});

// Note: initMap() is called by Google Maps API callback
// No DOMContentLoaded needed - async defer script handles timing
