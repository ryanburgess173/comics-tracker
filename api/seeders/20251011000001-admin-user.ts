import { QueryInterface } from 'sequelize';
import bcrypt from 'bcrypt';

export default {
  async up(queryInterface: QueryInterface): Promise<void> {
    const passwordHash = await bcrypt.hash('Admin123!', 10);

    // Check if admin user already exists to make seeder idempotent
    const [rows] = await queryInterface.sequelize.query(
      `SELECT id FROM "Users" WHERE email = 'ryanburgess173@outlook.com' LIMIT 1;`
    );
    const exists = Array.isArray(rows) && rows.length > 0;

    if (!exists) {
      await queryInterface.bulkInsert(
        'Users',
        [
          {
            username: 'admin',
            email: 'ryanburgess173@outlook.com',
            passwordHash: passwordHash,
            resetPasswordToken: null,
            resetPasswordExpires: null,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        {}
      );
    }
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.bulkDelete(
      'Users',
      {
        email: 'ryanburgess173@outlook.com',
      },
      {}
    );
  },
};
