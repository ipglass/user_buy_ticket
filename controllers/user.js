const uniqid = require("uniqid");
const UserModel = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


module.exports.INSERT_USER = async (req, res) => {
  try {
    const email = req.body.email;

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(req.body.password, salt, async (err, hash) => {
        const user = new UserModel({
          id: uniqid(),
          name: req.body.name,
          email: req.body.email,
          password: hash,
          money_balance: req.body.money_balance
        });

        const savedUser = await user.save();
      });
    });

    res.status(200).json({ response: "User was saved successfully" });
  } catch (err) {
    res.status(500).json({ response: "User was not saved, please try later" });
  }
};



module.exports.LOGIN = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({ response: "Bad data" });
    }

    bcrypt.compare(req.body.password, user.password, (err, isPasswordGood) => {
      if (isPasswordGood) {

        console.log("hit1");


        const jwt_token = jwt.sign(
          {
            email: user.email,
            id: user.id,
          },
          process.env.JWT_SECRET,
          { expiresIn: "2h" },
          {
            algorithm: "RS256",
          }
        );

        console.log("hit 2");

        const jwt_refresh_token = jwt.sign(
          {
            email: user.email,
            id: user.id,
          },
          process.env.JWT_SECRET,
          { expiresIn: "24h" },
          {algorithm: "RS256",
        }
        );

console.log ("hit");

        return res.status(200).json({ response: "You logged in", jwt: jwt_token, refresh_token:jwt_refresh_token });
      } else {
        return res.status(401).json({ response: "Bad data" });
      }
    });
  } catch (err) {
    console.log("ERR", err);
    res.status(500).json({ response: "ERROR, please try later" });
  }
};




module.exports.GET_NEW_JWT_TOKEN = async (req, res) => {
  try {
    const refreshToken = req.headers.authrefresh;

    console.log(refresh_token);

    jwt.verify(refresh_token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(400).json({ response: "Login" });
      } else {
        const user = await UserModel.findONE({ id: decoded.userId });

        const token = jwt.sign(
          {
            email: user.email,
            userId: user.id,
          },
          process.env.JWT_SECRET,
          { expiresIn: "2h" },
          {
            algorithm: "RS256",
          }
        );
        return res.status(200).json({ response: "Token is refreshed", jwt: jwt_token, refresh_token:jwt_refresh_token });
      }
    });

  } catch (err) {
    console.log("ERR", err);
    res.status(500).json({ response: "ERROR, please try later" });
  }
};
      
      

module.exports.GET_ALL_USERS = async (req, res) => {
  try {
    const users = await UserModel.findOne();
    res.status(200).json({ users: users });
  } catch (err) {
    console.log("ERR", err);
    res.status(500).json({ response: "ERROR" });
  }
};




module.exports.GET_USER_BY_ID = async (req, res) => {
  try {
    const user = await UserModel.findOne({ id: req.params.id });
    res.status(200).json({ user: user });
  } catch (err) {
    console.log("ERR", err);
    res.status(500).json({ response: "ERROR" });
  }
};


module.exports.DELETE_USER_BY_ID = async (req, res) => {
  try {
    const user = await UserModel.deleteOne({ id: req.params.id });
    res.status(200).json({ user: user });
  } catch (err) {
    console.log("ERR", err);
    res.status(500).json({ response: "ERROR" });
  }
};


module.exports.GET_ALL_USERS_WITH_TICKETS = async (req, res) => {
  try {


    const aggregatedUserData = await UserModel.aggregate([
      {
        $lookup: {
          from: "tickets",
          localField: "bought_tickets",
          foreignField: "id",
          as: "tickets",
        },
      },
      {
        $sort: { name: 1 },
      },
      { $match: { id: req.body.ticketId } },
    ]).exec();

    res.status(200).json({ user: aggregatedUserData });
  } catch (err) {
    console.log("ERR", err);
    res.status(500).json({ response: "ERROR, please try later" });
  }
};



















