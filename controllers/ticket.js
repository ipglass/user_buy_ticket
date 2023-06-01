const uniqid = require("uniqid");
const TicketModel = require("../models/ticket");
const UserModel = require("../models/user");

module.exports.INSERT_TICKET = async (req, res) => {
    try {
        const ticket = new TicketModel({
            title: req.body.title,
            price: req.body.price,            
            from_location: req.body.from_location,
            to_location: req.body.to_location,
            to_location_photo_url: req.body.to_location_photo_url,
            id: uniqid()
        });

        const savedTiket = await ticket.save();

        res.status(200).json({ response: "Ticket was inserted successfully" });
    } catch (err) {
        console.log("ERR", err);
        res.status(500).json({ response: "ERROR" });
    }
};


module.exports.BUY_TICKET = async (req, res) => {
    try {
        const ticket = await TicketModel.findOne({ id: req.body.ticket_id });
        const user = await UserModel.findOne({ id: req.body.user_id });

        if (!ticket || !user) {
            return res.status(404).json({ error: "User's or ticket's bad data" });
        }

        if (user.money_balance < ticket.ticket_price) {
            return res.status(400).json({ error: "Money balance is not enough" });
        }

        user.money_balance -= ticket.ticket_price;

        const savedTicket = await ticket.save();

        await UserModel.updateOne(
            { id: req.body.user_id },
            { $push: { bought_tickets: savedTicket.id } }
        );
        await UserModel.updateOne(
            { id: req.body.user_id },
            { $set: { money_balance: user.money_balance } }
        );

        res.status(200).json({ response: "User.money_balance" });
    } catch (err) {
        console.log("ERR", err);
        res.status(500).json({ response: "ERROR, please try later" });
    }
};


module.exports.GET_TICKET_BY_ID = async (req, res) => {
    try {
        const ticket = await UserModel.findOne({ id: req.params.id });
        res.status(200).json({ ticket: ticket });
    } catch (err) {
        console.log("ERR", err);
        res.status(500).json({ response: "ERROR, please try later" });
    }
};


module.exports.DELETE_TICKET_BY_ID = async (req, res) => {
    try {
        const ticket = await UserModel.findOne({ id: req.params.id });
        res.status(200).json({ response: "Ticket was deleted successfully" });
    } catch (err) {
        console.log("ERR", err);
        res.status(500).json({ response: "ERROR, please try later" });
    }
};







