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
    grid.innerHTML += `
        <div class="card">
            <img src="${item.img}" alt="${item.name}">
            <div class="card-content">
                <h3>${item.name}</h3>
                <p>$${item.price}</p>
                <button onclick="addToCart(${item.id})" class="btn-add">Agregar al Carrito</button>
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
    if(document.getElementById('side-cart').classList.contains('cart-hidden')) toggleCart();
}

function updateCart() {
    document.getElementById('cart-count').innerText = cart.length;
    const itemsContainer = document.getElementById('cart-items');
    itemsContainer.innerHTML = cart.map(i => `<div class="cart-item"><span>${i.name}</span> <span>$${i.price}</span></div>`).join('');
    const total = cart.reduce((acc, curr) => acc + curr.price, 0);
    document.getElementById('total-price').innerText = total;
}

async function startCheckout() {
    if(cart.length === 0) return alert("El carrito está vacío");
    const response = await fetch('http://localhost:3000/create-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cart })
    });
    const preference = await response.json();
    window.location.href = preference.init_point;
}