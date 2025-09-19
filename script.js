// ===== GLOBAL VARIABLES =====
let map;
let markers = [];
let infoWindows = [];
let centers = [
  { id: 1, name: "Gandhi Maidan Center", lat: 25.6093, lng: 85.1379, contact: "0612-1234567", type: "Mixed E-Waste", address: "Near Gandhi Maidan, Patna" },
  { id: 2, name: "Kankarbagh Collection Point", lat: 25.5945, lng: 85.1635, contact: "0612-2345678", type: "Electronics Only", address: "Kankarbagh Main Rd, Patna" },
  { id: 3, name: "Rajendra Nagar Facility", lat: 25.6021, lng: 85.1589, contact: "0612-3456789", type: "Batteries & Small Electronics", address: "Rajendra Nagar, Patna" },
  { id: 4, name: "Patliputra Recycling Hub", lat: 25.6280, lng: 85.1020, contact: "0612-4567890", type: "Mixed E-Waste", address: "Patliputra Colony, Patna" },
  { id: 5, name: "Bailey Road Center", lat: 25.6120, lng: 85.0860, contact: "0612-5678901", type: "Electronics Only", address: "Bailey Road, Patna" },
  { id: 6, name: "Ashok Rajpath Hub", lat: 25.6170, lng: 85.1470, contact: "0612-6789012", type: "Mixed E-Waste", address: "Ashok Rajpath, Patna" },
  { id: 7, name: "Fraser Road Facility", lat: 25.6150, lng: 85.1400, contact: "0612-7890123", type: "Batteries & Electronics", address: "Fraser Road, Patna" },
  { id: 8, name: "Boring Road Center", lat: 25.6250, lng: 85.1180, contact: "0612-8901234", type: "Electronics Only", address: "Boring Road, Patna" },
  { id: 9, name: "Airport Collection Point", lat: 25.5910, lng: 85.0870, contact: "0612-9012345", type: "Mixed E-Waste", address: "Near Airport, Patna" },
  { id: 10, name: "Anisabad Facility", lat: 25.5680, lng: 85.1030, contact: "0612-1122334", type: "Batteries & Electronics", address: "Anisabad, Patna" },
  { id: 11, name: "Digha Recycling Center", lat: 25.6420, lng: 85.0740, contact: "0612-2233445", type: "Electronics Only", address: "Digha, Patna" },
  { id: 12, name: "Gardanibagh Hub", lat: 25.6000, lng: 85.1200, contact: "0612-7788990", type: "Mixed E-Waste", address: "Gardanibagh, Patna" },
  { id: 13, name: "Rajbansi Nagar Center", lat: 25.6200, lng: 85.1100, contact: "0612-9988776", type: "Batteries & Electronics", address: "Rajbansi Nagar, Patna" },
  { id: 14, name: "Danapur Cantonment", lat: 25.6030, lng: 85.0290, contact: "0612-3344556", type: "Mixed E-Waste", address: "Danapur Cantonment, Patna" },
  { id: 15, name: "Pahari Collection Point", lat: 25.5970, lng: 85.1350, contact: "0612-4455667", type: "Electronics Only", address: "Pahari, Patna" },
  { id: 16, name: "S K Puri Facility", lat: 25.6210, lng: 85.1150, contact: "0612-5566778", type: "Batteries & Electronics", address: "S K Puri, Patna" }
];

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
  if (typeof lucide !== 'undefined') lucide.createIcons();
  populateCentersList();
  setupSearch();
  setupBackToTop();
  setupMobileMenu();
  animateStats();
});

// ===== GOOGLE MAPS =====
function initMap() {
  const patna = { lat: 25.5941, lng: 85.1376 };
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: patna
  });

  centers.forEach(center => {
    const marker = new google.maps.Marker({
      position: { lat: center.lat, lng: center.lng },
      map: map,
      title: center.name
    });

    const infoContent = `
      <div style="max-width:250px; padding:10px; font-family:Arial, sans-serif;">
        <h4 style="margin:0 0 5px 0; color:#2d4a2b;">${center.name}</h4>
        <p style="margin:0 0 5px 0; color:#555; font-size:14px;">${center.address}</p>
        <span style="background:#e8f5e8; color:#4CAF50; padding:4px 8px; border-radius:12px; font-size:12px;">${center.type}</span>
        <p style="margin:5px 0 0 0; font-size:14px;">📞 ${center.contact}</p>
        <a href="https://www.google.com/maps/dir/?api=1&destination=${center.lat},${center.lng}" 
           target="_blank" 
           style="display:inline-block; margin-top:8px; background:#4CAF50; color:white; padding:5px 10px; border-radius:5px; text-decoration:none; font-size:13px;">
          Get Directions
        </a>
      </div>
    `;

    const infoWindow = new google.maps.InfoWindow({ content: infoContent });
    marker.addListener('click', () => {
      infoWindows.forEach(iw => iw.close());
      infoWindow.open(map, marker);
      marker.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(() => marker.setAnimation(null), 2100);
      highlightCenterCard(center.id);
    });

    marker.centerId = center.id;
    marker.infoWindow = infoWindow;
    markers.push(marker);
    infoWindows.push(infoWindow);
  });
}

// ===== POPULATE CENTER LIST =====
function populateCentersList() {
  const container = document.getElementById('centersList');
  centers.forEach(center => {
    const div = document.createElement('div');
    div.className = 'center-card';
    div.id = `center-${center.id}`;
    div.innerHTML = `
      <h4>${center.name}</h4>
      <p>${center.address}</p>
      <span class="badge">${center.type}</span>
      <p>📞 ${center.contact}</p>
    `;
    div.addEventListener('click', () => {
      const marker = markers.find(m => m.centerId === center.id);
      if (marker) {
        map.panTo(marker.getPosition());
        google.maps.event.trigger(marker, 'click');
      }
    });
    container.appendChild(div);
  });
}

// ===== HIGHLIGHT SELECTED CENTER CARD =====
function highlightCenterCard(centerId) {
  document.querySelectorAll('.center-card').forEach(card => card.classList.remove('selected'));
  const card = document.getElementById(`center-${centerId}`);
  if (card) {
    card.classList.add('selected');
    card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

// ===== SEARCH FUNCTIONALITY =====
function setupSearch() {
  const searchInput = document.getElementById('searchInput');
  searchInput.addEventListener('input', () => {
    const value = searchInput.value.toLowerCase();
    document.querySelectorAll('.center-card').forEach((card, i) => {
      const match = centers[i].name.toLowerCase().includes(value) || centers[i].address.toLowerCase().includes(value);
      card.style.display = match ? 'block' : 'none';
      markers[i].setVisible(match);
    });
  });
}

// ===== BACK TO TOP =====
function setupBackToTop() {
  const btn = document.getElementById('backToTop');
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ===== MOBILE MENU =====
function setupMobileMenu() {
  const btn = document.getElementById('mobileMenuBtn');
  const nav = document.getElementById('mobileNav');
  btn.addEventListener('click', () => nav.classList.toggle('open'));
}

// ===== SCROLL STATS ANIMATION =====
function animateStats() {
  const stats = document.querySelectorAll('.stat-card');
  stats.forEach(stat => {
    const target = +stat.dataset.target;
    const number = stat.querySelector('.stat-number');
    let count = 0;
    const increment = Math.ceil(target / 100);
    const update = () => {
      count += increment;
      if (count > target) count = target;
      number.textContent = count;
      if (count < target) requestAnimationFrame(update);
    };
    update();
  });
}

// ===== SMOOTH SCROLL HELPER =====
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

// Export for Google Maps callback
window.initMap = initMap;
window.scrollToSection = scrollToSection;
