import { QueryInterface } from 'sequelize';

export default {
  async up(queryInterface: QueryInterface): Promise<void> {
    // Insert Vader Down Trade Paperback
    await queryInterface.bulkInsert(
      'TradePaperbacks',
      [
        {
          id: 3,
          title: 'Star Wars: Vader Down',
          coverImageUrl: null,
          publicationDate: new Date('2016-04-19'),
          isbn: '9780785197898',
          description: 'Collects Vader Down #1, Star Wars #13-14, Darth Vader #13-15',
          pageCount: 144,
          publisherId: 1, // Marvel Comics
          volume: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );

    // Insert Vader Down #1 comic
    await queryInterface.bulkInsert(
      'Comics',
      [
        {
          id: 76,
          title: 'Vader Down #1',
          authorId: 11, // Jason Aaron
          description:
            'The opening chapter of the Vader Down crossover event. Darth Vader crashes on a planet and faces the entire Rebel Fleet alone.',
          imageUrl: null,
          pages: null,
          publisherId: 1, // Marvel Comics
          publishedDate: new Date('2015-11-18'),
          runId: 6, // Star Wars 2015 run (crossover event)
          variant: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );

    // Link all issues to Vader Down TPB (Vader Down #1, Star Wars #13-14, Darth Vader #13-15)
    await queryInterface.bulkInsert(
      'TradePaperbackComicXRefs',
      [
        // Vader Down #1
        {
          tradePaperbackId: 3,
          comicId: 76, // Vader Down #1
          orderInCollection: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        // Star Wars #13-14 (comicIds 13-14)
        {
          tradePaperbackId: 3,
          comicId: 13, // Star Wars #13
          orderInCollection: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          tradePaperbackId: 3,
          comicId: 14, // Star Wars #14
          orderInCollection: 4,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        // Darth Vader #13-15 (comicIds 113-115)
        {
          tradePaperbackId: 3,
          comicId: 113, // Darth Vader #13
          orderInCollection: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          tradePaperbackId: 3,
          comicId: 114, // Darth Vader #14
          orderInCollection: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          tradePaperbackId: 3,
          comicId: 115, // Darth Vader #15
          orderInCollection: 6,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    // Delete in reverse order due to foreign keys
    await queryInterface.bulkDelete(
      'TradePaperbackComicXRefs',
      {
        tradePaperbackId: 3,
      },
      {}
    );

    await queryInterface.bulkDelete(
      'TradePaperbacks',
      {
        id: 3,
      },
      {}
    );

    await queryInterface.bulkDelete(
      'Comics',
      {
        id: 76, // Vader Down #1
      },
      {}
    );
  },
};
