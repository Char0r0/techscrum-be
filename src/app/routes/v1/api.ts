const express = require("express");
const router = new express.Router();
const tenantValidations = require("../../validations/tenant");
const tenantControllers = require("../../controllers/v1/clients/tenant");
const userControllers = require("../../controllers/v1/user/user");
const { authentication_token } = require("../../middlware/auth");
const loginControllers = require("../../controllers/v1/login/login");

router.get("/tenant", tenantValidations.index, tenantControllers.index);
router.post("/tenant", tenantValidations.store, tenantControllers.store);

router.post("/login", loginControllers.post);
router.get("/me", authentication_token, userControllers.get);

module.exports = router;
