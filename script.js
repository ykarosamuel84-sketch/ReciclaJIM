// ========================================================
// 0. INICIALIZAÇÃO DO EMAILJS
// ========================================================
(function() {
    // Chave Pública do EmailJS fornecida por você
    emailjs.init({
        publicKey: "ngMihWippJuMdxlfh",
    });
})();

// ========================================================
// 1. GRÁFICOS DO CHART.JS
// ========================================================
let ewasteChart;
let escolaChart;

const ctxEwaste = document.getElementById('ewasteChart').getContext('2d');
const ctxEscola = document.getElementById('escolaChart').getContext('2d');

function renderCharts(c1 = '#e76f51', c2 = '#52b788') {
    // Gráfico 1: Panorama Nacional
    if (ewasteChart) ewasteChart.destroy();
    ewasteChart = new Chart(ctxEwaste, {
        type: 'bar',
        data: {
            labels: ['2021', '2022', '2023', '2024', '2025 (Est.)'],
            datasets: [
                {
                    label: 'Lixo Eletrônico Gerado no Brasil (K-Toneladas)',
                    data: [2200, 2350, 2400, 2550, 2680],
                    backgroundColor: c1
                },
                {
                    label: 'Lixo Eletrônico Reciclado (K-Toneladas)',
                    data: [65, 90, 140, 210, 310],
                    backgroundColor: c2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { labels: { color: '#fff' } }
            },
            scales: {
                x: { ticks: { color: '#aaa' }, grid: { color: '#333' } },
                y: { ticks: { color: '#aaa' }, grid: { color: '#333' } }
            }
        }
    });

    // Gráfico 2: Desempenho Interno da Escola Joaquim Izidoro Marins
    if (escolaChart) escolaChart.destroy();
    escolaChart = new Chart(ctxEscola, {
        type: 'line',
        data: {
            labels: ['Mês 1', 'Mês 2', 'Mês 3', 'Mês 4', 'Mês 5'],
            datasets: [{
                label: 'Arrecadação da Escola Izidoro Marins (kg)',
                data: [40, 85, 150, 290, 450],
                borderColor: c2,
                backgroundColor: c2,
                fill: false,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { labels: { color: '#fff' } }
            },
            scales: {
                x: { ticks: { color: '#aaa' }, grid: { color: '#333' } },
                y: { ticks: { color: '#aaa' }, grid: { color: '#333' } }
            }
        }
    });
}

// Inicializar gráficos na abertura da página
renderCharts();

// ========================================================
// 2. FILTRO DE PESQUISA DE MATERIAIS
// ========================================================
function filterMaterials() {
    let input = document.getElementById('searchInput').value.toLowerCase();
    let cards = document.getElementsByClassName('material-card');

    for (let i = 0; i < cards.length; i++) {
        let name = cards[i].getAttribute('data-name');
        if (name.includes(input)) {
            cards[i].style.display = "flex";
        } else {
            cards[i].style.display = "none";
        }
    }
}

// ========================================================
// 3. CARROSSEL DE FOTOS AUTOMÁTICO
// ========================================================
let currentSlideIndex = 0;
let slideInterval;

function showSlide(index) {
    const slides = document.querySelectorAll('.slide-item');
    const dots = document.querySelectorAll('.dot');

    if (slides.length === 0) return;

    if (index >= slides.length) currentSlideIndex = 0;
    else if (index < 0) currentSlideIndex = slides.length - 1;
    else currentSlideIndex = index;

    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

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
    slideInterval = setInterval(() => {
        moveSlide(1);
    }, 4000); // Muda a foto a cada 4 segundos
}

function resetAutoSlide() {
    clearInterval(slideInterval);
    startAutoSlide();
}

// Inicia o carrossel
startAutoSlide();

// ========================================================
// 4. SISTEMA DE ESTRELAS E FORMULÁRIO DE AVALIAÇÃO (EMAILJS)
// ========================================================
const stars = document.querySelectorAll('.star-rating i');
let selectedRating = 0;

stars.forEach(star => {
    star.addEventListener('click', () => {
        selectedRating = star.getAttribute('data-value');
        stars.forEach((s, idx) => {
            if (idx < selectedRating) {
                s.classList.remove('fa-regular');
                s.classList.add('fa-solid', 'active');
            } else {
                s.classList.remove('fa-solid', 'active');
                s.classList.add('fa-regular');
            }
        });
    });
});

document.getElementById('ratingForm').addEventListener('submit', function(e) {
    e.preventDefault();
    if (selectedRating === 0) {
        alert('Por favor, selecione uma nota de 1 a 5 estrelas!');
        return;
    }

    const nome = document.getElementById('nomeRating').value;
    const feedback = document.getElementById('feedbackText').value;
    const msgBox = document.getElementById('feedbackResponse');

    // Enviar dados para EmailJS (Garante recebimento em ykarosamuel84@gmail.com)
    const templateParams = {
        nome: nome,
        mensagem: `[AVALIAÇÃO DO SITE]\nNota: ${selectedRating} Estrelas\nComentário: ${feedback}`,
        email: "Avaliação direta pelo site"
    };

    emailjs.send("service_gti544t", "template_vpg842g", templateParams)
        .then(() => {
            msgBox.innerText = `Obrigado pelo feedback, ${nome}! Sua avaliação de ${selectedRating} estrelas foi enviada para nosso e-mail.`;
            msgBox.style.display = 'block';
            document.getElementById('ratingForm').reset();
            stars.forEach(s => { s.classList.remove('fa-solid', 'active'); s.classList.add('fa-regular'); });
            selectedRating = 0;
        })
        .catch((err) => {
            console.error("Erro ao enviar avaliação:", err);
            alert("Ocorreu um erro ao enviar sua avaliação. Tente novamente!");
        });
});

// ========================================================
// 5. FORMULÁRIO DE CONTATO (EMAILJS)
// ========================================================
const contactForm = document.querySelector('#form');
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const contactMsgBox = document.getElementById('contactResponse');

    emailjs.sendForm("service_gti544t", "template_vpg842g", contactForm)
        .then((response) => {
            contactMsgBox.innerText = "Mensagem enviada com sucesso! Em breve responderemos.";
            contactMsgBox.style.display = 'block';
            contactForm.reset();
        })
        .catch((error) => {
            console.error("Erro no envio:", error);
            alert("Erro ao enviar mensagem! Tente novamente.");
        });
});

// ========================================================
// 6. ALTERNÂNCIA DO MODO DALTÔNICO
// ========================================================
function toggleModoDaltonico() {
    document.body.classList.toggle('modo-daltonico');
    const isDaltonico = document.body.classList.contains('modo-daltonico');
    
    if (isDaltonico) {
        renderCharts('#0077b6', '#e9c46a');
    } else {
        renderCharts('#e76f51', '#52b788');
    }
}