export function initButterflyBar() {
    const toggleBtn = document.querySelector("#butterfly-bar-more-btn");
    const overlay = document.querySelector(".mobile-popup-overlay");
    const sheet = document.querySelector("#butterfly-bar");
    const body = document.body;

    let sheetIsOpen = false;

    const toggleSheet = () => {
        if (sheetIsOpen) {
            body.classList.remove("popup-open");
            sheet.classList.remove("expanded");
            toggleBtn.classList.add("expanded");
            sheetIsOpen = false;
        }
        else {
            body.classList.add("popup-open");
            sheet.classList.add("expanded");
            toggleBtn.classList.remove("expanded");
            sheetIsOpen = true;
        }
    }

    toggleBtn.addEventListener("click", toggleSheet);
    overlay.addEventListener("click", toggleSheet);

}
