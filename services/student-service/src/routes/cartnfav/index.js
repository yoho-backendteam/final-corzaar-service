import express from "express"
import { addToCart, applyCoupon, clearCart, getCart, getCartById, removeCoupon, removeItem } from "../../controllers/cart/index.js"
import { validateRequest } from "../../middelwares/cartnfav/index.js"
import { addToCartValidator, getCartValidator, removeItemValidator } from "../../validations/cart/index.js"
import { addToFavorites, clearFavorites, getFavorites, moveToCart, removeFavoriteList } from "../../controllers/fav/index.js"
import { favSchema } from "../../validations/fav/index.js"
import { addInstituteFavValidator, getInstituteFavValidator } from "../../validations/fav/favinstitute.js"
import{addInstituteFav, getInstituteFav, removeInstituteFav} from "../../controllers/fav/favinstitute.js"
import { checkoutAllCart, checkoutDirectCourse, checkoutSingleCartItem } from "../../controllers/cartcontroller/index.js"
export const cartroute = express.Router()

cartroute.post('/addtocart/:courseId',addToCart)
cartroute.delete('/remove/:id',validateRequest(removeItemValidator) ,removeItem)
cartroute.get('/',getCart)
cartroute.get('/getbyid/:id',getCartById)
cartroute.delete('/clear',clearCart)
cartroute.post('/apply-coupon',applyCoupon)
cartroute.delete('/remove-coupon',removeCoupon)

cartroute.post("/checkout/:cartId", checkoutAllCart);
cartroute.post("/checkout/single", checkoutSingleCartItem);
cartroute.post("/buy", checkoutDirectCourse);
//fav
cartroute.post('/fav/add',validateRequest(favSchema),addToFavorites)
cartroute.get('/fav/get',getFavorites)
cartroute.post("/fav/movetocart",moveToCart)
cartroute.delete('/fav/remove-favourite/:courseId',removeFavoriteList)
cartroute.delete('/fav/clear',clearFavorites)
//favinstitute
cartroute.post('/fav/institute',validateRequest(addInstituteFavValidator),addInstituteFav)
cartroute.get('/fav/getinstitute/:userId',validateRequest(getInstituteFavValidator),getInstituteFav)
cartroute.delete('/fav/remove-ins/:instituteId',removeInstituteFav)
export default cartroute