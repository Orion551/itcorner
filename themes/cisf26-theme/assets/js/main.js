import { initSchedulePage } from './schedule.js';
import { initLocationsPage} from "./locations.js";

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

// ESC btn that closes MOdal
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' || e.key === 'Esc') {
        const openModalEl = document.querySelector('.base-modal.open');
        if (openModalEl) closeModal(openModalEl);
    }
});

// Modal's lifecycle
document.addEventListener('click', (event) => {
    // --- Btn to close Modal ---
    const closeTrigger = event.target.closest('.close-modal');
    if (closeTrigger) {
        const modalToClose = closeTrigger.closest('.base-modal');
        closeModal(modalToClose);
        return;
    }

    // --- External click to close Modal ---
    const overlay = event.target.closest('.base-modal.open');
    if (overlay && event.target === overlay) {
        closeModal(overlay);
    }
});



document.addEventListener('DOMContentLoaded', () => {
    console.log("🚀 Cool functions are ready to go");

    initSchedulePage();
    initLocationsPage();


});