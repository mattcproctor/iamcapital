// ===================================
// iAM Capital - Investment Properties
// Google Maps & Data Integration
// ===================================

// Configuration
const PROPERTIES_API_URL = 'https://script.google.com/macros/s/AKfycbzd8F3e1nlUPY8ybszTpiopyWpLU8pZ3JL15tWHBArrWvCWFyGuZydFAStZPp6MIOPzMQ/exec';

// Global state
let map;
let markers = [];
let markerCluster;
let geocoder;
let allProperties = [];
let activeFilters = {
    category: 'all',
    country: 'all',
    status: 'all'
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
        zoomControl: true,
        minZoom: 5,  // Allow Europe overview
        maxZoom: 12  // Prevent street-level zoom for privacy
    });

    geocoder = new google.maps.Geocoder();

    // Load properties after map initializes
    loadProperties();
}

/**
 * Custom map styling - Clean blue theme
 */
function getMapStyles() {
    return [
        // Blue base map color
        {
            "featureType": "all",
            "elementType": "geometry",
            "stylers": [{ "color": "#2c5f8d" }]
        },
        // Lighter blue for landscape
        {
            "featureType": "landscape",
            "elementType": "geometry",
            "stylers": [{ "color": "#3d7099" }]
        },
        // Deep blue water
        {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [{ "color": "#1a4d6d" }]
        },
        // Roads in lighter blue
        {
            "featureType": "road",
            "elementType": "geometry",
            "stylers": [{ "color": "#4a87b3" }]
        },
        // Hide road labels/numbers
        {
            "featureType": "road",
            "elementType": "labels",
            "stylers": [{ "visibility": "off" }]
        },
        // White text for labels
        {
            "featureType": "all",
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#ffffff" }]
        },
        // Blue text stroke
        {
            "featureType": "all",
            "elementType": "labels.text.stroke",
            "stylers": [{ "color": "#2c5f8d" }, { "weight": 2 }]
        },
        // Hide all POIs (airports, parks, businesses, etc.)
        {
            "featureType": "poi",
            "elementType": "all",
            "stylers": [{ "visibility": "off" }]
        },
        // Hide transit stations and labels
        {
            "featureType": "transit",
            "elementType": "all",
            "stylers": [{ "visibility": "off" }]
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
 * Get FontAwesome marker icon based on property category
 */
function getMarkerIcon(category, status) {
    const iconConfig = {
        'Residential': {
            path: 'M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H160 128.1c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2H104c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9 .1-2.8V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z',
            color: '#2ECC71',
            viewBox: '0 0 576 512',
            size: 40
        },
        'Commercial': {
            path: 'M48 0C21.5 0 0 21.5 0 48L0 464c0 26.5 21.5 48 48 48l96 0 0-80c0-26.5 21.5-48 48-48s48 21.5 48 48l0 80 96 0c26.5 0 48-21.5 48-48l0-416c0-26.5-21.5-48-48-48L48 0zM64 240c0-8.8 7.2-16 16-16l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32zm112-16l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32c0-8.8 7.2-16 16-16zm80 16c0-8.8 7.2-16 16-16l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32zM80 96l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32c0-8.8 7.2-16 16-16zm80 16c0-8.8 7.2-16 16-16l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32zM272 96l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32c0-8.8 7.2-16 16-16z',
            color: '#000000',
            viewBox: '0 0 384 512',
            size: 40
        },
        'Hospitality': {
            path: 'M0 32C0 14.3 14.3 0 32 0H480c17.7 0 32 14.3 32 32s-14.3 32-32 32V448c17.7 0 32 14.3 32 32s-14.3 32-32 32H304V464c0-26.5-21.5-48-48-48s-48 21.5-48 48v48H32c-17.7 0-32-14.3-32-32s14.3-32 32-32V64C14.3 64 0 49.7 0 32zm96 80v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V112c0-8.8-7.2-16-16-16H112c-8.8 0-16 7.2-16 16zM240 96c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V112c0-8.8-7.2-16-16-16H240zm112 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V112c0-8.8-7.2-16-16-16H368c-8.8 0-16 7.2-16 16zM112 192c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V208c0-8.8-7.2-16-16-16H112zm112 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V208c0-8.8-7.2-16-16-16H240c-8.8 0-16 7.2-16 16zm144-16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V208c0-8.8-7.2-16-16-16H368zM328 384c13.3 0 24.3-10.9 21-23.8c-10.6-41.5-48.2-72.2-93-72.2s-82.5 30.7-93 72.2c-3.3 12.8 7.8 23.8 21 23.8H328z',
            color: '#7B68EE',
            viewBox: '0 0 512 512',
            size: 40
        },
        'Renewable Energy': {
            path: 'M128 320L156.5 92C158.5 76 172.1 64 188.3 64L356.9 64C371.9 64 384 76.1 384 91.1C384 94.3 383.4 97.6 382.3 100.6L336 224L475.3 224C495.5 224 512 240.4 512 260.7C512 268.1 509.8 275.3 505.6 281.4L313.4 562.4C307.5 571 297.8 576.1 287.5 576.1L284.6 576.1C268.9 576.1 256.1 563.3 256.1 547.6C256.1 545.3 256.4 543 257 540.7L304 352L160 352C142.3 352 128 337.7 128 320z',
            color: '#FFC107',
            viewBox: '0 0 640 640',
            size: 40
        },
        // New category mappings
        'Office': {
            path: 'M48 0C21.5 0 0 21.5 0 48L0 464c0 26.5 21.5 48 48 48l96 0 0-80c0-26.5 21.5-48 48-48s48 21.5 48 48l0 80 96 0c26.5 0 48-21.5 48-48l0-416c0-26.5-21.5-48-48-48L48 0zM64 240c0-8.8 7.2-16 16-16l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32zm112-16l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32c0-8.8 7.2-16 16-16zm80 16c0-8.8 7.2-16 16-16l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32zM80 96l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32c0-8.8 7.2-16 16-16zm80 16c0-8.8 7.2-16 16-16l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32zM272 96l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32c0-8.8 7.2-16 16-16z',
            color: '#000000',
            viewBox: '0 0 384 512',
            size: 40
        },
        'Residential & Retail': {
            path: 'M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H160 128.1c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2H104c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9 .1-2.8V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z',
            color: '#2ECC71',
            viewBox: '0 0 576 512',
            size: 40
        },
        'Residential & Office': {
            path: 'M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H160 128.1c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2H104c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9 .1-2.8V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z',
            color: '#2ECC71',
            viewBox: '0 0 576 512',
            size: 40
        },
        'Retail & Office': {
            path: 'M48 0C21.5 0 0 21.5 0 48L0 464c0 26.5 21.5 48 48 48l96 0 0-80c0-26.5 21.5-48 48-48s48 21.5 48 48l0 80 96 0c26.5 0 48-21.5 48-48l0-416c0-26.5-21.5-48-48-48L48 0zM64 240c0-8.8 7.2-16 16-16l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32zm112-16l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32c0-8.8 7.2-16 16-16zm80 16c0-8.8 7.2-16 16-16l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32zM80 96l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32c0-8.8 7.2-16 16-16zm80 16c0-8.8 7.2-16 16-16l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32zM272 96l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32c0-8.8 7.2-16 16-16z',
            color: '#000000',
            viewBox: '0 0 384 512',
            size: 40
        },
        'Office & Retail': {
            path: 'M48 0C21.5 0 0 21.5 0 48L0 464c0 26.5 21.5 48 48 48l96 0 0-80c0-26.5 21.5-48 48-48s48 21.5 48 48l0 80 96 0c26.5 0 48-21.5 48-48l0-416c0-26.5-21.5-48-48-48L48 0zM64 240c0-8.8 7.2-16 16-16l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32zm112-16l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32c0-8.8 7.2-16 16-16zm80 16c0-8.8 7.2-16 16-16l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32zM80 96l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32c0-8.8 7.2-16 16-16zm80 16c0-8.8 7.2-16 16-16l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32zM272 96l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32c0-8.8 7.2-16 16-16z',
            color: '#000000',
            viewBox: '0 0 384 512',
            size: 40
        }
    };

    // Map category to icon config
    let config = iconConfig[category] || iconConfig['Commercial'];

    // Responsive marker size: 30% smaller on desktop
    const size = window.innerWidth <= 768 ? config.size : config.size * 0.7;

    // Lower opacity for sold properties
    const opacity = status === 'Sold' ? 0.4 : 1.0;

    return {
        url: 'data:image/svg+xml;utf-8,' + encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="${config.viewBox}">
                <path d="${config.path}" fill="${config.color}" stroke="white" stroke-width="20" opacity="${opacity}"/>
            </svg>
        `),
        scaledSize: new google.maps.Size(size, size),
        anchor: new google.maps.Point(size / 2, size)
    };
}

/**
 * Geocode addresses and add map markers
 * Uses pre-geocoded coordinates if available (fast), falls back to geocoding (slow)
 */
async function geocodeAndRenderProperties(properties) {
    const bounds = new google.maps.LatLngBounds();

    for (let i = 0; i < properties.length; i++) {
        const property = properties[i];

        try {
            let position;

            // Use pre-geocoded coordinates if available (FAST PATH)
            if (property.latitude && property.longitude) {
                position = new google.maps.LatLng(property.latitude, property.longitude);
            } else {
                // Fall back to geocoding if coordinates missing (SLOW PATH)
                position = await geocodeAddress(property.fullAddress);
            }

            if (position) {
                // Staggered drop animation for visual effect
                setTimeout(() => {
                    // Create marker with drop animation (FontAwesome icon)
                    const marker = new google.maps.Marker({
                        position: position,
                        map: map,
                        title: property.name,
                        animation: google.maps.Animation.DROP,
                        icon: getMarkerIcon(property.category, property.status),
                        label: '', // Prevent any label from appearing
                        opacity: property.status === 'Sold' ? 0.6 : 1.0
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
                    bounds.extend(position);
                }, i * 100); // 100ms delay between each marker
            }
        } catch (error) {
            console.warn(`Failed to render marker for ${property.name}:`, error);
            // Continue with other properties
        }
    }

    // Fit map to show all markers (wait for animation to complete)
    setTimeout(() => {
        if (markers.length > 0) {
            // Add padding to account for filter overlay (especially on mobile)
            const padding = window.innerWidth <= 768 ?
                { top: 120, right: 20, bottom: 20, left: 20 } :  // Mobile
                { top: 80, right: 80, bottom: 80, left: 280 };    // Desktop

            map.fitBounds(bounds, padding);

            // Adjust zoom if too close
            const listener = google.maps.event.addListener(map, 'idle', () => {
                if (map.getZoom() > 12) map.setZoom(12);
                google.maps.event.removeListener(listener);
            });

            // Initialize marker clusterer
            markerCluster = new markerClusterer.MarkerClusterer({
                map,
                markers: markers,
                renderer: {
                    render: ({ count, position }) => {
                        return new google.maps.Marker({
                            position,
                            icon: {
                                url: 'data:image/svg+xml;utf-8,' + encodeURIComponent(`
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60">
                                        <circle cx="30" cy="30" r="28" fill="#19375F" stroke="white" stroke-width="4"/>
                                        <text x="30" y="38" font-size="20" font-weight="bold" fill="white" text-anchor="middle">${count}</text>
                                    </svg>
                                `),
                                scaledSize: new google.maps.Size(60, 60),
                                anchor: new google.maps.Point(30, 30)
                            },
                            label: '',
                            zIndex: 1000
                        });
                    }
                }
            });
        }
    }, properties.length * 100 + 200);
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
        ? `<a href="${escapeHtml(property.portfolioUrl)}" class="info-window__button">View Property</a>`
        : '';

    const formattedSize = property.sizeSqm ? `${parseInt(property.sizeSqm).toLocaleString()} sqm` : '';

    return `
        <div class="info-window">
            <h3 class="info-window__title">${escapeHtml(property.name)}</h3>
            <p class="info-window__address">${escapeHtml(property.fullAddress)}</p>
            <p class="info-window__type">${escapeHtml(property.category)} • ${escapeHtml(property.propertyType)}</p>
            <p class="info-window__size">${formattedSize}</p>
            ${portfolioButton}
        </div>
    `;
}

// ===================================
// Property Cards Rendering
// ===================================

/**
 * Render property cards grid with image-based design
 */
function renderPropertyCards(properties) {
    const grid = document.getElementById('propertiesGrid');
    grid.innerHTML = '';

    properties.forEach(property => {
        const card = document.createElement('div');
        card.className = 'property-card';

        // Format size with commas (e.g., 7650 → 7,650)
        const formattedSize = property.sizeSqm ? parseInt(property.sizeSqm).toLocaleString() : '';
        const countryCode = getCountryCode(property.country);

        // Fallback placeholder image if none provided
        const imageUrl = property.imageUrl || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=640&h=360&fit=crop&auto=format&q=80';

        card.innerHTML = `
            <div class="property-card__image" style="background-image: url('${escapeHtml(imageUrl)}')">
                <div class="property-card__overlay">
                    <h3 class="property-card__name">${escapeHtml(property.name)}</h3>
                    <span class="property-card__location-badge">${escapeHtml(property.city)}, ${countryCode} • ${formattedSize} sqm</span>
                </div>
            </div>
            <div class="property-card__body">
                <span class="property-card__category" data-category="${escapeHtml(property.category)}">${escapeHtml(property.category)}</span>
                <span class="property-card__date">${escapeHtml(property.acquisitionDate)}</span>
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

/**
 * Get country code abbreviation
 */
function getCountryCode(country) {
    const codes = {
        'Italy': 'IT',
        'France': 'FR',
        'Spain': 'ES',
        'Portugal': 'PT'
    };
    return codes[country] || country;
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
    // Get unique categories, countries, and statuses
    const categories = [...new Set(properties.map(p => p.category).filter(Boolean))];
    const countries = [...new Set(properties.map(p => p.country).filter(Boolean))];
    const statuses = [...new Set(properties.map(p => p.status).filter(Boolean))];

    const filterHTML = `
        <div class="filter-pills__group">
            <span class="filter-pills__label">Status:</span>
            <button class="filter-pill filter-pill--active" data-filter-type="status" data-filter-value="all">All</button>
            ${statuses.map(status => `
                <button class="filter-pill" data-filter-type="status" data-filter-value="${status}">${status}</button>
            `).join('')}
        </div>
        <div class="filter-pills__group">
            <span class="filter-pills__label">Category:</span>
            <button class="filter-pill filter-pill--active" data-filter-type="category" data-filter-value="all">All</button>
            ${categories.map(cat => `
                <button class="filter-pill" data-filter-type="category" data-filter-value="${cat}">${cat}</button>
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

    // Render in map overlay only
    const filterContainer = document.getElementById('filterPills');
    if (filterContainer) {
        filterContainer.innerHTML = filterHTML;
        filterContainer.querySelectorAll('.filter-pill').forEach(pill => {
            pill.addEventListener('click', handleFilterClick);
        });
    }
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

    // Sync with category filter buttons if category changed
    if (filterType === 'category') {
        const categoryFilterBtns = document.querySelectorAll('.category-filter-btn');
        categoryFilterBtns.forEach(btn => {
            btn.classList.remove('category-filter-btn--active');
            if (btn.dataset.category === filterValue) {
                btn.classList.add('category-filter-btn--active');
            }
        });
    }

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
        const categoryMatch = activeFilters.category === 'all' || property.category === activeFilters.category;
        const countryMatch = activeFilters.country === 'all' || property.country === activeFilters.country;
        const statusMatch = activeFilters.status === 'all' || property.status === activeFilters.status;
        return categoryMatch && countryMatch && statusMatch;
    });

    // Update markers visibility
    markers.forEach(marker => {
        const property = allProperties.find(p => p.name === marker.title);
        if (property) {
            const categoryMatch = activeFilters.category === 'all' || property.category === activeFilters.category;
            const countryMatch = activeFilters.country === 'all' || property.country === activeFilters.country;
            const statusMatch = activeFilters.status === 'all' || property.status === activeFilters.status;
            marker.setVisible(categoryMatch && countryMatch && statusMatch);
        }
    });

    // Update clusterer with visible markers only
    if (markerCluster) {
        markerCluster.clearMarkers();
        const visibleMarkers = markers.filter(m => m.getVisible());
        markerCluster.addMarkers(visibleMarkers);
    }

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
        // Add padding to account for filter overlay
        const padding = window.innerWidth <= 768 ?
            { top: 120, right: 20, bottom: 20, left: 20 } :  // Mobile
            { top: 80, right: 80, bottom: 80, left: 280 };    // Desktop

        map.fitBounds(bounds, padding);
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

    // ===================================
    // Category Filter Buttons (Cards Section)
    // ===================================

    const categoryFilterBtns = document.querySelectorAll('.category-filter-btn');

    categoryFilterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.dataset.category;

            // Update button active states
            categoryFilterBtns.forEach(b => b.classList.remove('category-filter-btn--active'));
            btn.classList.add('category-filter-btn--active');

            // Update global filter state
            activeFilters.category = category;

            // Sync with map overlay filters if they exist
            const mapCategoryPills = document.querySelectorAll('[data-filter-type="category"]');
            mapCategoryPills.forEach(pill => {
                pill.classList.remove('filter-pill--active');
                if (pill.dataset.filterValue === category) {
                    pill.classList.add('filter-pill--active');
                }
            });

            // Apply filters
            applyFilters();
        });
    });
});

// Note: initMap() is called by Google Maps API callback
// No DOMContentLoaded needed - async defer script handles timing

// ===================================
// Dynamic Footer Year
// ===================================
document.getElementById('currentYear').textContent = new Date().getFullYear();

// ===================================
// Mobile Menu Toggle
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navList = document.querySelector('.nav__list');

    if (mobileMenuToggle && navList) {
        mobileMenuToggle.addEventListener('click', () => {
            navList.classList.toggle('active');
        });

        // Close menu when clicking a link
        document.querySelectorAll('.nav__link').forEach(link => {
            link.addEventListener('click', () => {
                navList.classList.remove('active');
            });
        });
    }
});
