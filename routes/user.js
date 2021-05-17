const router = require("express").Router();
const { catchErrors } = require("../handlers/errorHandlers");
const userController = require("../controllers/userController");
const {protect} = require("../middlewares/auth");
router.post("/login", catchErrors(userController.login));
router.post("/register", catchErrors(userController.register));
router.patch("/update/:id",protect, catchErrors(userController.updateUser));

module.exports = router;
