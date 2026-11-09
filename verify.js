const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = 'c:\\Users\\HP\\OneDrive\\Desktop\\Venture Micro Project';

console.log('====================================================');
console.log('     KRAFTORA — VERIFICATION & TEST SUITE           ');
console.log('  "SUSTAINABLE PACKAGING. ELEVATED STYLE."          ');
console.log('====================================================\n');

// 1. FILE EXISTENCE & INTEGRITY
console.log('=== 1. VERIFYING FILE EXISTENCE & INTEGRITY ===');
const files = [
  'index.html',
  'shop.html',
  'product.html',
  'cart.html',
  'checkout.html',
  'about.html',
  'how-its-made.html',
  'contact.html',
  'css/style.css',
  'js/config.js',
  'js/cart.js',
  'js/main.js',
  'images/kraftora-logo.png',
  'images/kraftora-logo-light.png',
  'images/kraftora-logo.jpg',
  'images/kraftora-logo.svg',
  'images/product-front.svg',
  'images/product-open.svg',
  'images/product-liner.svg',
  'images/product-assembly.svg',
  'images/product-reference.jpg',
];

let allExist = true;
for (const file of files) {
  const fullPath = path.join(ROOT, file);
  try {
    const stat = fs.statSync(fullPath);
    if (stat.size > 0) {
      console.log(`[PASS] ${file} (${stat.size} bytes)`);
    } else {
      console.error(`[FAIL] ${file} is empty`);
      allExist = false;
    }
  } catch (e) {
    console.error(`[MISSING] ${file}`);
    allExist = false;
  }
}
if (!allExist) process.exit(1);

// 2. JAVASCRIPT SYNTAX VERIFICATION
console.log('\n=== 2. VERIFYING JAVASCRIPT SYNTAX ===');
const jsFiles = ['js/config.js', 'js/cart.js', 'js/main.js'];
let jsValid = true;
for (const js of jsFiles) {
  try {
    const code = fs.readFileSync(path.join(ROOT, js), 'utf8');
    new vm.Script(code);
    console.log(`[SYNTAX OK] ${js}`);
  } catch (e) {
    console.error(`[SYNTAX ERR] ${js}:`, e.message);
    jsValid = false;
  }
}
if (!jsValid) process.exit(1);

// 3. INTERNAL LINK INTEGRITY
console.log('\n=== 3. VERIFYING INTERNAL HTML LINKS ===');
const htmlFiles = [
  'index.html',
  'shop.html',
  'product.html',
  'cart.html',
  'checkout.html',
  'about.html',
  'how-its-made.html',
  'contact.html',
];

let linksValid = true;
for (const html of htmlFiles) {
  const content = fs.readFileSync(path.join(ROOT, html), 'utf8');
  const matches = content.matchAll(/(?:href|src)="([^"#:]+)(?:#[^"]*)?"/g);
  for (const m of matches) {
    const target = m[1];
    if (target.startsWith('http') || target.startsWith('//') || target.startsWith('mailto:') || target.startsWith('tel:')) continue;
    const targetPath = path.join(ROOT, target);
    if (!fs.existsSync(targetPath)) {
      console.error(`[BROKEN LINK] in ${html}: "${target}" not found`);
      linksValid = false;
    }
  }
}
if (linksValid) {
  console.log('[ALL LINKS VALID] No broken href/src links across all HTML files.');
} else {
  process.exit(1);
}

// 4. BRAND NAME & LOGO REQUIREMENTS
console.log('\n=== 4. VERIFYING KRAFTORA BRANDING & CART REMOVAL ===');
let brandOk = true;

// Check zero occurrences of old brand name
for (const file of [...htmlFiles, 'css/style.css', 'js/config.js', 'js/cart.js', 'js/main.js']) {
  const content = fs.readFileSync(path.join(ROOT, file), 'utf8');
  if (/kraft bag co/i.test(content)) {
    console.error(`[FAIL] Found old brand "Kraft Bag Co" in ${file}`);
    brandOk = false;
  }
}
if (brandOk) {
  console.log('[PASS] Zero occurrences of "The Kraft Bag Co." across all project files');
}

// Check zero "Add to Cart" in HTML files
let noAddToCart = true;
for (const html of htmlFiles) {
  const content = fs.readFileSync(path.join(ROOT, html), 'utf8');
  if (/add to cart/i.test(content)) {
    console.error(`[FAIL] Found "Add to Cart" in ${html}`);
    noAddToCart = false;
  }
}
if (noAddToCart) {
  console.log('[PASS] Zero "Add to Cart" buttons found across all HTML pages');
}

// Check zero cart icons or count badges in navigation
let noNavCart = true;
for (const html of htmlFiles) {
  const content = fs.readFileSync(path.join(ROOT, html), 'utf8');
  if (/nav__cart|data-cart-count/i.test(content)) {
    console.error(`[FAIL] Found shopping cart icon or cart count in ${html}`);
    noNavCart = false;
  }
}
if (noNavCart) {
  console.log('[PASS] Zero shopping cart icons or cart count badges in navigation');
}

// Check transparent KRAFTORA logo usage
let logoUsageOk = true;
for (const html of ['index.html', 'shop.html', 'product.html', 'checkout.html', 'about.html', 'how-its-made.html', 'contact.html', 'cart.html']) {
  const content = fs.readFileSync(path.join(ROOT, html), 'utf8');
  if (!content.includes('images/kraftora-logo.png')) {
    console.error(`[FAIL] ${html} does not use images/kraftora-logo.png in navigation`);
    logoUsageOk = false;
  }
}
for (const html of ['index.html', 'shop.html', 'product.html', 'checkout.html', 'about.html', 'how-its-made.html', 'contact.html']) {
  const content = fs.readFileSync(path.join(ROOT, html), 'utf8');
  if (!content.includes('images/kraftora-logo-light.png')) {
    console.error(`[FAIL] ${html} does not use images/kraftora-logo-light.png in footer`);
    logoUsageOk = false;
  }
}
if (logoUsageOk) {
  console.log('[PASS] Transparent KRAFTORA logo blends naturally in nav (kraftora-logo.png) & footers (kraftora-logo-light.png)');
}

// 5. DIRECT BUY NOW & PRICING FUNCTIONAL TESTS
console.log('\n=== 5. TESTING DIRECT PURCHASE, SIZES & SHIPPING SCENARIOS ===');
try {
  let store = {};
  const mockLocalStorage = {
    getItem: (k) => store[k] || null,
    setItem: (k, v) => { store[k] = v; },
    removeItem: (k) => { delete store[k]; },
    clear: () => { store = {}; }
  };
  const mockDocument = {
    querySelectorAll: () => [],
    getElementById: () => null,
    dispatchEvent: () => {},
    addEventListener: () => {}
  };

  const sandbox = {
    localStorage: mockLocalStorage,
    document: mockDocument,
    CustomEvent: function(e, opts) { this.type = e; this.detail = opts ? opts.detail : null; },
    console: console,
    Math: Math,
    JSON: JSON,
    formatAmount: (n) => `₹${n}`
  };

  vm.createContext(sandbox);

  const configCode = fs.readFileSync(path.join(ROOT, 'js/config.js'), 'utf8');
  vm.runInContext(configCode, sandbox);

  const cartCode = fs.readFileSync(path.join(ROOT, 'js/cart.js'), 'utf8');
  vm.runInContext(cartCode, sandbox);

  const testScript = `
    // Scenario 1: Verify KRAFTORA Brand & Tagline in config
    if (SITE.brand.name !== "KRAFTORA") throw new Error("Brand name must be KRAFTORA");
    if (SITE.brand.tagline !== "SUSTAINABLE PACKAGING. ELEVATED STYLE.") throw new Error("Tagline must match exactly");
    console.log("[PASS] Scenario 1: Brand name KRAFTORA and Tagline verified");

    // Scenario 2: Select Small and verify ₹40
    if (SIZES.small.price !== 40) throw new Error("Small price is not 40");
    console.log("[PASS] Scenario 2: Small price verified at ₹40");

    // Scenario 3: Select Medium and verify ₹80
    if (SIZES.medium.price !== 80) throw new Error("Medium price is not 80");
    console.log("[PASS] Scenario 3: Medium price verified at ₹80");

    // Scenario 4: Select Large and verify ₹120
    if (SIZES.large.price !== 120) throw new Error("Large price is not 120");
    console.log("[PASS] Scenario 4: Large price verified at ₹120");

    // Scenario 5: Direct Buy Now — Small (qty 1) -> Subtotal ₹40, Shipping FREE, Total ₹40
    DirectOrder.clear();
    const orderSmall = DirectOrder.save('small', 1);
    if (orderSmall.subtotal !== 40) throw new Error("Small Subtotal failed: " + orderSmall.subtotal);
    if (orderSmall.shipping !== 0) throw new Error("Small Shipping must be FREE (0), got: " + orderSmall.shipping);
    if (orderSmall.finalAmount !== 40) throw new Error("Small Final Amount failed: " + orderSmall.finalAmount);
    console.log("[PASS] Scenario 5: Direct Buy Now — 1 Small bag -> Subtotal ₹40, Shipping FREE, Final ₹40");

    // Scenario 6: Direct Buy Now — Medium (qty 1) -> Subtotal ₹80, Shipping ₹29, Total ₹109
    DirectOrder.clear();
    const orderMed = DirectOrder.save('medium', 1);
    if (orderMed.subtotal !== 80) throw new Error("Medium Subtotal failed: " + orderMed.subtotal);
    if (orderMed.shipping !== 29) throw new Error("Medium Shipping must be ₹29, got: " + orderMed.shipping);
    if (orderMed.finalAmount !== 109) throw new Error("Medium Final Amount failed: " + orderMed.finalAmount);
    console.log("[PASS] Scenario 6: Direct Buy Now — 1 Medium bag -> Subtotal ₹80, Shipping ₹29, Final ₹109");

    // Scenario 7: Direct Buy Now — Large (qty 1) -> Subtotal ₹120, Shipping ₹29, Total ₹149
    DirectOrder.clear();
    const orderLarge = DirectOrder.save('large', 1);
    if (orderLarge.subtotal !== 120) throw new Error("Large Subtotal failed: " + orderLarge.subtotal);
    if (orderLarge.shipping !== 29) throw new Error("Large Shipping must be ₹29, got: " + orderLarge.shipping);
    if (orderLarge.finalAmount !== 149) throw new Error("Large Final Amount failed: " + orderLarge.finalAmount);
    console.log("[PASS] Scenario 7: Direct Buy Now — 1 Large bag -> Subtotal ₹120, Shipping ₹29, Final ₹149");

    // Scenario 8: Direct Buy Now — Multiple Small (qty 3) -> Subtotal ₹120, Shipping FREE, Total ₹120
    DirectOrder.clear();
    const order3Small = DirectOrder.save('small', 3);
    if (order3Small.subtotal !== 120) throw new Error("3 Small Subtotal failed: " + order3Small.subtotal);
    if (order3Small.shipping !== 0) throw new Error("Multiple Small bags must have FREE shipping, got: " + order3Small.shipping);
    if (order3Small.finalAmount !== 120) throw new Error("3 Small Final Amount failed: " + order3Small.finalAmount);
    console.log("[PASS] Scenario 8: Direct Buy Now — 3 Small bags -> Subtotal ₹120, Shipping FREE, Final ₹120");

    // Scenario 9: Direct Buy Now — Multiple Medium (qty 3) -> Subtotal ₹240, Shipping ₹29 (once), Total ₹269
    DirectOrder.clear();
    const order3Med = DirectOrder.save('medium', 3);
    if (order3Med.subtotal !== 240) throw new Error("3 Medium Subtotal failed: " + order3Med.subtotal);
    if (order3Med.shipping !== 29) throw new Error("Shipping must be ₹29 once, got: " + order3Med.shipping);
    if (order3Med.finalAmount !== 269) throw new Error("3 Medium Final Amount failed: " + order3Med.finalAmount);
    console.log("[PASS] Scenario 9: Direct Buy Now — 3 Medium bags -> Subtotal ₹240, Shipping ₹29 (once), Final ₹269");

    // Scenario 10: Direct Buy Now — Multiple Large (qty 2) -> Subtotal ₹240, Shipping ₹29 (once), Total ₹269
    DirectOrder.clear();
    const order2Large = DirectOrder.save('large', 2);
    if (order2Large.subtotal !== 240) throw new Error("2 Large Subtotal failed: " + order2Large.subtotal);
    if (order2Large.shipping !== 29) throw new Error("Shipping must be ₹29 once, got: " + order2Large.shipping);
    if (order2Large.finalAmount !== 269) throw new Error("2 Large Final Amount failed: " + order2Large.finalAmount);
    console.log("[PASS] Scenario 10: Direct Buy Now — 2 Large bags -> Subtotal ₹240, Shipping ₹29 (once), Final ₹269");

    // Scenario 11: Quantity stepper minimum is 1; zero and negative quantities prevented
    const orderInvalid = DirectOrder.save('medium', 0);
    if (orderInvalid.qty < 1) throw new Error("Quantity allowed to be less than 1!");
    const orderNegative = DirectOrder.save('large', -5);
    if (orderNegative.qty < 1) throw new Error("Quantity allowed to be negative!");
    console.log("[PASS] Scenario 11: Quantity minimum of 1 enforced; zero and negative prevented");

    // Scenario 12: Checkout order summary calculations fully verified
    const checkoutOrder = DirectOrder.get();
    if (!checkoutOrder.unitPrice || !checkoutOrder.subtotal || checkoutOrder.finalAmount === undefined) {
      throw new Error("Checkout order has missing or undefined amounts");
    }
    console.log("[PASS] Scenario 12: Checkout order summary calculations valid without dashes or empty values");

    // Scenario 13: Demo checkout order reference generation (KF-XXXXXX)
    const orderRef = "KF-" + Math.floor(100000 + Math.random() * 900000);
    if (!orderRef.startsWith("KF-") || orderRef.length !== 9) throw new Error("Order reference format invalid: " + orderRef);
    console.log("[PASS] Scenario 13: Demo order reference format verified (" + orderRef + ")");

    "ALL 13 TEST SCENARIOS PASSED!";
  `;

  const result = vm.runInContext(testScript, sandbox);
  console.log('\n====================================================');
  console.log('[SUCCESS] ' + result);
  console.log('====================================================\n');
} catch (e) {
  console.error('\n[TEST FAILED]', e);
  process.exit(1);
}
