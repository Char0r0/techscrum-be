const express = require("express");
const router = new express.Router();
const weatherController = require("../../controllers/example");
const taskCards = require("../../controllers/taskCardController");
const tenantValidations = require("../../validations/tenant");
const tenantControllers = require("../../controllers/v1/clients/tenant");

router.get("/weathers", weatherController.index);

router.get("/tenant", tenantValidations.index, tenantControllers.index);
router.post("/tenant", tenantValidations.store, tenantControllers.store);

router.get("/taskCards", taskCards.index);
router.get("/taskCards/:id", taskCards.show);
router.post("/taskCards", taskCards.store);
router.put("/taskCards", taskCards.update);
router.delete("/taskCards/:id", taskCards.delete);


module.exports = router;
