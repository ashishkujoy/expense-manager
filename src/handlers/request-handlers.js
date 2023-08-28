const Expense = require("../models/expense");
const User = require("../models/user");

const sendSignUpSuccessful = (_, res) => {
  const message = "Sign Up successful";
  res.status(201).json({ message });
};

const sendExpenseAdded = (req, res, expenseId, totalExpense) => {
  res.status(201).json({ expenseId, totalExpense });
};

const sendUsernameExists = (_, res) => {
  res.status(403).send();
};

const sendValidLogin = (req, res) => {
  const { name } = req.body;
  res.status(200).cookie("name", name).send();
};

const sendInvalidLoginCredentials = (_, res) => {
  res.status(403).send();
};

const handleAddExpense = (req, res) => {
  const { expenses, idGenerator, dataStorage } = req.app;
  const { title, amount, date } = req.body;
  const { name } = req.cookies;

  const expenseId = idGenerator.generateExpenseId();

  const expense = new Expense(title, amount, date, expenseId, name);
  expenses.add(expense);

  const { totalExpense } = expenses.getDetails(name);
  dataStorage.storeExpenses(expenses.details, () =>
    sendExpenseAdded(req, res, expenseId, totalExpense)
  );
};

const handleGetExpenses = (req, res) => {
  const { expenses } = req.app;
  const { name } = req.cookies;

  res.json(expenses.getDetails(name));
};

const handleSignUp = (req, res) => {
  const { dataStorage, idGenerator, users } = req.app;
  const { name, password } = req.body;

  if (users.isUsernameExists(name)) {
    sendUsernameExists(req, res);
    return;
  }

  const userId = idGenerator.generateUserId();
  const user = new User(name, password, userId);
  users.add(user);
  dataStorage.storeUsers(users.details, () => sendSignUpSuccessful(req, res));
};

const handleSignIn = (req, res) => {
  const { users } = req.app;
  const { name, password } = req.body;

  if (users.isValidLoginCredentials(name, password)) {
    sendValidLogin(req, res);
    return;
  }
  sendInvalidLoginCredentials(req, res);
};

const handleValidateUsername = (req, res) => {
  const { users } = req.app;
  const { name } = req.cookies;

  if (users.isUsernameExists(name)) {
    res.send({ name });
    return;
  }

  res.status(401).send();
};

const handleSignOut = (_, res) => {
  res.clearCookie("name").redirect(303, "/index.html");
};

module.exports = {
  handleAddExpense,
  handleGetExpenses,
  handleSignUp,
  handleSignIn,
  handleValidateUsername,
  handleSignOut,
};
