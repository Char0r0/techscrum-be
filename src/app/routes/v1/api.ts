const express = require("express");
const router = new express.Router();
const tenantValidations = require("../../validations/tenant");
const tenantControllers = require("../../controllers/v1/tenant/tenant");
const taskCards = require("../../controllers/v1/taskCards/taskCardController");

router.get("/tenants", tenantValidations.index, tenantControllers.index);
router.post("/tenants", tenantValidations.store, tenantControllers.store);

router.get("/tasks", taskCards.index);
router.get("/tasks/:id", taskCards.show);
router.post("/tasks", taskCards.store);
router.put("/tasks", taskCards.update);
router.delete("/tasks/:id", taskCards.delete);

module.exports = router;
