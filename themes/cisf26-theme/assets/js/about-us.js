export function initAboutUs() {
    const tl = gsap.timeline();


    tl.from([
        ".about-us-title span",
        ".about-us-subtitle span",
        ".about-us-description span",
    ], {
        y: 100,
        opacity: 0,
        ease: "power4.out",
        skewY: 7,
        duration: 1.8,
        delay: 0.5,
        stagger: {
            amount: 0.3
        }
    });

    // tl.to(".about-us-images", {
    //     opacity: 1,
    //     y: 0,
    //     duration: 1.2
    // }, "-=0.5");
    //
    // tl.from(".about-us-images img", {
    //     scale: 0.85,
    //     opacity: 0,
    //     stagger: 0.15,
    //     duration: 1,
    //     ease: "back.out(1.4)"
    // }, "-=0.8");

    gsap.from(".organizer-card", {
        scrollTrigger: {
            trigger: ".organizers-section",
            start: "top 85%",
        },
        opacity: 0,
        y: 40,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out"
    });
}