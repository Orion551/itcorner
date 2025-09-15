export function initSchedulePage() {
    console.log("🚀 Schedule");

    const filtersContainer = document.querySelector('.filters-container');
    if (!filtersContainer) return;

    /* Filters */
    const filterButtons = filtersContainer.querySelectorAll(".filter-button");
    const eventCards = document.querySelectorAll(".scheduled-event-card");
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

    // Modal life-cycle
    document.addEventListener('click', (event) => {
        const openTrigger = event.target.closest('[data-modal-target]');
        if(openTrigger) {
            event.preventDefault();
            const modalId = openTrigger.dataset.modalTarget || '';
            const selector = modalId.startsWith('#') ? modalId : `#${modalId}`;
            const modal = document.querySelector(selector);
            openModal(modal, openTrigger);
            return;
        }

        /* Close button */
        const closeTrigger = event.target.closest('.close-modal');
        if(closeTrigger) {
            const modalToClose = closeTrigger.closest('.base-modal');
            closeModal(modalToClose);
            return;
        }

        /* Outside click closes the modal */
        const overlay = event.target.closest('.base-modal');
        if(overlay && event.target === overlay) {
            closeModal(overlay);
            return;
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' || e.key === 'Esc') {
            const openModalEl = document.querySelector('.base-modal.open');
            if (openModalEl) closeModal(openModalEl);
        }
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
            const cards = Array.from(column.querySelectorAll(".scheduled-event-card"));
            const visibleCount = cards.filter(c => window.getComputedStyle(c).display !== "none").length;
            column.style.display = visibleCount > 0 ? "" : "none";
        });
    };

    /**
     * Opens the modal
     * @param modal {Object} - The modal
     * @param trigger
     */
    const openModal = (modal, trigger) => {
        if (!modal) return;
        if (modal && trigger) {
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

    const closeModal = (modal) => {
        if (!modal) return;

        // start closing
        modal.classList.remove('open');
        modal.classList.add('closing');

        let finished = false;
        const cleanup = () => {
            if (finished) return;
            finished = true;
            modal.classList.remove('closing');
            // keep the modal in DOM; CSS hides it when neither .open nor .closing
            document.body.classList.remove('modal-open');
            modal.removeEventListener('transitionend', onTransitionEnd);
        };

        const onTransitionEnd = (ev) => {
            // ensure the event is coming from the modal (not child)
            if (ev.target === modal) cleanup();
        };

        // listen transitionend (or animationend if you use animations)
        modal.addEventListener('transitionend', onTransitionEnd, { once: true });

        // Fallback: after 400ms (slightly longer than the CSS transition)
        setTimeout(cleanup, 450);
    }

    applyFilter('all');
}