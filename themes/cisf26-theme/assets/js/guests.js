export function initGuestScroller() {
    const container = document.querySelector('.guest-showcase-container');
    if (!container) return; // Esegui solo se il componente esiste

    const featuredBio = container.querySelector('.featured-guest-bio');
    const featuredImage = container.querySelector('.featured-guest-image');
    const scrollerItems = container.querySelectorAll('.guest-list-item');
    const scroller = container.querySelector('.guest-list-scroller');
    const navPrev = container.querySelector('.arrow.prev');
    const navNext = container.querySelector('.arrow.next');

    const isMobile = () => window.innerWidth <= 768;

    // Funzione per aggiornare l'ospite in primo piano (Desktop)
    function updateFeaturedGuest(item) {
        if (isMobile()) return;

        // Rimuovi la classe 'active' da tutti e aggiungila a quello cliccato
        scrollerItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');

        // Aggiungi classi per l'animazione di fade-out
        featuredBio.classList.add('changing');
        featuredImage.classList.add('changing');

        // Aspetta la fine dell'animazione per cambiare il contenuto
        setTimeout(() => {
            const data = item.dataset;
            featuredImage.src = data.image;
            featuredImage.alt = data.name;
            featuredBio.querySelector('.featured-guest-name').textContent = data.name;
            featuredBio.querySelector('.featured-guest-role').textContent = data.role;
            featuredBio.querySelector('.featured-guest-content').innerHTML = data.bio;

            // Rimuovi le classi per l'animazione di fade-in
            featuredBio.classList.remove('changing');
            featuredImage.classList.remove('changing');
        }, 200); // Metà della durata della transizione CSS
    }

    // Gestione del click sugli elementi
    scrollerItems.forEach(item => {
        item.addEventListener('click', () => {
            if (isMobile()) {
                // Su mobile, gestisce solo l'overlay
                // Chiudi gli altri overlay prima di aprire quello nuovo
                const isActive = item.classList.contains('overlay-active');
                scrollerItems.forEach(i => i.classList.remove('overlay-active'));
                if (!isActive) {
                    item.classList.add('overlay-active');
                }
            } else {
                // Su desktop, aggiorna l'ospite in primo piano
                updateFeaturedGuest(item);
            }
        });
    });

    // Navigazione con le frecce (Desktop)
    navPrev.addEventListener('click', () => {
        scroller.scrollBy({ left: -200, behavior: 'smooth' });
    });

    navNext.addEventListener('click', () => {
        scroller.scrollBy({ left: 200, behavior: 'smooth' });
    });
}