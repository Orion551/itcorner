export function initHomePage() {
    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
    const cisLetters = document.querySelectorAll("#CIS path");
    const phi = document.querySelectorAll("#phi");

    tl.from("#Leaf_sx", { x: -100, opacity: 0, duration: 1 })
        .from("#Leaf_dx", { x: 100, opacity: 0, duration: 1 }, "<");

    // 1) CISF + glow effect
    tl.from([cisLetters, phi], {
        scale: 0,
        opacity: 0,
        transformOrigin: "center center",
        duration: 0.4,
        stagger: 0.2,
        ease: "back.out(2)"
    })
        .to([cisLetters, phi], {
            filter: "drop-shadow(0 0 5px #ff8c00)",
            duration: 0.3,
            stagger: 0.2
        }, "<")
        .to([cisLetters, phi], {
            filter: "drop-shadow(0 0 0px #ff8c00)",
            duration: 0.4,
            stagger: 0.2
        });


    // 2) ROMA
    tl.from("#roma_text", { y: -50, opacity: 0, duration: 0.8 }, "-=0.3");

    // 3) 2026
    tl.from("#new_year", {
        y: 0,
        opacity: 0,
        duration: 0.8
    }, "-=0.3");


    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray("[data-animate]").forEach((section) => {
        gsap.fromTo(
            section,
            { opacity: 0, y: 60 },
            {
                opacity: 1,
                y: 0,
                duration: 0.5,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: section,
                    start: "top 85%",
                    toggleActions: "play none none none",
                },
            }
        );
    });

    const counter = document.getElementById("guests-counter");
    if (counter) {
        const finalValue = parseInt(counter.textContent, 10);
        counter.textContent = "0";

        ScrollTrigger.create({
            trigger: counter,
            start: "top 90%",
            once: true,
            onEnter: () => {
                gsap.to(counter, {
                    innerText: finalValue,
                    duration: 1.5,
                    snap: { innerText: 1 },
                    ease: "power1.out",
                    onUpdate: () => {
                        counter.textContent = Math.floor(counter.textContent);
                    },
                });
            },
        });
    }
}