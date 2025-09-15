import { closeModal } from "./main";

export function initLocationsPage() {
    const filterButtons = document.querySelectorAll(".filter-btn");
    const cards = document.querySelectorAll(".structure-card");

    // Init Leaflet map
    let map = L.map("map").setView([41.8648, 12.4813], 6); // Italy
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors"
    }).addTo(map);

    const youAreHereIcon = L.divIcon({
        html: '<i class="fa-solid fa-circle fa-lg" style="color: #007aff; filter: drop-shadow(0px 0px 5px #2b2b2b); -webkit-text-stroke: 2px white;"></i>',
        className: 'myDivIcon'
    });

    let markers = [];

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

    // TODO: Move to main.js
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' || e.key === 'Esc') {
            const openModalEl = document.querySelector('.base-modal.open');
            if (openModalEl) closeModal(openModalEl);
        }
    });

    cards.forEach(card => {
        const lat = parseFloat(card.dataset.lat);
        const lng = parseFloat(card.dataset.lng);

        if (!isNaN(lat) && !isNaN(lng)) {
            const color = card.dataset.color || "#007aff";
            const marker = L.marker([lat, lng], {
                icon: L.divIcon({
                    html: `<i class="fa-solid fa-location-pin fa-xl" style='color: ${color}; 
                                 filter: drop-shadow(0px 0px 5px #2b2b2b); 
                                 -webkit-text-stroke: 2px white;'></i>`,
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

            const navBtn = card.querySelector(".navigate-btn");
            navBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
                window.open(url, "_blank");
            });
        };
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
}