// ==========================================
// CONFIGURAÇÃO DO EMAILJS
// ==========================================

emailjs.init("0UHGn2DYsTSiu7oVA");

const EMAIL_SERVICE_ID = "service_j51ashj";

const TEMPLATE_AVALIACAO = "template_ve081pv"; // Template das estrelas
const TEMPLATE_CONTATO = "template_fo2tqey";     // Template do Fale Conosco


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

    // 4. SELEÇÃO DE ESTRELAS E ENVIO DA AVALIAÇÃO (TEMPLATE 1)
    const stars = document.querySelectorAll(".star-rating i");
    const notaInput = document.getElementById("notaInput");
    let selectedRating = 0;

    stars.forEach((star) => {
        star.addEventListener("click", function () {
            selectedRating = parseInt(this.getAttribute("data-value"));
            
            if (notaInput) {
                notaInput.value = selectedRating;
            }

            stars.forEach((s) => {
                if (parseInt(s.getAttribute("data-value")) <= selectedRating) {
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
    const btnSubmitRating = document.getElementById("btnSubmitRating");

    if (ratingForm) {
        ratingForm.addEventListener("submit", function (e) {
            e.preventDefault();

            if (selectedRating === 0) {
                alert("Por favor, escolha uma nota clicando em uma das estrelas!");
                return;
            }

            const resp = document.getElementById("feedbackResponse");
            btnSubmitRating.disabled = true;
            btnSubmitRating.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando...';

            // Envia usando o template específico de Avaliação
            emailjs.sendForm(EMAIL_SERVICE_ID, TEMPLATE_AVALIACAO, this)
                .then(function() {
                    resp.className = "feedback-msg";
                    resp.style.display = "block";
                    resp.innerHTML = "<p>Obrigado! Sua avaliação foi enviada com sucesso.</p>";

                    ratingForm.reset();
                    selectedRating = 0;
                    if (notaInput) notaInput.value = 0;

                    stars.forEach(s => {
                        s.classList.remove("fa-solid");
                        s.classList.add("fa-regular");
                    });
                }, function(error) {
                    console.error("Erro no EmailJS:", error);
                    resp.className = "feedback-msg error";
                    resp.style.display = "block";
                    resp.innerHTML = "<p>Erro ao enviar avaliação. Tente novamente mais tarde.</p>";
                })
                .finally(function() {
                    btnSubmitRating.disabled = false;
                    btnSubmitRating.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Enviar Avaliação';
                });
        });
    }

    // 5. ENVIO DO FORMULÁRIO DE CONTATO (TEMPLATE 2)
    const contactForm = document.getElementById("contactForm");
    const btnSubmitContact = document.getElementById("btnSubmitContact");

    if (contactForm) {
        contactForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const resp = document.getElementById("contactResponse");
            btnSubmitContact.disabled = true;
            btnSubmitContact.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando...';

            // Envia usando o template específico de Contato
            emailjs.sendForm(EMAIL_SERVICE_ID, TEMPLATE_CONTATO, this)
                .then(function() {
                    resp.className = "feedback-msg";
                    resp.style.display = "block";
                    resp.innerHTML = "<p>Mensagem enviada com sucesso! Responderemos em breve.</p>";
                    contactForm.reset();
                }, function(error) {
                    console.error("Erro no EmailJS:", error);
                    resp.className = "feedback-msg error";
                    resp.style.display = "block";
                    resp.innerHTML = "<p>Erro ao enviar mensagem. Tente novamente mais tarde.</p>";
                })
                .finally(function() {
                    btnSubmitContact.disabled = false;
                    btnSubmitContact.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Enviar Mensagem';
                });
        });
    }
});

// 6. MODO DALTONISMO GLOBAL
function changeDaltonismMode(mode) {
    const htmlElement = document.documentElement;
    if (mode === "none") {
        htmlElement.style.filter = "none";
    } else {
        htmlElement.style.filter = `url(#${mode})`;
    }
}

// 7. CARROSSEL DE FOTOS
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

// 8. FILTRO DE BUSCA DE MATERIAIS
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