window.addEventListener("load", () => {
    const viewport = document.querySelector(".visual");
    const track = document.querySelector(".visual-track");
    const previousButton = document.querySelector(".visual-prev");
    const nextButton = document.querySelector(".visual-next");
    const pagination = [...document.querySelectorAll(".visual-pagination button")];

    if (!viewport || !track || !previousButton || !nextButton) return;

    const originalSlides = [...track.querySelectorAll(".project-slide")];
    if (originalSlides.length < 2) return;

    // Clones at both ends allow the track to loop without Swiper.
    track.prepend(originalSlides[originalSlides.length - 1].cloneNode(true));
    track.append(originalSlides[0].cloneNode(true));

    const slides = [...track.querySelectorAll(".project-slide")];
    let currentIndex = 1; // Start on the second original project.
    let resizeTimer;

    function getGap() {
        return parseFloat(getComputedStyle(track).gap) || 0;
    }

    function setPosition(animate = true) {
        const activeSlide = slides[currentIndex];
        if (!activeSlide) return;

        track.style.transition = animate ? "transform 650ms ease" : "none";
        const slideWidth = activeSlide.getBoundingClientRect().width;
        const step = slideWidth + getGap();
        const offset = (viewport.clientWidth - slideWidth) / 2 - currentIndex * step;
        track.style.transform = `translate3d(${offset}px, 0, 0)`;

        slides.forEach((slide, index) => {
            slide.classList.toggle("is-active", index === currentIndex);
        });

        const originalIndex = (currentIndex - 1 + originalSlides.length) % originalSlides.length;
        pagination.forEach((button, index) => {
            button.classList.toggle("is-active", index === originalIndex);
            button.setAttribute("aria-current", index === originalIndex ? "true" : "false");
        });
    }

    function move(direction) {
        currentIndex += direction;
        setPosition(true);
    }

    previousButton.addEventListener("click", () => move(-1));
    nextButton.addEventListener("click", () => move(1));

    pagination.forEach((button, index) => {
        button.addEventListener("click", () => {
            currentIndex = index + 1;
            setPosition(true);
        });
    });

    track.addEventListener("transitionend", (event) => {
        if (event.propertyName !== "transform") return;

        if (currentIndex === 0) {
            currentIndex = originalSlides.length;
            setPosition(false);
        } else if (currentIndex === originalSlides.length + 1) {
            currentIndex = 1;
            setPosition(false);
        }
    });

    window.addEventListener("resize", () => {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(() => setPosition(false), 100);
    });

    // Wait for images to load so slide widths are measured correctly.
    Promise.all(originalSlides.map((slide) => {
        const image = slide.querySelector("img");
        if (!image || image.complete) return Promise.resolve();
        return new Promise((resolve) => {
            image.addEventListener("load", resolve, { once: true });
            image.addEventListener("error", resolve, { once: true });
        });
    })).then(() => setPosition(false));

    setPosition(false);
});
