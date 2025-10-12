import { QueryInterface } from 'sequelize';

export default {
  async up(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.bulkInsert(
      'Publishers',
      [
        {
          id: 1,
          name: 'Marvel Comics',
          country: 'United States',
          foundedYear: 1939,
          website: 'https://www.marvel.com',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          name: 'DC Comics',
          country: 'United States',
          foundedYear: 1934,
          website: 'https://www.dc.com',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 3,
          name: 'Image Comics',
          country: 'United States',
          foundedYear: 1992,
          website: 'https://imagecomics.com',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 4,
          name: 'Dark Horse Comics',
          country: 'United States',
          foundedYear: 1986,
          website: 'https://www.darkhorse.com',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 5,
          name: 'IDW Publishing',
          country: 'United States',
          foundedYear: 1999,
          website: 'https://www.idwpublishing.com',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.bulkDelete(
      'Publishers',
      {
        id: [1, 2, 3, 4, 5],
      },
      {}
    );
  },
};
