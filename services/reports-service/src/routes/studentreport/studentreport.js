import express from 'express'
import { createTicket, deleteTicket, getTicketById, getTicketsStudent, updateTicket } from '../../controlls/studentreport/report.js'
import { PermissionVerify } from '../../middleware/index.js'

const StudentTicketsRoute= express.Router()

StudentTicketsRoute.post('/stucreate',createTicket)
StudentTicketsRoute.put('/stuupdate/:id',PermissionVerify(["admin","merchant"]),updateTicket)
StudentTicketsRoute.delete('/studelete/:id',PermissionVerify(["admin","merchant"]),deleteTicket)
StudentTicketsRoute.get('/stugetall',getTicketsStudent)
StudentTicketsRoute.get('/stuget/:id',getTicketById)



export default StudentTicketsRoute