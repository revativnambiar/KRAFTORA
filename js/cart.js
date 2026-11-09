/* ============================================================
   KRAFTORA — DIRECT PURCHASE & CHECKOUT ORDER SYSTEM
   Brand: KRAFTORA
   Tagline: "SUSTAINABLE PACKAGING. ELEVATED STYLE."
   Direct Buy Now Order State (No Shopping Cart)
   ============================================================ */

const DirectOrder = (() => {
  const ORDER_KEY = "kraftora_current_order";

  /**
   * Saves selected size and quantity directly for checkout.
   * Calculates subtotal, shipping, and final payable amount.
   * @param {string} sizeKey - "small" | "medium" | "large"
   * @param {number} qty - quantity of bags
   * @returns {Object} order
   */
  function save(sizeKey = "small", qty = 1) {
    const order = calculateDirectOrder(sizeKey, qty);
    try {
      localStorage.setItem(ORDER_KEY, JSON.stringify(order));
    } catch {}
    return order;
  }

  /**
   * Retrieves the current direct order. If none exists, defaults to 1 Small bag.
   * Guarantees all fields and calculations are 100% valid numbers (no dashes/blanks).
   * @returns {Object} order
   */
  function get() {
    try {
      const raw = localStorage.getItem(ORDER_KEY);
      if (!raw) return calculateDirectOrder("small", 1);
      const parsed = JSON.parse(raw);
      if (!parsed || !parsed.sizeKey) return calculateDirectOrder("small", 1);
      return calculateDirectOrder(parsed.sizeKey, parsed.qty);
    } catch {
      return calculateDirectOrder("small", 1);
    }
  }

  /**
   * Clears the current order upon completion.
   */
  function clear() {
    try {
      localStorage.removeItem(ORDER_KEY);
    } catch {}
  }

  return { save, get, clear };
})();

// Compatibility wrapper so existing unit tests and helper functions seamlessly transition
const Cart = {
  getItems: () => [DirectOrder.get()],
  getCount: () => DirectOrder.get().qty,
  getSubtotal: () => DirectOrder.get().subtotal,
  getShipping: () => DirectOrder.get().shipping,
  getTotal: () => DirectOrder.get().finalAmount,
  add: (product, sizeKey, qty) => DirectOrder.save(sizeKey, qty),
  buyNow: (product, sizeKey, qty) => DirectOrder.save(sizeKey, qty),
  remove: () => DirectOrder.clear(),
  setQty: (id, qty) => {
    const current = DirectOrder.get();
    DirectOrder.save(current.sizeKey, qty);
  },
  clear: () => DirectOrder.clear(),
  init: () => {},
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = { DirectOrder, Cart };
}
