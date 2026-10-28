window.addEventListener("load", () => {
    const slider = document.querySelector(".hero-sec .visual");
    if (!slider || typeof Swiper === "undefined") return;

    new Swiper(slider, {
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
});
