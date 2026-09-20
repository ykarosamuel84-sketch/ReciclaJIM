document.addEventListener("DOMContentLoaded", function () {
    // ==========================================
    // 1. MENU MOBILE (HAMBÚRGUER)
    // ==========================================
    const mobileToggle = document.getElementById("mobileToggle");
    const navWrapper = document.getElementById("navWrapper");

    if (mobileToggle && navWrapper) {
        mobileToggle.addEventListener("click", function () {
            navWrapper.classList.toggle("active");
        });

        // Fecha o menu ao clicar em qualquer link do menu (melhora a usabilidade)
        const navLinks = document.querySelectorAll(".nav-links a");
        navLinks.forEach(link => {
            link.addEventListener("click", () => {
                navWrapper.classList.remove("active");
            });
        });
    }

    // ==========================================
    // 2. ALTERNADOR DE TEMA (CLARO / ESCURO)
    // ==========================================
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
        });
    }

    // ==========================================
    // 3. GRÁFICOS INTERATIVOS (CHART.JS)
    // ==========================================
    // Gráfico de Arrecadação da Escola Izidoro
    const escolaCtx = document.getElementById("escolaChart");
    if (escolaCtx) {
        new Chart(escolaCtx, {
            type: "bar",
            data: {
                labels: ["Jan/Fev", "Mar/Abr", "Mai/Jun", "Jul/Ago", "Set/Out"],
                datasets: [{
                    label: "Quilos de E-Lixo Arrecadados (kg)",
                    data: [45, 90, 120, 85, 110],
                    backgroundColor: "#52b788",
                    borderColor: "#2d6a4f",
                    borderWidth: 1,
                    borderRadius: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { color: "#e0e0e0" } }
                },
                scales: {
                    x: { ticks: { color: "#aaa" }, grid: { color: "#333" } },
                    y: { ticks: { color: "#aaa" }, grid: { color: "#333" } }
                }
            }
        });
    }

    // Gráfico do Panorama Brasil
    const ewasteCtx = document.getElementById("ewasteChart");
    if (ewasteCtx) {
        new Chart(ewasteCtx, {
            type: "pie",
            data: {
                labels: ["Descartado Incorretamente (97%)", "Reciclado Oficialmente (3%)"],
                datasets: [{
                    data: [97, 3],
                    backgroundColor: ["#e63946", "#52b788"],
                    borderWidth: 2,
                    borderColor: "#1e1e1e"
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: "bottom",
                        labels: { color: "#e0e0e0", font: { size: 13 } }
                    }
                }
            }
        });
    }

    // ==========================================
    // 4. AVALIAÇÃO COM ESTRELAS
    // ==========================================
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

    // Envios de Formulários (Feedback e Contato)
    const ratingForm = document.getElementById("ratingForm");
    if (ratingForm) {
        ratingForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const resp = document.getElementById("feedbackResponse");
            if (resp) {
                resp.innerHTML = "<p style='color: #52b788; margin-top: 10px;'>Obrigado pela sua avaliação!</p>";
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
                resp.innerHTML = "<p style='color: #52b788; margin-top: 10px;'>Mensagem enviada com sucesso!</p>";
                contactForm.reset();
            }
        });
    }
});

// ==========================================
// 5. MODO DALTONISMO (FUNÇÃO GLOBAL)
// ==========================================
function changeDaltonismMode(mode) {
    const htmlElement = document.documentElement;
    if (mode === "none") {
        htmlElement.style.filter = "none";
    } else {
        htmlElement.style.filter = `url(#${mode})`;
    }
}

// ==========================================
// 6. CARROSSEL DE FOTOS
// ==========================================
let slideIndex = 0;

function moveSlide(step) {
    const slides = document.querySelectorAll(".slide-item");
    if (slides.length === 0) return;

    slides[slideIndex].classList.remove("active");
    slideIndex = (slideIndex + step + slides.length) % slides.length;
    slides[slideIndex].classList.add("active");
}

// ==========================================
// 7. BUSCA / FILTRO DE MATERIAIS
// ==========================================
function filterMaterials() {
    const input = document.getElementById("searchInput").value.toLowerCase();
    const cards = document.querySelectorAll(".material-card");

    cards.forEach((card) => {
        const nameAttr = card.getAttribute("data-name") || "";
        const textContent = card.innerText.toLowerCase();

        if (nameAttr.toLowerCase().includes(input) || textContent.includes(input)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
}