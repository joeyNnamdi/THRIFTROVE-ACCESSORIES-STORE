// ========================= 
// MENU TOGGLE (Mobile)
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

// Save cart to localStorage
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  localStorage.setItem("cartTotal", cartTotal);
}

// Load cart from localStorage
function loadCart() {
  const storedCart = localStorage.getItem("cart");
  const storedTotal = localStorage.getItem("cartTotal");

  if (storedCart) cart = JSON.parse(storedCart);
  if (storedTotal) cartTotal = parseFloat(storedTotal);

  updateCartUI();
}

// Add item to cart
function addToCart(productName, price) {
  cart.push({ name: productName, price: price });
  cartTotal += price;
  updateCartUI();
  saveCart();
}

// Update cart display
function updateCartUI() {
  const cartItemsList = document.getElementById("cartItems");
  const cartCount = document.getElementById("cartCount");
  const cartTotalElem = document.getElementById("cartTotal");

  cartItemsList.innerHTML = "";

  cart.forEach((item, index) => {
    const li = document.createElement("li");
    li.textContent = `${item.name} - R${item.price}`;

    // Remove button
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "❌";
    removeBtn.style.marginLeft = "10px";
    removeBtn.onclick = () => removeFromCart(index);

    li.appendChild(removeBtn);
    cartItemsList.appendChild(li);
  });

  cartCount.textContent = cart.length;
  cartTotalElem.textContent = cartTotal;
}

// Remove item from cart
function removeFromCart(index) {
  cartTotal -= cart[index].price;
  cart.splice(index, 1);
  updateCartUI();
  saveCart();
}

// Toggle cart overlay
function toggleCart() {
  document.getElementById("cartOverlay").classList.toggle("show");
}

// Checkout
function checkout() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }
  alert(`Thank you for shopping! Your total is R${cartTotal}.`);
  cart = [];
  cartTotal = 0;
  updateCartUI();
  saveCart();
  toggleCart();
}

// =========================
// MARK AS SOLD (only on product list pages)
// =========================
function markAsSold(button) {
  const productDiv = button.closest(".product");

  // Disable buttons
  const buttons = productDiv.querySelectorAll("button");
  buttons.forEach(btn => (btn.disabled = true));

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

  // Only add "Mark as SOLD" buttons if NOT on a product detail page
  const isDetailPage = document.querySelector(".product-details");
  if (!isDetailPage) {
    document.querySelectorAll(".product").forEach(product => {
      const soldBtn = document.createElement("button");
      soldBtn.innerText = "Mark as SOLD";
      soldBtn.classList.add("mark-sold-btn");
      soldBtn.onclick = function () {
        markAsSold(soldBtn);
      };
      product.appendChild(soldBtn);
    });
  }
};
