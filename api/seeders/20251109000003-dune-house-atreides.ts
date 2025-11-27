import { QueryInterface } from 'sequelize';

export const up = async (queryInterface: QueryInterface): Promise<void> => {
  // Insert Publisher (Boom! Studios)
  await queryInterface.bulkInsert('Publishers', [
    {
      id: 6,
      name: 'Boom! Studios',
      country: 'United States',
      foundedYear: 2005,
      website: 'https://www.boom-studios.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  // Insert Universe for Dune
  await queryInterface.bulkInsert('Universes', [
    {
      id: 6,
      name: 'Dune Universe',
      description:
        'The science fiction universe created by Frank Herbert, set in the distant future where noble houses control planetary fiefs.',
      publisherId: 6, // Boom! Studios
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  // Insert Creators
  await queryInterface.bulkInsert('Creators', [
    {
      id: 19,
      name: 'Brian Herbert',
      creatorType: 'AUTHOR',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 20,
      name: 'Kevin J. Anderson',
      creatorType: 'AUTHOR',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 21,
      name: 'Dev Pramanik',
      creatorType: 'ARTIST',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 22,
      name: 'Alex Guimarães',
      creatorType: 'ARTIST',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  // Insert Run for Dune: House Atreides
  await queryInterface.bulkInsert('Runs', [
    {
      id: 10,
      seriesName: 'Dune: House Atreides',
      keyAuthorId: 19, // Brian Herbert
      keyArtistId: 21, // Dev Pramanik
      universeId: 6, // Dune Universe
      startDate: new Date('2020-10-01'),
      endDate: new Date('2021-09-01'),
      startIssue: 1,
      endIssue: 12,
      description: 'Comic adaptation of the prequel novel by Brian Herbert and Kevin J. Anderson',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  // Insert Comics (Issues #1-12)
  await queryInterface.bulkInsert('Comics', [
    {
      id: 158,
      title: 'Dune: House Atreides #1',
      authorId: 19,
      description:
        "The beginning of the epic adaptation of the prequel to Frank Herbert's Dune. Witness the rise of House Atreides and the fall of House Harkonnen.",
      imageUrl: null,
      pages: null,
      publisherId: 6,
      publishedDate: new Date('2020-10-21'),
      runId: 10,
      variant: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 159,
      title: 'Dune: House Atreides #2',
      authorId: 19,
      description:
        'Leto Atreides continues his journey while the machinations of House Harkonnen unfold.',
      imageUrl: null,
      pages: null,
      publisherId: 6,
      publishedDate: new Date('2020-11-18'),
      runId: 10,
      variant: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 160,
      title: 'Dune: House Atreides #3',
      authorId: 19,
      description:
        'The conspiracy against House Atreides deepens as young Leto faces new challenges.',
      imageUrl: null,
      pages: null,
      publisherId: 6,
      publishedDate: new Date('2020-12-16'),
      runId: 10,
      variant: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 161,
      title: 'Dune: House Atreides #4',
      authorId: 19,
      description: "Duncan Idaho's story intertwines with the fate of House Atreides.",
      imageUrl: null,
      pages: null,
      publisherId: 6,
      publishedDate: new Date('2021-01-20'),
      runId: 10,
      variant: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 162,
      title: 'Dune: House Atreides #5',
      authorId: 19,
      description: "The Bene Gesserit's breeding program and political maneuvering come to light.",
      imageUrl: null,
      pages: null,
      publisherId: 6,
      publishedDate: new Date('2021-02-17'),
      runId: 10,
      variant: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 163,
      title: 'Dune: House Atreides #6',
      authorId: 19,
      description: "Baron Harkonnen's cruelty is revealed as House Atreides fights for survival.",
      imageUrl: null,
      pages: null,
      publisherId: 6,
      publishedDate: new Date('2021-03-17'),
      runId: 10,
      variant: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 164,
      title: 'Dune: House Atreides #7',
      authorId: 19,
      description:
        'Leto Atreides must make difficult choices that will shape the future of his house.',
      imageUrl: null,
      pages: null,
      publisherId: 6,
      publishedDate: new Date('2021-04-21'),
      runId: 10,
      variant: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 165,
      title: 'Dune: House Atreides #8',
      authorId: 19,
      description:
        'The spice mining operations on Arrakis become central to the conflict between houses.',
      imageUrl: null,
      pages: null,
      publisherId: 6,
      publishedDate: new Date('2021-05-19'),
      runId: 10,
      variant: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 166,
      title: 'Dune: House Atreides #9',
      authorId: 19,
      description:
        "Shaddam Corrino's ascension to Emperor brings new challenges for all Great Houses.",
      imageUrl: null,
      pages: null,
      publisherId: 6,
      publishedDate: new Date('2021-06-16'),
      runId: 10,
      variant: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 167,
      title: 'Dune: House Atreides #10',
      authorId: 19,
      description: 'The pieces are set for the final confrontation between Atreides and Harkonnen.',
      imageUrl: null,
      pages: null,
      publisherId: 6,
      publishedDate: new Date('2021-07-21'),
      runId: 10,
      variant: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 168,
      title: 'Dune: House Atreides #11',
      authorId: 19,
      description: 'Betrayal and sacrifice as the story builds to its climactic conclusion.',
      imageUrl: null,
      pages: null,
      publisherId: 6,
      publishedDate: new Date('2021-08-18'),
      runId: 10,
      variant: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 169,
      title: 'Dune: House Atreides #12',
      authorId: 19,
      description:
        "The epic conclusion as the foundations are laid for the events of Frank Herbert's Dune.",
      imageUrl: 'https://comics-tracker-2025.s3.us-east-1.amazonaws.com/dune-houseatreides-12.jpg',
      pages: null,
      publisherId: 6,
      publishedDate: new Date('2021-12-01'),
      runId: 10,
      variant: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  // Insert Trade Paperbacks
  await queryInterface.bulkInsert('TradePaperbacks', [
    {
      id: 19,
      title: 'Dune: House Atreides Volume 1',
      description: 'Collects Dune: House Atreides #1-4',
      publicationDate: new Date('2021-04-28'),
      isbn: '978-1684156627',
      publisherId: 6,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 20,
      title: 'Dune: House Atreides Volume 2',
      description: 'Collects Dune: House Atreides #5-8',
      publicationDate: new Date('2021-09-01'),
      isbn: '978-1684157426',
      publisherId: 6,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 21,
      title: 'Dune: House Atreides Volume 3',
      description: 'Collects Dune: House Atreides #9-12',
      publicationDate: new Date('2022-03-09'),
      isbn: '978-1684158294',
      publisherId: 6,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  // Insert Trade Paperback Comic Cross-References
  await queryInterface.bulkInsert('TradePaperbackComicXRefs', [
    // Volume 1 (Issues #1-4)
    {
      tradePaperbackId: 19,
      comicId: 158,
      orderInCollection: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      tradePaperbackId: 19,
      comicId: 159,
      orderInCollection: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      tradePaperbackId: 19,
      comicId: 160,
      orderInCollection: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      tradePaperbackId: 19,
      comicId: 161,
      orderInCollection: 4,
      createdAt: new Date(),
      updatedAt: new Date(),
    },

    // Volume 2 (Issues #5-8)
    {
      tradePaperbackId: 20,
      comicId: 162,
      orderInCollection: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      tradePaperbackId: 20,
      comicId: 163,
      orderInCollection: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      tradePaperbackId: 20,
      comicId: 164,
      orderInCollection: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      tradePaperbackId: 20,
      comicId: 165,
      orderInCollection: 4,
      createdAt: new Date(),
      updatedAt: new Date(),
    },

    // Volume 3 (Issues #9-12)
    {
      tradePaperbackId: 21,
      comicId: 166,
      orderInCollection: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      tradePaperbackId: 21,
      comicId: 167,
      orderInCollection: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      tradePaperbackId: 21,
      comicId: 168,
      orderInCollection: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      tradePaperbackId: 21,
      comicId: 169,
      orderInCollection: 4,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
};

export const down = async (queryInterface: QueryInterface): Promise<void> => {
  // Delete in reverse order to respect foreign key constraints
  await queryInterface.bulkDelete('TradePaperbackComicXRefs', { tradePaperbackId: [19, 20, 21] });
  await queryInterface.bulkDelete('TradePaperbacks', { id: [19, 20, 21] });
  await queryInterface.bulkDelete('Comics', { id: Array.from({ length: 12 }, (_, i) => 158 + i) });
  await queryInterface.bulkDelete('Runs', { id: 10 });
  await queryInterface.bulkDelete('Creators', { id: [19, 20, 21, 22] });
  await queryInterface.bulkDelete('Universes', { id: 6 });
  await queryInterface.bulkDelete('Publishers', { id: 6 });
};
