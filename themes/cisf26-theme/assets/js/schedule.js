export function initSchedulePage() {
    console.log("🚀 Schedule");

    const filtersContainer = document.querySelector('.filters-container');
    if (!filtersContainer) return;

    /* Filters */
    const filterButtons = filtersContainer.querySelectorAll(".filter-button");
    const eventCards = document.querySelectorAll(".base-card");
    const dayColumns = document.querySelectorAll(".day-column");

    // Attach an event listener to each filter button
    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            const filter = button.dataset.filter;

            filterButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");

            applyFilter(filter);
        });
    });

    /**
     * Show/Hide cards based on selected filter.
     * @param {string} activeFilter - Filter to apply (e.g. "all", "workshop", ecc.).
     */
    const applyFilter = (activeFilter) => {
        // Filters event cards
        eventCards.forEach(card => {
            const cardContext = card.dataset.context;

            const shouldShow = activeFilter === "all" || cardContext === activeFilter;
            card.style.display = shouldShow ? "" : "none";
        });

        // Checks day cols and hides them if empty
        dayColumns.forEach(column => {
            const cards = Array.from(column.querySelectorAll(".base-card"));
            const visibleCount = cards.filter(c => window.getComputedStyle(c).display !== "none").length;
            column.style.display = visibleCount > 0 ? "" : "none";
        });
    };

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
            const speakerData = trigger.dataset;
            console.log('speaker data', speakerData);
            modal.querySelector('.modal-speaker.image').src = speakerData.speakerImage || '';
            modal.querySelector('.modal-speaker.name').textContent = speakerData.speakerName || '--';
            modal.querySelector('.modal-speaker.role').textContent = speakerData.speakerRole || '';
            modal.querySelector('.modal-speaker.bio').innerHTML = speakerData.speakerBio || '--';

            modal.classList.add('open');
            document.body.classList.add('modal-open');
        }
    }


    applyFilter('all');
}