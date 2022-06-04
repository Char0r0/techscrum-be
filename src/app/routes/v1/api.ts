const express = require("express");
const router = new express.Router();
const projects = require("../../controllers/v1/projects/projectsController");
const tenantValidations = require("../../validations/tenant");
const tenantControllers = require("../../controllers/v1/tenant/tenant");
const register = require("../../controllers/v1/register/register")
const task = require("../../controllers/v1/task/task");
const userControllers = require("../../controllers/v1/user/user");

router.get("/tenants", tenantValidations.index, tenantControllers.index);
router.post("/tenants", tenantValidations.store, tenantControllers.store);

router.get("/register/:email", register.post);
router.post("/register", register.store);
router.get("/users/:id", userControllers.show);
router.post("/users/:id", userControllers.update);

router.get("/tasks", task.index);
router.get("/tasks/:id", task.show);
router.post("/tasks", task.store);
router.put("/tasks", task.update);
router.delete("/tasks/:id", task.delete);

router.get("/projects", projects.show);
router.put("/projects", projects.update);

module.exports = router;
