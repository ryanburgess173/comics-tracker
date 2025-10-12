import { QueryInterface } from 'sequelize';

export default {
  async up(queryInterface: QueryInterface): Promise<void> {
    // Get the admin user ID
    const [users]: any = await queryInterface.sequelize.query(
      `SELECT id FROM Users WHERE email = 'ryanburgess173@outlook.com' LIMIT 1;`
    );

    if (users.length === 0) {
      throw new Error('Admin user not found. Make sure the admin user seeder has run first.');
    }

    const adminUserId = users[0].id;

    // Get the Admin role ID
    const [roles]: any = await queryInterface.sequelize.query(
      `SELECT id FROM Roles WHERE name = 'Admin' LIMIT 1;`
    );

    if (roles.length === 0) {
      throw new Error('Admin role not found. Make sure the roles seeder has run first.');
    }

    const adminRoleId = roles[0].id;

    // Assign Admin role to admin user
    await queryInterface.bulkInsert(
      'UserRoleXRefs',
      [
        {
          userId: adminUserId,
          roleId: adminRoleId,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    // Get the admin user ID
    const [users]: any = await queryInterface.sequelize.query(
      `SELECT id FROM Users WHERE email = 'ryanburgess173@outlook.com' LIMIT 1;`
    );

    if (users.length > 0) {
      const adminUserId = users[0].id;

      // Remove Admin role from admin user
      await queryInterface.bulkDelete(
        'UserRoleXRefs',
        {
          userId: adminUserId,
        },
        {}
      );
    }
  },
};
