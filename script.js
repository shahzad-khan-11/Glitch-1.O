// Hamburger toggle
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("nav-links");
hamburger.addEventListener("click", () => {
  navLinks.style.display = navLinks.style.display === "flex" ? "none" : "flex";
});

// Animated Stats
const stats = document.querySelectorAll(".stat-card");
stats.forEach(card => {
  const statElem = card.querySelector(".stat");
  const updateCount = () => {
    const target = +card.getAttribute("data-target");
    const count = +statElem.innerText;
    const increment = target / 100;
    if(count < target) {
      statElem.innerText = Math.ceil(count + increment);
      setTimeout(updateCount, 20);
    } else { statElem.innerText = target; }
  };
  updateCount();
});

// Google Map
function initMap() {
  const patna = { lat: 25.5941, lng: 85.1376 };
  const map = new google.maps.Map(document.getElementById('map'), { zoom: 12, center: patna });

  const centers = [
    { name: "Gandhi Maidan", lat: 25.6093, lng: 85.1379, contact: "0612-1234567", type: "Mixed", address: "Near Gandhi Maidan, Patna" },
    { name: "Kankarbagh", lat: 25.5945, lng: 85.1635, contact: "0612-2345678", type: "Electronics", address: "Kankarbagh Main Rd, Patna" },
    { name: "Rajendra Nagar", lat: 25.6021, lng: 85.1483, contact: "0612-3456789", type: "Batteries", address: "Rajendra Nagar, Patna" },
    { name: "Boring Road", lat: 25.6201, lng: 85.1225, contact: "0612-4567890", type: "Mixed", address: "Boring Rd, Patna" },
    { name: "Bailey Road", lat: 25.6245, lng: 85.1078, contact: "0612-5678901", type: "Electronics", address: "Bailey Rd, Patna" },
    { name: "Patna City", lat: 25.5950, lng: 85.1420, contact: "0612-6789012", type: "Batteries", address: "Patna City, Patna" },
    { name: "Danapur", lat: 25.6055, lng: 85.0300, contact: "0612-7890123", type: "Mixed", address: "Danapur, Patna" },
    { name: "Kadamkuan", lat: 25.5860, lng: 85.1000, contact: "0612-8901234", type: "Electronics", address: "Kadamkuan, Patna" },
    { name: "Patliputra", lat: 25.5730, lng: 85.1370, contact: "0612-9012345", type: "Batteries", address: "Patliputra, Patna" },
    { name: "Fatuha", lat: 25.5110, lng: 85.2010, contact: "0612-0123456", type: "Mixed", address: "Fatuha, Patna" },
    { name: "Mithapur", lat: 25.6200, lng: 85.1800, contact: "0612-1122334", type: "Electronics", address: "Mithapur, Patna" },
    { name: "Rajbansi Nagar", lat: 25.5900, lng: 85.1600, contact: "0612-2233445", type: "Mixed", address: "Rajbansi Nagar, Patna" },
    { name: "Kumhrar", lat: 25.5850, lng: 85.1300, contact: "0612-3344556", type: "Batteries", address: "Kumhrar, Patna" },
    { name: "Patna Junction", lat: 25.6090, lng: 85.1410, contact: "0612-4455667", type: "Mixed", address: "Patna Junction, Patna" },
    { name: "Bankipur", lat: 25.6000, lng: 85.1100, contact: "0612-5566778", type: "Electronics", address: "Bankipur, Patna" }
  ];

  const markers = [];
  const infoWindow = new google.maps.InfoWindow();

  centers.forEach(center => {
    const marker = new google.maps.Marker({
      position: { lat: center.lat, lng: center.lng },
      map: map,
      title: center.name,
      icon: "https://maps.google.com/mapfiles/ms/icons/green-dot.png"
    });
    marker.addListener("click", () => {
      infoWindow.setContent(
        `<h3>${center.name}</h3>
         <p>${center.type} Center</p>
         <p>Address: ${center.address}</p>
         <p>Contact: ${center.contact}</p>
         <a href="https://www.google.com/maps/dir/?api=1&destination=${center.lat},${center.lng}" target="_blank">Get Directions</a>`
      );
      infoWindow.open(map, marker);
    });
    markers.push({ marker, name: center.name.toLowerCase() });
  });

  // Search filter
  const searchInput = document.getElementById("search");
  searchInput.addEventListener("input", function () {
    const value = this.value.toLowerCase();
    markers.forEach(m => { m.marker.setVisible(m.name.includes(value)); });
  });

  // Use my location
  document.getElementById("locate-btn").addEventListener("click", () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const userPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        map.setCenter(userPos);
        new google.maps.Marker({ position: userPos, map: map, title: "You are here" });
      }, () => { alert("Unable to access your location"); });
    } else alert("Geolocation not supported");
  });

  // Scroll-to-top button
  const topBtn = document.querySelector(".top-btn");
  topBtn.addEventListener("click", () => { window.scrollTo({ top:0, behavior:"smooth" }); });
}

window.onload = initMap;