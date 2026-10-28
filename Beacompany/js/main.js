document.addEventListener("DOMContentLoaded", () => {
    const slider = document.querySelector(".hero-sec .visual");
    if (!slider || typeof Swiper === "undefined") return;

    new Swiper(slider, {
        direction: "horizontal",
        loop: true,
        centeredSlides: true,
        slidesPerView: "auto",
        spaceBetween: 20,
        speed: 650,
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
