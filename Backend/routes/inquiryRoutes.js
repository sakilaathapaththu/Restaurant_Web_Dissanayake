const router = require("express").Router();
const rateLimit = require("express-rate-limit");
const inquiryCtrl = require("../controllers/inquiryController");

router.post("/", inquiryCtrl.create);
router.get("/", inquiryCtrl.list);
router.patch("/:id/status", inquiryCtrl.updateStatus);

module.exports = router;
