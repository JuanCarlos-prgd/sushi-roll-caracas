const sushiMenu = [
    { id: 1, name: "Nigiri Salmón Tradicional", price: 12, img: "https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=600" },
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
    const plato = sushiMenu.find(p => p.id === id);
    cart.push(plato);
    updateCart();

    // Encontrar el botón que activó el evento
    const btn = event.target;
    const originalContent = btn.innerHTML;

    // Cambiar estado a "Añadido"
    btn.classList.add('btn-added');
    btn.innerHTML = `<span>✔ Añadido</span>`;
    btn.disabled = true; // Evita clics accidentales durante la animación

    // Volver al estado original tras 1.5 segundos
    setTimeout(() => {
        btn.classList.remove('btn-added');
        btn.innerHTML = originalContent;
        btn.disabled = false;
    }, 1500);

    // Abrir el carrito automáticamente si está oculto
    if(document.getElementById('side-cart').classList.contains('cart-hidden')) {
        toggleCart();
    }
}
function updateCart() {
    document.getElementById('cart-count').innerText = cart.length;
    const itemsContainer = document.getElementById('cart-items');
    itemsContainer.innerHTML = cart.map(i => `<div class="cart-item"><span>${i.name}</span> <span>$${i.price}</span></div>`).join('');
    const total = cart.reduce((acc, curr) => acc + curr.price, 0);
    document.getElementById('total-price').innerText = total;
}
// Función principal para iniciar el proceso
function startCheckout() {
    if(cart.length === 0) return alert("El carrito está vacío");
    
    const total = cart.reduce((acc, curr) => acc + curr.price, 0);
    document.getElementById('amount-to-pay').innerText = `Total a pagar: $${total}`;
    
    // Abrir el modal y cerrar el carrito lateral
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
                <p>Tu pedido de sushi ya está en camino.</p>
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