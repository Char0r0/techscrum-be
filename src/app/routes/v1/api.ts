const express = require("express");
const router = new express.Router();
const weatherController = require("../../controllers/example");
const tenantValidations = require("../../validations/tenant");
const tenantControllers = require("../../controllers/v1/tenant/tenant");
const accountAccess = require("../../controllers/v1/accountAccess/register")
const taskCards = require("../../controllers/v1/taskCards/taskCardController");

router.get("/weathers", weatherController.index);

router.get("/tenants", tenantValidations.index, tenantControllers.index);
router.post("/tenants", tenantValidations.store, tenantControllers.store);

router.get("/register/:email", accountAccess.post);
router.post("/register", accountAccess.store);

router.get("/tasks", taskCards.index);
router.get("/tasks/:id", taskCards.show);
router.post("/tasks", taskCards.store);
router.put("/tasks", taskCards.update);
router.delete("/tasks/:id", taskCards.delete);

module.exports = router;
