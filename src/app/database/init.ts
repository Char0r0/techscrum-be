export {};
const Role = require('../model/role');
const Permission = require('../model/permission');

exports.init = async (dbConnection:any) =>{
  
  const role = Role.getModel(dbConnection);
  const permission = Permission.getModel(dbConnection);
    
  const result = await role.find({ slug:'admin' });
  if (result.length > 0) {
    return;
  }
  
  const adminRole = new role({ name:'Admin', slug:'admin' });
  const developerRole = new role({ name:'Developer', slug:'developer' });
  const productManagerRole = new role({ name:'Product Manager', slug:'product-manager' });
  const guestRole = new role({ name:'Guest', slug:'guest' });

  await adminRole.save();
  await developerRole.save();
  await productManagerRole.save();
  await guestRole.save();

  const viewProjectPolicy = new permission({ slug: 'view:projects', description: 'View Project' });
  const editProjectPolicy = new permission({ slug: 'edit:projects', description: 'Edit Project' });
  const deleteProjectPolicy = new permission({ slug: 'delete:projects', description: 'Delete Project' });

  const viewBoardPolicy = new permission({ slug: 'view:boards', description: 'View Boards' });
  const editBoardPolicy = new permission({ slug: 'edit:boards', description: 'Edit Project' });
  const deleteBoardPolicy = new permission({ slug: 'delete:boards', description: 'Delete Project' });

  const addMemberPolicy = new permission({ slug: 'add:members', description: 'Add Members' });
  const viewMemberPolicy = new permission({ slug: 'view:members', description: 'View Members' });
  const editMemberPolicy = new permission({ slug: 'edit:members', description: 'Edit Members' });
  const deleteMemberPolicy = new permission({ slug: 'delete:members', description: 'Delete Members' });

  const addRolesPolicy = new permission({ slug: 'add:roles', description: 'Add Roles' });
  const viewRolesPolicy = new permission({ slug: 'view:roles', description: 'View Roles' });
  const editRolesPolicy = new permission({ slug: 'edit:roles', description: 'Edit Roles' });
  const deleteRolesPolicy = new permission({ slug: 'delete:roles', description: 'Delete Roles' });

  const addShortcutPolicy = new permission({ slug: 'add:shortcut', description: 'Add Shortcut' });
  const viewShortcutPolicy = new permission({ slug: 'view:shortcut', description: 'View Shortcut' });
  const editShortcutPolicy = new permission({ slug: 'edit:shortcut', description: 'Edit Shortcut' });
  const deleteShortcutPolicy = new permission({ slug: 'delete:shortcut', description: 'Delete Shortcut' });

  await viewProjectPolicy.save();
  await editProjectPolicy.save();
  await deleteProjectPolicy.save();
  await viewBoardPolicy.save();
  await editBoardPolicy.save();
  await deleteBoardPolicy.save();

  await addMemberPolicy.save();
  await viewMemberPolicy.save();
  await editMemberPolicy.save();
  await deleteMemberPolicy.save();

  await addRolesPolicy.save();
  await viewRolesPolicy.save();
  await editRolesPolicy.save();
  await deleteRolesPolicy.save();

  await addShortcutPolicy.save();
  await viewShortcutPolicy.save();
  await editShortcutPolicy.save();
  await deleteShortcutPolicy.save();
  ////////////////////////////////
  const permissions = [
    viewProjectPolicy._id, 
    editProjectPolicy._id, 
    deleteProjectPolicy._id, 
    viewBoardPolicy._id, 
    editBoardPolicy._id, 
    deleteBoardPolicy._id, 
    addMemberPolicy._id, 
    viewMemberPolicy._id,
    editMemberPolicy._id, 
    deleteMemberPolicy._id, 
    addRolesPolicy._id, 
    viewRolesPolicy._id, 
    editRolesPolicy._id, 
    deleteRolesPolicy._id, 
    addShortcutPolicy._id, 
    viewShortcutPolicy._id,
    editShortcutPolicy._id,
    deleteShortcutPolicy._id,
  ];


  const devPermissions = [
    viewProjectPolicy._id, 
    editProjectPolicy._id, 
    deleteProjectPolicy._id, 
    viewBoardPolicy._id, 
    editBoardPolicy._id, 
    deleteBoardPolicy._id, 
    addShortcutPolicy._id, 
    viewShortcutPolicy._id,
    editShortcutPolicy._id,
    deleteShortcutPolicy._id,
  ];


  const guestPermissions = [
    viewProjectPolicy._id, 
    viewBoardPolicy._id,  
    viewShortcutPolicy._id,
  ];

  adminRole.permission = permissions;
  productManagerRole.permission = permissions;
  developerRole.permission = devPermissions;
  guestRole.permission = guestPermissions;
  
  await adminRole.save();
  await productManagerRole.save();
  await developerRole.save();
  await guestRole.save();
};