import express from 'express'
import faqRoutes from './faqroute/faqroutes.js';
import offerRouter from './offerroute/offerroutes.js';
import { route } from './helpcenter/routes.js';

const routes = express.Router();

routes.use("/faq",faqRoutes)
routes.use("/offer",offerRouter)
routes.use('/helpcenter',route)

export default routes;