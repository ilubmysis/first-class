window.addEventListener("load", () => {
    const slider = document.querySelector(".hero-sec .visual");
    if (!slider || typeof Swiper === "undefined") return;

    const visualSwiper = new Swiper(slider, {
        direction: "horizontal",
        loop: true,
        initialSlide: 1,
        centeredSlides: true,
        centeredSlidesBounds: false,
        slidesPerView: "auto",
        watchSlidesProgress: true,
        spaceBetween: 20,
        speed: 650,
        preloadImages: true,
        updateOnImagesReady: true,
        observer: true,
        observeParents: true,
        navigation: {
            nextEl: ".visual-next",
            prevEl: ".visual-prev"
        },
        pagination: {
            el: ".visual-controls .swiper-pagination",
            clickable: true
        },
        breakpoints: {
            0: { spaceBetween: 12 },
            901: { spaceBetween: 20 }
        }
    });

    // Let the browser finish layout before recalculating the initial loop position.
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            visualSwiper.update();
            visualSwiper.slideToLoop(1, 0, false);
            visualSwiper.update();
        });
    });

    // Recalculate again when any project image finishes loading.
    slider.querySelectorAll("img").forEach((image) => {
        if (!image.complete) {
            const refreshSlider = () => {
                visualSwiper.update();
                visualSwiper.slideTo(1, 0, false);
                visualSwiper.update();
            };

            image.addEventListener("load", refreshSlider, { once: true });
            image.addEventListener("error", refreshSlider, { once: true });
        }
    });
});
