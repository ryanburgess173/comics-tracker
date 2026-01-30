import { QueryInterface, QueryTypes } from 'sequelize';

export default {
  async up(queryInterface: QueryInterface): Promise<void> {
    const now = new Date();
    const seedPublishers = [
      {
        id: 1,
        name: 'Marvel Comics',
        country: 'United States',
        foundedYear: 1939,
        website: 'https://www.marvel.com',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 2,
        name: 'DC Comics',
        country: 'United States',
        foundedYear: 1934,
        website: 'https://www.dc.com',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 3,
        name: 'Image Comics',
        country: 'United States',
        foundedYear: 1992,
        website: 'https://imagecomics.com',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 4,
        name: 'Dark Horse Comics',
        country: 'United States',
        foundedYear: 1986,
        website: 'https://www.darkhorse.com',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 5,
        name: 'IDW Publishing',
        country: 'United States',
        foundedYear: 1999,
        website: 'https://www.idwpublishing.com',
        createdAt: now,
        updatedAt: now,
      },
    ];

    // Fetch existing publishers to avoid unique constraint violations on reruns
    const rows = await queryInterface.sequelize.query('SELECT name FROM "Publishers";', {
      type: QueryTypes.SELECT,
    });
    const existingNames = new Set((rows as Array<{ name: string }>).map((r) => r.name));

    const toInsert = seedPublishers.filter((p) => !existingNames.has(p.name));
    if (toInsert.length > 0) {
      await queryInterface.bulkInsert('Publishers', toInsert, {});
    }
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.bulkDelete(
      'Publishers',
      {
        name: ['Marvel Comics', 'DC Comics', 'Image Comics', 'Dark Horse Comics', 'IDW Publishing'],
      },
      {}
    );
  },
};
