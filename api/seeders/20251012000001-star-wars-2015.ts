import { QueryInterface } from 'sequelize';

export default {
  async up(queryInterface: QueryInterface): Promise<void> {
    // First, add Jason Aaron as a creator if not exists
    await queryInterface.bulkInsert(
      'Creators',
      [
        {
          id: 11,
          name: 'Jason Aaron',
          creatorType: 'AUTHOR',
          bio: 'American comic book writer known for Star Wars, Thor, and The Avengers',
          birthDate: new Date('1973-01-28'),
          deathDate: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 12,
          name: 'John Cassaday',
          creatorType: 'ARTIST',
          bio: 'American comic book artist known for Planetary, Astonishing X-Men, and Star Wars',
          birthDate: new Date('1971-12-14'),
          deathDate: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );

    // Add Star Wars Universe
    await queryInterface.bulkInsert(
      'Universes',
      [
        {
          id: 5,
          name: 'Star Wars Canon',
          description: 'The official Star Wars canon universe following Disney acquisition',
          publisherId: 1, // Marvel Comics
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );

    // Insert the Star Wars (2015) Run
    await queryInterface.bulkInsert(
      'Runs',
      [
        {
          id: 6,
          seriesName: 'Star Wars (2015)',
          keyAuthorId: 11, // Jason Aaron
          keyArtistId: 12, // John Cassaday
          startDate: new Date('2015-01-14'),
          endDate: new Date('2019-11-13'),
          startIssue: 1,
          endIssue: 75,
          description:
            "Marvel's flagship Star Wars series set between A New Hope and The Empire Strikes Back",
          universeId: 5, // Star Wars Canon
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );

    // Insert Star Wars (2015) Comics - First arc and notable issues
    await queryInterface.bulkInsert(
      'Comics',
      [
        {
          id: 1,
          title: 'Star Wars #1',
          authorId: 11, // Jason Aaron
          description:
            'Skywalker Strikes Part 1 - Luke, Leia, and Han raid an Imperial weapons factory',
          imageUrl: 'https://comics-tracker-2025.s3.us-east-1.amazonaws.com/starwars-2015-1.jpg',
          pages: 36,
          publisherId: 1, // Marvel Comics
          publishedDate: new Date('2015-01-14'),
          runId: 6,
          variant: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          title: 'Star Wars #2',
          authorId: 11, // Jason Aaron
          description: 'Skywalker Strikes Part 2 - The mission goes sideways',
          imageUrl: 'https://comics-tracker-2025.s3.us-east-1.amazonaws.com/starwars-2015-2.jpg',
          pages: 20,
          publisherId: 1, // Marvel Comics
          publishedDate: new Date('2015-02-11'),
          runId: 6,
          variant: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 3,
          title: 'Star Wars #3',
          authorId: 11, // Jason Aaron
          description: 'Skywalker Strikes Part 3 - Luke duels Darth Vader',
          imageUrl: 'https://comics-tracker-2025.s3.us-east-1.amazonaws.com/starwars-2015-3.jpg',
          pages: 20,
          publisherId: 1, // Marvel Comics
          publishedDate: new Date('2015-03-11'),
          runId: 6,
          variant: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 4,
          title: 'Star Wars #4',
          authorId: 11, // Jason Aaron
          description: 'Skywalker Strikes Part 4 - Escape from Cymoon 1',
          imageUrl: 'https://comics-tracker-2025.s3.us-east-1.amazonaws.com/starwars-2015-4.jpg',
          pages: 20,
          publisherId: 1, // Marvel Comics
          publishedDate: new Date('2015-04-08'),
          runId: 6,
          variant: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 5,
          title: 'Star Wars #5',
          authorId: 11, // Jason Aaron
          description: 'Skywalker Strikes Part 5 - A plan falls apart',
          imageUrl: 'https://comics-tracker-2025.s3.us-east-1.amazonaws.com/starwars-2015-5.jpg',
          pages: 20,
          publisherId: 1, // Marvel Comics
          publishedDate: new Date('2015-05-13'),
          runId: 6,
          variant: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 6,
          title: 'Star Wars #6',
          authorId: 11, // Jason Aaron
          description: 'Skywalker Strikes Conclusion - Final confrontation',
          imageUrl: 'https://comics-tracker-2025.s3.us-east-1.amazonaws.com/starwars-2015-6.jpg',
          pages: 20,
          publisherId: 1, // Marvel Comics
          publishedDate: new Date('2015-06-10'),
          runId: 6,
          variant: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 7,
          title: 'Star Wars #7',
          authorId: 11, // Jason Aaron
          description: 'From the Journals of Old Ben Kenobi - Obi-Wan on Tatooine',
          imageUrl: 'https://comics-tracker-2025.s3.us-east-1.amazonaws.com/starwars-2015-7.jpg',
          pages: 20,
          publisherId: 1, // Marvel Comics
          publishedDate: new Date('2015-07-08'),
          runId: 6,
          variant: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 8,
          title: 'Star Wars #8',
          authorId: 11, // Jason Aaron
          description: "Showdown on the Smuggler's Moon Part 1",
          imageUrl: 'https://comics-tracker-2025.s3.us-east-1.amazonaws.com/starwars-2015-8.jpg',
          pages: 20,
          publisherId: 1, // Marvel Comics
          publishedDate: new Date('2015-08-12'),
          runId: 6,
          variant: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 9,
          title: 'Star Wars #9',
          authorId: 11, // Jason Aaron
          description: "Showdown on the Smuggler's Moon Part 2",
          imageUrl: 'https://comics-tracker-2025.s3.us-east-1.amazonaws.com/starwars-2015-9.jpg',
          pages: 20,
          publisherId: 1, // Marvel Comics
          publishedDate: new Date('2015-09-09'),
          runId: 6,
          variant: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 10,
          title: 'Star Wars #10',
          authorId: 11, // Jason Aaron
          description: "Showdown on the Smuggler's Moon Part 3",
          imageUrl: 'https://comics-tracker-2025.s3.us-east-1.amazonaws.com/starwars-2015-10.jpg',
          pages: 20,
          publisherId: 1, // Marvel Comics
          publishedDate: new Date('2015-10-14'),
          runId: 6,
          variant: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 11,
          title: 'Star Wars #11',
          authorId: 11, // Jason Aaron
          description: "Showdown on the Smuggler's Moon Part 4",
          imageUrl: 'https://comics-tracker-2025.s3.us-east-1.amazonaws.com/starwars-2015-11.jpg',
          pages: 20,
          publisherId: 1, // Marvel Comics
          publishedDate: new Date('2015-11-11'),
          runId: 6,
          variant: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 12,
          title: 'Star Wars #12',
          authorId: 11, // Jason Aaron
          description: "Showdown on the Smuggler's Moon Conclusion",
          imageUrl: 'https://comics-tracker-2025.s3.us-east-1.amazonaws.com/starwars-2015-12.jpg',
          pages: 20,
          publisherId: 1, // Marvel Comics
          publishedDate: new Date('2015-12-09'),
          runId: 6,
          variant: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 13,
          title: 'Star Wars #13',
          authorId: 11, // Jason Aaron
          description: 'Vader Down, Part III - The Dark Lord crashes',
          imageUrl: 'https://comics-tracker-2025.s3.us-east-1.amazonaws.com/starwars-2015-13.jpg',
          pages: 20,
          publisherId: 1, // Marvel Comics
          publishedDate: new Date('2015-12-02'),
          runId: 6,
          variant: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 14,
          title: 'Star Wars #14',
          authorId: 11, // Jason Aaron
          description: 'Vader Down, Part V - Facing overwhelming odds',
          imageUrl: 'https://comics-tracker-2025.s3.us-east-1.amazonaws.com/starwars-2015-14.jpg',
          pages: 20,
          publisherId: 1, // Marvel Comics
          publishedDate: new Date('2016-01-06'),
          runId: 6,
          variant: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 15,
          title: 'Star Wars #15',
          authorId: 11, // Jason Aaron
          description: 'From the Journals of Old Ben Kenobi: The Last of His Breed',
          imageUrl: 'https://comics-tracker-2025.s3.us-east-1.amazonaws.com/starwars-2015-15.jpg',
          pages: 20,
          publisherId: 1, // Marvel Comics
          publishedDate: new Date('2016-01-20'),
          runId: 6,
          variant: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 16,
          title: 'Star Wars #16',
          authorId: 11, // Jason Aaron
          description: 'Rebel Jail, Part I - A mysterious prison',
          imageUrl: 'https://comics-tracker-2025.s3.us-east-1.amazonaws.com/starwars-2015-16.jpg',
          pages: 20,
          publisherId: 1, // Marvel Comics
          publishedDate: new Date('2016-02-17'),
          runId: 6,
          variant: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 17,
          title: 'Star Wars #17',
          authorId: 11, // Jason Aaron
          description: 'Rebel Jail, Part II - Secrets revealed',
          imageUrl: 'https://comics-tracker-2025.s3.us-east-1.amazonaws.com/starwars-2015-17.jpg',
          pages: 20,
          publisherId: 1, // Marvel Comics
          publishedDate: new Date('2016-03-23'),
          runId: 6,
          variant: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 18,
          title: 'Star Wars #18',
          authorId: 11, // Jason Aaron
          description: 'Rebel Jail, Part III - Escape attempt',
          imageUrl: 'https://comics-tracker-2025.s3.us-east-1.amazonaws.com/starwars-2015-18.jpg',
          pages: 20,
          publisherId: 1, // Marvel Comics
          publishedDate: new Date('2016-04-27'),
          runId: 6,
          variant: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 19,
          title: 'Star Wars #19',
          authorId: 11, // Jason Aaron
          description: 'Rebel Jail, Part IV - Final confrontation',
          imageUrl: 'https://comics-tracker-2025.s3.us-east-1.amazonaws.com/starwars-2015-19.jpg',
          pages: 20,
          publisherId: 1, // Marvel Comics
          publishedDate: new Date('2016-05-25'),
          runId: 6,
          variant: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 20,
          title: 'Star Wars #20',
          authorId: 11, // Jason Aaron
          description: 'From the Journals of Old Ben Kenobi: The Last of His Breed, Part II',
          imageUrl: 'https://comics-tracker-2025.s3.us-east-1.amazonaws.com/starwars-2015-20.jpg',
          pages: 20,
          publisherId: 1, // Marvel Comics
          publishedDate: new Date('2016-06-22'),
          runId: 6,
          variant: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 21,
          title: 'Star Wars #21',
          authorId: 11, // Jason Aaron
          description: 'The Last Flight of the Harbinger, Part I',
          imageUrl: 'https://comics-tracker-2025.s3.us-east-1.amazonaws.com/starwars-2015-21.jpg',
          pages: 20,
          publisherId: 1, // Marvel Comics
          publishedDate: new Date('2016-07-27'),
          runId: 6,
          variant: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 22,
          title: 'Star Wars #22',
          authorId: 11, // Jason Aaron
          description: 'The Last Flight of the Harbinger, Part II',
          imageUrl: 'https://comics-tracker-2025.s3.us-east-1.amazonaws.com/starwars-2015-22.jpg',
          pages: 20,
          publisherId: 1, // Marvel Comics
          publishedDate: new Date('2016-08-24'),
          runId: 6,
          variant: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 23,
          title: 'Star Wars #23',
          authorId: 11, // Jason Aaron
          description: 'The Last Flight of the Harbinger, Part III',
          imageUrl: 'https://comics-tracker-2025.s3.us-east-1.amazonaws.com/starwars-2015-23.jpg',
          pages: 20,
          publisherId: 1, // Marvel Comics
          publishedDate: new Date('2016-09-21'),
          runId: 6,
          variant: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 24,
          title: 'Star Wars #24',
          authorId: 11, // Jason Aaron
          description: 'The Last Flight of the Harbinger, Part IV',
          imageUrl: 'https://comics-tracker-2025.s3.us-east-1.amazonaws.com/starwars-2015-24.jpg',
          pages: 20,
          publisherId: 1, // Marvel Comics
          publishedDate: new Date('2016-10-19'),
          runId: 6,
          variant: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 25,
          title: 'Star Wars #25',
          authorId: 11, // Jason Aaron
          description: 'The Last Flight of the Harbinger, Part V',
          imageUrl: 'https://comics-tracker-2025.s3.us-east-1.amazonaws.com/starwars-2015-25.jpg',
          pages: 20,
          publisherId: 1, // Marvel Comics
          publishedDate: new Date('2016-11-23'),
          runId: 6,
          variant: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );

    // Insert Trade Paperbacks for Star Wars (2015)
    await queryInterface.bulkInsert(
      'TradePaperbacks',
      [
        {
          id: 1,
          title: 'Star Wars Vol. 1: Skywalker Strikes',
          coverImageUrl: null,
          publicationDate: new Date('2015-08-11'),
          isbn: '9780785192138',
          description: 'Collects Star Wars #1-6',
          pageCount: 160,
          publisherId: 1, // Marvel Comics
          volume: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          title: "Star Wars Vol. 2: Showdown on the Smuggler's Moon",
          coverImageUrl: null,
          publicationDate: new Date('2016-01-26'),
          isbn: '9780785192169',
          description: 'Collects Star Wars #7-12',
          pageCount: 152,
          publisherId: 1, // Marvel Comics
          volume: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 4,
          title: 'Star Wars Vol. 3: Rebel Jail',
          coverImageUrl: null,
          publicationDate: new Date('2016-08-16'),
          isbn: '9780785199830',
          description: 'Collects Star Wars #15-19, Star Wars Annual #1',
          pageCount: 136,
          publisherId: 1, // Marvel Comics
          volume: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );

    // Insert Omnibus editions
    await queryInterface.bulkInsert(
      'Omnibuses',
      [
        {
          id: 1,
          title: 'Star Wars by Jason Aaron Omnibus',
          coverImageUrl: null,
          publicationDate: new Date('2022-11-29'),
          isbn: '9781302946616',
          description: 'The complete Jason Aaron run collecting Star Wars #1-37 and Annual #1-2',
          pageCount: 920,
          publisherId: 1, // Marvel Comics
          volume: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          title: 'Star Wars Legends Epic Collection: The Empire Vol. 1',
          coverImageUrl: null,
          publicationDate: new Date('2015-12-01'),
          isbn: '9780785193555',
          description: 'Collects classic Star Wars stories from the original Marvel run',
          pageCount: 504,
          publisherId: 1, // Marvel Comics
          volume: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );

    // Create relationships between Trade Paperbacks and Comics
    await queryInterface.bulkInsert(
      'TradePaperbackComicXRefs',
      [
        // Vol. 1: Skywalker Strikes (Issues #1-6)
        {
          tradePaperbackId: 1,
          comicId: 1,
          orderInCollection: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          tradePaperbackId: 1,
          comicId: 2,
          orderInCollection: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          tradePaperbackId: 1,
          comicId: 3,
          orderInCollection: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          tradePaperbackId: 1,
          comicId: 4,
          orderInCollection: 4,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          tradePaperbackId: 1,
          comicId: 5,
          orderInCollection: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          tradePaperbackId: 1,
          comicId: 6,
          orderInCollection: 6,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        // Vol. 2: Showdown on Smuggler's Moon (Issues #7-12)
        {
          tradePaperbackId: 2,
          comicId: 7,
          orderInCollection: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          tradePaperbackId: 2,
          comicId: 8,
          orderInCollection: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          tradePaperbackId: 2,
          comicId: 9,
          orderInCollection: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          tradePaperbackId: 2,
          comicId: 10,
          orderInCollection: 4,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          tradePaperbackId: 2,
          comicId: 11,
          orderInCollection: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          tradePaperbackId: 2,
          comicId: 12,
          orderInCollection: 6,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        // Vol. 3: Rebel Jail (Issues #15-19)
        {
          tradePaperbackId: 4,
          comicId: 15,
          orderInCollection: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          tradePaperbackId: 4,
          comicId: 16,
          orderInCollection: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          tradePaperbackId: 4,
          comicId: 17,
          orderInCollection: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          tradePaperbackId: 4,
          comicId: 18,
          orderInCollection: 4,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          tradePaperbackId: 4,
          comicId: 19,
          orderInCollection: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );

    // Create relationships between Omnibus and Comics
    await queryInterface.bulkInsert(
      'OmnibusComicXRefs',
      [
        // Star Wars by Jason Aaron Omnibus includes issues #1-25
        {
          omnibusId: 1,
          comicId: 1,
          orderInCollection: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          omnibusId: 1,
          comicId: 2,
          orderInCollection: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          omnibusId: 1,
          comicId: 3,
          orderInCollection: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          omnibusId: 1,
          comicId: 4,
          orderInCollection: 4,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          omnibusId: 1,
          comicId: 5,
          orderInCollection: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          omnibusId: 1,
          comicId: 6,
          orderInCollection: 6,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          omnibusId: 1,
          comicId: 7,
          orderInCollection: 7,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          omnibusId: 1,
          comicId: 8,
          orderInCollection: 8,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          omnibusId: 1,
          comicId: 9,
          orderInCollection: 9,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          omnibusId: 1,
          comicId: 10,
          orderInCollection: 10,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          omnibusId: 1,
          comicId: 11,
          orderInCollection: 11,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          omnibusId: 1,
          comicId: 12,
          orderInCollection: 12,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          omnibusId: 1,
          comicId: 13,
          orderInCollection: 13,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          omnibusId: 1,
          comicId: 14,
          orderInCollection: 14,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          omnibusId: 1,
          comicId: 15,
          orderInCollection: 15,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          omnibusId: 1,
          comicId: 16,
          orderInCollection: 16,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          omnibusId: 1,
          comicId: 17,
          orderInCollection: 17,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          omnibusId: 1,
          comicId: 18,
          orderInCollection: 18,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          omnibusId: 1,
          comicId: 19,
          orderInCollection: 19,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          omnibusId: 1,
          comicId: 20,
          orderInCollection: 20,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          omnibusId: 1,
          comicId: 21,
          orderInCollection: 21,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          omnibusId: 1,
          comicId: 22,
          orderInCollection: 22,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          omnibusId: 1,
          comicId: 23,
          orderInCollection: 23,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          omnibusId: 1,
          comicId: 24,
          orderInCollection: 24,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          omnibusId: 1,
          comicId: 25,
          orderInCollection: 25,
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
      'OmnibusComicXRefs',
      {
        omnibusId: [1, 2],
      },
      {}
    );

    await queryInterface.bulkDelete(
      'TradePaperbackComicXRefs',
      {
        tradePaperbackId: [1, 2, 4],
      },
      {}
    );

    await queryInterface.bulkDelete(
      'Omnibuses',
      {
        id: [1, 2],
      },
      {}
    );

    await queryInterface.bulkDelete(
      'TradePaperbacks',
      {
        id: [1, 2, 4],
      },
      {}
    );

    await queryInterface.bulkDelete(
      'Comics',
      {
        id: [
          1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25,
        ],
      },
      {}
    );

    await queryInterface.bulkDelete(
      'Runs',
      {
        id: 6,
      },
      {}
    );

    await queryInterface.bulkDelete(
      'Universes',
      {
        id: 5,
      },
      {}
    );

    await queryInterface.bulkDelete(
      'Creators',
      {
        id: [11, 12],
      },
      {}
    );
  },
};
