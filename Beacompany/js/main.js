window.addEventListener("load", () => {
    const slider = document.querySelector(".hero-sec .visual");
    if (!slider || typeof Swiper === "undefined") return;

    const firstSlide = slider.querySelector(".project-slide");
    if (!firstSlide) return;

    // Shift the initial slide track right by one slide slot.
    const slideGap = window.innerWidth <= 900 ? 12 : 20;
    const oneSlideSlot = firstSlide.getBoundingClientRect().width + slideGap;

    new Swiper(slider, {
        direction: "horizontal",
        loop: true,
        initialSlide: 1,
        centeredSlides: true,
        slidesPerView: "auto",
        slidesOffsetBefore: oneSlideSlot,
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
});
