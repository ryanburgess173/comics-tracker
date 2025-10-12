import { QueryInterface } from 'sequelize';

export default {
  async up(queryInterface: QueryInterface): Promise<void> {
    const permissions = [];
    let id = 1;

    // Define resources (major tables/models)
    const resources = [
      { name: 'comics', description: 'Comic books and issues' },
      { name: 'creators', description: 'Comic book creators (authors/artists)' },
      { name: 'publishers', description: 'Comic book publishers' },
      { name: 'universes', description: 'Comic book universes/continuities' },
      { name: 'runs', description: 'Comic book series runs' },
      { name: 'omnibuses', description: 'Omnibus collections' },
      { name: 'tradePaperbacks', description: 'Trade paperback collections' },
      { name: 'users', description: 'System users' },
      { name: 'roles', description: 'User roles' },
      { name: 'permissions', description: 'System permissions' },
    ];

    // Define actions
    const actions = [
      { action: 'create', description: 'Create new records' },
      { action: 'read', description: 'View/read records' },
      { action: 'update', description: 'Modify existing records' },
      { action: 'delete', description: 'Remove records' },
      { action: 'list', description: 'List/browse all records' },
    ];

    // Generate permissions for each resource + action combination
    resources.forEach((resource) => {
      actions.forEach((actionDef) => {
        permissions.push({
          id: id++,
          name: `${resource.name}:${actionDef.action}`,
          description: `${actionDef.description} for ${resource.description}`,
          resource: resource.name,
          action: actionDef.action,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });
    });

    // Add special permissions for specific operations
    const specialPermissions = [
      // User management
      {
        id: id++,
        name: 'users:resetPassword',
        description: 'Reset user passwords',
        resource: 'users',
        action: 'resetPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: id++,
        name: 'users:changeRole',
        description: 'Change user roles',
        resource: 'users',
        action: 'changeRole',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: id++,
        name: 'users:activate',
        description: 'Activate/deactivate user accounts',
        resource: 'users',
        action: 'activate',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Role management
      {
        id: id++,
        name: 'roles:assignPermissions',
        description: 'Assign permissions to roles',
        resource: 'roles',
        action: 'assignPermissions',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Collection management
      {
        id: id++,
        name: 'omnibuses:addComics',
        description: 'Add comics to omnibus collections',
        resource: 'omnibuses',
        action: 'addComics',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: id++,
        name: 'omnibuses:removeComics',
        description: 'Remove comics from omnibus collections',
        resource: 'omnibuses',
        action: 'removeComics',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: id++,
        name: 'tradePaperbacks:addComics',
        description: 'Add comics to trade paperback collections',
        resource: 'tradePaperbacks',
        action: 'addComics',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: id++,
        name: 'tradePaperbacks:removeComics',
        description: 'Remove comics from trade paperback collections',
        resource: 'tradePaperbacks',
        action: 'removeComics',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // System administration
      {
        id: id++,
        name: 'system:viewLogs',
        description: 'View system logs',
        resource: 'system',
        action: 'viewLogs',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: id++,
        name: 'system:manageSettings',
        description: 'Manage system settings',
        resource: 'system',
        action: 'manageSettings',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: id++,
        name: 'system:backup',
        description: 'Create system backups',
        resource: 'system',
        action: 'backup',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    permissions.push(...specialPermissions);

    // Insert all permissions
    await queryInterface.bulkInsert('Permissions', permissions, {});
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.bulkDelete('Permissions', {}, {});
  },
};
