// ================================================================
// Основная логика для сайта InvestGroup Samara
// Все комментарии на русском языке согласно правилу пользователя
// ================================================================

// Инициализация после загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    initSmoothScrolling();
    initBurgerMenu();
    initAOS();
    initContactForm();
    initScrollHeader();
    initScrollIndicator();
});

// ================================================================
// Плавная прокрутка по якорным ссылкам
// ================================================================
function initSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Учитываем высоту шапки только если она видима
                const header = document.querySelector('.header');
                const headerHeight = header.classList.contains('visible') ? header.offsetHeight : 0;
                const targetPosition = targetElement.offsetTop - headerHeight - 20; // +20px для отступа
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Закрываем мобильное меню если оно открыто
                const nav = document.querySelector('.header__nav');
                const burger = document.querySelector('.header__burger');
                if (nav && nav.classList.contains('active')) {
                    nav.classList.remove('active');
                    burger.classList.remove('active');
                    document.body.style.overflow = '';
                }
            }
        });
    });
}

// ================================================================
// Индикатор прокрутки на вступительном экране
// ================================================================
function initScrollIndicator() {
    const scrollIndicator = document.querySelector('.intro__scroll-indicator');
    const heroSection = document.querySelector('.hero');
    
    if (!scrollIndicator || !heroSection) return;
    
    scrollIndicator.addEventListener('click', function() {
        heroSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });
}

// ================================================================
// Бургер-меню для мобильной версии
// ================================================================
function initBurgerMenu() {
    const burger = document.querySelector('.header__burger');
    const nav = document.querySelector('.header__nav');
    
    if (!burger || !nav) return;
    
    burger.addEventListener('click', function() {
        // Переключаем состояние меню
        this.classList.toggle('active');
        nav.classList.toggle('active');
        
        // Блокируем скролл страницы при открытом меню
        if (nav.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });
    
    // Закрываем меню при клике вне его области
    document.addEventListener('click', function(e) {
        if (!nav.contains(e.target) && !burger.contains(e.target)) {
            nav.classList.remove('active');
            burger.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Закрываем меню при изменении размера окна
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            nav.classList.remove('active');
            burger.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// ================================================================
// Инициализация библиотеки AOS для анимаций при прокрутке
// ================================================================
function initAOS() {
    // Проверяем, что библиотека AOS загружена
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,          // Длительность анимации
            once: true,             // Анимация выполняется только один раз
            offset: 100,            // Отступ для срабатывания анимации
            easing: 'ease-out-cubic' // Плавность анимации
        });
    }
}

// ================================================================
// Обработка контактной формы с валидацией
// ================================================================
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Получаем данные формы
        const formData = new FormData(this);
        const name = this.querySelector('input[type="text"]').value.trim();
        const phone = this.querySelector('input[type="tel"]').value.trim();
        const message = this.querySelector('textarea').value.trim();
        
        // Валидация полей
        if (!validateForm(name, phone)) {
            return;
        }
        
        // Отправляем форму
        submitForm({
            name: name,
            phone: phone,
            message: message
        });
    });
}

// ================================================================
// Валидация формы с кастомными сообщениями
// ================================================================
function validateForm(name, phone) {
    let isValid = true;
    
    // Очищаем предыдущие ошибки
    clearFormErrors();
    
    // Проверяем имя
    if (name.length < 2) {
        showFieldError('text', 'Пожалуйста, введите ваше имя (минимум 2 символа)');
        isValid = false;
    }
    
    // Проверяем телефон (базовая проверка)
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    if (!phoneRegex.test(phone)) {
        showFieldError('tel', 'Пожалуйста, введите корректный номер телефона');
        isValid = false;
    }
    
    return isValid;
}

// ================================================================
// Показ ошибок валидации
// ================================================================
function showFieldError(inputType, message) {
    const input = document.querySelector(`input[type="${inputType}"]`);
    if (!input) return;
    
    input.style.borderColor = '#dc3545';
    
    // Создаем элемент ошибки
    const errorElement = document.createElement('div');
    errorElement.className = 'form__error';
    errorElement.textContent = message;
    errorElement.style.color = '#dc3545';
    errorElement.style.fontSize = '14px';
    errorElement.style.marginTop = '4px';
    
    // Вставляем после поля ввода
    input.parentNode.insertBefore(errorElement, input.nextSibling);
}

// ================================================================
// Очистка ошибок формы
// ================================================================
function clearFormErrors() {
    const errorElements = document.querySelectorAll('.form__error');
    errorElements.forEach(el => el.remove());
    
    const inputs = document.querySelectorAll('.form__input');
    inputs.forEach(input => {
        input.style.borderColor = '';
    });
}

// ================================================================
// Отправка формы (имитация или интеграция с EmailJS)
// ================================================================
function submitForm(data) {
    const submitButton = document.querySelector('.cta__form button[type="submit"]');
    const originalText = submitButton.textContent;
    
    // Показываем состояние загрузки
    submitButton.textContent = 'Отправляем...';
    submitButton.disabled = true;
    
    // Имитация отправки (можно заменить на реальную интеграцию)
    setTimeout(() => {
        showSuccessMessage();
        resetForm();
        
        // Возвращаем кнопку в исходное состояние
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }, 1500);
    
    // Пример реальной отправки через fetch:
    /*
    fetch('/submit-form', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            showSuccessMessage();
            resetForm();
        } else {
            showErrorMessage('Произошла ошибка при отправке. Попробуйте еще раз.');
        }
    })
    .catch(error => {
        showErrorMessage('Произошла ошибка при отправке. Попробуйте еще раз.');
    })
    .finally(() => {
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    });
    */
}

// ================================================================
// Показ сообщения об успешной отправке
// ================================================================
function showSuccessMessage() {
    const form = document.getElementById('contactForm');
    const successMessage = document.createElement('div');
    successMessage.className = 'form__success';
    successMessage.innerHTML = `
        <p style="color: #28a745; background: rgba(40, 167, 69, 0.1); padding: 16px; border-radius: 8px; margin-top: 20px; text-align: center;">
            ✓ Спасибо! Ваша заявка отправлена. Мы свяжемся с вами в ближайшее время.
        </p>
    `;
    
    form.appendChild(successMessage);
    
    // Удаляем сообщение через 5 секунд
    setTimeout(() => {
        successMessage.remove();
    }, 5000);
}

// ================================================================
// Сброс формы после успешной отправки
// ================================================================
function resetForm() {
    const form = document.getElementById('contactForm');
    if (form) {
        form.reset();
        clearFormErrors();
    }
}

// ================================================================
// Показ/скрытие шапки при прокрутке
// ================================================================
function initScrollHeader() {
    const header = document.querySelector('.header');
    if (!header) return;
    
    let lastScrollY = window.scrollY;
    let ticking = false;
    
    function updateHeader() {
        const currentScrollY = window.scrollY;
        
        // Показываем шапку при прокрутке вниз (после 100px)
        if (currentScrollY > 100) {
            header.classList.add('visible');
        } else {
            header.classList.remove('visible');
        }
        
        lastScrollY = currentScrollY;
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    });
}

// ================================================================
// Все стили для мобильного меню теперь в CSS файле
// Дополнительная инициализация не требуется
// ================================================================
