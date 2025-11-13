// ===== ADMIN MODE TOGGLE =====
let isAdmin = localStorage.getItem("adminMode") === "true";

document.addEventListener("keydown", (event) => {
  if (event.key.toLowerCase() === "d" && event.shiftKey) {
    isAdmin = !isAdmin;
    localStorage.setItem("adminMode", isAdmin);
    alert("Admin mode " + (isAdmin ? "✅ ON" : "❌ OFF"));
    location.reload();
  }
});

// ===== CART SYSTEM =====
let cart = JSON.parse(localStorage.getItem("cart")) || [];

window.onload = function () {
  updateCart();
};

// Add product to cart
function addToCart(productName, price) {
  cart.push({ name: productName, price: price });
  saveCart();
  updateCart();
}

// Update cart UI
function updateCart() {
  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");
  const cartCount = document.getElementById("cartCount");

  if (!cartItems) return; // page safety check

  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
      ${item.name} - R${item.price.toFixed(2)}
      <button class="remove-btn" onclick="removeFromCart(${index})">❌</button>
    `;
    cartItems.appendChild(div);
    total += item.price;
  });

  cartTotal.textContent = "R" + total.toFixed(2);
  if (cartCount) cartCount.textContent = cart.length;
}

function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
  updateCart();
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

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

// ===== ADMIN MARK AS SOLD =====
function renderAdminButton(productDiv) {
  if (!isAdmin) return;
  const soldBtn = document.createElement("button");
  soldBtn.className = "mark-sold-btn";
  soldBtn.textContent = "Mark as Sold";
  soldBtn.onclick = () => markAsSold(soldBtn);
  productDiv.appendChild(soldBtn);
}

function markAsSold(button) {
  const productDiv = button.closest(".product");
  productDiv.querySelectorAll("button").forEach((btn) => (btn.disabled = true));

  const soldTag = document.createElement("div");
  soldTag.textContent = "SOLD OUT";
  soldTag.classList.add("sold-tag");
  productDiv.appendChild(soldTag);
  productDiv.style.opacity = "0.6";
}

document.querySelectorAll(".product").forEach(renderAdminButton);

// ===== MENU TOGGLE =====
function toggleMenu() {
  document.getElementById("menuLinks").classList.toggle("active");
}

// ===== DELIVERY OPTION TOGGLE =====
document.getElementById("deliveryType").addEventListener("change", function () {
  const type = this.value;
  const addressFields = document.getElementById("addressFields");
  const lockerFields = document.getElementById("lockerFields");

  if (type === "PUDO") {
    addressFields.style.display = "none";
    lockerFields.style.display = "block";
    loadPudoLockers();
  } else {
    addressFields.style.display = "block";
    lockerFields.style.display = "none";
  }
});

// ===== LOAD PUDO LOCKERS =====
async function loadPudoLockers() {
  const lockerDropdown = document.getElementById("lockerSelect");
  lockerDropdown.innerHTML = "<option>Loading lockers...</option>";

  try {
    const response = await fetch("/pudo/lockers/");
    const data = await response.json();

    if (data.error) {
      lockerDropdown.innerHTML = `<option>${data.error}</option>`;
      return;
    }

    lockerDropdown.innerHTML = "";
    data.forEach((locker) => {
      const option = document.createElement("option");
      option.value = locker.terminal_id || locker.code;
      option.textContent = `${locker.name} - ${locker.city || locker.suburb}`;
      lockerDropdown.appendChild(option);
    });
  } catch (err) {
    lockerDropdown.innerHTML = `<option>Error loading lockers</option>`;
    console.error(err);
  }
}

// ===== PUDO QUOTE FETCH =====
async function getDeliveryQuote() {
  const deliveryType = document.getElementById("deliveryType").value;
  const resultDiv = document.getElementById("deliveryResult");

  let payload;

  if (deliveryType === "PUDO") {
    const lockerId = document.getElementById("lockerSelect").value;
    if (!lockerId) return alert("Please select a locker.");

    payload = {
      collection_address: { terminal_id: "CG107" }, // origin locker/store
      delivery_address: { terminal_id: lockerId },
    };
  } else {
    const address = document.getElementById("address").value;
    const postalCode = document.getElementById("postalCode").value;

    if (!address || !postalCode) {
      alert("Please fill in your address and postal code.");
      return;
    }

    payload = {
      collection_address: { terminal_id: "CG107" },
      delivery_address: {
        street_address: address,
        code: postalCode,
        country: "South Africa",
      },
    };
  }

  try {
    const res = await fetch("/pudo/quote/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (data.error) {
      resultDiv.innerHTML = `<p style="color:red;">Error: ${data.error}</p>`;
    } else {
      resultDiv.innerHTML = `<p>Estimated Delivery: <strong>R${data.rate || data.cost}</strong></p>`;
    }
  } catch (err) {
    resultDiv.innerHTML = `<p style="color:red;">Failed to fetch delivery quote.</p>`;
    console.error(err);
  }
}
