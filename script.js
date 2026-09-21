document.addEventListener("DOMContentLoaded", function () {
    // 1. MENU MOBILE
    const mobileToggle = document.getElementById("mobileToggle");
    const navWrapper = document.getElementById("navWrapper");

    if (mobileToggle && navWrapper) {
        mobileToggle.addEventListener("click", function () {
            navWrapper.classList.toggle("active");
        });

        const navLinks = document.querySelectorAll(".nav-links a");
        navLinks.forEach(link => {
            link.addEventListener("click", () => {
                navWrapper.classList.remove("active");
            });
        });
    }

    // 2. ALTERNADOR DE TEMA CLARO / ESCURO
    const toggleThemeBtn = document.getElementById("toggleTheme");
    const themeIcon = document.getElementById("themeIcon");

    if (toggleThemeBtn && themeIcon) {
        toggleThemeBtn.addEventListener("click", function () {
            if (document.body.classList.contains("theme-dark")) {
                document.body.classList.remove("theme-dark");
                document.body.classList.add("theme-light");
                themeIcon.classList.remove("fa-moon");
                themeIcon.classList.add("fa-sun");
            } else {
                document.body.classList.remove("theme-light");
                document.body.classList.add("theme-dark");
                themeIcon.classList.remove("fa-sun");
                themeIcon.classList.add("fa-moon");
            }
            updateChartTheme();
        });
    }

    // 3. GRÁFICOS INTERATIVOS
    let escolaChartInstance = null;
    let ewasteChartInstance = null;

    function renderCharts() {
        const isLight = document.body.classList.contains("theme-light");
        const textColor = isLight ? "#2d6a4f" : "#aaaaaa";
        const gridColor = isLight ? "rgba(0, 0, 0, 0.08)" : "rgba(255, 255, 255, 0.08)";
        const barColor = isLight ? "#1b4332" : "#52b788";

        const escolaCtx = document.getElementById("escolaChart");
        if (escolaCtx) {
            if (escolaChartInstance) escolaChartInstance.destroy();
            escolaChartInstance = new Chart(escolaCtx, {
                type: "bar",
                data: {
                    labels: ["Jan/Fev", "Mar/Abr", "Mai/Jun", "Jul/Ago", "Set/Out"],
                    datasets: [{
                        label: "Quilos de E-Lixo Arrecadados (kg)",
                        data: [45, 90, 120, 85, 110],
                        backgroundColor: barColor,
                        borderRadius: 5
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { labels: { color: textColor } }
                    },
                    scales: {
                        x: { ticks: { color: textColor }, grid: { color: gridColor } },
                        y: { ticks: { color: textColor }, grid: { color: gridColor } }
                    }
                }
            });
        }

        const ewasteCtx = document.getElementById("ewasteChart");
        if (ewasteCtx) {
            if (ewasteChartInstance) ewasteChartInstance.destroy();
            ewasteChartInstance = new Chart(ewasteCtx, {
                type: "pie",
                data: {
                    labels: ["Descartado Incorretamente (97%)", "Reciclado Oficialmente (3%)"],
                    datasets: [{
                        data: [97, 3],
                        backgroundColor: ["#d90429", "#2d6a4f"],
                        borderWidth: 2,
                        borderColor: isLight ? "#ffffff" : "#1e1e1e"
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: "bottom",
                            labels: { color: textColor, font: { size: 12 }, padding: 15 }
                        }
                    }
                }
            });
        }
    }

    function updateChartTheme() {
        renderCharts();
    }

    renderCharts();

    // 4. AVALIAÇÃO DE ESTRELAS
    const stars = document.querySelectorAll(".star-rating i");
    let selectedRating = 0;

    stars.forEach((star) => {
        star.addEventListener("click", function () {
            selectedRating = this.getAttribute("data-value");
            stars.forEach((s) => {
                if (s.getAttribute("data-value") <= selectedRating) {
                    s.classList.remove("fa-regular");
                    s.classList.add("fa-solid");
                } else {
                    s.classList.remove("fa-solid");
                    s.classList.add("fa-regular");
                }
            });
        });
    });

    const ratingForm = document.getElementById("ratingForm");
    if (ratingForm) {
        ratingForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const resp = document.getElementById("feedbackResponse");
            if (resp) {
                resp.style.display = "block";
                resp.innerHTML = "<p style='color: #ffffff; margin: 0;'>Obrigado pela sua avaliação!</p>";
                ratingForm.reset();
                stars.forEach(s => {
                    s.classList.remove("fa-solid");
                    s.classList.add("fa-regular");
                });
            }
        });
    }

    const contactForm = document.getElementById("form");
    if (contactForm) {
        contactForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const resp = document.getElementById("contactResponse");
            if (resp) {
                resp.style.display = "block";
                resp.innerHTML = "<p style='color: #ffffff; margin: 0;'>Mensagem enviada com sucesso!</p>";
                contactForm.reset();
            }
        });
    }
});

// 5. MODO DALTONISMO GLOBAL
function changeDaltonismMode(mode) {
    const htmlElement = document.documentElement;
    if (mode === "none") {
        htmlElement.style.filter = "none";
    } else {
        htmlElement.style.filter = `url(#${mode})`;
    }
}

// 6. CARROSSEL DE FOTOS
let slideIndex = 0;

function showSlide(index) {
    const slides = document.querySelectorAll(".slide-item");
    const dots = document.querySelectorAll(".carousel-dots .dot");
    if (slides.length === 0) return;

    if (index >= slides.length) slideIndex = 0;
    else if (index < 0) slideIndex = slides.length - 1;
    else slideIndex = index;

    slides.forEach(slide => slide.classList.remove("active"));
    dots.forEach(dot => dot.classList.remove("active"));

    slides[slideIndex].classList.add("active");
    if (dots[slideIndex]) dots[slideIndex].classList.add("active");
}

function moveSlide(step) {
    showSlide(slideIndex + step);
}

function currentSlide(n) {
    showSlide(n);
}

// 7. FILTRO DE BUSCA
function filterMaterials() {
    const input = document.getElementById("searchInput").value.toLowerCase();
    const cards = document.querySelectorAll(".material-card");

    cards.forEach((card) => {
        const nameAttr = card.getAttribute("data-name") || "";
        const textContent = card.innerText.toLowerCase();

        if (nameAttr.toLowerCase().includes(input) || textContent.includes(input)) {
            card.style.display = "flex";
        } else {
            card.style.display = "none";
        }
    });
}