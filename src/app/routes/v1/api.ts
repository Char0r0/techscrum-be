const express = require('express');
const router = new express.Router();
const projects = require('../../controllers/v1/projects/projects');
const tenantValidations = require('../../validations/tenant');
const tenantControllers = require('../../controllers/v1/tenant/tenant');
const userInfoControllers = require('../../controllers/v1/userInfo/userInfo');
const { authenticationEmailToken, authenticationToken } = require('../../middleware/auth');
const login = require('../../controllers/v1/login/login');
const register = require('../../controllers/v1/register/register');
const board = require('../../controllers/v1/board/board');
const task = require('../../controllers/v1/task/task');
const userControllers = require('../../controllers/v1/user/user');
const commitControllers = require('../../controllers/v1/commit/commit');
const accountSettingControllers = require('../../controllers/v1/accountSetting/accountSetting');
const shortcutControllers = require('../../controllers/v1/shortcut/shortcut');
const userPageControllers = require('../../controllers/v1/userPage/userPage');

/* https://blog.logrocket.com/documenting-your-express-api-with-swagger/ */

/**
 * @swagger
 * components:
 *   schemas:
 *     Tenants:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The user ID.
 *           example: 0
 *         name:
 *           type: string
 *           description: The user's name.
 *           example: Leanne Graham
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The user ID.
 *           example: 0
 *         name:
 *           type: string
 *           description: The user's name.
 *           example: Leanne Graham
 */

/**
 * @swagger
 * /tenants:
 *   get:
 *     summary: Retrieve a list of tenants
 *     description: Retrieve a list of tenants.
 *     parameters:
 *       - in: query
 *         name: domain
 *         required: true
 *         description: Domain of the url.
 *         schema:
 *           type: string
 *       - in: query
 *         name: name
 *         required: true
 *         description: App name.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Tenants'
 */
router.get('/tenants', tenantValidations.index, tenantControllers.index);
router.post('/tenants', tenantValidations.store, tenantControllers.store);

router.post('/login', login.store);

router.get('/register/:token', authenticationEmailToken, register.get);
router.post('/register/:email', register.emailRegister);
router.put('/register/:token', authenticationEmailToken, register.store);
/**
 * @swagger
 * components:
 *   schemas:
 *     Tenants:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The user ID.
 *           example: 0
 *         name:
 *           type: string
 *           description: The user's name.
 *           example: Leanne Graham
 */

/**
 * @swagger
 * /tenants:
 *   get:
 *     summary: Retrieve an user
 *     description: Retrieve an user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Domain of the url.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: return an users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */

router.get('/users/:id', userControllers.show);
router.post('/users/:id', userControllers.update);

router.post('/users/userPage/:userId', userPageControllers.update);

router.get('/commits/:senderid', commitControllers.show);
router.post('/commits', commitControllers.store);
router.put('/commits', commitControllers.update);
router.delete('/commits', commitControllers.delete);

// router.get('/tasks', task.index);
router.get('/tasks/:id', task.show);
router.post('/tasks', task.store);
router.put('/tasks/:id', task.update);
router.delete('/tasks/:id', task.delete);

router.get('/me', authenticationToken, userInfoControllers.index);

router.patch('/account/me', authenticationToken, accountSettingControllers.update);
router.delete('/account/me', authenticationToken, accountSettingControllers.destroy);

router.get('/projects', projects.show);
router.put('/projects/:id', projects.update);
router.post('/projects', projects.store);
router.delete('/projects/:id', projects.delete);

router.post('/project/shortcut/:id', shortcutControllers.store);
router.put('/project/shortcut/:id/:shortcutId', shortcutControllers.update);
router.delete('/project/shortcut/:id/:shortcutId', shortcutControllers.destroy);

router.get('/board/:id', board.show);

module.exports = router;
