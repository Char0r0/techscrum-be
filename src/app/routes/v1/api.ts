const express = require("express");
const router = new express.Router();
const tenantValidations = require("../../validations/tenant");
const tenantControllers = require("../../controllers/v1/clients/tenant");

router.get("/tenant", tenantValidations.index, tenantControllers.index);
router.post("/tenant", tenantValidations.store, tenantControllers.store);

module.exports = router;
