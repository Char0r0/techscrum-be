const express = require("express");
const router = new express.Router();
const weatherController = require("../../controllers/example");
const projects = require("../../controllers/v1/projects/projectsController");
router.get("/weathers", weatherController.index);

router.get("/projects", projects.show);
router.put("/projects", projects.update);

module.exports = router;
