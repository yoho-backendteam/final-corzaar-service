import express from 'express'
import { createTicket, deleteTicket, getTicketById, getTicketsStudent, updateTicket } from '../../controlls/studentreport/report.js'
import { authorize } from '../../middleware/authorizationClient.js'

const StudentTicketsRoute= express.Router()

StudentTicketsRoute.post('/stucreate',createTicket)
StudentTicketsRoute.put('/stuupdate/:id',authorize(["admin","merchant"]),updateTicket)
StudentTicketsRoute.delete('/studelete/:id',authorize(["admin","merchant"]),deleteTicket)
StudentTicketsRoute.get('/stugetall',getTicketsStudent)
StudentTicketsRoute.get('/stuget/:id',getTicketById)



export default StudentTicketsRoute