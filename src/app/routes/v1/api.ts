const express = require("express");
const router = new express.Router();
const weatherController = require("../../controllers/example");

router.get("/weathers", weatherController.index);

module.exports = router;
