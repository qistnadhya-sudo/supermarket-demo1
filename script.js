const SELLER_PHONE = "60128655181";

const menuData = [
  { id: 1, title: "Classic Chicken Chop", price: 25.90, desc: "Crispy breaded thigh, black pepper sauce, fries, coleslaw.", img: "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=500&q=80" },
  { id: 2, title: "Spicy Chicken Tenders", price: 18.00, desc: "6pcs fiery tenders, dip, fries.", img: "https://images.unsplash.com/photo-1562967916-eb82221dfb92?auto=format&fit=crop&w=500&q=80" },
  { id: 3, title: "Beef Bolognese Spaghetti", price: 28.00, desc: "Pasta with rich meat sauce, parmesan.", img: "https://images.unsplash.com/photo-1621996346565-e3d5d6281298?auto=format&fit=crop&w=500&q=80" },
  { id: 4, title: "Fish & Chips", price: 24.50, desc: "Deep-fried cod fillet, tartar, salad, wedges.", img: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=500&q=80" },
  { id: 5, title: "Grilled Lamb Chop", price: 36.00, desc: "3pcs lamb, mint sauce, mash, veg.", img: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=500&q=80" },
  { id: 6, title: "Creamy Carbonara", price: 27.00, desc: "Pasta, bacon (beef), cream, egg yolk.", img: "https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&w=500&q=80" },
  { id: 7, title: "Hawaiian Burger", price: 22.00, desc: "Beef patty, pineapple, cheese, fries.", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80" },
  { id: 8, title: "Aglio Olio with Prawns", price: 29.50, desc: "Olive oil, garlic, prawns, chili flakes.", img: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=500&q=80" },
  { id: 9, title: "Grilled Chicken Salad", price: 19.90, desc: "Mixed greens, dressing, grilled chicken breast.", img: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=500&q=80" },
  { id: 10, title: "Mushroom Soup & Garlic Bread", price: 15.00, desc: "Creamy soup, 3pcs garlic toast.", img: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=500&q=80" }
];

let cart = [];

function renderMenu() {
  const grid = document.getElementById("menuGrid");
  grid.innerHTML = menuData.map(item => `
    <div class="menu-card">
      <div class="card-img-wrapper">
        <img src="${item.img}" alt="${item.title}" />
      </div>
      <div class="card-content">
        <h3>${item.title}</h3>
        <p>${item.desc}</p>
        <div class="card-footer-row">
          <span class="item-price">RM ${item.price.toFixed(2)}</span>
          <button class="add-cart-btn" onclick="addToCart(${item.id})">Add to Cart</button>
        </div>
      </div>
    </div>
  `).join("");
}

function showToast(title) {
  const container = document.getElementById("toastContainer");
  if (container.children.length >= 2) container.firstChild.remove();
  const t = document.createElement("div");
  t.className = "toast-item";
  t.textContent = `✓ ${title} added to cart!`;
  container.appendChild(t);
  setTimeout(() => t.remove(), 2200);
}

function addToCart(id) {
  const product = menuData.find(i => i.id === id);
  if (!product) return;

  const existing = cart.find(c => c.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  updateCartUI();
  showToast(product.title);
}

function changeQty(id, delta) {
  const item = cart.find(c => c.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(c => c.id !== id);
  updateCartUI();
}

function updateCartUI() {
  const totalQty = cart.reduce((sum, i) => sum + i.qty, 0);
  let subtotal = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);

  const orderType = document.getElementById("orderType").value;
  const deliveryFee = orderType.includes("Delivery") ? 3.00 : 0.00;
  const finalTotal = subtotal + deliveryFee;

  document.getElementById("footerCartCount").textContent = `${totalQty} Item${totalQty !== 1 ? 's' : ''}`;
  document.getElementById("footerCartTotal").textContent = `RM ${finalTotal.toFixed(2)}`;

  const container = document.getElementById("cartItems");
  if (cart.length === 0) {
    container.innerHTML = `<p style="text-align:center; color:#78716c; margin-top:40px;">Your cart is empty.</p>`;
    document.getElementById("cartTotal").textContent = "RM 0.00";
    return;
  }

  container.innerHTML = "";
  cart.forEach(item => {
    const row = document.createElement("div");
    row.className = "cart-item-row";
    row.innerHTML = `
      <div>
        <h4 style="font-size:0.85rem; font-weight:700;">${item.title}</h4>
        <span style="font-size:0.75rem; color:#78716c;">RM ${item.price.toFixed(2)} x ${item.qty}</span>
      </div>
      <div class="qty-controls">
        <button class="q-btn" onclick="changeQty(${item.id}, -1)">-</button>
        <span style="font-size:0.85rem; font-weight:700;">${item.qty}</span>
        <button class="q-btn" onclick="changeQty(${item.id}, 1)">+</button>
      </div>
    `;
    container.appendChild(row);
  });

  document.getElementById("cartTotal").textContent = `RM ${finalTotal.toFixed(2)}`;
}

document.getElementById("orderType").addEventListener("change", updateCartUI);

const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");

function openCart() { cartDrawer.classList.add("open"); cartOverlay.classList.add("open"); }
function closeCart() { cartDrawer.classList.remove("open"); cartOverlay.classList.remove("open"); }

document.getElementById("closeCartBtn").addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);
document.getElementById("orderNowBtn").addEventListener("click", openCart);

document.getElementById("checkoutBtn").addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Please select at least one item.");
    return;
  }
  const name = document.getElementById("custName").value.trim();
  if (!name) {
    alert("Please enter your name.");
    document.getElementById("custName").focus();
    return;
  }

  let msg = `*NEW ORDER - GRILLMASTER WESTERN*\n\n`;
  msg += `*Name:* ${name}\n`;
  msg += `*Order Type:* ${document.getElementById("orderType").value}\n\n`;
  msg += `*Items Ordered:*\n`;

  cart.forEach((item, i) => {
    msg += `${i + 1}. ${item.title} (x${item.qty}) - RM ${(item.price * item.qty).toFixed(2)}\n`;
  });

  msg += `\n*Total Amount:* ${document.getElementById("cartTotal").textContent}`;

  const url = `https://wa.me/${SELLER_PHONE}?text=${encodeURIComponent(msg)}`;
  window.open(url, "_blank");
});

renderMenu();
updateCartUI();