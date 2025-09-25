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
                // Учитываем высоту фиксированной шапки
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
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
// Анимация шапки при прокрутке
// ================================================================
function initScrollHeader() {
    const header = document.querySelector('.header');
    if (!header) return;
    
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScrollY = currentScrollY;
    });
}

// ================================================================
// Дополнительные стили для мобильного меню (добавляются динамически)
// ================================================================
function addMobileMenuStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @media (max-width: 768px) {
            .header__nav {
                position: fixed;
                top: 70px;
                left: -100%;
                width: 100%;
                height: calc(100vh - 70px);
                background: rgba(255, 255, 255, 0.98);
                backdrop-filter: blur(10px);
                transition: left 0.3s ease;
                z-index: 999;
                padding-top: 2rem;
            }
            
            .header__nav.active {
                left: 0;
            }
            
            .nav__list {
                flex-direction: column;
                align-items: center;
                gap: 2rem;
            }
            
            .nav__link {
                font-size: 1.2rem;
                padding: 1rem 0;
            }
            
            .header__burger.active span:nth-child(1) {
                transform: rotate(45deg) translate(5px, 5px);
            }
            
            .header__burger.active span:nth-child(2) {
                opacity: 0;
            }
            
            .header__burger.active span:nth-child(3) {
                transform: rotate(-45deg) translate(7px, -6px);
            }
            
            .header.scrolled {
                background: rgba(255, 255, 255, 0.98);
                box-shadow: 0 2px 20px rgba(20, 93, 87, 0.1);
            }
        }
    `;
    document.head.appendChild(style);
}

// Добавляем стили для мобильного меню
addMobileMenuStyles();
