// ===== ADMIN MODE TOGGLE =====
let isAdmin = localStorage.getItem("adminMode") === "true";

// Toggle admin mode using SHIFT + D
document.addEventListener("keydown", (event) => {
  if (event.key.toLowerCase() === "d" && event.shiftKey) {
    isAdmin = !isAdmin;
    localStorage.setItem("adminMode", isAdmin);
    alert("Admin mode " + (isAdmin ? "✅ ON" : "❌ OFF"));
    location.reload();
  }
});

// ===== CART FUNCTIONALITY =====
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Initialize cart on load
window.onload = function () {
  updateCart();
};

// Add to cart
function addToCart(productName, price) {
  cart.push({ name: productName, price: price });
  saveCart();
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
    li.innerHTML = `
      ${item.name} - R${item.price.toFixed(2)}
      <button class="remove-btn" onclick="removeFromCart(${index})">❌</button>
    `;
    cartItems.appendChild(li);
    total += item.price;
  });

  cartTotal.textContent = total.toFixed(2);
  document.getElementById("cartCount").textContent = cart.length;
}

// Remove cart item
function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
  updateCart();
}

// Save cart to storage
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Toggle cart popup
function toggleCart() {
  document.getElementById("cartOverlay").classList.toggle("show");
}

// ===== PAYFAST CHECKOUT =====
function checkout() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  let total = cart.reduce((sum, item) => sum + item.price, 0);

  const form = document.createElement("form");
  form.method = "POST";
  form.action = "https://www.payfast.co.za/eng/process";

  form.innerHTML = `
    <input type="hidden" name="merchant_id" value="16931721">
    <input type="hidden" name="merchant_key" value="vqz7dadeb0bre">
    <input type="hidden" name="return_url" value="https://thriftrove-accessories-store.co.za/success.html">
    <input type="hidden" name="cancel_url" value="https://thriftrove-accessories-store.co.za/cancel.html">
    <input type="hidden" name="notify_url" value="https://thriftrove-accessories-store.co.za/notify.php">
    <input type="hidden" name="amount" value="${total.toFixed(2)}">
    <input type="hidden" name="item_name" value="Thriftrove Order">
  `;

  document.body.appendChild(form);
  form.submit();

  cart = [];
  saveCart();
  updateCart();
}

// ===== MARK AS SOLD (Admin only) =====
function renderAdminButton(productDiv) {
  if (!isAdmin) return; // only show to admin

  const soldBtn = document.createElement("button");
  soldBtn.className = "mark-sold-btn";
  soldBtn.textContent = "Mark as Sold";
  soldBtn.onclick = () => markAsSold(soldBtn);
  productDiv.appendChild(soldBtn);
}

// Function called when admin clicks mark sold
function markAsSold(button) {
  const productDiv = button.closest(".product");

  productDiv.querySelectorAll("button").forEach((btn) => btn.disabled = true);

  const soldTag = document.createElement("div");
  soldTag.textContent = "SOLD OUT";
  soldTag.classList.add("sold-tag");
  productDiv.appendChild(soldTag);

  productDiv.style.opacity = "0.6";
}

// Call this after loading products if using JS-generated items
document.querySelectorAll(".product").forEach(renderAdminButton);

// ===== MOBILE MENU =====
function toggleMenu() {
  document.getElementById("menuLinks").classList.toggle("active");
}

document.querySelectorAll('input[name="delivery_type"]').forEach(radio=>{
  radio.addEventListener('change', ()=> {
    if (radio.value === 'locker' && radio.checked){
      document.getElementById('homeFields').style.display = 'none';
      document.getElementById('lockerFields').style.display = 'block';
      loadLockers();
    } else {
      document.getElementById('homeFields').style.display = 'block';
      document.getElementById('lockerFields').style.display = 'none';
    }
  });
});

async function loadLockers(){
  const resp = await fetch("{% url 'pudo_lockers' %}");
  const data = await resp.json();
  const sel = document.getElementById('lockerSelect');
  sel.innerHTML = '';
  data.forEach(l => {
    const opt = document.createElement('option');
    opt.value = l.terminal_id;
    opt.textContent = l.name + ' – ' + (l.suburb || '');
    sel.append(opt);
  });
}

async function getDeliveryQuote(event){
  event.preventDefault();
  const form = document.getElementById('deliveryForm');
  const type = form.delivery_type.value;
  let payload = { "delivery_type": type };

  if (type === 'home'){
    payload.collection_address = {
      "lat": null,
      "lng": null,
      "street_address": "Your Store Address",
      "local_area": "Your Area",
      "suburb": "Your Suburb",
      "city": "Your City",
      "code": "Your PostalCode",
      "zone": "Your Province",
      "country": "South Africa",
      "entered_address": "Your Store Address Full",
      "type": "business"
    };
    payload.delivery_address = {
      "street_address": document.getElementById('address').value,
      "code": document.getElementById('postalCode').value,
      "country": "South Africa",
      "type": "residential"
    };
  } else {
    payload.collection_address = {
      "street_address": "Your Store Address",
      "type": "business"
    };
    payload.delivery_address = {
      "terminal_id": form.locker_id.value
    };
  }

  const resp = await fetch("{% url 'pudo_quote' %}", {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await resp.json();
  document.getElementById('deliveryResult').textContent = JSON.stringify(data, null, 2);
  if(data.order_id){
    // Optionally redirect to confirmation: window.location = `/checkout/confirm/${data.order_id}/`;
  }
  return false;
}