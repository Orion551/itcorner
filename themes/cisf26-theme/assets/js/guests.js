export function initGuestScroller() {
    const container = document.querySelector('.guest-showcase-container');
    if (!container) return;

    const featuredGuest = container.querySelector('.featured-guest');
    const featuredBio = featuredGuest.querySelector('.featured-guest-bio');
    const featuredImage = featuredGuest.querySelector('.featured-guest-image');
    const scroller = container.querySelector('.guest-list-scroller');
    const navPrev = container.querySelector('.arrow-prev');
    const navNext = container.querySelector('.arrow-next');

    console.log('scroller', scroller);

    const isMobile = () => window.innerWidth <= 768;

    function createScrollerItem(data) {
        const item = document.createElement('div');
        item.className = 'guest-list-item';
        item.dataset.name = data.name;
        item.dataset.role = data.role;
        item.dataset.image = data.image;
        item.dataset.bio = data.bio;

        item.innerHTML = `
            <img src="${data.image}" alt="${data.name}">
            <div class="guest-item-overlay">
                <h3>${data.name}</h3>
                <p>${data.role}</p>
            </div>
        `;
        return item;
    }

    function updateFeaturedGuest(itemToFeature) {
        if (isMobile()) return;

        const currentFeaturedData = {
            name: featuredBio.querySelector('.featured-guest-name').textContent,
            role: featuredBio.querySelector('.featured-guest-role').textContent,
            image: featuredImage.src,
            bio: featuredBio.querySelector('.featured-guest-content').innerHTML,
        };

        const newFeaturedData = itemToFeature.dataset;

        featuredBio.classList.add('changing');
        featuredImage.classList.add('changing');

        setTimeout(() => {
            featuredImage.src = newFeaturedData.image;
            featuredImage.alt = newFeaturedData.name;
            featuredBio.querySelector('.featured-guest-name').textContent = newFeaturedData.name;
            featuredBio.querySelector('.featured-guest-role').textContent = newFeaturedData.role;
            featuredBio.querySelector('.featured-guest-content').innerHTML = newFeaturedData.bio;

            scroller.removeChild(itemToFeature);



            const newItem = createScrollerItem(currentFeaturedData);
            scroller.appendChild(newItem);

            setTimeout(() => {
                // Fai scrollare il carosello per mostrare il nuovo elemento
                newItem.scrollIntoView({
                    behavior: 'smooth',
                    inline: 'nearest'
                });
            }, 50); // Piccolo ritardo (50ms) per garantire lo scorrimento

            // Re-inizializza gli event listener
            addEventListenersToItems();

            featuredBio.classList.remove('changing');
            featuredImage.classList.remove('changing');
        }, 200);
    }

    function addEventListenersToItems() {
        const scrollerItems = container.querySelectorAll('.guest-list-item');
        scrollerItems.forEach(item => {
            item.removeEventListener('click', handleItemClick);
            item.addEventListener('click', handleItemClick);
        });
    }

    function handleItemClick(event) {
        const item = event.currentTarget;
        if (isMobile()) {

            const isActive = item.classList.contains('overlay-active');
            container.querySelectorAll('.guest-list-item').forEach(i => i.classList.remove('overlay-active'));
            if (!isActive) {
                item.classList.add('overlay-active');
            }
        } else {

            updateFeaturedGuest(item);
        }
    }


    addEventListenersToItems();


    navPrev.addEventListener('click', () => {
        scroller.scrollBy({ left: -200, behavior: 'smooth' });
    });

    navNext.addEventListener('click', () => {
        scroller.scrollBy({ left: 200, behavior: 'smooth' });
    });
}