// Station data
const stations = {
    busan: { name: '부산역', lat: 35.114495, lng: 129.03933 },
    dongdaegu: { name: '동대구역', lat: 35.879667, lng: 128.628476 },
    seoul: { name: '서울역', lat: 37.555946, lng: 126.972317 },
    gwangju: { name: '광주역', lat: 35.1653428, lng: 126.9092003 },
    gangneung: { name: '강릉역', lat: 37.7637815, lng: 128.9016465 }
};

// Initialize passport when page loads
window.addEventListener('DOMContentLoaded', function() {
    loadPassportData();
});

// Load passport data from sessionStorage
function loadPassportData() {
    const dataStr = sessionStorage.getItem('passportData');

    if (!dataStr) {
        alert('여권 데이터가 없습니다. 입력 페이지로 돌아갑니다.');
        window.location.href = 'input.html';
        return;
    }

    const data = JSON.parse(dataStr);

    // Display photo
    document.getElementById('passportPhoto').src = data.photo;

    // Display traveler info
    document.getElementById('passportName').textContent = data.name;
    document.getElementById('passportDate').textContent = formatDate(data.date);

    // Display routes and calculate totals
    displayRoutes(data.routes);

    // Initialize map
    initializePassportMap(data.routes);

    // Set certification date
    setCertificationDate();

    // Generate barcode
    generateBarcode();
}

// Format date in Korean style
function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Display routes in table
function displayRoutes(routes) {
    const tbody = document.getElementById('passportRouteList');
    let totalDistance = 0;
    let totalTrainCO2 = 0;
    let totalCarCO2 = 0;
    let totalCO2Saved = 0;

    routes.forEach(route => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${route.start.name} → ${route.end.name}</td>
            <td>${route.distance} km</td>
            <td>${route.co2.train} kg</td>
            <td>${route.co2.car} kg</td>
            <td style="color: #2ecc71; font-weight: bold;">${route.co2.saved} kg</td>
        `;
        tbody.appendChild(tr);

        totalDistance += route.distance;
        totalTrainCO2 += parseFloat(route.co2.train);
        totalCarCO2 += parseFloat(route.co2.car);
        totalCO2Saved += parseFloat(route.co2.saved);
    });

    // Update table footer totals
    document.getElementById('totalDistance').textContent = `${totalDistance} km`;
    document.getElementById('totalTrainCO2').textContent = `${totalTrainCO2.toFixed(2)} kg`;
    document.getElementById('totalCarCO2').textContent = `${totalCarCO2.toFixed(2)} kg`;
    document.getElementById('totalSaved').textContent = `${totalCO2Saved.toFixed(2)} kg`;

    // Calculate emissions for different transport modes
    const busCO2PerKm = 0.089; // Bus average
    const planeCO2PerKm = 0.285; // Domestic flight average

    const trainTotal = totalTrainCO2.toFixed(1);
    const carTotal = totalCarCO2.toFixed(1);
    const busTotal = (totalDistance * busCO2PerKm).toFixed(1);
    const planeTotal = (totalDistance * planeCO2PerKm).toFixed(1);

    // Update transport comparison cards
    document.getElementById('trainCO2').textContent = `${trainTotal} kg`;
    document.getElementById('carCO2').textContent = `${carTotal} kg`;
    document.getElementById('busCO2').textContent = `${busTotal} kg`;
    document.getElementById('planeCO2').textContent = `${planeTotal} kg`;
}

// Initialize passport map
function initializePassportMap(routes) {
    const map = L.map('passportMap', {
        zoomControl: false,
        attributionControl: false,
        dragging: false,
        touchZoom: false,
        scrollWheelZoom: false,
        doubleClickZoom: false
    }).setView([36, 127.6], 6);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 10,
        minZoom: 6
    }).addTo(map);

    // Draw all routes
    routes.forEach(route => {
        drawRouteOnPassportMap(map, route);
    });
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

// Draw route on passport map
function drawRouteOnPassportMap(map, route) {
    // Add station markers
    L.circleMarker([route.start.lat, route.start.lng], {
        radius: 3,
        fillColor: '#2ecc71',
        color: '#27ae60',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    }).addTo(map);

    L.circleMarker([route.end.lat, route.end.lng], {
        radius: 3,
        fillColor: '#2ecc71',
        color: '#27ae60',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    }).addTo(map);

    // Draw curved route
    const startPoint = [route.start.lat, route.start.lng];
    const endPoint = [route.end.lat, route.end.lng];
    const controlPoint = calculateControlPoint(route.start, route.end);
    const curvePoints = generateCurvePoints(startPoint, controlPoint, endPoint);

    const polyline = L.polyline(curvePoints, {
        color: '#667eea',
        weight: 2,
        opacity: 0.8
    }).addTo(map);

    // Add arrow
    L.polylineDecorator(polyline, {
        patterns: [{
            offset: '95%',
            repeat: 0,
            symbol: L.Symbol.arrowHead({
                pixelSize: 8,
                polygon: false,
                pathOptions: {
                    stroke: true,
                    weight: 1.5,
                    color: '#667eea',
                    fillOpacity: 1,
                    opacity: 0.8
                }
            })
        }]
    }).addTo(map);
}

// Set certification date
function setCertificationDate() {
    const today = new Date();
    const dateStr = today.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    document.getElementById('certDate').textContent = dateStr;
}

// Generate barcode
function generateBarcode() {
    const barcodeNumber = 'GP' + Date.now().toString().substr(-10);
    document.getElementById('barcodeNumber').textContent = barcodeNumber;

    // Create simple barcode pattern
    const svg = document.getElementById('barcode');
    svg.setAttribute('viewBox', '0 0 200 40');

    let barcode = '';
    for (let i = 0; i < 50; i++) {
        const width = Math.random() * 3 + 1;
        const x = i * 4;
        const height = 40;

        if (i % 2 === 0) {
            barcode += `<rect x="${x}" y="0" width="${width}" height="${height}" fill="#333"/>`;
        }
    }

    svg.innerHTML = barcode;
}