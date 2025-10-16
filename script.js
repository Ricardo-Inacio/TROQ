
document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signup-form');
    const loginForm = document.getElementById('login-form');
    const offerForm = document.getElementById('offer-form');
    const messageDiv = document.getElementById('message');

    // Initialize Swiper for offer types
    const offerSwiper = new Swiper('.offer-swiper', {
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        slidesPerView: 1,
        spaceBetween: 10,
        centeredSlides: true,
        // Responsive breakpoints
        breakpoints: {
            640: {
                slidesPerView: 3,
                spaceBetween: 20,
            },
        },
    });

    // Handle offer type selection
    offerSwiper.on('slideChange', function () {
        const activeSlide = offerSwiper.slides[offerSwiper.activeIndex];
        const offerType = activeSlide.getAttribute('data-offer');
        document.getElementById('offer-type').value = offerType;
    });

    // Função para mostrar mensagens na tela
    const showMessage = (message, type) => {
        messageDiv.textContent = message;
        messageDiv.className = `message ${type}`;
    };

    // Lógica de Cadastro
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Impede o recarregamento da página

            const fullname = document.getElementById('fullname').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;

            if (password !== confirmPassword) {
                showMessage('As senhas não coincidem!', 'error');
                return;
            }

            try {
                const res = await fetch('/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ fullname, email, password }),
                });

                const data = await res.json();

                if (res.ok) {
                    showMessage(data.message, 'success');
                    signupForm.reset();
                    // Redireciona para o login após 2 segundos
                    setTimeout(() => window.location.href = '/login.html', 2000);
                } else {
                    showMessage(data.message, 'error');
                }
            } catch (error) {
                showMessage('Ocorreu um erro na comunicação com o servidor.', 'error');
            }
        });
    }

    // Lógica de Login
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const res = await fetch('/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password }),
                });

                const data = await res.json();

                if (res.ok) {
                    showMessage(data.message, 'success');
                    // Redireciona para o dashboard após 2 segundos
                    setTimeout(() => window.location.href = '/dashboard.html', 2000);
                } else {
                    showMessage(data.message, 'error');
                }
            } catch (error) {
                showMessage('Ocorreu um erro na comunicação com o servidor.', 'error');
            }
        });
    }

    // Lógica do Dashboard (Oferta)
    if (offerForm) {
        const introductionTextarea = document.getElementById('introduction');
        const charCount = document.getElementById('char-count');

        // Contador de caracteres para a apresentação
        if (introductionTextarea && charCount) {
            introductionTextarea.addEventListener('input', () => {
                const count = introductionTextarea.value.length;
                charCount.textContent = `${count}/100`;
            });
        }

        offerForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const offerTypeValue = document.getElementById('offer-type').value;
            const offerType = ['vender', 'trocar', 'servico'][parseInt(offerTypeValue)];
            const description = document.getElementById('description').value;
            const introduction = document.getElementById('introduction').value;
            const photos = document.getElementById('photos').files;

            if (!offerType || !description || !introduction) {
                showMessage('Todos os campos são obrigatórios!', 'error');
                return;
            }

            // Aqui você pode adicionar lógica para enviar os dados para o servidor
            // Por enquanto, apenas mostra uma mensagem de sucesso
            showMessage('Oferta publicada com sucesso!', 'success');
            offerForm.reset();
            if (charCount) charCount.textContent = '0/100';
        });
    }
});
