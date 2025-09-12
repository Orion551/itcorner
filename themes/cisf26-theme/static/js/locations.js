document.addEventListener("DOMContentLoaded", () => {
    const locationPinColors = {
        "Laboratorio": "#ff6600",
        "Universitá": "#214b72",
    }
    const filterButtons = document.querySelectorAll(".filter-btn");
    const cards = document.querySelectorAll(".structure-card");
    const modal = document.getElementById("structure-modal");
    const modalClose = modal.querySelector(".modal-close");

    // Modal fields
    let modalTitle = document.getElementById("modal-title");
    let modalAddress = document.getElementById("modal-address");
    let modalDescription = document.getElementById("modal-description");
    let modalWebsite = document.getElementById("modal-website");

    // Init Leaflet map
    let map = L.map("map").setView([41.8648, 12.4813], 6); // Italy
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors"
    }).addTo(map);

    const youAreHereIcon = L.divIcon({
        html: '<i class="fa-solid fa-circle fa-lg" style="color: #007aff; filter: drop-shadow(0px 0px 5px #2b2b2b); -webkit-text-stroke: 2px white;"></i>',
        className: 'myDivIcon'
    })

    let markers = [];

    // Add markers from cards
    cards.forEach(card => {
        const lat = parseFloat(card.dataset.lat);
        const lng = parseFloat(card.dataset.lng);

        if (!isNaN(lat) && !isNaN(lng)) {
            const marker = L.marker([lat, lng], {
                icon: L.divIcon({
                    html: `<i class="fa-solid fa-location-pin fa-xl" style='color: ${locationPinColors[card.dataset.type]}; filter: drop-shadow(0px 0px 5px #2b2b2b); -webkit-text-stroke: 2px white;'></i>`,
                    className: 'myDivIcon'
                })
            }).addTo(map);

            marker.bindPopup(`
                <strong>
                    ${card.dataset.title}
                </strong><br>
                <button class="popup-navigate-btn" data-lat="${lat}" data-lng="${lng}">
                    Naviga 
                </button>
            `);
            markers.push({ marker, type: card.dataset.type });

            card.addEventListener("click", () => {
                map.setView([lat, lng], 15);
                marker.openPopup();
            });

            const cardInfoBtn = card.querySelector("#location-card-info-btn");

            cardInfoBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                modalTitle.textContent = card.dataset.title;
                modalAddress.textContent = card.dataset.address;
                modalDescription.textContent = card.dataset.description;
                if (card.dataset.website) {
                    modalWebsite.href = card.dataset.website;
                    modalWebsite.style.display = "inline";
                }
                else
                    modalWebsite.style.display = "none";
                modal.classList.remove("hidden");
            });

            const navBtn = card.querySelector(".navigate-btn");
            navBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
                window.open(url, "_blank");
            });
        };
    });

    document.addEventListener("click", (e) => {
        if (e.target.classList.contains("popup-navigate-btn")) {
            const lat = e.target.dataset.lat;
            const lng = e.target.dataset.lng;
            const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
            window.open(url, "_blank");
        }
    })

    // Modal close
    modalClose.addEventListener("click", () => modal.classList.add("hidden"));

    // Filters
    filterButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            filterButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            const filter = btn.dataset.filter;

            cards.forEach(card => {
                console.log('card', card);
                console.log('card.dataset', card.dataset);
                if (filter === "all" || card.dataset.type === filter) {
                    card.style.display = "block";
                } else {
                    card.style.display = "none";
                }
            });

            markers.forEach(obj => {
                if (filter === "all" || obj.type === filter) {
                    obj.marker.addTo(map);
                } else {
                    map.removeLayer(obj.marker);
                }
            });
        });
    });

    // Geolocation
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
            const userMarker = L.marker([pos.coords.latitude, pos.coords.longitude], {
                icon: youAreHereIcon }).addTo(map).bindPopup("Tu sei qui");
            map.setView([pos.coords.latitude, pos.coords.longitude], 12);
        });
    }
});