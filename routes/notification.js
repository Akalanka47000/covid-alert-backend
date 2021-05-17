const router = require("express").Router();
const { catchErrors } = require("../handlers/errorHandlers");
const notificationController = require("../controllers/notificationController");
const { protect, authorize } = require("../middlewares/auth");

router.post("/send",protect,authorize("Admin"), catchErrors(notificationController.sendNotification));
router.put("/uploadImage",protect, authorize("Admin"), catchErrors(notificationController.uploadImage));

module.exports = router;
