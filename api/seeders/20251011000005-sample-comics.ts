import { QueryInterface } from 'sequelize';

export default {
  async up(queryInterface: QueryInterface): Promise<void> {
    // Insert Runs first
    await queryInterface.bulkInsert(
      'Runs',
      [
        {
          id: 1,
          seriesName: 'The Amazing Spider-Man',
          keyAuthorId: 1, // Stan Lee
          keyArtistId: 3, // Steve Ditko
          startDate: new Date('1963-03-01'),
          endDate: null,
          startIssue: 1,
          endIssue: null,
          description: 'The flagship Spider-Man series featuring Peter Parker',
          universeId: 1, // Marvel Universe
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          seriesName: 'Fantastic Four',
          keyAuthorId: 1, // Stan Lee
          keyArtistId: 2, // Jack Kirby
          startDate: new Date('1961-11-01'),
          endDate: new Date('1996-11-01'),
          startIssue: 1,
          endIssue: 416,
          description: 'The original Fantastic Four series',
          universeId: 1, // Marvel Universe
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 3,
          seriesName: 'Batman',
          keyAuthorId: 5, // Frank Miller
          keyArtistId: 8, // Jim Lee
          startDate: new Date('1940-04-01'),
          endDate: null,
          startIssue: 1,
          endIssue: null,
          description: 'The main Batman comic series',
          universeId: 2, // DC Universe
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 4,
          seriesName: 'The Sandman',
          keyAuthorId: 6, // Neil Gaiman
          keyArtistId: null,
          startDate: new Date('1989-01-01'),
          endDate: new Date('1996-03-01'),
          startIssue: 1,
          endIssue: 75,
          description: "Neil Gaiman's acclaimed Sandman series",
          universeId: 2, // DC Universe
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 5,
          seriesName: 'Ultimate Spider-Man',
          keyAuthorId: 10, // Brian Michael Bendis
          keyArtistId: null,
          startDate: new Date('2000-10-01'),
          endDate: new Date('2011-08-01'),
          startIssue: 1,
          endIssue: 160,
          description: 'Modern retelling of Spider-Man in the Ultimate Universe',
          universeId: 3, // Ultimate Universe
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );

    // Insert Comics
    await queryInterface.bulkInsert(
      'Comics',
      [
        // Amazing Spider-Man issues
        {
          id: 1,
          title: 'The Amazing Spider-Man #1',
          authorId: 1, // Stan Lee
          description:
            'First issue of The Amazing Spider-Man featuring the first appearance of J. Jonah Jameson',
          imageUrl: null,
          pages: 22,
          publisherId: 1, // Marvel Comics
          publishedDate: new Date('1963-03-01'),
          runId: 1,
          variant: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          title: 'The Amazing Spider-Man #50',
          authorId: 1, // Stan Lee
          description: 'Spider-Man No More! - Peter Parker quits being Spider-Man',
          imageUrl: null,
          pages: 20,
          publisherId: 1, // Marvel Comics
          publishedDate: new Date('1967-07-01'),
          runId: 1,
          variant: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 3,
          title: 'The Amazing Spider-Man #121',
          authorId: null, // Gerry Conway not in seed data
          description:
            'The Night Gwen Stacy Died - One of the most significant issues in Spider-Man history',
          imageUrl: null,
          pages: 20,
          publisherId: 1, // Marvel Comics
          publishedDate: new Date('1973-06-01'),
          runId: 1,
          variant: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        // Fantastic Four issues
        {
          id: 4,
          title: 'Fantastic Four #1',
          authorId: 1, // Stan Lee
          description: 'First appearance of the Fantastic Four',
          imageUrl: null,
          pages: 25,
          publisherId: 1, // Marvel Comics
          publishedDate: new Date('1961-11-01'),
          runId: 2,
          variant: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 5,
          title: 'Fantastic Four #5',
          authorId: 1, // Stan Lee
          description: 'First appearance of Doctor Doom',
          imageUrl: null,
          pages: 23,
          publisherId: 1, // Marvel Comics
          publishedDate: new Date('1962-07-01'),
          runId: 2,
          variant: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 6,
          title: 'Fantastic Four #48',
          authorId: 1, // Stan Lee
          description: 'First appearance of Galactus and Silver Surfer',
          imageUrl: null,
          pages: 20,
          publisherId: 1, // Marvel Comics
          publishedDate: new Date('1966-03-01'),
          runId: 2,
          variant: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        // Batman issues
        {
          id: 7,
          title: 'Batman #1',
          authorId: null, // Bill Finger not in seed data
          description: 'First appearances of the Joker and Catwoman',
          imageUrl: null,
          pages: 60,
          publisherId: 2, // DC Comics
          publishedDate: new Date('1940-04-25'),
          runId: 3,
          variant: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 8,
          title: 'Batman #404',
          authorId: 5, // Frank Miller
          description: 'Batman: Year One Part 1',
          imageUrl: null,
          pages: 22,
          publisherId: 2, // DC Comics
          publishedDate: new Date('1987-02-01'),
          runId: 3,
          variant: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        // Sandman issues
        {
          id: 9,
          title: 'The Sandman #1',
          authorId: 6, // Neil Gaiman
          description: 'Sleep of the Just - Introduction to Morpheus/Dream',
          imageUrl: null,
          pages: 24,
          publisherId: 2, // DC Comics
          publishedDate: new Date('1989-01-01'),
          runId: 4,
          variant: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 10,
          title: 'The Sandman #8',
          authorId: 6, // Neil Gaiman
          description: 'The Sound of Her Wings - Introduction to Death',
          imageUrl: null,
          pages: 24,
          publisherId: 2, // DC Comics
          publishedDate: new Date('1989-08-01'),
          runId: 4,
          variant: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        // Ultimate Spider-Man issues
        {
          id: 11,
          title: 'Ultimate Spider-Man #1',
          authorId: 10, // Brian Michael Bendis
          description: 'Powerless - Peter Parker gets his powers in the Ultimate Universe',
          imageUrl: null,
          pages: 32,
          publisherId: 1, // Marvel Comics
          publishedDate: new Date('2000-10-01'),
          runId: 5,
          variant: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 12,
          title: 'Ultimate Spider-Man #160',
          authorId: 10, // Brian Michael Bendis
          description: 'Death of Spider-Man conclusion',
          imageUrl: null,
          pages: 32,
          publisherId: 1, // Marvel Comics
          publishedDate: new Date('2011-08-01'),
          runId: 5,
          variant: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    // Delete Comics first (due to foreign key constraints)
    await queryInterface.bulkDelete(
      'Comics',
      {
        id: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      },
      {}
    );

    // Then delete Runs
    await queryInterface.bulkDelete(
      'Runs',
      {
        id: [1, 2, 3, 4, 5],
      },
      {}
    );
  },
};
