// ===============================
// 🛒 CART FUNCTIONALITY
// ===============================

// Load cart from localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Initialize cart count on page load
window.onload = function() {
  updateCart();
};

// Add product to cart
function addToCart(productName, price) {
  cart.push({ name: productName, price: price });
  saveCart();
  updateCart();
}

// Update cart display and total
function updateCart() {
  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");
  const cartCount = document.getElementById("cartCount");

  if (!cartItems || !cartTotal || !cartCount) return; // Prevents JS errors on pages without cart

  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${item.name} - R${item.price.toFixed(2)} 
      <button class="remove-btn" onclick="removeFromCart(${index})">❌</button>
    `;
    cartItems.appendChild(li);
    total += item.price;
  });

  cartTotal.textContent = total.toFixed(2);
  cartCount.textContent = cart.length;
}

// Remove item from cart
function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
  updateCart();
}

// Save cart to localStorage
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Toggle cart overlay
function toggleCart() {
  const overlay = document.getElementById("cartOverlay");
  overlay?.classList.toggle("show");
}

// ===============================
// 💳 PAYFAST CHECKOUT FUNCTIONALITY
// ===============================
function checkout() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  // Calculate total
  let total = cart.reduce((sum, item) => sum + item.price, 0);

  // Build PayFast form
  const form = document.createElement("form");
  form.method = "POST";
  form.action = "https://www.payfast.co.za/eng/process";

  // ⚠️ Replace merchant_id & merchant_key with YOUR verified PayFast details
  form.innerHTML = `
    <input type="hidden" name="merchant_id" value="16931721">
    <input type="hidden" name="merchant_key" value="vqz7dadeb0bre">
    <input type="hidden" name="return_url" value="https://thriftrove-accessories-store.co.za/success.html">
    <input type="hidden" name="cancel_url" value="https://thriftrove-accessories-store.co.za/cancel.html">
    <input type="hidden" name="notify_url" value="https://thriftrove-accessories-store.co.za/notify.php">

    <input type="hidden" name="amount" value="${total.toFixed(2)}">
    <input type="hidden" name="item_name" value="Thriftrove Order">
    <input type="hidden" name="email_address" value="customer@example.com">
  `;

  document.body.appendChild(form);
  form.submit();

  // Clear cart after successful submission
  cart = [];
  saveCart();
  updateCart();
}

// ===============================
// 🚫 MARK AS SOLD FUNCTIONALITY
// ===============================
function markAsSold(button) {
  const productDiv = button.closest(".product");
  if (!productDiv) return;

  const buttons = productDiv.querySelectorAll("button");
  buttons.forEach(btn => (btn.disabled = true));

  const soldTag = document.createElement("div");
  soldTag.textContent = "SOLD OUT";
  soldTag.classList.add("sold-tag");
  productDiv.appendChild(soldTag);

  productDiv.style.opacity = "0.6";
}

// ===============================
// 📱 MOBILE MENU TOGGLE
// ===============================
function toggleMenu() {
  const menuLinks = document.getElementById("menuLinks");
  menuLinks?.classList.toggle("active");
}
