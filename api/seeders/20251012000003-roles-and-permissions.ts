import { QueryInterface } from 'sequelize';

export default {
  async up(queryInterface: QueryInterface): Promise<void> {
    // Create roles
    await queryInterface.bulkInsert(
      'Roles',
      [
        {
          id: 1,
          name: 'Admin',
          description: 'Full system access with all permissions',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          name: 'Editor',
          description: 'Can create, read, update comics, creators, publishers, and collections',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 3,
          name: 'Contributor',
          description: 'Can create and read content, but not delete',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 4,
          name: 'Reader',
          description: 'Read-only access to view comics and collections',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 5,
          name: 'Moderator',
          description: 'Can manage users and moderate content',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );

    // Admin gets all permissions (1-61)
    const adminPermissions = [];
    for (let i = 1; i <= 61; i++) {
      adminPermissions.push({
        roleId: 1,
        permissionId: i,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    await queryInterface.bulkInsert('RolePermissionXRefs', adminPermissions, {});

    // Editor permissions - full CRUD on content resources
    const editorPermissionIds = [
      // Comics: create, read, update, delete, list (1-5)
      1,
      2,
      3,
      4,
      5,
      // Creators: create, read, update, delete, list (6-10)
      6,
      7,
      8,
      9,
      10,
      // Publishers: create, read, update, delete, list (11-15)
      11,
      12,
      13,
      14,
      15,
      // Universes: create, read, update, delete, list (16-20)
      16,
      17,
      18,
      19,
      20,
      // Runs: create, read, update, delete, list (21-25)
      21,
      22,
      23,
      24,
      25,
      // Omnibuses: create, read, update, delete, list (26-30)
      26,
      27,
      28,
      29,
      30,
      // Trade Paperbacks: create, read, update, delete, list (31-35)
      31,
      32,
      33,
      34,
      35,
      // Collection management
      55,
      56,
      57,
      58, // addComics and removeComics for omnibuses and TPBs
    ];
    const editorPermissions = editorPermissionIds.map((permId) => ({
      roleId: 2,
      permissionId: permId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert('RolePermissionXRefs', editorPermissions, {});

    // Contributor permissions - create and read only
    const contributorPermissionIds = [
      // Comics: create, read, list (1, 2, 5)
      1,
      2,
      5,
      // Creators: create, read, list (6, 7, 10)
      6,
      7,
      10,
      // Publishers: read, list (12, 15)
      12,
      15,
      // Universes: read, list (17, 20)
      17,
      20,
      // Runs: create, read, list (21, 22, 25)
      21,
      22,
      25,
      // Omnibuses: create, read, list (26, 27, 30)
      26,
      27,
      30,
      // Trade Paperbacks: create, read, list (31, 32, 35)
      31,
      32,
      35,
      // Collection management - add only
      55,
      57, // addComics for omnibuses and TPBs
    ];
    const contributorPermissions = contributorPermissionIds.map((permId) => ({
      roleId: 3,
      permissionId: permId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert('RolePermissionXRefs', contributorPermissions, {});

    // Reader permissions - read and list only
    const readerPermissionIds = [
      // Comics: read, list (2, 5)
      2, 5,
      // Creators: read, list (7, 10)
      7, 10,
      // Publishers: read, list (12, 15)
      12, 15,
      // Universes: read, list (17, 20)
      17, 20,
      // Runs: read, list (22, 25)
      22, 25,
      // Omnibuses: read, list (27, 30)
      27, 30,
      // Trade Paperbacks: read, list (32, 35)
      32, 35,
    ];
    const readerPermissions = readerPermissionIds.map((permId) => ({
      roleId: 4,
      permissionId: permId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert('RolePermissionXRefs', readerPermissions, {});

    // Moderator permissions - user management + content moderation
    const moderatorPermissionIds = [
      // Users: create, read, update, list, resetPassword, activate (36-40, 51, 53)
      36,
      37,
      38,
      40,
      51,
      53,
      // Content - read, update, delete, list for moderation
      2,
      3,
      4,
      5, // Comics
      7,
      8,
      9,
      10, // Creators
      12,
      13,
      14,
      15, // Publishers
      17,
      18,
      19,
      20, // Universes
      22,
      23,
      24,
      25, // Runs
      27,
      28,
      29,
      30, // Omnibuses
      32,
      33,
      34,
      35, // Trade Paperbacks
    ];
    const moderatorPermissions = moderatorPermissionIds.map((permId) => ({
      roleId: 5,
      permissionId: permId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert('RolePermissionXRefs', moderatorPermissions, {});
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    // Delete role-permission associations first
    await queryInterface.bulkDelete('RolePermissionXRefs', {}, {});

    // Then delete roles
    await queryInterface.bulkDelete(
      'Roles',
      {
        id: [1, 2, 3, 4, 5],
      },
      {}
    );
  },
};
