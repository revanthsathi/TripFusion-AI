const express = require("express");

const router = express.Router();

const { register } = require("../controllers/authController");
const { registerValidator } = require("../validators/authValidators");
const validate = require("../middleware/validationMiddleware");

router.post(
    "/register",
    registerValidator,
    validate,
    register
);

module.exports = router;