import express from "express"
const router = express.Router()

import { addFriend, getFriends, createExpense, getExpenses, getExpensesById } from "../controllers/expenseController.js";

import { jwtToken } from "../middlewares/jwtToken.js";

router.route("/addFriend").post(jwtToken, addFriend);
router.route("/createExpense").post(jwtToken, createExpense);
router.route("/getFriends").get(jwtToken, getFriends);

router.route("/getExpenses").get(jwtToken, getExpenses);

router.route("/getExpenses/:id").get(jwtToken, getExpensesById);


export default router;