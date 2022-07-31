const express = require('express');
const router = new express.Router();
const projectsController = require('../../controllers/v1/projects/projects');
const projectValidation = require('../../validations/project');
const tenantValidations = require('../../validations/tenant');
const tenantControllers = require('../../controllers/v1/tenant/tenant');
const {
  authenticationEmailTokenMiddleware,
  authenticationTokenMiddleware,
  authenticationTokenValidationMiddleware,
  authenticationRefreshTokenMiddleware,
} = require('../../middleware/auth');
const loginController = require('../../controllers/v1/login/login');
const loginValidation = require('../../validations/login');
const registerController = require('../../controllers/v1/register/register');
const registerValidation = require('../../validations/register');
const boardController = require('../../controllers/v1/board/board');
const boardValidation = require('../../validations/board');
const taskController = require('../../controllers/v1/task/task');
const taskValidation = require('../../validations/task');
const userControllers = require('../../controllers/v1/user/user');
const userValidation = require('../../validations/user');
const commentControllers = require('../../controllers/v1/comment/comment');
const commentValidation = require('../../validations/comment');
const accountSettingControllers = require('../../controllers/v1/accountSetting/accountSetting');
const accountSettingValidation = require('../../validations/accountSetting');
const shortcutControllers = require('../../controllers/v1/shortcut/shortcut');
const shortcutValidation = require('../../validations/shortcut');
const labelController = require('../../controllers/v1/label/label');
const labelValidation = require('../../validations/label');
const multerMiddleware = require('../../middleware/multer');
const saasMiddleware = require('../../middleware/saas');
const userPageControllers = require('../../controllers/v1/userPage/userPage');
const userPageValidation = require('../../validations/userPage');
const permissionMiddleware = require('../../middleware/permission');
const memberController = require('../../controllers/v1/member/member');
const memberValidation = require('../../validations/member');
const roleController = require('../../controllers/v1/role/role');
const roleValidation = require('../../validations/role');
const permissionController = require('../../controllers/v1/permission/permission');
const typeController = require('../../controllers/v1/type/type');
const contactController = require('../../controllers/v1/contact/contact');
const contactValidation = require('../../validations/contact');
const database = require('../../database/init');

router.post('/register/:email', registerValidation.register, registerController.register);
router.post('/contacts', contactValidation.store, contactController.store);
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

router.post('/login', loginValidation.login, loginController.login);

router.get('/register/:token', authenticationEmailTokenMiddleware, registerController.get);
router.put('/register/:token', registerValidation.store, authenticationEmailTokenMiddleware, registerController.store);
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
router.get('/users/:id', userValidation.show, userControllers.show);
// router.post('/users/:id', userControllers.update);
router.put('/users/:id', userPageValidation.update, userPageControllers.update);

// router.post('/tasks/:taskId/comments', commentControllers.store);
// router.put('/comments/:id', commentControllers.update);
// router.delete('/task/:taskId/comments/:commentId', commentControllers.destroy);
router.get('/commits/:id', commentControllers.show);
router.post('/commits', commentValidation.store, commentControllers.store);
router.put('/commits/:id', commentValidation.update, commentControllers.update);
router.delete('/commits/:id', commentValidation.remove, commentControllers.destroy);


// router.get('/tasks', task.index);
router.get('/tasks/:id', taskValidation.show, taskController.show);
router.post('/tasks', taskValidation.store, authenticationTokenMiddleware, taskController.store);
router.put('/tasks/:id', taskValidation.update, taskController.update);
router.delete('/tasks/:id', taskValidation.remove, taskController.delete);

router.put('/account/me', accountSettingValidation.update, authenticationTokenMiddleware, accountSettingControllers.update);
router.delete('/account/me', accountSettingValidation.remove, authenticationTokenMiddleware, accountSettingControllers.destroy);

router.post(
  '/auto-fetch-userInfo',
  authenticationTokenValidationMiddleware,
  authenticationRefreshTokenMiddleware,
  loginController.autoFetchUserInfo,
);

router.get('/projects', authenticationTokenMiddleware, projectsController.index);
router.get(
  '/projects/:id',
  authenticationTokenMiddleware,
  permissionMiddleware.permission('view:projects'),
  projectValidation.store,
  projectsController.show,
);
router.put(
  '/projects/:id',
  authenticationTokenMiddleware,
  permissionMiddleware.permission('edit:projects'),
  projectValidation.update,
  projectsController.update,
);
router.post('/projects', authenticationTokenMiddleware, projectsController.store);
router.delete(
  '/projects/:id',
  authenticationTokenMiddleware,
  permissionMiddleware.permission('delete:projects'),
  projectValidation.remove,
  projectsController.delete,
);


router.post('/projects/:id/shortcuts', shortcutValidation.store, shortcutControllers.store);
router.put('/projects/:projectId/shortcuts/:shortcutId', shortcutValidation.update, shortcutControllers.update);
router.delete('/projects/:projectId/shortcuts/:shortcutId', shortcutValidation.remove, shortcutControllers.destroy);

router.get('/projects/:id/members', memberController.index);
router.put('/projects/:projectId/members/:userId', memberValidation.update, memberController.update);
router.delete('/projects/:projectId/members/:userId', memberValidation.remove, memberController.delete);
router.post('/projects/:projectId/members/invite', memberValidation.invite, memberController.invite);
// router.get('/members', projects.index);

router.get('/roles', roleController.index);
router.put('/roles/:id/permissions/:permissionId', roleValidation.update, roleController.update);
router.get('/permissions', permissionController.index);
router.delete('/roles/:id/permissions/:permissionId', roleValidation.remove, roleController.remove);
router.post('/uploads', multerMiddleware.array('photos'), (req: any, res: any) => {
  res.status(200).json(req.files);
});

router.get('/types', typeController.index);

router.get('/board/:id', boardValidation.show, boardController.show);

router.get('/abc', async (req: any) => {
  // const Role = require('../../model/role');
  // const Permission = require('../../model/permission');

  database.init(req.dbConnection);
  // const role = Role.getModel(req.dbConnection);
  // const permission = Permission.getModel(req.dbConnection);

  // const viewRole = await role.findOne({ name:'view', slug:'view' });
  // const viewP = await permission.findOne({ slug: 'view:projects', description: 'view-project' });
  // viewRole.permission.push(viewP._id);
  // viewRole.save();
  // const adminRole = new role({ name:'admin', slug:'admin' });
  // const developerRole = new role({ name:'developer', slug:'developer' });
  // const projectManagerRole = new role({ name:'project-manager', slug:'project-manager' });
  // const viewRole = new role({ name:'view', slug:'view' });

  // adminRole.save();
  // developerRole.save();
  // projectManagerRole.save();
  // viewRole.save();

  // const viewProjectPolicy = new permission({ slug: 'view:projects', description: 'view-project' });
  // const editProjectPolicy = new permission({ slug: 'edit:projects', description: 'edit-project' });
  // const deleteProjectPolicy = new permission({ slug: 'delete:projects', description: 'delete-project' });
  // const addProjectPolicy = new permission({ slug: 'add:projects', description: 'add-project' });
});

router.get('/labels/:projectId', labelController.index);
router.get('/projects/:projectId/labels', labelController.index);
router.post('/tasks/:taskId/labels', labelValidation.store, labelController.store);
router.delete('/tasks/:taskId/labels/:labelId', labelValidation.eliminate, labelController.remove);
router.put('/labels/:id', labelValidation.update, labelController.update);
router.delete('/labels/:id', labelValidation.remove, labelController.delete);
module.exports = router;
