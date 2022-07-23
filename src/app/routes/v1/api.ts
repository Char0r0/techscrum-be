const express = require('express');
const router = new express.Router();
const projectsController = require('../../controllers/v1/projects/projects');
const tenantValidations = require('../../validations/tenant');
const tenantControllers = require('../../controllers/v1/tenant/tenant');
const { authenticationEmailTokenMiddleware, authenticationTokenMiddleware, authenticationTokenValidationMiddleware, authenticationRefreshTokenMiddleware } = require('../../middleware/auth');
const loginController = require('../../controllers/v1/login/login');
const registerController = require('../../controllers/v1/register/register');
const boardController = require('../../controllers/v1/board/board');
const taskController = require('../../controllers/v1/task/task');
const userControllers = require('../../controllers/v1/user/user');
const commitControllers = require('../../controllers/v1/commit/commit');
const accountSettingControllers = require('../../controllers/v1/accountSetting/accountSetting');
const shortcutControllers = require('../../controllers/v1/shortcut/shortcut');
const  labelController = require('../../controllers/v1/label/label');
const multerMiddleware = require('../../middleware/multer');
const saasMiddleware = require('../../middleware/saas');
const userPageControllers = require('../../controllers/v1/userPage/userPage');

router.all('*', saasMiddleware.saas);
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

router.post('/login', loginController.login);

router.get('/register/:token', authenticationEmailTokenMiddleware, registerController.get);
router.post('/register/:email', registerController.emailRegister);
router.put('/register/:token', authenticationEmailTokenMiddleware, registerController.store);
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


router.get('/users', userControllers.index);
// router.get('/users/:id', userControllers.show);
// router.post('/users/:id', userControllers.update);
router.put('/users/:id', userPageControllers.update);

router.get('/commits/:id', commitControllers.show);
router.post('/commits', commitControllers.store);
router.put('/commits', commitControllers.update);
router.delete('/commits', commitControllers.destroy);

// router.get('/tasks', task.index);
router.get('/tasks/:id', taskController.show);
router.post('/tasks', taskController.store);
router.put('/tasks/:id', taskController.update);
router.delete('/tasks/:id', taskController.delete);

//router.get('/me', authenticationToken, userInfoControllers.index);

router.patch('/account/me', authenticationTokenMiddleware, accountSettingControllers.update);
router.delete('/account/me', authenticationTokenMiddleware, accountSettingControllers.destroy);

router.post('/auto-fetch-userInfo', authenticationTokenValidationMiddleware, authenticationRefreshTokenMiddleware, loginController.autoFetchUserInfo);

router.get('/projects', projectsController.index);
router.get('/projects/:id', projectsController.show);
router.put('/projects/:id', projectsController.update);
router.post('/projects', projectsController.store);
router.delete('/projects/:id', projectsController.delete);

router.post('/projects/:id/shortcuts', shortcutControllers.store);
router.put('/projects/:projectId/shortcuts/:shortcutId', shortcutControllers.update);
router.delete('/projects/:projectId/shortcuts/:shortcutId', shortcutControllers.destroy);

router.post('/uploads', multerMiddleware.array('photos'), (req:any, res:any) => {
  res.status(200).json(req.files);
});

router.get('/board/:id', boardController.show);

router.get('/labels/:projectId', labelController.index);
router.get('/tasks/:taskId/labels', labelController.index);
router.post('/tasks/:taskId/labels', labelController.store);
router.post('/labels', labelController.store);
router.put('/labels/:id', labelController.update);
router.delete('/labels/:id', labelController.delete);
module.exports = router;
