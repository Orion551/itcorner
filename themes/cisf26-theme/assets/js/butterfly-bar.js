export function initButterflyBar() {
    const toggleBtn = document.querySelector("#butterfly-bar-more-btn");
    const popupMenu = document.querySelector(".mobile-popup-menu");
    const body = document.body;

    toggleBtn.addEventListener("click", () => {
        console.log('clicked');
        body.classList.toggle('popup-open');
    });
}