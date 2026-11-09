/* ============================================================
   KRAFTORA — MAIN JAVASCRIPT
   Brand: KRAFTORA
   Tagline: "SUSTAINABLE PACKAGING. ELEVATED STYLE."
   Direct Purchase System (No Shopping Cart)
   ============================================================ */

/* ---- NAVIGATION ---- */
function initNav() {
  const toggle = document.getElementById("navToggle");
  const links  = document.getElementById("navLinks");

  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const isOpen = links.classList.toggle("open");
      toggle.classList.toggle("open", isOpen);
      toggle.setAttribute("aria-expanded", isOpen);
    });

    links.querySelectorAll(".nav__link").forEach((link) => {
      link.addEventListener("click", () => {
        links.classList.remove("open");
        toggle.classList.remove("open");
      });
    });
  }

  // Active navigation highlight
  const page = document.body.dataset.page;
  document.querySelectorAll("[data-nav]").forEach((el) => {
    if (el.dataset.nav === page) el.classList.add("active");
  });
}

/* ---- TOAST NOTIFICATION ---- */
function showToast(message, type = "success", duration = 3200) {
  let toast = document.getElementById("toastEl");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toastEl";
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.className = `toast toast--${type}`;
  void toast.offsetWidth;
  toast.classList.add("show");
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove("show"), duration);
}

/* ---- SHOP PAGE (Single Product Showcase with Direct Buy Now) ---- */
function initShop() {
  const product = getMainProduct();
  if (!product) return;

  // 1. Angle Pills Switcher
  const showcaseImg = document.getElementById("showcaseMainImg");
  const anglePills = document.querySelectorAll(".angle-pill");

  if (showcaseImg && anglePills.length > 0) {
    anglePills.forEach((pill) => {
      pill.addEventListener("click", () => {
        anglePills.forEach((p) => p.classList.remove("active"));
        pill.classList.add("active");
        const src = pill.dataset.src;
        if (src) showcaseImg.src = src;
      });
    });
  }

  // 2. Showcase Size Selector
  let showcaseSizeKey = "small";
  let shopQty = 1;
  const sizeBtns = document.querySelectorAll("#showcaseSizeButtons .size-btn");
  const priceDisplay = document.getElementById("showcasePrice");
  const priceNote = document.getElementById("showcasePriceNote");
  const dimensionsNote = document.getElementById("showcaseDimensions");
  const showcaseSubtotalEl = document.getElementById("showcaseSubtotal");

  function updateShowcaseCalculations() {
    const sizeConfig = SIZES[showcaseSizeKey] || SIZES.small;
    const subtotal = sizeConfig.price * shopQty;
    const shipping = sizeConfig.shipping;
    const finalAmount = subtotal + shipping;

    sizeBtns.forEach((btn) => {
      const isMatch = btn.dataset.size === showcaseSizeKey;
      btn.classList.toggle("active", isMatch);
      btn.setAttribute("aria-checked", isMatch ? "true" : "false");
    });

    if (priceDisplay) priceDisplay.textContent = formatAmount(sizeConfig.price);
    if (priceNote) {
      priceNote.textContent = shipping === 0
        ? `Size: ${sizeConfig.name} (₹${sizeConfig.price}) · FREE Shipping`
        : `Size: ${sizeConfig.name} (₹${sizeConfig.price}) · ₹29 Flat Shipping`;
    }
    if (dimensionsNote) {
      dimensionsNote.textContent = `Size ${sizeConfig.name}: ${sizeConfig.dimensions} (${sizeConfig.capacity})`;
    }
    if (showcaseSubtotalEl) {
      showcaseSubtotalEl.textContent = `Subtotal: ${formatAmount(subtotal)} · Shipping: ${shipping === 0 ? "FREE" : "₹29"} · Total: ${formatAmount(finalAmount)}`;
    }
  }

  sizeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      showcaseSizeKey = btn.dataset.size || "small";
      updateShowcaseCalculations();
    });
  });

  // 3. Showcase Quantity Stepper
  const qtyVal   = document.getElementById("shopQtyVal");
  const qtyMinus = document.getElementById("shopQtyMinus");
  const qtyPlus  = document.getElementById("shopQtyPlus");

  function updateShopQtyDisplay() {
    if (qtyVal) qtyVal.textContent = shopQty;
    if (qtyMinus) qtyMinus.disabled = shopQty <= 1;
    updateShowcaseCalculations();
  }

  if (qtyMinus) qtyMinus.addEventListener("click", () => { shopQty = Math.max(1, shopQty - 1); updateShopQtyDisplay(); });
  if (qtyPlus)  qtyPlus.addEventListener("click",  () => { shopQty += 1; updateShopQtyDisplay(); });

  // Initial calculation
  updateShowcaseCalculations();

  // 4. Direct BUY NOW from Showcase
  const buyBtn = document.getElementById("shopShowcaseBuyBtn") || document.getElementById("shopShowcaseAddBtn");
  if (buyBtn) {
    buyBtn.addEventListener("click", (e) => {
      e.preventDefault();
      DirectOrder.save(showcaseSizeKey, shopQty);
      window.location.href = "checkout.html";
    });
  }

  // Quick Buy buttons across sections
  document.querySelectorAll("[data-quick-buy]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const targetSize = btn.dataset.quickSize || "small";
      DirectOrder.save(targetSize, 1);
      window.location.href = "checkout.html";
    });
  });
}

/* ---- PRODUCT DETAIL PAGE (Direct Buy Now Flow) ---- */
function initProduct() {
  const product = getMainProduct();
  if (!product) return;

  // 1. Gallery Image Switcher
  let currentIndex = 0;
  const mainImg   = document.getElementById("galleryMain");
  const mainLabel = document.getElementById("galleryLabel");
  const thumbs    = document.querySelectorAll(".gallery__thumb");
  const lightbox  = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");

  function setGallery(index) {
    if (index < 0 || index >= product.images.length) return;
    currentIndex = index;
    const img = product.images[index];
    if (mainImg) {
      mainImg.src = img.src;
      mainImg.alt = img.alt;
    }
    if (mainLabel) mainLabel.textContent = img.label;
    thumbs.forEach((t, i) => t.classList.toggle("active", i === index));
  }

  thumbs.forEach((thumb, i) => {
    thumb.addEventListener("click", () => setGallery(i));
  });

  if (mainImg && lightbox) {
    mainImg.addEventListener("click", () => {
      lightboxImg.src = product.images[currentIndex].src;
      lightboxImg.alt = product.images[currentIndex].alt;
      lightbox.classList.add("open");
    });
  }

  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox || e.target.classList.contains("lightbox__close")) {
        lightbox.classList.remove("open");
      }
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") lightbox.classList.remove("open");
    });
  }

  setGallery(0);

  // 2. Size Selection & Quantity System
  let selectedSizeKey = "small";
  let qty = 1;

  const sizeBtns = document.querySelectorAll(".product-size-btn");
  const priceEl = document.getElementById("productPrice");
  const priceShippingNote = document.getElementById("priceShippingNote");
  const selectedSizeDisplay = document.getElementById("selectedSizeDisplay");
  const sizeDimensionsNote = document.getElementById("sizeDimensionsNote");
  const liveOrderPreview = document.getElementById("liveOrderPreview");

  function updateProductCalculations() {
    const sizeConfig = SIZES[selectedSizeKey] || SIZES.small;
    const subtotal = sizeConfig.price * qty;
    const shipping = sizeConfig.shipping;
    const finalAmount = subtotal + shipping;

    sizeBtns.forEach((btn) => {
      const isMatch = btn.dataset.size === selectedSizeKey;
      btn.classList.toggle("active", isMatch);
      btn.setAttribute("aria-checked", isMatch ? "true" : "false");
    });

    if (priceEl) priceEl.textContent = formatAmount(sizeConfig.price);
    if (selectedSizeDisplay) {
      selectedSizeDisplay.textContent = `${sizeConfig.name} (₹${sizeConfig.price})`;
    }
    if (priceShippingNote) {
      priceShippingNote.textContent = shipping === 0
        ? `Size: ${sizeConfig.name} (₹${sizeConfig.price}) · FREE Shipping`
        : `Size: ${sizeConfig.name} (₹${sizeConfig.price}) · ₹29 Flat Shipping`;
    }
    if (sizeDimensionsNote) {
      sizeDimensionsNote.innerHTML = `<strong>Selected Size: ${sizeConfig.name}</strong> — ${sizeConfig.dimensions} (${sizeConfig.capacity}). ${sizeConfig.description}`;
    }
    if (liveOrderPreview) {
      liveOrderPreview.innerHTML = `
        <span><strong>Order Total:</strong> ${qty} × ${sizeConfig.name}</span>
        <span>Subtotal: ${formatAmount(subtotal)} + Shipping: ${shipping === 0 ? "FREE" : "₹29"} = <strong>${formatAmount(finalAmount)}</strong></span>
      `;
    }
  }

  sizeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      selectedSizeKey = (btn.dataset.size || "small").toLowerCase();
      updateProductCalculations();
    });
  });

  // Quantity Stepper
  const qtyVal   = document.getElementById("qtyVal");
  const qtyMinus = document.getElementById("qtyMinus");
  const qtyPlus  = document.getElementById("qtyPlus");

  function updateQtyDisplay() {
    if (qtyVal) qtyVal.textContent = qty;
    if (qtyMinus) qtyMinus.disabled = qty <= 1;
    updateProductCalculations();
  }

  if (qtyMinus) qtyMinus.addEventListener("click", () => { qty = Math.max(1, qty - 1); updateQtyDisplay(); });
  if (qtyPlus)  qtyPlus.addEventListener("click",  () => { qty += 1; updateQtyDisplay(); });

  // Initialize calculations
  updateProductCalculations();

  // 3. ONE Prominent BUY NOW Button (Direct Checkout Flow)
  const buyBtn = document.getElementById("buyNowBtn") || document.getElementById("addToCartBtn");
  if (buyBtn) {
    buyBtn.addEventListener("click", (e) => {
      e.preventDefault();
      // Direct purchase: save selected size and quantity, then redirect directly to checkout
      DirectOrder.save(selectedSizeKey, qty);
      window.location.href = "checkout.html";
    });
  }

  // 4. Accordion Tabs
  document.querySelectorAll(".p-tab").forEach((tab) => {
    tab.querySelector(".p-tab__header").addEventListener("click", () => {
      tab.classList.toggle("open");
    });
  });

  const firstTab = document.querySelector(".p-tab");
  if (firstTab) firstTab.classList.add("open");
}

/* ---- CHECKOUT PAGE (Direct Order Summary & Demo Order Processing) ---- */
function initCheckout() {
  const order = DirectOrder.get();
  renderCheckoutSummary(order);

  const form = document.getElementById("checkoutForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (validateCheckout()) submitDirectOrder(form, order);
    });
  }
}

function renderCheckoutSummary(order) {
  const listEl   = document.getElementById("orderItems");
  const subtotEl = document.getElementById("orderSubtotal");
  const shipEl   = document.getElementById("orderShipping");
  const totalEl  = document.getElementById("orderTotal");

  if (listEl) {
    listEl.innerHTML = `
      <div class="checkout-item-row">
        <div class="checkout-item__thumb">
          <img src="${order.image}" alt="${order.productName}" loading="lazy"/>
        </div>
        <div style="flex:1;">
          <div class="checkout-item__title">${order.productName}</div>
          <div class="checkout-item__meta">
            <span class="cart-item__size-badge" style="font-size:0.75rem; padding:2px 8px; font-weight:600;">Size: ${order.sizeName}</span>
            <div style="margin-top:4px; font-size:0.85rem; color:var(--text-light);">
              Qty: <strong>${order.qty}</strong> × ₹${order.unitPrice} = ₹${order.subtotal.toLocaleString("en-IN")}
            </div>
          </div>
        </div>
        <div class="checkout-item__total" style="font-weight:700; color:var(--green-dark);">
          ₹${order.subtotal.toLocaleString("en-IN")}
        </div>
      </div>
    `;
  }

  if (subtotEl) subtotEl.textContent = formatAmount(order.subtotal);
  if (shipEl)   shipEl.textContent   = order.shipping === 0 ? "FREE" : formatAmount(order.shipping);
  if (totalEl)  totalEl.textContent  = formatAmount(order.finalAmount);
}

function validateCheckout() {
  let valid = true;
  const fields = [
    { id: "co-name",  errId: "err-name",  test: (v) => v.trim().length >= 2 },
    { id: "co-email", errId: "err-email", test: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) },
    { id: "co-phone", errId: "err-phone", test: (v) => /^[\d\s\+\-\(\)]{7,15}$/.test(v.trim()) },
    { id: "co-addr",  errId: "err-addr",  test: (v) => v.trim().length >= 5 },
    { id: "co-city",  errId: "err-city",  test: (v) => v.trim().length >= 2 },
    { id: "co-state", errId: "err-state", test: (v) => v.trim().length >= 2 },
    { id: "co-pin",   errId: "err-pin",   test: (v) => /^\d{4,10}$/.test(v.trim()) },
  ];

  fields.forEach(({ id, errId, test }) => {
    const input = document.getElementById(id);
    const err   = document.getElementById(errId);
    if (!input) return;
    const ok = test(input.value);
    input.classList.toggle("invalid", !ok);
    if (err) err.classList.toggle("show", !ok);
    if (!ok) valid = false;
  });

  return valid;
}

function submitDirectOrder(form, order) {
  // Official KRAFTORA Demo Order Reference
  const ref = "KF-" + Math.floor(100000 + Math.random() * 900000);

  const name     = document.getElementById("co-name")?.value  || "";
  const email    = document.getElementById("co-email")?.value || "";
  const phone    = document.getElementById("co-phone")?.value || "";
  const address  = document.getElementById("co-addr")?.value  || "";
  const city     = document.getElementById("co-city")?.value  || "";
  const state    = document.getElementById("co-state")?.value || "";
  const pin      = document.getElementById("co-pin")?.value   || "";

  const formSec = document.getElementById("checkoutFormSection");
  const confSec = document.getElementById("confirmationSection");

  if (formSec) formSec.style.display = "none";
  if (confSec) {
    confSec.style.display = "";

    const confRef       = document.getElementById("confRef");
    const confName      = document.getElementById("confName");
    const confEmail     = document.getElementById("confEmail");
    const confPhone     = document.getElementById("confPhone");
    const confAddress   = document.getElementById("confAddress");
    const confItemsList = document.getElementById("confItemsList");
    const confSubtotal  = document.getElementById("confSubtotal");
    const confShipping  = document.getElementById("confShipping");
    const confTotal     = document.getElementById("confTotal");

    if (confRef)      confRef.textContent = ref;
    if (confName)     confName.textContent = name;
    if (confEmail)    confEmail.textContent = email;
    if (confPhone)    confPhone.textContent = phone;
    if (confAddress)  confAddress.textContent = `${address}, ${city}, ${state} - ${pin}`;

    if (confItemsList) {
      confItemsList.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; padding:12px 0; border-bottom:1px solid rgba(23,77,53,0.12); font-size:0.95rem;">
          <div>
            <div style="font-weight:700; color:var(--green-dark);">${order.productName}</div>
            <div style="margin-top:4px;">
              <span class="cart-item__size-badge" style="font-size:0.75rem; padding:2px 8px;">Size: ${order.sizeName}</span>
              <span style="color:var(--text-light); font-size:0.85rem; margin-left:8px;">Qty: ${order.qty} × ₹${order.unitPrice}</span>
            </div>
          </div>
          <div style="font-weight:700; color:var(--green-dark); font-size:1.05rem;">
            ₹${order.subtotal.toLocaleString("en-IN")}
          </div>
        </div>
      `;
    }

    if (confSubtotal) confSubtotal.textContent = formatAmount(order.subtotal);
    if (confShipping) confShipping.textContent = order.shipping === 0 ? "FREE" : formatAmount(order.shipping);
    if (confTotal)    confTotal.textContent    = formatAmount(order.finalAmount);
  }

  // Clear direct order once placed
  DirectOrder.clear();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ---- CONTACT PAGE ---- */
function initContact() {
  const form    = document.getElementById("contactForm");
  const success = document.getElementById("contactSuccess");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let valid = true;

    const fields = [
      { id: "ct-name",    errId: "ct-err-name",    test: (v) => v.trim().length >= 2 },
      { id: "ct-email",   errId: "ct-err-email",   test: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) },
      { id: "ct-subject", errId: "ct-err-subject",  test: (v) => v.trim().length >= 3 },
      { id: "ct-message", errId: "ct-err-message",  test: (v) => v.trim().length >= 10 },
    ];

    fields.forEach(({ id, errId, test }) => {
      const input = document.getElementById(id);
      const err   = document.getElementById(errId);
      if (!input) return;
      const ok = test(input.value);
      input.classList.toggle("invalid", !ok);
      if (err) err.classList.toggle("show", !ok);
      if (!ok) valid = false;
    });

    if (valid) {
      if (success) success.classList.add("show");
      form.reset();
      form.querySelectorAll(".invalid").forEach((el) => el.classList.remove("invalid"));
      window.scrollTo({ top: success.offsetTop - 120, behavior: "smooth" });
    }
  });
}

/* ---- DOMContentLoaded Router ---- */
document.addEventListener("DOMContentLoaded", () => {
  initNav();

  const page = document.body.dataset.page;
  switch (page) {
    case "shop":     initShop();     break;
    case "product":  initProduct();  break;
    case "checkout": initCheckout(); break;
    case "contact":  initContact();  break;
    case "cart":     window.location.replace("shop.html"); break;
  }
});
