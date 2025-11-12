export const calculateTotals = (items = [], coupon = null) => {
  const subtotal = items.reduce((sum, item) => sum + (item.price || 0), 0);
  const itemDiscounts = items.reduce((sum, item) => sum + (item.discountPrice || 0), 0);
  const couponDiscount = coupon?.discountAmount || 0;
  const totalDiscount = itemDiscounts + couponDiscount;
  const tax = 0; 
  const total = subtotal - totalDiscount + tax;

  return { subtotal, discount: totalDiscount, tax, total, currency: "INR" };
};
