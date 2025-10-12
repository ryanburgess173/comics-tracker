import { QueryInterface } from 'sequelize';

export default {
  async up(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.bulkInsert(
      'Universes',
      [
        {
          id: 1,
          name: 'Marvel Universe',
          description: 'The primary shared universe where most Marvel Comics stories take place',
          publisherId: 1, // Marvel Comics
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          name: 'DC Universe',
          description: 'The shared universe of DC Comics superheroes and stories',
          publisherId: 2, // DC Comics
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 3,
          name: 'Ultimate Universe',
          description: "Marvel's modernized reimagining of classic characters (Earth-1610)",
          publisherId: 1, // Marvel Comics
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 4,
          name: 'Image Universe',
          description: 'Shared universe for Image Comics characters',
          publisherId: 3, // Image Comics
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.bulkDelete(
      'Universes',
      {
        id: [1, 2, 3, 4],
      },
      {}
    );
  },
};
