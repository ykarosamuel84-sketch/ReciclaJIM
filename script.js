// ========================================================
// 0. INICIALIZAÇÃO DO EMAILJS
// ========================================================
(function() {
    emailjs.init({
        publicKey: "ngMihWippJuMdxlfh",
    });
})();

// ========================================================
// 1. ALTERNÂNCIA DE TEMA CLARO / ESCURO
// ========================================================
const toggleThemeBtn = document.getElementById('toggleTheme');
const themeIcon = document.getElementById('themeIcon');

toggleThemeBtn.addEventListener('click', () => {
    if (document.body.classList.contains('theme-dark')) {
        document.body.classList.remove('theme-dark');
        document.body.classList.add('theme-light');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    } else {
        document.body.classList.remove('theme-light');
        document.body.classList.add('theme-dark');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }
    updateChartColors();
});

// ========================================================
// 2. MODOS DE DALTONISMO COM FILTROS SVG
// ========================================================
function changeDaltonismMode(mode) {
    document.body.classList.remove('filter-protanopia', 'filter-deuteranopia', 'filter-tritanopia', 'filter-achromatopsia');
    if (mode !== 'none') {
        document.body.classList.add(`filter-${mode}`);
    }
}

// ========================================================
// 3. GRÁFICOS INTERATIVOS
// ========================================================
let ewasteChart, escolaChart;
const ctxEwaste = document.getElementById('ewasteChart').getContext('2d');
const ctxEscola = document.getElementById('escolaChart').getContext('2d');

function renderCharts(color1 = '#25855a', color2 = '#52b788') {
    if (ewasteChart) ewasteChart.destroy();
    ewasteChart = new Chart(ctxEwaste, {
        type: 'bar',
        data: {
            labels: ['2021', '2022', '2023', '2024', '2025 (Est.)'],
            datasets: [
                { label: 'Lixo Eletrônico Gerado (K-Ton)', data: [2200, 2350, 2400, 2550, 2680], backgroundColor: '#e76f51' },
                { label: 'Lixo Eletrônico Reciclado (K-Ton)', data: [65, 90, 140, 210, 310], backgroundColor: color2 }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    if (escolaChart) escolaChart.destroy();
    escolaChart = new Chart(ctxEscola, {
        type: 'line',
        data: {
            labels: ['Mês 1', 'Mês 2', 'Mês 3', 'Mês 4', 'Mês 5'],
            datasets: [{
                label: 'Arrecadação Izidoro Marins (kg)',
                data: [40, 85, 150, 290, 450],
                borderColor: color2,
                backgroundColor: color2,
                fill: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

function updateChartColors() {
    renderCharts('#25855a', '#52b788');
}

renderCharts();

// ========================================================
// 4. PESQUISA DE MATERIAIS
// ========================================================
function filterMaterials() {
    let input = document.getElementById('searchInput').value.toLowerCase();
    let cards = document.getElementsByClassName('material-card');

    for (let i = 0; i < cards.length; i++) {
        let name = cards[i].getAttribute('data-name');
        cards[i].style.display = name.includes(input) ? "flex" : "none";
    }
}

// ========================================================
// 5. CARROSSEL DE FOTOS AUTOMÁTICO
// ========================================================
let currentSlideIndex = 0;
let slideInterval;

function showSlide(index) {
    const slides = document.querySelectorAll('.slide-item');
    const dots = document.querySelectorAll('.dot');

    if (!slides.length) return;
    if (index >= slides.length) currentSlideIndex = 0;
    else if (index < 0) currentSlideIndex = slides.length - 1;
    else currentSlideIndex = index;

    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));

    slides[currentSlideIndex].classList.add('active');
    if (dots[currentSlideIndex]) dots[currentSlideIndex].classList.add('active');
}

function moveSlide(step) {
    showSlide(currentSlideIndex + step);
    resetAutoSlide();
}

function currentSlide(index) {
    showSlide(index);
    resetAutoSlide();
}

function startAutoSlide() {
    slideInterval = setInterval(() => moveSlide(1), 4000);
}

function resetAutoSlide() {
    clearInterval(slideInterval);
    startAutoSlide();
}

startAutoSlide();

// ========================================================
// 6. CORREÇÃO DO EMAILJS PARA CONTATO E AVALIAÇÃO
// ========================================================
// Sistema de Estrelas
const stars = document.querySelectorAll('.star-rating i');
let selectedRating = 0;

stars.forEach(star => {
    star.addEventListener('click', () => {
        selectedRating = star.getAttribute('data-value');
        stars.forEach((s, idx) => {
            if (idx < selectedRating) {
                s.classList.remove('fa-regular');
                s.classList.add('fa-solid');
            } else {
                s.classList.remove('fa-solid');
                s.classList.add('fa-regular');
            }
        });
    });
});

// Envio de Avaliação com EmailJS
document.getElementById('ratingForm').addEventListener('submit', function(e) {
    e.preventDefault();
    if (selectedRating === 0) {
        alert('Por favor, selecione uma nota de 1 a 5 estrelas!');
        return;
    }

    const nome = document.getElementById('nomeRating').value;
    const feedback = document.getElementById('feedbackText').value;
    const msgBox = document.getElementById('feedbackResponse');

    // Mapeamento correto dos parâmetros para seu Template do EmailJS
    const templateParams = {
        from_name: nome,
        reply_to: "Avaliação do Site",
        message: `[NOVA AVALIAÇÃO DO SITE DO ECOJIM]\n\nNota: ${selectedRating} Estrelas\nComentário: ${feedback}`
    };

    emailjs.send("service_gti544t", "template_vpg842g", templateParams)
        .then(() => {
            msgBox.innerText = `Obrigado pelo feedback, ${nome}! Sua avaliação de ${selectedRating} estrelas foi enviada!`;
            msgBox.style.display = 'block';
            document.getElementById('ratingForm').reset();
            selectedRating = 0;
        })
        .catch((err) => {
            console.error("Erro no envio:", err);
            alert("Erro ao enviar avaliação! Verifique a configuração no EmailJS.");
        });
});

// Envio do Formulário de Contato com EmailJS
const contactForm = document.querySelector('#form');
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const contactMsgBox = document.getElementById('contactResponse');

    emailjs.sendForm("service_gti544t", "template_vpg842g", contactForm)
        .then(() => {
            contactMsgBox.innerText = "Mensagem enviada com sucesso! Responderemos em breve.";
            contactMsgBox.style.display = 'block';
            contactForm.reset();
        })
        .catch((error) => {
            console.error("Erro no envio:", error);
            alert("Erro ao enviar mensagem!");

            document.getElementById('mobileToggle')?.addEventListener('click', function() {
    const navWrapper = document.getElementById('navWrapper');
    navWrapper.classList.toggle('active');
});
        });
});