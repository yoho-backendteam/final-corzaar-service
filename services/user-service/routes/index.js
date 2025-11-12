import express from "express"
import userRoute from "./users/index.js"
import merchantRoute from "./merchant/index.js"
import adminRoute from "./admin/index.js"
import sharedRoute from "./shared/index.js"
const route = express.Router()

route.use('/users',userRoute)
route.use('/merchant',merchantRoute)
route.use('/admin',adminRoute)
route.use('/share',sharedRoute)

export default route