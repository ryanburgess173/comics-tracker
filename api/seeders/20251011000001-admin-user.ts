import { QueryInterface } from 'sequelize';
import bcrypt from 'bcrypt';

export default {
  async up(queryInterface: QueryInterface): Promise<void> {
    const passwordHash = await bcrypt.hash('Admin123!', 10);

    await queryInterface.bulkInsert(
      'Users',
      [
        {
          username: 'admin',
          email: 'admin@comics-tracker.com',
          passwordHash: passwordHash,
          resetPasswordToken: null,
          resetPasswordExpires: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.bulkDelete(
      'Users',
      {
        email: 'admin@comics-tracker.com',
      },
      {}
    );
  },
};
