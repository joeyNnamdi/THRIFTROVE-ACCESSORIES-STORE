// ===== CART FUNCTIONALITY =====
let cart = [];
let cartCount = 0;

// Add product to cart
function addToCart(productName, price) {
  cart.push({ name: productName, price: price });
  cartCount++;
  updateCart();
}

// Update cart display
function updateCart() {
  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");

  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    const li = document.createElement("li");
    li.textContent = `${item.name} - R${item.price}`;
    cartItems.appendChild(li);
    total += item.price;
  });

  cartTotal.textContent = total;
  document.getElementById("cartCount").textContent = cartCount;
}

// Toggle cart overlay
function toggleCart() {
  const overlay = document.getElementById("cartOverlay");
  overlay.classList.toggle("show");
}

// Checkout (simple alert for demo)
function checkout() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }
  alert("Thank you for your purchase!");
  cart = [];
  cartCount = 0;
  updateCart();
  toggleCart();
}

// ===== MARK AS SOLD FUNCTIONALITY =====
// Only marks product as sold, does NOT create any new button
function markAsSold(button) {
  const productDiv = button.closest(".product");

  // Disable all buttons in this product
  const buttons = productDiv.querySelectorAll("button");
  buttons.forEach((btn) => (btn.disabled = true));

  // Add SOLD overlay
  const soldTag = document.createElement("div");
  soldTag.textContent = "SOLD OUT";
  soldTag.classList.add("sold-tag");
  productDiv.appendChild(soldTag);

  // Fade the product visually
  productDiv.style.opacity = "0.6";
}

// ===== MOBILE MENU TOGGLE =====
function toggleMenu() {
  const menuLinks = document.getElementById("menuLinks");
  menuLinks.classList.toggle("active");
}
