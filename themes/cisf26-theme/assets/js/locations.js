// locations.js
export function initLocationsPage() {
    const filtersContainer = document.querySelector('#location-filter-container');
    const markerMap = new Map();

    if (!filtersContainer) return;


    const filterButtons = filtersContainer.querySelectorAll(".filter-button");
    const cards = document.querySelectorAll("#location-card");

    if(!cards.length) return;

    const applyLocationFilter = (activeFilter) => {
        cards.forEach(card => {
            const locationType = card.dataset.type;
            const shouldShow = activeFilter ===  "all" || locationType === activeFilter;
            console.log("Card:", card.dataset.title,
                "| type:", `"${locationType}"`,
                "| shouldShow:", shouldShow);
            card.style.display = shouldShow ? "block" : "none";
        });

        markerMap.forEach((v,k) => {
            if(activeFilter === 'all' || k.dataset.type === activeFilter)
                v.addTo(map);
            else
                map.removeLayer(v);
        });
    }

    // LeafLet map init
    const map = L.map("map").setView([41.8648, 12.4813], 6); // Italy

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors"
    }).addTo(map);

    const youAreHereIcon = L.divIcon({
        html: '<i class="fa-solid fa-circle fa-lg" style="color: #007aff; filter: drop-shadow(0px 0px 5px #2b2b2b); -webkit-text-stroke: 2px white;"></i>',
        className: 'myDivIcon'
    });

    // Geolocation
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
            const userMarker = L.marker([pos.coords.latitude, pos.coords.longitude], {
                icon: youAreHereIcon
            }).addTo(map).bindPopup("Tu sei qui");
            map.setView([pos.coords.latitude, pos.coords.longitude], 12);
        }, (err) => {
            console.warn("Geolocation error:", err && err.message);
        });
    }



    // Adds markers and click to show popup
    cards.forEach(card => {
        const { lat, lng, color, title, type, address } = card.dataset;

        if (lat && lng) {
            const marker = L.marker([parseFloat(lat), parseFloat(lng)], {
                icon: L.divIcon({
                    html: `<i class="fa-solid fa-location-pin fa-xl" style='color: ${color || "#007aff"}; filter: drop-shadow(0px 0px 5px #2b2b2b); -webkit-text-stroke: 2px white;'></i>`,
                    className: 'myDivIcon'
                })
            }).addTo(map);

            marker.bindPopup(`
                <div class="map-popup">
                    <h3><strong>${title || ''}</strong></h3>
                    <div class="map-popup-address">${address || ''}</div>
                    <button class="popup-navigate-btn" data-lat="${lat}" data-lng="${lng}">
                        <i class="fa-solid fa-location-arrow"></i>
                    </button>
                </div>
            `);

            markerMap.set(card, marker);

            card.addEventListener("click", () => {
                map.setView([parseFloat(lat), parseFloat(lng)], 15);
                marker.openPopup();
            });
        }
    });

    map.on('popupopen', (e) => {
        const popupEl = e.popup.getElement();
        const navBtn = popupEl.querySelector('.popup-navigate-btn');
        if (navBtn) {
            navBtn.removeEventListener('click', onPopupNavigateClick);
            navBtn.addEventListener('click', onPopupNavigateClick);
        }
    });

    function onPopupNavigateClick(ev) {
        ev.stopPropagation();
        const { lat, lng } = ev.currentTarget.dataset;
        if (lat && lng) {
            const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
            window.open(url, "_blank");
        }
    }

    // Directins btn within card
    cards.forEach(card => {
        const navBtn = card.querySelector(".navigate-btn");
        if (navBtn) {
            navBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                const { lat, lng } = card.dataset;
                if (lat && lng) {
                    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
                    window.open(url, "_blank");
                }
            });
        }
    });

    const locationModal = document.getElementById('location-modal');
    const infoButtons = document.querySelectorAll('.location-card-fab-info-btn');

    infoButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // evita che il click sulla card venga triggerato
            const card = btn.closest('.base-card');
            if (!card || !locationModal) return;

            // Data reading
            const ds = card.dataset;
            const title = ds.title || '';
            const address = ds.address || '';
            const description = ds.description || '';
            const website = ds.website || '';

            const titleEl = locationModal.querySelector('.modal-location-title');
            const addressEl = locationModal.querySelector('#modal-address');
            const descEl = locationModal.querySelector('#modal-description');
            const webEl = locationModal.querySelector('#modal-website');

            if (titleEl) titleEl.textContent = title;
            if (addressEl) addressEl.textContent = address;
            if (descEl) descEl.textContent = description;
            if (webEl) {
                if (website) {
                    webEl.href = website;
                    webEl.style.display = '';
                } else
                    webEl.style.display = 'none';
            }

            locationModal.classList.remove('closing');
            locationModal.offsetHeight;
            locationModal.classList.add('open');
            document.body.classList.add('modal-open');
        });
    });

    filterButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            // reset attivi
            // filterButtons.forEach(b => b.classList.remove("active"));
            // btn.classList.add("active");

            const filter = btn.dataset.filter;
            applyLocationFilter(filter);
        });
    });
}