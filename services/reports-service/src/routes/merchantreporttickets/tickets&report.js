import express from 'express'
import { createTicket, deleteTicket, getAllTickets, getTicketById, updateTicket } from '../../controlls/merchantreport/index.js'
import { PermissionVerify } from '../../middleware/index.js'

const merchantreports = express.Router()
 
merchantreports.post('/mercreate',createTicket)
merchantreports.get('/mergetall',getAllTickets)
merchantreports.delete('/merdelete/:id',PermissionVerify(["admin","merchant"]),deleteTicket)
// merchantreports.put('/merupdate/:id',authorize(["admin","merchant"]),updateTicket)
merchantreports.put('/merupdate/:id',updateTicket)

merchantreports.get('/merget/:id',getTicketById)

export default merchantreports;