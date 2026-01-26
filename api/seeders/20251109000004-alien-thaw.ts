import { QueryInterface } from 'sequelize';

export default {
  async up(queryInterface: QueryInterface): Promise<void> {
    // Insert Creators
    await queryInterface.bulkInsert(
      'Creators',
      [
        {
          id: 23,
          name: 'Declan Shalvey',
          creatorType: 'AUTHOR',
          bio: 'Irish comic book artist and writer known for his work on Marvel Comics.',
          birthDate: null,
          deathDate: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 24,
          name: 'Andrea Broccardo',
          creatorType: 'ARTIST',
          bio: 'Italian comic book artist known for his work on Marvel Comics.',
          birthDate: null,
          deathDate: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );

    // Insert Run
    await queryInterface.bulkInsert(
      'Runs',
      [
        {
          id: 11,
          seriesName: 'Alien (2023)',
          keyAuthorId: 23, // Declan Shalvey
          keyArtistId: 24, // Andrea Broccardo
          startDate: new Date('2023-04-26'),
          endDate: new Date('2023-08-30'),
          startIssue: 1,
          endIssue: 5,
          description:
            "Marvel's Alien: Thaw follows scientist Batya Zahn and her family on the ice moon LV-695 as they discover a deadly white-colored Xenomorph buried in the ice.",
          universeId: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );

    // Insert Comics (Issues #1-5)
    await queryInterface.bulkInsert(
      'Comics',
      [
        {
          id: 4001,
          title: 'Alien #1',
          authorId: 23, // Declan Shalvey
          description:
            "Scientist Batya Zahn will do just about anything to get her family off the icy moon where they've been conducting research on water conservation. But there's more than glacial springs to find in this forgotten corner of the galaxy. When they discover an extraordinary organism buried in the ice, it won't take long for tensions to heat up.",
          imageUrl: 'https://comics-tracker-2025.s3.us-east-1.amazonaws.com/alien-thaw-1.jpg',
          pages: null,
          publisherId: 1, // Marvel Comics
          publishedDate: new Date('2023-04-26'),
          runId: 11,
          variant: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 4002,
          title: 'Alien #2',
          authorId: 23,
          description:
            "BETTER OFF BURIED! Talbot Engineering Inc. is under new management, but the organization's brilliant chief scientist, Batya Zhan, is not willing to give up her coded work to this unexpected threat without a fight. Over at Zhan's dig site, the intruders drill into the ice of the moon colony's surface only to discover hundreds of dark, black, frozen bodies.",
          imageUrl: 'https://comics-tracker-2025.s3.us-east-1.amazonaws.com/alien-thaw-2.jpeg',
          pages: null,
          publisherId: 1,
          publishedDate: new Date('2023-05-24'),
          runId: 11,
          variant: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 4003,
          title: 'Alien #3',
          authorId: 23,
          description:
            'SOMETHING WICKED IS COMING THEIR WAY... The USCSS Boreas has been infiltrated! A chestburster is wreaking havoc on base, leaving a trail of gore and eviscerated bodies in its wake. With their numbers dwindling, will the Weyland-Yutani security team be able to track the alien down before it becomes something even more deadly?',
          imageUrl: 'https://comics-tracker-2025.s3.us-east-1.amazonaws.com/alien-thaw-3.jpeg',
          pages: null,
          publisherId: 1,
          publishedDate: new Date('2023-06-28'),
          runId: 11,
          variant: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 4004,
          title: 'Alien #4',
          authorId: 23,
          description:
            'HOW FAR WOULD YOU SINK, TO SURVIVE? All hell has broken loose on base. As Xenomorphs swarm the rig - massacring any Weyland-Yutani personnel in sight - Batya makes a plan for an escape. With her research and family at risk, Batya must take a gamble and pursue her last option for salvation.',
          imageUrl: 'https://comics-tracker-2025.s3.us-east-1.amazonaws.com/alien-thaw-4.jpeg',
          pages: null,
          publisherId: 1,
          publishedDate: new Date('2023-07-26'),
          runId: 11,
          variant: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 4005,
          title: 'Alien #5',
          authorId: 23,
          description:
            'ONE LAST CHANCE TO ESCAPE THE THAW! With secrets revealed, loved ones lost and Xenomorphs engulfing the base – for a moment, Zasha thought all hope was gone. However, when a familiar face arrives in the form of a savior, the two set off for one last-ditch effort to escape the moon.',
          imageUrl: 'https://comics-tracker-2025.s3.us-east-1.amazonaws.com/alien-thaw-5.jpg',
          pages: null,
          publisherId: 1,
          publishedDate: new Date('2023-08-30'),
          runId: 11,
          variant: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );

    // Insert Trade Paperback
    await queryInterface.bulkInsert(
      'TradePaperbacks',
      [
        {
          id: 23,
          title: 'Alien Vol. 1: Thaw',
          coverImageUrl: null,
          publicationDate: new Date('2023-11-14'),
          isbn: null,
          description: 'Collects Alien (2023) #1-5',
          pageCount: null,
          publisherId: 1, // Marvel Comics
          volume: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );

    // Create relationships between Trade Paperback and Comics
    await queryInterface.bulkInsert(
      'TradePaperbackComicXRefs',
      [
        {
          tradePaperbackId: 23,
          comicId: 4002,
          orderInCollection: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          tradePaperbackId: 23,
          comicId: 4003,
          orderInCollection: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          tradePaperbackId: 23,
          comicId: 4004,
          orderInCollection: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          tradePaperbackId: 23,
          comicId: 4005,
          orderInCollection: 4,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          tradePaperbackId: 23,
          comicId: 4001,
          orderInCollection: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    // Delete in reverse order due to foreign keys
    await queryInterface.bulkDelete('TradePaperbackComicXRefs', { tradePaperbackId: 23 }, {});
    await queryInterface.bulkDelete('TradePaperbacks', { id: 23 }, {});
    await queryInterface.bulkDelete(
      'Comics',
      {
        id: Array.from({ length: 5 }, (_, i) => 171 + i),
      },
      {}
    );
    await queryInterface.bulkDelete('Runs', { id: 11 }, {});
    await queryInterface.bulkDelete('Creators', { id: [23, 24] }, {});
  },
};
