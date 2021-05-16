const router = require("express").Router();
const { catchErrors } = require("../handlers/errorHandlers");
const notificationController = require("../controllers/notificationController");

router.post("/send", catchErrors(notificationController.sendNotification));

module.exports = router;
