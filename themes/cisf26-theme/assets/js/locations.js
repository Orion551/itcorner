// locations.js
export function initLocationsPage() {
    // --- SELETTORI DOM ---
    const filtersContainer = document.querySelector('#location-filter-container');
    const markerMap = new Map();

    if (!filtersContainer) return;

    const sheet = document.querySelector('.locations-sheet');
    const handle = document.querySelector('.sheet-handle');

    const filterButtons = filtersContainer.querySelectorAll(".filter-button");
    const cards = document.querySelectorAll('#location-card');

    // MODIFICATO: Selezioniamo il wrapper che contiene i dati e la card
    const cardWrappers = document.querySelectorAll(".location-card-wrapper");
    if(!cardWrappers.length) return;

    // --- Mobile -- Sheet ---
    // sheet Toggler
    if (sheet && handle) {
        handle.addEventListener('click', () => {
            sheet.classList.toggle('is-expanded');
        });
    }

    // --- Filters ---
    const applyLocationFilter = (activeFilter) => {
        cardWrappers.forEach(wrapper => {
            const locationType = wrapper.querySelector('.location-card').dataset.type;
            const shouldShow = activeFilter === "all" || locationType === activeFilter;

            wrapper.style.display = shouldShow ? "block" : "none";
        });

        markerMap.forEach((marker, wrapper) => {
            const card = wrapper.querySelector('.location-card');
            if(activeFilter === 'all' || card.dataset.type === activeFilter)
                marker.addTo(map);
            else
                map.removeLayer(marker);
        });
    }

    // LeafLet map init
    const map = L.map("map").setView([41.8648, 12.4813], 6);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors"
    }).addTo(map);

    const youAreHereIcon = L.divIcon({
        html: '<i class="fa-solid fa-circle fa-lg" style="color: #007aff; filter: drop-shadow(0px 0px 5px #2b2b2b); -webkit-text-stroke: 2px white;"></i>',
        className: 'myDivIcon'
    });

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
            L.marker([pos.coords.latitude, pos.coords.longitude], {
                icon: youAreHereIcon
            }).addTo(map).bindPopup("Tu sei qui");
            map.setView([pos.coords.latitude, pos.coords.longitude], 12);
        }, (err) => {
            console.warn("Geolocation error:", err && err.message);
        });
    }

    // --- GESTIONE MARKER, POPUP E INTERAZIONI CARD ---
    // MODIFICATO: Iteriamo sui wrapper invece che direttamente sulle card
    cardWrappers.forEach(wrapper => {
        // I dati per la mappa li prendiamo dal wrapper
        const { lat, lng } = wrapper.dataset;
        // I dati per il contenuto li prendiamo dalla card interna
        const card = wrapper.querySelector('.location-card');
        if (!card) return;
        const { color, title, type, address, description, website } = card.dataset;

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

            // Usiamo il wrapper come chiave della mappa
            markerMap.set(wrapper, marker);

            // MODIFICATO: Aggiunta logica per chiudere lo sheet su mobile
            wrapper.addEventListener("click", () => {
                map.setView([parseFloat(lat), parseFloat(lng)], 15);
                marker.openPopup();

                // AGGIUNTO: Se siamo su mobile, chiudi lo sheet per mostrare la mappa
                if (window.innerWidth < 992 && sheet) {
                    sheet.classList.remove('is-expanded');
                }
            });
        }

        const navBtn = card.querySelector(".navigate-btn");
        if (navBtn) {
            navBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                if (lat && lng) {
                    const url = `https://maps.google.com/?q=${lat},${lng}`;
                    window.open(url, "_blank");
                }
            });
        }

        const infoBtn = card.querySelector('.location-card-fab-info-btn');
        const locationModal = document.getElementById('location-modal');
        if(infoBtn && locationModal) {
            infoBtn.addEventListener('click', (e) => {
                e.stopPropagation();

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
                    } else {
                        webEl.style.display = 'none';
                    }
                }

                locationModal.classList.remove('closing');
                locationModal.offsetHeight;
                locationModal.classList.add('open');
                document.body.classList.add('modal-open');
            });
        }
    });

    // --- GESTIONE POPUP E FILTRI (invariata) ---
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
            const url = `https://maps.google.com/?q=${lat},${lng}`;
            window.open(url, "_blank");
        }
    }

    filterButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            filterButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            const filter = btn.dataset.filter;
            applyLocationFilter(filter);
        });
    });


    applyLocationFilter('all');
}