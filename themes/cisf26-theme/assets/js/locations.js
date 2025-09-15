import { closeModal } from "./main.js"; // Già corretto

export function initLocationsPage() {
    const cards = document.querySelectorAll(".base-card");

    const youAreHereIcon = L.divIcon({
        html: '<i class="fa-solid fa-circle fa-lg" style="color: #007aff; filter: drop-shadow(0px 0px 5px #2b2b2b); -webkit-text-stroke: 2px white;"></i>',
        className: 'myDivIcon'
    });

    // Geolocation
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
            const userMarker = L.marker([pos.coords.latitude, pos.coords.longitude], {
                icon: youAreHereIcon }).addTo(map).bindPopup("Tu sei qui");
            map.setView([pos.coords.latitude, pos.coords.longitude], 12);
        });
    }

    document.addEventListener('click', (event) => {
        const openTrigger = event.target.closest('[data-modal-target]');
        console.log('open trigger', openTrigger);
        if (openTrigger) {
            event.preventDefault();
            const modalId = openTrigger.dataset.modalTarget || '';
            const selector = modalId.startsWith('#') ? modalId : `#${modalId}`;
            const modal = document.querySelector(selector);
            openModal(modal, openTrigger);
            return;
        }
    });

    const openModal = (modal, trigger) => {
        if(!modal) return;
        if(modal && trigger) {
            const locationData = trigger.dataset;
            console.log('locationData', locationData);
            console.log('modal', modal);
            modal.querySelector('.modal-location-title.title').textContent = locationData.locationTitle || '';
            modal.classList.add('open');
            document.body.classList.add('modal-open');
        }
    }

    // LeafLet Map init
    const map = L.map("map").setView([41.8648, 12.4813], 6); // Italy
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors"
    }).addTo(map);


    const markerMap = new Map();

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
                    <h3>
                        <strong>${title}</strong>
                    </h3>
                    <span>${address}</span>
                    <button class="popup-navigate-btn" data-lat="${lat}" data-lng="${lng}">
                        <i class="fa-solid fa-location-arrow"></i>
                    </button>
                </div>
                
            `);

            markerMap.set(card, marker);

            // Listener per il click sulla card
            card.addEventListener("click", () => {
                map.setView([parseFloat(lat), parseFloat(lng)], 15);
                marker.openPopup();
            });
        }
    });

    // Click handler on navigation button (popup)
    map.on('popupopen', (e) => {
        const navBtn = e.popup.getElement().querySelector('.popup-navigate-btn');
        if (navBtn) {
            navBtn.addEventListener("click", (e) => {
                const { lat, lng } = e.target.dataset;
                console.log('lat', lat);
                console.log('lng', lng);
                const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
                window.open(url, "_blank");
            });
        }
    });

    // Direct navigation (click on button 'directions')
    cards.forEach(card => {
        const navBtn = card.querySelector(".navigate-btn");
        if(navBtn) {
            navBtn.addEventListener("click", (e) => {
                e.stopPropagation(); // Previene il click sull'intera card
                const { lat, lng } = card.dataset;
                const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
                window.open(url, "_blank");
            });
        }
    });
}