import { initSchedulePage } from './schedule.js';
import { initLocationsPage } from "./locations.js";

/**
 * Logics & Styling to close the Modal
 * @param modal {object} - DOM Modal
 */
export const closeModal = (modal) => {
    if (!modal) return;
    modal.classList.remove('open');
    modal.classList.add('closing');
    let finished = false;
    const cleanup = () => {
        if (finished) return;
        finished = true;
        modal.classList.remove('closing');
        document.body.classList.remove('modal-open');
        modal.removeEventListener('transitionend', onTransitionEnd);
    };
    const onTransitionEnd = (ev) => {
        if (ev.target === modal) cleanup();
    };
    modal.addEventListener('transitionend', onTransitionEnd, { once: true });
    setTimeout(cleanup, 450);
};

// --- ESC key closes Modal ---
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' || e.key === 'Esc') {
        const openModalEl = document.querySelector('.base-modal.open');
        if (openModalEl) closeModal(openModalEl);
    }
});

// --- Modal lifecycle (close btn + overlay) ---
document.addEventListener('click', (event) => {
    const closeTrigger = event.target.closest('.close-modal');
    if (closeTrigger) {
        const modalToClose = closeTrigger.closest('.base-modal');
        closeModal(modalToClose);
        return;
    }

    const overlay = event.target.closest('.base-modal.open');
    if (overlay && event.target === overlay) {
        closeModal(overlay);
    }
});

// --- Page initializers ---
document.addEventListener('DOMContentLoaded', () => {
    // Init schedule page if schedule container exists
    if (document.querySelector('.schedule-grid')) {
        initSchedulePage();
    }
    // Init locations page if map exists
    if (document.querySelector('#map')) {
        initLocationsPage();
    }
});
