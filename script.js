// ========================= 
// MENU TOGGLE
// =========================
function toggleMenu() {
  const menuLinks = document.getElementById("menuLinks");
  menuLinks.classList.toggle("active"); 
}


// =========================
// CART SYSTEM (with localStorage)
// =========================
let cart = [];
let cartTotal = 0;

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  localStorage.setItem("cartTotal", cartTotal.toFixed(2));
}

function loadCart() {
  const storedCart = localStorage.getItem("cart");
  const storedTotal = localStorage.getItem("cartTotal");

  if (storedCart) cart = JSON.parse(storedCart);
  if (storedTotal) cartTotal = parseFloat(storedTotal);

  updateCartUI();
}

function updateCartUI() {
  document.getElementById("cartCount").textContent = cart.length;
  document.getElementById("cartTotal").textContent = cartTotal.toFixed(2);
  updateCartDisplay();
}

function addToCart(productName, price) {
  cart.push({ name: productName, price: price });
  cartTotal += price;
  saveCart();
  updateCartUI();

  // Quick visual feedback
  alert(`${productName} added to your cart! 🛍️`);
}

function updateCartDisplay() {
  const cartItemsList = document.getElementById("cartItems");
  cartItemsList.innerHTML = "";

  cart.forEach((item, index) => {
    const li = document.createElement("li");
    li.textContent = `${item.name} - R${item.price.toFixed(2)}`;

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "❌";
    removeBtn.className = "remove-btn";
    removeBtn.onclick = () => removeFromCart(index);

    li.appendChild(removeBtn);
    cartItemsList.appendChild(li);
  });
}

function removeFromCart(index) {
  cartTotal -= cart[index].price;
  cart.splice(index, 1);
  saveCart();
  updateCartUI();
}

function toggleCart() {
  const overlay = document.getElementById("cartOverlay");
  overlay.classList.toggle("show");
}

function checkout() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  alert(`🎉 Thank you for shopping! Your total is R${cartTotal.toFixed(2)}.`);

  // Reset
  cart = [];
  cartTotal = 0;
  saveCart();
  updateCartUI();
  toggleCart();
}


// =========================
// MARK AS SOLD
// =========================
function markAsSold(button) {
  const productDiv = button.closest(".product");

  // Disable both buttons
  productDiv.querySelectorAll("button").forEach(btn => btn.disabled = true);

  // Add overlay tag
  const soldTag = document.createElement("div");
  soldTag.textContent = "SOLD OUT";
  soldTag.classList.add("sold-tag");
  productDiv.appendChild(soldTag);

  productDiv.classList.add("sold"); // Adds your CSS fade effect
}


// =========================
// INIT ON PAGE LOAD
// =========================
window.addEventListener("DOMContentLoaded", loadCart);
