// Station data with coordinates
const stations = {
    busan: { name: '부산역', lat: 35.114495, lng: 129.03933 },
    dongdaegu: { name: '동대구역', lat: 35.879667, lng: 128.628476 },
    seoul: { name: '서울역', lat: 37.555946, lng: 126.972317 },
    gwangju: { name: '광주역', lat: 35.1653428, lng: 126.9092003 },
    gangneung: { name: '강릉역', lat: 37.7637815, lng: 128.9016465 }
};

// Global variables
let routes = [];
let routeLayers = [];
let stationMarkers = {};
let map;
let userPhotoData = null;

// Initialize when page loads
window.addEventListener('DOMContentLoaded', function() {
    initializeMap();
    setupEventListeners();
    setDefaultDate();
});

// Initialize Leaflet map
function initializeMap() {
    map = L.map('map', {
        zoomControl: false,
        attributionControl: false
    }).setView([36, 127.6], 6);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 10,
        minZoom: 6
    }).addTo(map);
}

// Setup event listeners
function setupEventListeners() {
    // Photo upload handler
    document.getElementById('photoInput').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                userPhotoData = e.target.result;
                const img = document.getElementById('userPhoto');
                img.src = userPhotoData;
                img.style.display = 'block';
                document.getElementById('photoPlaceholder').style.display = 'none';
                checkGenerateButton();
            };
            reader.readAsDataURL(file);
        }
    });
}

// Set default date to today
function setDefaultDate() {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    document.getElementById('travelDate').value = dateStr;
}

// Calculate distance between coordinates
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return Math.round(distance);
}

// Calculate CO2 emissions
function calculateCO2(distance) {
    const trainCO2PerKm = 0.041;
    const carCO2PerKm = 0.171;

    return {
        train: (distance * trainCO2PerKm).toFixed(2),
        car: (distance * carCO2PerKm).toFixed(2),
        saved: ((distance * carCO2PerKm) - (distance * trainCO2PerKm)).toFixed(2)
    };
}

// Calculate control point for curved path
function calculateControlPoint(start, end) {
    const midLat = (start.lat + end.lat) / 2;
    const midLng = (start.lng + end.lng) / 2;
    const distance = Math.sqrt(Math.pow(end.lat - start.lat, 2) + Math.pow(end.lng - start.lng, 2));
    const curvature = distance * 0.2;
    const angle = Math.atan2(end.lng - start.lng, end.lat - start.lat) + Math.PI / 2;
    const controlLat = midLat + Math.cos(angle) * curvature;
    const controlLng = midLng + Math.sin(angle) * curvature;
    return [controlLat, controlLng];
}

// Generate curve points
function generateCurvePoints(start, control, end, numPoints = 50) {
    const points = [];
    for (let i = 0; i <= numPoints; i++) {
        const t = i / numPoints;
        const lat = Math.pow(1 - t, 2) * start[0] + 2 * (1 - t) * t * control[0] + Math.pow(t, 2) * end[0];
        const lng = Math.pow(1 - t, 2) * start[1] + 2 * (1 - t) * t * control[1] + Math.pow(t, 2) * end[1];
        points.push([lat, lng]);
    }
    return points;
}

// Add route
function addRoute() {
    const startSelect = document.getElementById('startStation');
    const endSelect = document.getElementById('endStation');

    const startKey = startSelect.value;
    const endKey = endSelect.value;

    if (!startKey || !endKey) {
        alert('출발역과 도착역을 모두 선택해주세요.');
        return;
    }

    if (startKey === endKey) {
        alert('출발역과 도착역이 같을 수 없습니다.');
        return;
    }

    const startStation = stations[startKey];
    const endStation = stations[endKey];

    const distance = calculateDistance(
        startStation.lat, startStation.lng,
        endStation.lat, endStation.lng
    );

    const co2 = calculateCO2(distance);

    const route = {
        id: Date.now(),
        start: startStation,
        end: endStation,
        distance: distance,
        co2: co2
    };

    routes.push(route);
    drawRouteOnMap(route);
    updateRouteList();
    updateTotals();
    checkGenerateButton();

    startSelect.value = '';
    endSelect.value = '';
}

// Draw route on map
function drawRouteOnMap(route) {
    const startKey = Object.keys(stations).find(key => stations[key] === route.start);
    const endKey = Object.keys(stations).find(key => stations[key] === route.end);

    if (startKey && !stationMarkers[startKey]) {
        stationMarkers[startKey] = L.circleMarker([route.start.lat, route.start.lng], {
            radius: 4,
            fillColor: '#2ecc71',
            color: '#27ae60',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8
        }).addTo(map);
    }

    if (endKey && !stationMarkers[endKey]) {
        stationMarkers[endKey] = L.circleMarker([route.end.lat, route.end.lng], {
            radius: 4,
            fillColor: '#2ecc71',
            color: '#27ae60',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8
        }).addTo(map);
    }

    const startPoint = [route.start.lat, route.start.lng];
    const endPoint = [route.end.lat, route.end.lng];
    const controlPoint = calculateControlPoint(route.start, route.end);
    const curvePoints = generateCurvePoints(startPoint, controlPoint, endPoint);

    const polyline = L.polyline(curvePoints, {
        color: '#667eea',
        weight: 3,
        opacity: 1
    }).addTo(map);

    const arrowHead = L.polylineDecorator(polyline, {
        patterns: [{
            offset: '99%',
            repeat: 0,
            symbol: L.Symbol.arrowHead({
                pixelSize: 12,
                polygon: false,
                pathOptions: {
                    stroke: true,
                    weight: 2,
                    color: '#667eea',
                    fillOpacity: 1,
                    opacity: 0.8
                }
            })
        }]
    }).addTo(map);

    routeLayers.push({
        id: route.id,
        layer: polyline,
        arrowLayer: arrowHead,
        startKey,
        endKey
    });
}

// Update route list
function updateRouteList() {
    const container = document.getElementById('routesList');
    container.innerHTML = '';

    routes.forEach(route => {
        const routeItem = document.createElement('div');
        routeItem.className = 'route-item';
        routeItem.innerHTML = `
            <div class="route-info">
                <span>${route.start.name} → ${route.end.name}</span>
                <div class="route-details">
                    <span>${route.distance} km</span>
                    <span>절감: <strong>${route.co2.saved} kg CO₂</strong></span>
                </div>
            </div>
            <button class="btn btn-delete" onclick="deleteRoute(${route.id})">삭제</button>
        `;
        container.appendChild(routeItem);
    });
}

// Delete route
function deleteRoute(routeId) {
    routes = routes.filter(r => r.id !== routeId);

    const layerIndex = routeLayers.findIndex(l => l.id === routeId);
    if (layerIndex !== -1) {
        const routeLayer = routeLayers[layerIndex];
        map.removeLayer(routeLayer.layer);

        if (routeLayer.arrowLayer) {
            map.removeLayer(routeLayer.arrowLayer);
        }

        const startStillUsed = routeLayers.some((l, idx) =>
            idx !== layerIndex && (l.startKey === routeLayer.startKey || l.endKey === routeLayer.startKey)
        );
        const endStillUsed = routeLayers.some((l, idx) =>
            idx !== layerIndex && (l.startKey === routeLayer.endKey || l.endKey === routeLayer.endKey)
        );

        if (!startStillUsed && stationMarkers[routeLayer.startKey]) {
            map.removeLayer(stationMarkers[routeLayer.startKey]);
            delete stationMarkers[routeLayer.startKey];
        }

        if (!endStillUsed && stationMarkers[routeLayer.endKey]) {
            map.removeLayer(stationMarkers[routeLayer.endKey]);
            delete stationMarkers[routeLayer.endKey];
        }

        routeLayers.splice(layerIndex, 1);
    }

    updateRouteList();
    updateTotals();
    checkGenerateButton();
}

// Update totals
function updateTotals() {
    const totalDistance = routes.reduce((sum, route) => sum + route.distance, 0);
    const totalCO2Saved = routes.reduce((sum, route) => sum + parseFloat(route.co2.saved), 0);

    document.getElementById('totalDistance').textContent = `${totalDistance} km`;
    document.getElementById('totalCO2').textContent = `${totalCO2Saved.toFixed(2)} kg`;
}

// Check if generate button should be enabled
function checkGenerateButton() {
    const btn = document.getElementById('generateBtn');
    const hasPhoto = userPhotoData !== null;
    const hasRoutes = routes.length > 0;

    btn.disabled = !(hasPhoto && hasRoutes);
}

// Generate passport
function generatePassport() {
    const name = document.getElementById('travelerName').value || '여행자';
    const date = document.getElementById('travelDate').value;

    // Store data in sessionStorage
    const passportData = {
        photo: userPhotoData,
        name: name,
        date: date,
        routes: routes
    };

    sessionStorage.setItem('passportData', JSON.stringify(passportData));

    // Navigate to passport page
    window.location.href = 'passport.html';
}