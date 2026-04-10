// script.js

let currentUser = null;
let cart = [];
let favorites = [];

const productsData = {
    health: {
        supplements: [
            { id: "h1", name: "RNA комплекс", price: 4900, desc: "ВП РНК для иммунитета", img: "💊" },
            { id: "h2", name: "Витамин D3 + K2", price: 2100, desc: "Для костей и иммунитета", img: "💊" }
        ],
        devices: [
            { id: "h3", name: "Биомодулятор Effector", price: 18900, desc: "Омоложение клеток", img: "⚡" }
        ]
    },
    beauty: {
        cosmetics: [
            { id: "b1", name: "Jenel Professional Cream", price: 3500, desc: "Интенсивное увлажнение", img: "🧴" },
            { id: "b2", name: "Сыворотка с пептидами", price: 4200, desc: "Лифтинг-эффект", img: "✨" }
        ]
    },
    devices: {
        home: [
            { id: "d1", name: "VERUM ONE генератор H2", price: 32900, desc: "Водородная вода дома", img: "💧" },
            { id: "d2", name: "Массажёр для лица", price: 5900, desc: "Уход за кожей", img: "🌀" }
        ]
    }
};

let activeCategory = "health";
let activeSubcategory = "supplements";

function updateCounters() {
    const cartCount = document.getElementById('cartCount');
    const favCount = document.getElementById('favoritesCount');
    if (cartCount) cartCount.innerText = cart.length;
    if (favCount) favCount.innerText = favorites.length;
}

function findProductById(id) {
    for (let cat in productsData) {
        for (let sub in productsData[cat]) {
            let found = productsData[cat][sub].find(p => p.id === id);
            if (found) return found;
        }
    }
    return null;
}

function addToCart(product) {
    if (!currentUser) {
        alert("Добавление в корзину доступно только после входа!");
        window.location.href = 'login.html';
        return;
    }
    if (!cart.find(item => item.id === product.id)) {
        cart.push(product);
        updateCounters();
        renderProducts();
        alert(`${product.name} добавлен в корзину`);
    } else {
        alert("Товар уже в корзине");
    }
}

function addToFavorites(product) {
    if (!favorites.find(item => item.id === product.id)) {
        favorites.push(product);
        updateCounters();
        renderProducts();
        alert(`${product.name} добавлен в избранное`);
    } else {
        favorites = favorites.filter(item => item.id !== product.id);
        updateCounters();
        renderProducts();
    }
}

function renderSubcategoryTabs() {
    const container = document.getElementById('subcategoryTabs');
    if (!container) return;
    
    let subs = [];
    if (activeCategory === "health") subs = ["supplements", "devices"];
    else if (activeCategory === "beauty") subs = ["cosmetics"];
    else if (activeCategory === "devices") subs = ["home"];
    
    const subNames = { supplements: "БАДы/Витамины", devices: "Приборы", cosmetics: "Косметика", home: "Для дома" };
    
    container.innerHTML = subs.map(sub => `<button class="subcat-btn ${activeSubcategory === sub ? 'active' : ''}" data-sub="${sub}">${subNames[sub]}</button>`).join('');
    
    document.querySelectorAll('.subcat-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            activeSubcategory = btn.dataset.sub;
            renderSubcategoryTabs();
            renderProducts();
        });
    });
}

function renderProducts() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    
    let products = productsData[activeCategory]?.[activeSubcategory] || [];
    if (!products.length) {
        grid.innerHTML = "<p>Нет товаров в этой категории</p>";
        return;
    }
    
    grid.innerHTML = products.map(p => {
        const isFav = favorites.some(f => f.id === p.id);
        const isInCart = cart.some(c => c.id === p.id);
        return `
            <div class="product-card">
                <div class="product-img">${p.img}</div>
                <div class="product-title">${p.name}</div>
                <div class="product-price">${p.price.toLocaleString()} ₽</div>
                <div class="product-desc">${p.desc}</div>
                <div class="product-actions">
                    <button class="btn-fav ${isFav ? 'active' : ''}" data-id="${p.id}">
                        <i class="fa-${isFav ? 'solid' : 'regular'} fa-heart"></i> Избранное
                    </button>
                    <button class="btn-cart" data-id="${p.id}" ${isInCart ? 'disabled style="opacity:0.5;"' : ''}>
                        <i class="fas fa-shopping-cart"></i> ${isInCart ? 'В корзине' : 'В корзину'}
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    document.querySelectorAll('.btn-fav').forEach(btn => {
        btn.addEventListener('click', () => {
            const product = findProductById(btn.dataset.id);
            if (product) addToFavorites(product);
        });
    });
    
    document.querySelectorAll('.btn-cart').forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.disabled) return;
            const product = findProductById(btn.dataset.id);
            if (product) addToCart(product);
        });
    });
}

// Чат
function initChat() {
    const chatIcon = document.getElementById('chatIcon');
    const chatWindow = document.getElementById('chatWindow');
    const closeChatBtn = document.getElementById('closeChatBtn');
    const sendBtn = document.getElementById('sendChatMsg');
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');
    
    if (!chatIcon) return;
    
    function toggleChat() {
        if (chatWindow.style.display === 'flex') {
            chatWindow.style.display = 'none';
        } else {
            chatWindow.style.display = 'flex';
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }
    
    chatIcon.onclick = toggleChat;
    if (closeChatBtn) closeChatBtn.onclick = toggleChat;
    
    if (sendBtn) {
        sendBtn.onclick = () => {
            const msg = chatInput?.value.trim();
            if (msg && chatMessages) {
                chatMessages.innerHTML += `<div class="message user">${escapeHtml(msg)}</div>`;
                chatInput.value = '';
                chatMessages.scrollTop = chatMessages.scrollHeight;
                setTimeout(() => {
                    chatMessages.innerHTML += `<div class="message bot">Спасибо, оператор скоро ответит!</div>`;
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                }, 600);
            }
        };
    }
    
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && sendBtn) sendBtn.click();
        });
    }
}

function escapeHtml(str) {
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// Прокрутка при клике на мышку
function initScrollMouse() {
    const scrollMouse = document.querySelector('.scroll-mouse');
    const catalogSection = document.getElementById('catalog');
    
    if (scrollMouse && catalogSection) {
        scrollMouse.addEventListener('click', () => {
            catalogSection.scrollIntoView({ behavior: 'smooth' });
        });
    }
}
// Инициализация слайдера с прокруткой мышкой
document.addEventListener('DOMContentLoaded', function() {
    const sliderSection = document.getElementById('products');
    
    // Функция смены цвета фона
    function changeBackgroundColor(index) {
        const slides = document.querySelectorAll('.blog-slideritem');
        const activeSlide = slides[index];
        if (activeSlide && sliderSection) {
            const bgColor = activeSlide.getAttribute('data-bg-color');
            if (bgColor) {
                sliderSection.style.backgroundColor = bgColor;
                sliderSection.style.transition = 'background-color 0.5s ease';
            }
        }
    }
    
    const swiper = new Swiper('#productSlider', {
        effect: 'slide',
        loop: false,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        mousewheel: {
            enabled: true,
            sensitivity: 1,
            eventsTarget: '.blog-slidercontainer',
            thresholdDelta: 50,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: false,
        on: {
            init: function() {
                changeBackgroundColor(this.realIndex);
            },
            slideChange: function() {
                changeBackgroundColor(this.realIndex);
            },
        },
    });
    
    // Установка начального цвета
    const slides = document.querySelectorAll('.blog-slideritem');
    if (slides.length > 0 && sliderSection) {
        const initialColor = slides[0].getAttribute('data-bg-color');
        if (initialColor) {
            sliderSection.style.backgroundColor = initialColor;
        }
    }
    
    // Прокрутка при клике на мышку
    const scrollMouse = document.querySelector('.scroll-mouse');
    const catalogSection = document.getElementById('products');
    if (scrollMouse && catalogSection) {
        scrollMouse.addEventListener('click', () => {
            catalogSection.scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    // Чат поддержки
    const chatIcon = document.getElementById('chatIcon');
    const chatWindow = document.getElementById('chatWindow');
    const closeChatBtn = document.getElementById('closeChatBtn');
    const sendBtn = document.getElementById('sendChatMsg');
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');
    
    if (chatIcon) {
        function toggleChat() {
            if (chatWindow.style.display === 'flex') {
                chatWindow.style.display = 'none';
            } else {
                chatWindow.style.display = 'flex';
                if (chatMessages) chatMessages.scrollTop = chatMessages.scrollHeight;
            }
        }
        
        chatIcon.onclick = toggleChat;
        if (closeChatBtn) closeChatBtn.onclick = toggleChat;
        
        if (sendBtn) {
            sendBtn.onclick = () => {
                const msg = chatInput?.value.trim();
                if (msg && chatMessages) {
                    chatMessages.innerHTML += `<div class="message user">${escapeHtml(msg)}</div>`;
                    chatInput.value = '';
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                    setTimeout(() => {
                        chatMessages.innerHTML += `<div class="message bot">Спасибо, оператор скоро ответит!</div>`;
                        chatMessages.scrollTop = chatMessages.scrollHeight;
                    }, 600);
                }
            };
        }
        
        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && sendBtn) sendBtn.click();
            });
        }
    }
    
    function escapeHtml(str) {
        return str.replace(/[&<>]/g, function(m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        });
    }
});

// script.js
document.addEventListener('DOMContentLoaded', function() {
    const sliderSection = document.getElementById('products');
    
    // Функция смены цвета фона
    function changeBackgroundColor(index) {
        const slides = document.querySelectorAll('.blog-slideritem');
        const activeSlide = slides[index];
        if (activeSlide && sliderSection) {
            const bgColor = activeSlide.getAttribute('data-bg-color');
            if (bgColor) {
                sliderSection.style.backgroundColor = bgColor;
                sliderSection.style.transition = 'background-color 0.5s ease';
            }
        }
    }
    
    const swiper = new Swiper('#productSlider', {
        effect: 'slide',
        loop: false,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        mousewheel: {
            enabled: true,
            sensitivity: 1,
            eventsTarget: '.blog-slidercontainer',
            thresholdDelta: 50,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: false,
        on: {
            init: function() {
                changeBackgroundColor(this.realIndex);
            },
            slideChange: function() {
                changeBackgroundColor(this.realIndex);
            },
        },
    });
    
    // Установка начального цвета
    const slides = document.querySelectorAll('.blog-slideritem');
    if (slides.length > 0 && sliderSection) {
        const initialColor = slides[0].getAttribute('data-bg-color');
        if (initialColor) {
            sliderSection.style.backgroundColor = initialColor;
        }
    }
    
    // Прокрутка при клике на мышку
    const scrollMouse = document.querySelector('.scroll-mouse');
    const productsSection = document.getElementById('products');
    if (scrollMouse && productsSection) {
        scrollMouse.addEventListener('click', () => {
            productsSection.scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    // Чат поддержки
    const chatIcon = document.getElementById('chatIcon');
    const chatWindow = document.getElementById('chatWindow');
    const closeChatBtn = document.getElementById('closeChatBtn');
    const sendBtn = document.getElementById('sendChatMsg');
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');
    
    if (chatIcon) {
        function toggleChat() {
            if (chatWindow.style.display === 'flex') {
                chatWindow.style.display = 'none';
            } else {
                chatWindow.style.display = 'flex';
                if (chatMessages) chatMessages.scrollTop = chatMessages.scrollHeight;
            }
        }
        
        chatIcon.onclick = toggleChat;
        if (closeChatBtn) closeChatBtn.onclick = toggleChat;
        
        if (sendBtn) {
            sendBtn.onclick = () => {
                const msg = chatInput?.value.trim();
                if (msg && chatMessages) {
                    chatMessages.innerHTML += `<div class="message user">${escapeHtml(msg)}</div>`;
                    chatInput.value = '';
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                    setTimeout(() => {
                        chatMessages.innerHTML += `<div class="message bot">Спасибо, оператор скоро ответит!</div>`;
                        chatMessages.scrollTop = chatMessages.scrollHeight;
                    }, 600);
                }
            };
        }
        
        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && sendBtn) sendBtn.click();
            });
        }
    }
    
    function escapeHtml(str) {
        return str.replace(/[&<>]/g, function(m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        });
    }
});

// ========== РАБОТА ВЫПАДАЮЩИХ МЕНЮ НА МОБИЛЬНЫХ ==========
document.addEventListener('DOMContentLoaded', function() {
    // Для меню "Информация"
    const infoDropdown = document.querySelector('.dropdown-wrapper-info');
    const infoToggle = document.querySelector('.dropdown-toggle-info');
    
    if (infoToggle && infoDropdown && window.innerWidth <= 768) {
        infoToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            infoDropdown.classList.toggle('active');
        });
        
        document.addEventListener('click', function(e) {
            if (infoDropdown && !infoDropdown.contains(e.target) && infoDropdown.classList.contains('active')) {
                infoDropdown.classList.remove('active');
            }
        });
    }
    
    // Для меню "О нас"
    const aboutDropdown = document.querySelector('.dropdown-wrapper-about');
    const aboutToggle = document.querySelector('.dropdown-toggle-about');
    
    if (aboutToggle && aboutDropdown && window.innerWidth <= 768) {
        aboutToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            aboutDropdown.classList.toggle('active');
        });
        
        document.addEventListener('click', function(e) {
            if (aboutDropdown && !aboutDropdown.contains(e.target) && aboutDropdown.classList.contains('active')) {
                aboutDropdown.classList.remove('active');
            }
        });
    }
});