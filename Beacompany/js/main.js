window.addEventListener("load", () => {
    const slider = document.querySelector(".hero-sec .visual");
    if (!slider || typeof Swiper === "undefined") return;

    const firstSlide = slider.querySelector(".project-slide");
    if (!firstSlide) return;

    // Shift the initial slide track right by one slide slot.
    const slideGap = window.innerWidth <= 900 ? 12 : 20;
    const oneSlideSlot = firstSlide.getBoundingClientRect().width + slideGap;

    const visualSwiper = new Swiper(slider, {
        direction: "horizontal",
        loop: true,
        initialSlide: 1,
        centeredSlides: true,
        slidesPerView: "auto",
        watchSlidesProgress: true,
        spaceBetween: 20,
        speed: 650,
        preloadImages: true,
        updateOnImagesReady: true,
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

    // Shift the whole slide track right without changing slide order or navigation.
    const shiftTrackRight = () => {
        const firstSlide = slider.querySelector(".project-slide");
        if (!firstSlide) return;

        const offset = firstSlide.getBoundingClientRect().width + visualSwiper.params.spaceBetween;
        visualSwiper.wrapperEl.style.transform = `translate3d(${offset}px, 0, 0)`;
    };

    shiftTrackRight();
    window.addEventListener("resize", shiftTrackRight);
});
