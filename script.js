const sushiMenu = [
    { id: 1, name: "Nigiri Salmón", price: 12, img: "https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=600" },
    { id: 2, name: "Dragon Roll Especial", price: 16, img: "https://images.unsplash.com/photo-1617196034183-421b4917c92d?w=600" },
    { id: 3, name: "California Dream", price: 11, img: "https://images.unsplash.com/photo-1559466273-d95e72debaf8?w=600" },
    { id: 4, name: "Philadelphia Roll", price: 13, img: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=600" },
    { id: 5, name: "Spicy Tuna Crunch", price: 15, img: "https://images.unsplash.com/photo-1590759668628-05b0fc34bb70?w=600" },
    { id: 6, name: "Veggie Maki Premium", price: 10, img: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600" },
    { id: 7, name: "Gyoza de Cerdo (6 uni)", price: 9, img: "https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=600" },
    { id: 8, name: "Futomaki Samurai", price: 17, img: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=600" }
];

let cart = [];

// Cargar menú dinámico
const grid = document.getElementById('menu-grid');
sushiMenu.forEach(item => {
    // Busca esta línea en tu bucle forEach de sushiMenu
grid.innerHTML += `
    <div class="card">
        <img src="${item.img}" alt="${item.name}">
        <div class="card-content">
            <h3>${item.name}</h3>
            <p>$${item.price}</p>
            <button onclick="addToCart(${item.id})" class="btn-add">
                🛒 Agregar
            </button>
        </div>
    </div>`;
});

function toggleCart() {
    document.getElementById('side-cart').classList.toggle('cart-hidden');
}

function addToCart(id) {
    // Intentamos buscar en el menú normal. Si no está, buscamos en promociones.
    const plato = sushiMenu.find(p => p.id === id) || promocionesData.find(p => p.id === id);
    
    // Si después de buscar en ambos sigue sin existir, salimos de la función
    if (!plato) return;

    const itemEnCarrito = cart.find(p => p.id === id);

    if (itemEnCarrito) {
        itemEnCarrito.cantidad++;
    } else {
        // Usamos el Spread Operator (...) para copiar las propiedades del plato
        cart.push({ ...plato, cantidad: 1 });
    }
    
    updateCart();

    // Feedback visual del botón (tu código existente)
    const btn = event.target;
    const originalContent = btn.innerHTML;
    btn.classList.add('btn-added');
    btn.innerHTML = `<span>✔ Añadido</span>`;
    btn.disabled = true;
    setTimeout(() => {
        btn.classList.remove('btn-added');
        btn.innerHTML = originalContent;
        btn.disabled = false;
    }, 1500);

    if(document.getElementById('side-cart').classList.contains('cart-hidden')) {
        toggleCart();
    }
}

function updateCart() {
    const cartCount = cart.reduce((acc, item) => acc + item.cantidad, 0);
    document.getElementById('cart-count').innerText = cartCount;
    
    const itemsContainer = document.getElementById('cart-items');
    
    itemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <span class="item-name">${item.name}</span>
                <span class="item-price">$${(item.price * item.cantidad)}</span>
            </div>
            <div class="cart-item-controls">
                <button onclick="changeQuantity(${item.id}, -1)" class="btn-qty">-</button>
                <span class="qty-num">${item.cantidad}</span>
                <button onclick="changeQuantity(${item.id}, 1)" class="btn-qty">+</button>
                <button onclick="removeFromCart(${item.id})" class="btn-remove">🗑️</button>
            </div>
        </div>
    `).join('');

    const total = cart.reduce((acc, curr) => acc + (curr.price * curr.cantidad), 0);
    document.getElementById('total-price').innerText = total;
}

// 3. Función para sumar/restar
function changeQuantity(id, delta) {
    const item = cart.find(p => p.id === id);
    if (item) {
        item.cantidad += delta;
        if (item.cantidad <= 0) {
            removeFromCart(id);
        } else {
            updateCart();
        }
    }
}

// 4. Función para eliminar completamente
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
}
function updateCart() {
    const cartCount = cart.reduce((acc, item) => acc + item.cantidad, 0);
    document.getElementById('cart-count').innerText = cartCount;
    
    const itemsContainer = document.getElementById('cart-items');
    
    itemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <span class="item-name">${item.name}</span>
                <span class="item-price">$${(item.price * item.cantidad)}</span>
            </div>
            <div class="cart-item-controls">
                <button onclick="changeQuantity(${item.id}, -1)" class="btn-qty">-</button>
                <span class="qty-num">${item.cantidad}</span>
                <button onclick="changeQuantity(${item.id}, 1)" class="btn-qty">+</button>
                <button onclick="removeFromCart(${item.id})" class="btn-remove">🗑️</button>
            </div>
        </div>
    `).join('');

    const total = cart.reduce((acc, curr) => acc + (curr.price * curr.cantidad), 0);
    document.getElementById('total-price').innerText = total;
}
// Función principal para iniciar el proceso
function startCheckout() {
    if(cart.length === 0) return alert("El carrito está vacío");
    
    // CORRECCIÓN: Multiplicar precio por cantidad
    const total = cart.reduce((acc, curr) => acc + (curr.price * curr.cantidad), 0);
    document.getElementById('amount-to-pay').innerText = `Total a pagar: $${total}`;
    
    toggleCart();
    document.getElementById('payment-modal').classList.remove('modal-hidden');
}

function closePaymentModal() {
    document.getElementById('payment-modal').classList.add('modal-hidden');
    // Limpiar el resultado al cerrar
    document.getElementById('payment-result').classList.add('hidden');
    document.getElementById('simulated-payment-form').classList.remove('hidden');
}

// Lógica del formulario de simulación
document.getElementById('simulated-payment-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const btn = document.getElementById('confirm-pay-btn');
    const resultDiv = document.getElementById('payment-result');
    const form = document.getElementById('simulated-payment-form');

    btn.innerText = "Procesando pago...";
    btn.disabled = true;

    // Simulamos un retraso de red de 2 segundos
    setTimeout(() => {
        form.classList.add('hidden');
        resultDiv.classList.remove('hidden');
        
        // Generar número de referencia aleatorio
        const ref = Math.floor(Math.random() * 900000) + 100000;

        resultDiv.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <h1 style="color: #28a745;">✅ ¡Gracias por tu compra!</h1>
                <p>Tu pedido ya está en camino.</p>
                <hr>
                <p><strong>Referencia:</strong> #${ref}</p>
                <p><strong>Estado:</strong> Aprobado</p>
                <br>
                <button onclick="finalizarTodo()" class="btn-add">Volver al inicio</button>
            </div>
        `;
        
        // Vaciar carrito
        cart = [];
        updateCart();
    }, 2000);
});

function finalizarTodo() {
    closePaymentModal();
    location.reload(); // Recarga para limpiar la interfaz
}

function toggleTheme() {
    const body = document.documentElement;
    const themeIcon = document.getElementById('theme-icon');
    const currentTheme = body.getAttribute('data-theme');
    
    if (currentTheme === 'dark') {
        body.removeAttribute('data-theme');
        themeIcon.innerText = '🌙';
        localStorage.setItem('theme', 'light');
    } else {
        body.setAttribute('data-theme', 'dark');
        themeIcon.innerText = '☀️';
        localStorage.setItem('theme', 'dark');
    }
}

// Al cargar la página, aplicar el tema guardado
window.onload = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.getElementById('theme-icon').innerText = '☀️';
    }
};

// Añade este bloque al final de tu archivo script.js

document.getElementById('reserva-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const form = document.getElementById('reserva-form');
    const successMsg = document.getElementById('reserva-success');
    const btn = form.querySelector('.btn-reserva');

    // Efecto visual de carga
    btn.innerText = "Confirmando...";
    btn.disabled = true;

    // Simulación de envío de datos (1.5 segundos)
    setTimeout(() => {
        form.classList.add('hidden'); // Oculta el formulario
        successMsg.classList.remove('hidden'); // Muestra el mensaje de éxito
        
        // Opcional: Hacer scroll suave hacia el mensaje
        successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 1500);
});

// Función para permitir al usuario volver a reservar sin recargar la página
function resetReserva() {
    const form = document.getElementById('reserva-form');
    const successMsg = document.getElementById('reserva-success');
    
    form.reset();
    form.classList.remove('hidden');
    successMsg.classList.add('hidden');
    
    const btn = form.querySelector('.btn-reserva');
    btn.innerText = "Confirmar Mesa";
    btn.disabled = false;
}

function scrollPromos(direction) {
    const slider = document.getElementById('promo-slider');
    // Calculamos el ancho de una tarjeta para que el scroll sea exacto
    const cardWidth = slider.querySelector('.promo-card').offsetWidth + 20; 
    
    slider.scrollBy({
        left: direction * cardWidth,
        behavior: 'smooth'
    });
}
const promocionesData = [
    { id: 101, name: "Promo 60 PZAS", price: 27, img: "https://mail.google.com/mail/u/0?ui=2&ik=4259423ffb&attid=0.1&permmsgid=msg-a:r3642272035389415170&th=19d6b2b1651218c2&view=att&disp=safe&realattid=19d6b2af12014243e6f8&zw", tag: "2x1" },
    { id: 102, name: "Promo 100 PZAS", price: 42, img: "https://mail.google.com/mail/u/0?ui=2&ik=4259423ffb&attid=0.2&permmsgid=msg-a:r3642272035389415170&th=19d6b2b1651218c2&view=att&disp=safe&realattid=19d6b2af12039aedc194&zw", tag: "-20%" },
    { id: 103, name: "Promo 48 PZAS + 1REF. De 1LT", price: 27, img: "https://mail.google.com/mail/u/0?ui=2&ik=4259423ffb&attid=0.3&permmsgid=msg-a:r3642272035389415170&th=19d6b2b1651218c2&view=att&disp=safe&realattid=19d6b2af12014406d719&zw", tag: "Popular" },
    { id: 104, name: "Promo Cono Sushi 3 PZAS", price: 6,  img: "https://mail.google.com/mail/u/0?ui=2&ik=4259423ffb&attid=0.4&permmsgid=msg-a:r3642272035389415170&th=19d6b2b1651218c2&view=att&disp=safe&realattid=19d6b2af1203b2b56b41&zw", tag: "Nuevo" },
    { id: 105, name: "Promo Roll 22 PZAS", price: 17, img: "https://mail.google.com/mail/u/0?ui=2&ik=4259423ffb&attid=0.5&permmsgid=msg-a:r3642272035389415170&th=19d6b2b1651218c2&view=att&disp=safe&realattid=19d6b2af12039e73a1d2&zw", tag: "2x1" },
    { id: 106, name: "Promo 48 PZAS", price: 22, img: "https://mail.google.com/mail/u/0?ui=2&ik=4259423ffb&attid=0.6&permmsgid=msg-a:r3642272035389415170&th=19d6b2b1651218c2&view=att&disp=safe&realattid=19d6b2af120145c9c737&zw", tag: "Sushiman" },
    { id: 107, name: "Promo 28 PZAS", price: 18, img: "https://mail.google.com/mail/u/0?ui=2&ik=4259423ffb&attid=0.7&permmsgid=msg-a:r3642272035389415170&th=19d6b2b1651218c2&view=att&disp=safe&realattid=19d6b2af12013ebe06bb&zw", tag: "-10%" },
    { id: 108, name: "Promo Ari 10 PZAS", price: 9, img: "https://mail.google.com/mail/u/0?ui=2&ik=4259423ffb&attid=0.8&permmsgid=msg-a:r3642272035389415170&th=19d6b2b1651218c2&view=att&disp=safe&realattid=19d6b2af12039767e156&zw", tag: "Flash" },
    { id: 109, name: "Promo 24 PZAS Frios + 1REF. Bombita", price: 13, img: "https://mail.google.com/mail/u/0?ui=2&ik=4259423ffb&attid=0.9&permmsgid=msg-a:r3642272035389415170&th=19d6b2b1651218c2&view=att&disp=safe&realattid=19d6b2af12039cb0b1b3&zw", tag: "Premium" },
    { id: 110, name: "Promo 80 PZAS ", price: 32,img: "https://mail.google.com/mail/u/0?ui=2&ik=4259423ffb&attid=0.11&permmsgid=msg-a:r3642272035389415170&th=19d6b2b1651218c2&view=att&disp=safe&realattid=19d6b2af1203992ad175&zw", tag: "-20%" }
];

function cargarPromociones() {
    const slider = document.getElementById('promo-slider');
    
    // Generar el HTML para cada plato
    const htmlPromos = promocionesData.map(promo => `
        <div class="promo-card">
            <div class="promo-badge">${promo.tag}</div>
            <img src="${promo.img}" alt="${promo.name}">
            <div class="promo-info">
                <h3>${promo.name}</h3>
                <span class="promo-price">$${promo.price.toFixed(2)}</span>
                <button class="btn-add" onclick="addToCart(${promo.id})">Aprovechar</button>
            </div>
        </div>
    `).join('');

    slider.innerHTML = htmlPromos;
}

// Ejecutar la función cuando cargue la página. 
window.addEventListener('DOMContentLoaded', cargarPromociones);