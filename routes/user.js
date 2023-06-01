const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const {
    INSERT_USER,
    LOGIN,
    GET_NEW_JWT_TOKEN,
    GET_ALL_USERS,
    GET_USER_BY_ID,
    DELETE_USER_BY_ID,
    GET_ALL_USERS_WITH_TICKETS    
    } = require("../controllers/user");

router.post("/insertUser", INSERT_USER);
router.post("/login", LOGIN);
router.get("/newJwt", GET_NEW_JWT_TOKEN);
router.get("/users",authMiddleware, GET_ALL_USERS);
router.get("/user/:id", authMiddleware, GET_USER_BY_ID);
router.delete("/user/:id", authMiddleware, DELETE_USER_BY_ID);
router.get("/users/withTickets", authMiddleware, GET_ALL_USERS_WITH_TICKETS)
module.exports = router;