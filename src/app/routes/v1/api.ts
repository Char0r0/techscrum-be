const express = require("express");
const router = new express.Router();
const projects = require("../../controllers/v1/projects/projectsController");
const tenantValidations = require("../../validations/tenant");
const tenantControllers = require("../../controllers/v1/tenant/tenant");
const userInfoControllers = require("../../controllers/v1/userInfo/userInfo");
const { authentication_token } = require("../../middlware/auth");
const loginControllers = require("../../controllers/v1/login/login");
const taskCards = require("../../controllers/v1/taskCards/taskCardController");
const userControllers = require("../../controllers/v1/user/user");

router.get("/tenants", tenantValidations.index, tenantControllers.index);
router.post("/tenants", tenantValidations.store, tenantControllers.store);

router.get("/users/:id", userControllers.show);
router.post("/users/:id", userControllers.update);

router.get("/tasks", taskCards.index);
router.get("/tasks/:id", taskCards.show);
router.post("/tasks", taskCards.store);
router.put("/tasks", taskCards.update);
router.delete("/tasks/:id", taskCards.delete);

router.post("/login", loginControllers.store);
router.get("/me", authentication_token, userInfoControllers.index);
router.get("/projects", projects.show);
router.put("/projects", projects.update);

module.exports = router;
