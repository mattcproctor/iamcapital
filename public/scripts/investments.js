// ===================================
// iAM Capital - Investment Properties
// MapLibre map (OpenFreeMap tiles) & Google Sheet data
// ===================================

// Configuration
const PROPERTIES_API_URL = 'https://script.google.com/macros/s/AKfycbzd8F3e1nlUPY8ybszTpiopyWpLU8pZ3JL15tWHBArrWvCWFyGuZydFAStZPp6MIOPzMQ/exec';

// The properties request, started once with the map script (after first paint) so it runs in parallel with it
let propertiesRequest;
function fetchProperties() {
    if (!propertiesRequest) {
        propertiesRequest = fetch(PROPERTIES_API_URL);
        propertiesRequest.catch(() => {}); // a failure is reported by loadProperties, which awaits it
    }
    return propertiesRequest;
}

// Image addresses from the sheet over https (the browser already upgrades http ones; this avoids the mixed-content warning)
function secureUrl(url) {
    return String(url).replace(/^http:\/\//, 'https://');
}

// The sheet links to iamcapital.com and iamcapital.vercel.app by full address. This site now serves both the property
// pages and those images itself, so links and images on either domain become paths on whichever host is serving
// the page (local preview, a Cloudflare preview, or iamcapital.com). Renamed property pages redirect (redirects.json).
const OWN_HOSTS = /^https?:\/\/(www\.)?(iamcapital\.com|iamcapital\.vercel\.app)(?=\/|$)/i;
function localUrl(url) {
    if (!url) return url;
    const path = String(url).replace(OWN_HOSTS, '');
    return path === '' ? '/' : path;
}
function localiseProperty(property) {
    return { ...property, portfolioUrl: localUrl(property.portfolioUrl), imageUrl: localUrl(property.imageUrl) };
}

// Global state
let map;
let mapReady;            // resolves once the map's style has loaded (MapLibre)
let popup;               // the one open property pop-up
let features = [];       // one GeoJSON point per property with coordinates
let allProperties = [];
let activeFilters = {
    category: 'all',
    country: 'all',
    status: 'all'
};

/**
 * Parse categories from combined strings
 * "Residential & Retail" → ["Residential", "Retail"]
 */
function parseCategories(categoryString) {
    if (!categoryString) return [];
    return categoryString.split('&').map(cat => cat.trim());
}

/**
 * Get all unique base categories from properties
 */
function getUniqueCategories(properties) {
    const allCats = properties.flatMap(p => parseCategories(p.category));
    return [...new Set(allCats)].filter(Boolean).sort();
}

// ===================================
// Map (MapLibre GL with OpenFreeMap tiles: free, no API key, no cookies)
// ===================================

const MAP_STYLE = 'https://tiles.openfreemap.org/styles/positron';
const PIN_HEIGHT = () => (window.innerWidth <= 768 ? 40 : 32);

/**
 * Create the map. Called once MapLibre has loaded (see investments.astro). The property data loads in parallel
 * and is added when both are ready, so the cards never wait for the map.
 */
function initMap() {
    try {
        map = new maplibregl.Map({
            container: 'map',
            style: MAP_STYLE,
            center: [10.0, 45.0],   // Europe (Italy/France focus)
            zoom: 4,
            minZoom: 3.5,           // Europe overview
            maxZoom: 16,            // allow cluster expansion while preventing street-level detail
            attributionControl: { compact: true },
            cooperativeGestures: false,
        });
    } catch (error) {
        console.error('Map could not start:', error);
        showMapError();
        return;
    }
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-right');
    map.addControl(new maplibregl.FullscreenControl(), 'top-right');
    map.getCanvas().setAttribute('aria-label', 'Map of iAM Capital properties. The same properties are listed below the map.');

    mapReady = new Promise((resolve) => {
        map.on('load', () => {
            applyBlueTheme();
            addPinImage().then(resolve);
        });
    });
    map.on('error', (e) => console.warn('Map:', e && e.error ? e.error.message : e));

    loadProperties();
}

/**
 * The map's own colours, as the Google version had them: blue land, deep blue water, light blue roads, white place
 * names; no road names, points of interest or transit.
 */
function applyBlueTheme() {
    const set = (id, prop, value) => { try { map.setPaintProperty(id, prop, value); } catch (e) { /* layer lacks it */ } };
    for (const layer of map.getStyle().layers) {
        const id = layer.id;
        if (layer.type === 'background') set(id, 'background-color', '#2c5f8d');
        else if (layer.type === 'fill') {
            if (/water/.test(id)) set(id, 'fill-color', '#1a4d6d');
            else if (/aeroway|pier/.test(id)) map.setLayoutProperty(id, 'visibility', 'none');
            else { set(id, 'fill-color', '#3d7099'); set(id, 'fill-opacity', /building/.test(id) ? 0.5 : 0.35); }
        } else if (layer.type === 'line') {
            if (/water/.test(id)) set(id, 'line-color', '#1a4d6d');
            else if (/railway|aeroway|pier|path/.test(id)) map.setLayoutProperty(id, 'visibility', 'none');
            else if (/boundary/.test(id)) set(id, 'line-color', '#8fb3d4');
            else set(id, 'line-color', '#4a87b3');
        } else if (layer.type === 'symbol') {
            if (/highway|road|shield|airport|poi|transit|waterway/.test(id)) map.setLayoutProperty(id, 'visibility', 'none');
            else { set(id, 'text-color', '#ffffff'); set(id, 'text-halo-color', '#2c5f8d'); set(id, 'text-halo-width', 1.5); }
        } else if (layer.type === 'raster' || layer.type === 'hillshade') {
            map.setLayoutProperty(id, 'visibility', 'none');
        }
    }
}

/**
 * The grey location pin (Font Awesome Free "location-dot") with a white outline, drawn at twice the size for
 * sharp screens
 */
function addPinImage() {
    const pinPath = 'M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z';
    const h = PIN_HEIGHT() * 2, w = h * 0.75;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="-12 -12 408 536"><path d="${pinPath}" fill="#A7A6A7" stroke="white" stroke-width="24"/></svg>`;
    return new Promise((resolve) => {
        const img = new Image(w, h);
        img.onload = () => { if (!map.hasImage('pin')) map.addImage('pin', img, { pixelRatio: 2 }); resolve(); };
        img.onerror = () => resolve();
        img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    });
}

function showMapError() {
    document.getElementById('mapLoading').style.display = 'none';
    document.getElementById('mapError').style.display = 'flex';
}

// ===================================
// Data Loading
// ===================================

/**
 * Load properties from Google Apps Script API
 */
async function loadProperties() {
    const mapLoading = document.getElementById('mapLoading');
    const propertiesLoading = document.getElementById('propertiesLoading');
    const propertiesError = document.getElementById('propertiesError');

    try {
        const response = await fetchProperties();
        if (!response.ok) throw new Error('Failed to fetch properties');
        const data = await response.json();
        if (data.error) throw new Error(data.message);

        propertiesLoading.style.display = 'none';

        if (data.properties && data.properties.length > 0) {
            data.properties = data.properties.map(localiseProperty);
            allProperties = data.properties;
            features = toFeatures(data.properties);
            renderPropertyCards(data.properties);
            renderFilterPills(data.properties);
            renderCategoryFilterButtons(data.properties);
            if (mapReady) {
                await mapReady;
                addPropertiesToMap();
            }
            mapLoading.style.display = 'none';
        } else {
            showMapError();
            propertiesError.style.display = 'block';
        }
    } catch (error) {
        console.error('Properties load error:', error);
        showMapError();
        propertiesLoading.style.display = 'none';
        propertiesError.style.display = 'block';
    }
}

// ===================================
// Markers, clusters and pop-ups
// ===================================

/**
 * One point per property. Positions are moved randomly by about 0.5-1 km so exact assets aren't shown.
 */
function toFeatures(properties) {
    return properties.map((property, index) => {
        if (!property.latitude || !property.longitude) {
            console.warn(`No coordinates for ${property.name}; add latitude and longitude in the sheet.`);
            return null;
        }
        const lat = Number(property.latitude) + (Math.random() - 0.5) * 0.04;
        const lng = Number(property.longitude) + (Math.random() - 0.5) * 0.04;
        return { type: 'Feature', id: index, geometry: { type: 'Point', coordinates: [lng, lat] }, properties: { index, name: property.name } };
    }).filter(Boolean);
}

function fitPadding() {
    return window.innerWidth <= 768
        ? { top: 120, right: 20, bottom: 20, left: 20 }    // Mobile
        : { top: 80, right: 80, bottom: 80, left: 280 };   // Desktop (room for the filter panel)
}

function fitTo(list) {
    if (!list.length) return;
    const bounds = new maplibregl.LngLatBounds();
    list.forEach((f) => bounds.extend(f.geometry.coordinates));
    map.fitBounds(bounds, { padding: fitPadding(), maxZoom: 11, duration: 600 });
}

/**
 * Add the properties as a clustered source: navy circles with a count where pins overlap, grey pins otherwise
 */
function addPropertiesToMap() {
    map.addSource('properties', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features },
        cluster: true,
        clusterRadius: 45,
        clusterMaxZoom: 14,
    });
    map.addLayer({
        id: 'clusters', type: 'circle', source: 'properties', filter: ['has', 'point_count'],
        paint: { 'circle-color': '#19375F', 'circle-radius': 26, 'circle-stroke-color': '#ffffff', 'circle-stroke-width': 3 },
    });
    map.addLayer({
        id: 'cluster-count', type: 'symbol', source: 'properties', filter: ['has', 'point_count'],
        layout: { 'text-field': ['get', 'point_count_abbreviated'], 'text-font': ['Noto Sans Bold'], 'text-size': 18, 'text-allow-overlap': true },
        paint: { 'text-color': '#ffffff' },
    });
    map.addLayer({
        id: 'pins', type: 'symbol', source: 'properties', filter: ['!', ['has', 'point_count']],
        layout: { 'icon-image': 'pin', 'icon-anchor': 'bottom', 'icon-allow-overlap': true },
    });

    map.on('click', 'clusters', async (e) => {
        const f = map.queryRenderedFeatures(e.point, { layers: ['clusters'] })[0];
        const zoom = await map.getSource('properties').getClusterExpansionZoom(f.properties.cluster_id);
        map.easeTo({ center: f.geometry.coordinates, zoom });
    });
    map.on('click', 'pins', (e) => {
        const f = e.features[0];
        openPopup(f.properties.index, f.geometry.coordinates);
    });
    for (const layer of ['clusters', 'pins']) {
        map.on('mouseenter', layer, () => { map.getCanvas().style.cursor = 'pointer'; });
        map.on('mouseleave', layer, () => { map.getCanvas().style.cursor = ''; });
    }
    fitTo(features);
}

function openPopup(index, coordinates) {
    if (popup) popup.remove();
    // The pin is anchored at its tip: a pop-up above it clears the pin's height, one below starts at the tip
    const h = PIN_HEIGHT();
    const offset = {
        'bottom': [0, -h], 'bottom-left': [0, -h], 'bottom-right': [0, -h],
        'top': [0, 0], 'top-left': [0, 0], 'top-right': [0, 0],
        'left': [10, -h / 2], 'right': [-10, -h / 2], 'center': [0, -h / 2],
    };
    popup = new maplibregl.Popup({ offset, maxWidth: '300px', focusAfterOpen: false })
        .setLngLat(coordinates)
        .setHTML(createInfoWindowContent(allProperties[index]))
        .addTo(map);
}

/**
 * Create info window HTML content
 */
function createInfoWindowContent(property) {
    const portfolioButton = property.portfolioUrl
        ? `<a href="${escapeHtml(property.portfolioUrl)}" class="info-window__button">View Property</a>`
        : '';

    const formattedSize = property.sizeSqm ? `${parseInt(property.sizeSqm).toLocaleString()} sqm` : '';

    const soldBadge = property.status === 'Sold'
        ? `<span class="info-window__sold-badge">SOLD</span>`
        : '';

    const imageUrl = property.imageUrl ? secureUrl(property.imageUrl) : '';
    const imageHtml = imageUrl
        ? `<div class="info-window__image"><img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(property.name)}"></div>`
        : '';

    return `
        <div class="info-window">
            ${imageHtml}
            ${soldBadge}
            <h3 class="info-window__title">${escapeHtml(property.name)}</h3>
            <p class="info-window__address">${escapeHtml(property.city)}, ${escapeHtml(property.country)}${property.acquisitionDate ? ' • ' + escapeHtml(property.acquisitionDate) : ''}</p>
            <p class="info-window__type">${escapeHtml(property.category)}${formattedSize ? ' • ' + formattedSize : ''}</p>
            ${portfolioButton}
        </div>
    `;
}

// ===================================
// Property Cards Rendering
// ===================================

/**
 * Render category filter buttons dynamically
 */
function renderCategoryFilterButtons(properties) {
    const categories = getUniqueCategories(properties);
    const categoryGroup = document.querySelector('#categoryFilters .category-filters__group:nth-child(2)');

    if (categoryGroup) {
        // Keep the label and "All" button, add category buttons
        const existingButtons = categoryGroup.innerHTML;
        const categoryButtons = categories.map(cat =>
            `<button class="category-filter-btn" data-filter-type="category" data-filter-value="${cat}">${cat}</button>`
        ).join('');

        categoryGroup.innerHTML = existingButtons + categoryButtons;

        // Attach event listeners to all filter buttons
        attachFilterButtonListeners();
    }
}

/**
 * Attach event listeners to category filter buttons
 */
function attachFilterButtonListeners() {
    const categoryFilterBtns = document.querySelectorAll('.category-filter-btn');

    categoryFilterBtns.forEach(btn => {
        // Remove existing listener to avoid duplicates
        btn.replaceWith(btn.cloneNode(true));
    });

    // Re-query after cloning
    const newBtns = document.querySelectorAll('.category-filter-btn');

    newBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filterType = btn.dataset.filterType;
            const filterValue = btn.dataset.filterValue;

            // Update button active states within the same group
            const group = btn.closest('.category-filters__group');
            if (group) {
                group.querySelectorAll('.category-filter-btn').forEach(b =>
                    b.classList.remove('category-filter-btn--active')
                );
            }
            btn.classList.add('category-filter-btn--active');

            // Update global filter state
            if (filterType === 'status') {
                activeFilters.status = filterValue;
            } else if (filterType === 'category') {
                activeFilters.category = filterValue;
            }

            // Sync with map overlay filters if they exist
            const mapPills = document.querySelectorAll(`[data-filter-type="${filterType}"]`);
            mapPills.forEach(pill => {
                pill.classList.remove('filter-pill--active');
                if (pill.dataset.filterValue === filterValue) {
                    pill.classList.add('filter-pill--active');
                }
            });

            // Apply filters
            applyFilters();
        });
    });
}

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
        const imageUrl = property.imageUrl ? secureUrl(property.imageUrl) : 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=640&h=360&fit=crop&auto=format&q=80';

        const soldBadge = property.status === 'Sold' ? '<span class="property-card__sold-badge">SOLD</span>' : '';

        card.innerHTML = `
            <div class="property-card__image">
                <img class="property-card__img" src="${escapeHtml(imageUrl)}" alt="${escapeHtml(property.name)} - ${escapeHtml(property.city)}, ${escapeHtml(property.country)}" loading="lazy">
                ${soldBadge}
                <div class="property-card__overlay">
                    <h3 class="property-card__name">${escapeHtml(property.name)}</h3>
                    <span class="property-card__location-badge">${escapeHtml(property.city)}, ${countryCode}${formattedSize ? ' • ' + formattedSize + ' sqm' : ''}${property.acquisitionDate ? ' • ' + escapeHtml(property.acquisitionDate) : ''}</span>
                </div>
            </div>
            <div class="property-card__body">
                <span class="property-card__category" data-category="${escapeHtml(property.category)}">${escapeHtml(property.category)}</span>
                ${property.portfolioUrl ? `<a href="${escapeHtml(property.portfolioUrl)}" class="property-card__view-btn" onclick="event.stopPropagation()">View Property &rarr;</a>` : ''}
            </div>
        `;

        // Card click: fly to the property on the map and open its pop-up
        card.addEventListener('click', () => {
            const feature = features.find(f => allProperties[f.properties.index] === property);
            if (!feature || !map || !map.getSource('properties')) return;
            map.flyTo({ center: feature.geometry.coordinates, zoom: 11 });
            map.once('moveend', () => openPopup(feature.properties.index, feature.geometry.coordinates));
            document.getElementById('map').scrollIntoView({ behavior: 'smooth', block: 'center' });
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

// ===================================
// Filter Pills Rendering
// ===================================

/**
 * Render filter pills from property data
 */
function renderFilterPills(properties) {
    // Get unique base categories, countries, and statuses
    const categories = getUniqueCategories(properties);
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
        // Check if property's categories include the selected filter
        const propertyCats = parseCategories(property.category);
        const categoryMatch = activeFilters.category === 'all' || propertyCats.includes(activeFilters.category);
        const countryMatch = activeFilters.country === 'all' || property.country === activeFilters.country;
        const statusMatch = activeFilters.status === 'all' || property.status === activeFilters.status;
        return categoryMatch && countryMatch && statusMatch;
    });

    // Update property cards
    renderPropertyCards(filtered);

    // Show only the matching pins, and fit the map to them
    if (map && map.getSource('properties')) {
        if (popup) popup.remove();
        const visible = features.filter(f => filtered.includes(allProperties[f.properties.index]));
        map.getSource('properties').setData({ type: 'FeatureCollection', features: visible });
        fitTo(visible);
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

    // Filter button listeners will be attached after data loads
});

// Note: initMap() is called once MapLibre has loaded (see src/pages/investments.astro)
