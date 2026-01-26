// ===================================
// iAM Capital - Investment Properties
// Google Maps & Data Integration
// ===================================

// Configuration
const PROPERTIES_API_URL = 'https://script.google.com/macros/s/AKfycbzFiDn31ne4CISFqjzCcpMwSve5FAJXKgNALoh1kzFw3IRrZtVBUIEUbTf_5whW_weMkQ/exec';

// Global state
let map;
let markers = [];
let geocoder;

// ===================================
// Map Initialization
// ===================================

/**
 * Initialize Google Maps
 * Called by Google Maps API callback
 */
function initMap() {
    // Center on US (default view before markers load)
    const defaultCenter = { lat: 39.8283, lng: -98.5795 };

    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 4,
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
            "stylers": [{ "color": "#193D5F" }]
        },
        {
            "featureType": "all",
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#FFFFFF" }]
        },
        {
            "featureType": "all",
            "elementType": "labels.text.stroke",
            "stylers": [{ "color": "#193D5F" }]
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
            "stylers": [{ "color": "#1E3D5F" }]
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
        console.log('Fetching properties from:', PROPERTIES_API_URL);
        const response = await fetch(PROPERTIES_API_URL, {
            redirect: 'follow'
        });

        console.log('Response status:', response.status, response.statusText);

        if (!response.ok) {
            throw new Error(`Failed to fetch properties: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Properties loaded:', data.count, 'properties');

        // Handle API error response
        if (data.error) {
            throw new Error(data.message);
        }

        // Hide loading states
        mapLoading.style.display = 'none';
        propertiesLoading.style.display = 'none';

        // Process properties
        if (data.properties && data.properties.length > 0) {
            await geocodeAndRenderProperties(data.properties);
            renderPropertyCards(data.properties);
        } else {
            // No properties case
            mapError.style.display = 'flex';
            propertiesError.style.display = 'block';
        }

    } catch (error) {
        console.error('Properties load error:', error);
        console.error('Error details:', error.message);
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
                // Create marker
                const marker = new google.maps.Marker({
                    position: result,
                    map: map,
                    title: property.name,
                    icon: {
                        path: google.maps.SymbolPath.CIRCLE,
                        scale: 8,
                        fillColor: '#9DFF20',
                        fillOpacity: 1,
                        strokeColor: '#FFFFFF',
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
    return `
        <div class="info-window">
            <h3 class="info-window__title">${property.name}</h3>
            <p class="info-window__address">${property.fullAddress}</p>
            <p class="info-window__type">${property.propertyType}</p>
            <p class="info-window__size">${property.unitsSize}</p>
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
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#9DFF20"/>
                        <circle cx="12" cy="9" r="2.5" fill="#193D5F"/>
                    </svg>
                    ${escapeHtml(property.city)}, ${escapeHtml(property.state)}
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

// Note: initMap() is called by Google Maps API callback
// No DOMContentLoaded needed - async defer script handles timing
