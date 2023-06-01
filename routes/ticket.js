const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const {
    INSERT_TICKET,
    BUY_TICKET,
    GET_TICKET_BY_ID,
    DELETE_TICKET_BY_ID
        } = require("../controllers/ticket");

router.post("/insertTicket", INSERT_TICKET);
router.post("/buyTicket", authMiddleware, BUY_TICKET );
router.get("/getTicketById", authMiddleware, GET_TICKET_BY_ID); 
router.delete("/deleteTicketById", authMiddleware, DELETE_TICKET_BY_ID)

module.exports = router;
