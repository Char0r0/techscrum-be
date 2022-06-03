const express = require("express");
const router = new express.Router();
const tenantValidations = require("../../validations/tenant");
const tenantControllers = require("../../controllers/v1/tenant/tenant");
const registerController = require("../../controllers/v1/register/registerController")
const taskCards = require("../../controllers/v1/taskCards/taskCardController");
const userControllers = require("../../controllers/v1/user/user");

router.get("/tenants", tenantValidations.index, tenantControllers.index);
router.post("/tenants", tenantValidations.store, tenantControllers.store);

router.get("/register/:email", registerController.post);
router.post("/register", registerController.store);
router.get("/users/:id", userControllers.show);
router.post("/users/:id", userControllers.update);

router.get("/tasks", taskCards.index);
router.get("/tasks/:id", taskCards.show);
router.post("/tasks", taskCards.store);
router.put("/tasks", taskCards.update);
router.delete("/tasks/:id", taskCards.delete);

module.exports = router;
