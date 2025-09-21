export function initGuestScroller() {
    const container = document.querySelector('.guest-showcase-container');
    if (!container) return;

    const featuredBio = container.querySelector('.featured-guest-bio');
    const featuredImage = container.querySelector('.featured-guest-image');
    const scrollerItems = container.querySelectorAll('.guest-list-item');
    const scroller = container.querySelector('.guest-list-scroller');
    const navPrev = container.querySelector('.arrow.prev');
    const navNext = container.querySelector('.arrow.next');

    const isMobile = () => window.innerWidth <= 768;

    function updateFeaturedGuest(item) {
        if (isMobile()) return;

        scrollerItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');

        featuredBio.classList.add('changing');
        featuredImage.classList.add('changing');

        setTimeout(() => {
            const data = item.dataset;
            featuredImage.src = data.image;
            featuredImage.alt = data.name;
            featuredBio.querySelector('.featured-guest-name').textContent = data.name;
            featuredBio.querySelector('.featured-guest-role').textContent = data.role;
            featuredBio.querySelector('.featured-guest-content').innerHTML = data.bio;

            featuredBio.classList.remove('changing');
            featuredImage.classList.remove('changing');
        }, 200);
    }

    scrollerItems.forEach(item => {
        item.addEventListener('click', () => {
            if (isMobile()) {
                const isActive = item.classList.contains('overlay-active');
                scrollerItems.forEach(i => i.classList.remove('overlay-active'));
                if (!isActive) {
                    item.classList.add('overlay-active');
                }
            } else {
                updateFeaturedGuest(item);
            }
        });
    });

    navPrev.addEventListener('click', () => {
        scroller.scrollBy({ left: -200, behavior: 'smooth' });
    });

    navNext.addEventListener('click', () => {
        scroller.scrollBy({ left: 200, behavior: 'smooth' });
    });
}