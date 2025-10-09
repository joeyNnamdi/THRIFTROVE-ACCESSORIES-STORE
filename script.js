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
  localStorage.setItem("cartTotal", cartTotal);
}

function loadCart() {
  const storedCart = localStorage.getItem("cart");
  const storedTotal = localStorage.getItem("cartTotal");

  if (storedCart) {
    cart = JSON.parse(storedCart);
  }
  if (storedTotal) {
    cartTotal = parseFloat(storedTotal);
  }

  document.getElementById("cartCount").textContent = cart.length;
  document.getElementById("cartTotal").textContent = cartTotal;
  updateCartDisplay();
}

function addToCart(productName, price) {
  cart.push({ name: productName, price: price });

  cartTotal += price;
  document.getElementById("cartCount").textContent = cart.length;
  document.getElementById("cartTotal").textContent = cartTotal;

  updateCartDisplay();
  saveCart();
}

function updateCartDisplay() {
  const cartItemsList = document.getElementById("cartItems");
  cartItemsList.innerHTML = "";

  cart.forEach((item, index) => {
    const li = document.createElement("li");
    li.textContent = `${item.name} - R${item.price}`;

    // Remove button
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "❌";
    removeBtn.style.marginLeft = "10px";
    removeBtn.onclick = function () {
      removeFromCart(index);
    };

    li.appendChild(removeBtn);
    cartItemsList.appendChild(li);
  });
}

function removeFromCart(index) {
  cartTotal -= cart[index].price;
  cart.splice(index, 1);

  document.getElementById("cartCount").textContent = cart.length;
  document.getElementById("cartTotal").textContent = cartTotal;

  updateCartDisplay();
  saveCart();
}

function toggleCart() {
  document.getElementById("cartOverlay").classList.toggle("active");
}

function checkout() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  alert(`Thank you for shopping! Your total is R${cartTotal}.`);

  // Reset cart
  cart = [];
  cartTotal = 0;
  document.getElementById("cartCount").textContent = 0;
  document.getElementById("cartTotal").textContent = 0;
  updateCartDisplay();
  saveCart();
  toggleCart();
}

// =========================
// MARK AS SOLD
// =========================
function markAsSold(button) {
  const productDiv = button.closest(".product");

  // Disable buttons
  const buttons = productDiv.querySelectorAll("button");
  buttons.forEach((btn) => (btn.disabled = true));

  // Add SOLD overlay
  const soldTag = document.createElement("div");
  soldTag.textContent = "SOLD OUT";
  soldTag.classList.add("sold-tag");
  productDiv.appendChild(soldTag);

  // Optional: fade product
  productDiv.style.opacity = "0.6";
}

// =========================
// INIT ON PAGE LOAD
// =========================
window.onload = function () {
  loadCart();
};
