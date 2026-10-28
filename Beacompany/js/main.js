window.addEventListener("load", () => {
    const slider = document.querySelector(".hero-sec .visual");
    if (!slider || typeof Swiper === "undefined") return;

    const visualSwiper = new Swiper(slider, {
        direction: "horizontal",
        loop: true,
        centeredSlides: true,
        slidesPerView: "auto",
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

    // Recalculate slide positions after image dimensions are available.
    const images = slider.querySelectorAll("img");
    let pendingImages = 0;

    images.forEach((image) => {
        if (!image.complete) {
            pendingImages += 1;
            image.addEventListener("load", refreshSlider, { once: true });
            image.addEventListener("error", refreshSlider, { once: true });
        }
    });

    function refreshSlider() {
        pendingImages -= 1;
        if (pendingImages <= 0) {
            visualSwiper.update();
            visualSwiper.slideToLoop(0, 0, false);
        }
    }

    visualSwiper.update();
});
