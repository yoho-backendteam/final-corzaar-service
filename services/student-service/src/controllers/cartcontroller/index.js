import axios from "axios";
import  {  OrderModel } from "../../models/cartmodel/index.js";
import CartCourses from "../../models/cart/index.js";


const getData = async(url) => {
    try {
        const response = await axios.get(url)
        return response?.data
    } catch (error) {
        console.log(error)
    }
}

export const checkoutAllCart = async (req, res) => {
  try {
    const user = req.user;
    const {cartId} = req.params;
    
    const cart = await CartCourses.findOne({_id:cartId,userId:user?._id, checkout:false});

    if (!cart) return errorResponse(res, "No active cart found for this user");
    
    const {data} = await GetCourseDataForCart({item:cart?.items})
    
    const output = {...cart._doc,items:data}
    

    if (!cart) {
      return res.status(400).json({ message: "No active items in cart" });
    }

    const allItems = cart.flatMap(cart => cart.items);

    const totalAmount = allItems.reduce((sum, item) => sum + (item.price || 0), 0);

    const order = await OrderModel.create({
      userId,
      items: allItems,
      totalAmount,
    });

    await CartCourses.updateMany(
      { userId, isactive: true, isdeleted: false },
      { $set: { isactive: false, isdeleted: true } }
    );

    order.status = "confirmed";
    await order.save();

    return res.status(200).json({
      message: "All cart items checked out successfully",
      order,
    });

  } catch (err) {
    console.error("Checkout error:", err);
    return res.status(500).json({ message: err.message });
  }
};


export const checkoutSingleCartItem = async (req, res) => {
  try {
    const { userId, cartID } = req.body;

    if (!userId || !cartID)
      return res.status(400).json({ message: "userId and cartId required" });

    const cart = await CartCourses.findOne({
      _id: cartID,
      userId,
      isdeleted: false,
      isactive: true,
    });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const order = await OrderModel.create({
      userId,
      items: cart.items,
      totalAmount: cart.items.reduce((sum, item) => sum + item.price, 0),
    });

    await CartCourses.findByIdAndDelete(cartID); 

    return res.status(200).json({
      message: "Single cart item checked out successfully",
      order,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


export const checkoutDirectCourse = async (req, res) => {
  try {
    const { userId, courseId } = req.body;

    if (!userId || !courseId)
      return res.status(400).json({ message: "userId and courseId required" });

    const data = await getData("http://localhost:5000/api/courses");
    const course = data.data.find((c) => c._id === courseId);

    if (!course)
      return res.status(404).json({ message: "Course not found" });

    const price = course?.pricing?.price || 0;

    const order = await OrderModel.create({
      userId,
      items: [{ courseId, price }],
      totalAmount: price,
    });

    return res.status(200).json({
      success: true,
      message: "Course purchased directly successfully",
      order,
    });
  } catch (err) {
    console.error("Error in checkoutDirectCourse:", err);
    return res.status(500).json({ message: err.message });
  }
};
