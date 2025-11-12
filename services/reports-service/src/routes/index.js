import express from 'express'

import merchantreports from './merchantreporttickets/tickets&report.js'
import StudentTicketsRoute from './studentreport/studentreport.js'
import routes_Crud from './Query/query.js'

const routes = express.Router()

routes.use('/',merchantreports)
routes.use('/complaint',StudentTicketsRoute)
routes.use("/query",routes_Crud)

export default routes