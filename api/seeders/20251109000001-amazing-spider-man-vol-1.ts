import { QueryInterface } from 'sequelize';

export default {
  async up(queryInterface: QueryInterface): Promise<void> {
    // Add Steve Ditko and John Romita Sr. as creators (Stan Lee already exists with ID 1)
    await queryInterface.bulkInsert(
      'Creators',
      [
        {
          id: 16,
          name: 'Steve Ditko',
          creatorType: 'ARTIST',
          bio: 'Legendary comic book artist, co-creator of Spider-Man and Doctor Strange. Known for his distinctive art style.',
          birthDate: new Date('1927-11-02'),
          deathDate: new Date('2018-06-29'),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 17,
          name: 'John Romita Sr.',
          creatorType: 'ARTIST',
          bio: "Legendary comic book artist who succeeded Steve Ditko on Amazing Spider-Man and defined the character's look for decades.",
          birthDate: new Date('1930-01-24'),
          deathDate: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );

    // Insert the Amazing Spider-Man Vol 1 Run
    await queryInterface.bulkInsert(
      'Runs',
      [
        {
          id: 8,
          seriesName: 'The Amazing Spider-Man Vol 1',
          keyAuthorId: 1, // Stan Lee
          keyArtistId: 16, // Steve Ditko
          startDate: new Date('1963-03-01'),
          endDate: new Date('1998-11-01'),
          startIssue: 1,
          endIssue: 441,
          description:
            "The original and longest-running Spider-Man series, featuring Peter Parker's adventures from his high school days through college and beyond.",
          universeId: 2, // Marvel 616
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );

    // Insert Comics (Issues #1-50)
    await queryInterface.bulkInsert(
      'Comics',
      [
        {
          id: 1001,
          title: 'The Amazing Spider-Man #1',
          authorId: 1, // Stan Lee
          description: 'Spider-Man! - First appearance of J. Jonah Jameson and the Chameleon',
          imageUrl:
            'https://comics-tracker-2025.s3.us-east-1.amazonaws.com/amazingspiderman-1963-1.jpg',
          pages: 22,
          publisherId: 1, // Marvel Comics
          publishedDate: new Date('1963-03-01'),
          runId: 8,
          variant: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 1002,
          title: 'The Amazing Spider-Man #2',
          authorId: 1,
          description: 'Duel to the Death with the Vulture! - First appearance of the Vulture',
          imageUrl:
            'https://comics-tracker-2025.s3.us-east-1.amazonaws.com/amazingspiderman-1963-2.jpg',
          pages: 22,
          publisherId: 1,
          publishedDate: new Date('1963-05-01'),
          runId: 8,
          variant: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 1003,
          title: 'The Amazing Spider-Man #3',
          authorId: 1,
          description: 'Spider-Man Versus Doctor Octopus - First appearance of Doctor Octopus',
          imageUrl:
            'https://comics-tracker-2025.s3.us-east-1.amazonaws.com/amazingspiderman-1963-3.jpg',
          pages: 22,
          publisherId: 1,
          publishedDate: new Date('1963-07-01'),
          runId: 8,
          variant: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 1004,
          title: 'The Amazing Spider-Man #4',
          authorId: 1,
          description: 'Nothing Can Stop... the Sandman! - First appearance of the Sandman',
          imageUrl:
            'https://comics-tracker-2025.s3.us-east-1.amazonaws.com/amazingspiderman-1963-4.jpg',
          pages: 22,
          publisherId: 1,
          publishedDate: new Date('1963-09-01'),
          runId: 8,
          variant: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 1005,
          title: 'The Amazing Spider-Man #5',
          authorId: 1,
          description: 'Marked for Destruction by Dr. Doom! - Doctor Doom appearance',
          imageUrl:
            'https://comics-tracker-2025.s3.us-east-1.amazonaws.com/amazingspiderman-1963-5.jpg',
          pages: 22,
          publisherId: 1,
          publishedDate: new Date('1963-10-01'),
          runId: 8,
          variant: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 1006,
          title: 'The Amazing Spider-Man #6',
          authorId: 1,
          description: 'Face-to-Face with... the Lizard! - First appearance of the Lizard',
          imageUrl:
            'https://comics-tracker-2025.s3.us-east-1.amazonaws.com/amazingspiderman-1963-6.jpg',
          pages: 22,
          publisherId: 1,
          publishedDate: new Date('1963-11-01'),
          runId: 8,
          variant: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 1007,
          title: 'The Amazing Spider-Man #7',
          authorId: 1,
          description: 'The Return of the Vulture - Vulture returns',
          imageUrl:
            'https://comics-tracker-2025.s3.us-east-1.amazonaws.com/amazingspiderman-1963-7.jpg',
          pages: 22,
          publisherId: 1,
          publishedDate: new Date('1963-12-01'),
          runId: 8,
          variant: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 1008,
          title: 'The Amazing Spider-Man #8',
          authorId: 1,
          description: 'The Terrible Threat of the Living Brain!',
          imageUrl:
            'https://comics-tracker-2025.s3.us-east-1.amazonaws.com/amazingspiderman-1963-8.jpg',
          pages: 22,
          publisherId: 1,
          publishedDate: new Date('1964-01-01'),
          runId: 8,
          variant: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 1009,
          title: 'The Amazing Spider-Man #9',
          authorId: 1,
          description: 'The Man Called Electro! - First appearance of Electro',
          imageUrl:
            'https://comics-tracker-2025.s3.us-east-1.amazonaws.com/amazingspiderman-1963-9.jpg',
          pages: 22,
          publisherId: 1,
          publishedDate: new Date('1964-02-01'),
          runId: 8,
          variant: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 1010,
          title: 'The Amazing Spider-Man #10',
          authorId: 1,
          description: 'The Enforcers! - First appearance of the Enforcers',
          imageUrl:
            'https://comics-tracker-2025.s3.us-east-1.amazonaws.com/amazingspiderman-1963-10.jpg',
          pages: 22,
          publisherId: 1,
          publishedDate: new Date('1964-03-01'),
          runId: 8,
          variant: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 1011,
          title: 'The Amazing Spider-Man #11',
          authorId: 1,
          description: 'Turning Point - Second appearance of Doctor Octopus',
          imageUrl:
            'https://comics-tracker-2025.s3.us-east-1.amazonaws.com/amazingspiderman-1963-11.jpg',
          pages: 22,
          publisherId: 1,
          publishedDate: new Date('1964-04-01'),
          runId: 8,
          variant: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 1012,
          title: 'The Amazing Spider-Man #12',
          authorId: 1,
          description: 'Unmasked By Doctor Octopus!',
          imageUrl:
            'https://comics-tracker-2025.s3.us-east-1.amazonaws.com/amazingspiderman-1963-12.jpg',
          pages: 22,
          publisherId: 1,
          publishedDate: new Date('1964-05-01'),
          runId: 8,
          variant: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 1013,
          title: 'The Amazing Spider-Man #13',
          authorId: 1,
          description: 'The Menace of... Mysterio! - First appearance of Mysterio',
          imageUrl:
            'https://comics-tracker-2025.s3.us-east-1.amazonaws.com/amazingspiderman-1963-13.jpg',
          pages: 22,
          publisherId: 1,
          publishedDate: new Date('1964-06-01'),
          runId: 8,
          variant: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 1014,
          title: 'The Amazing Spider-Man #14',
          authorId: 1,
          description:
            'The Grotesque Adventure of the Green Goblin - First appearance of the Green Goblin',
          imageUrl: null,
          pages: 22,
          publisherId: 1,
          publishedDate: new Date('1964-07-01'),
          runId: 8,
          variant: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 1015,
          title: 'The Amazing Spider-Man #15',
          authorId: 1,
          description: 'Kraven the Hunter! - First appearance of Kraven the Hunter',
          imageUrl:
            'https://comics-tracker-2025.s3.us-east-1.amazonaws.com/amazingspiderman-1963-15.jpg',
          pages: 22,
          publisherId: 1,
          publishedDate: new Date('1964-08-01'),
          runId: 8,
          variant: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 1016,
          title: 'The Amazing Spider-Man #16',
          authorId: 1,
          description: 'Duel with Daredevil - First meeting with Daredevil',
          imageUrl:
            'https://comics-tracker-2025.s3.us-east-1.amazonaws.com/amazingspiderman-1963-16.jpg',
          pages: 22,
          publisherId: 1,
          publishedDate: new Date('1964-09-01'),
          runId: 8,
          variant: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 1017,
          title: 'The Amazing Spider-Man #17',
          authorId: 1,
          description: 'The Return of the Green Goblin!',
          imageUrl:
            'https://comics-tracker-2025.s3.us-east-1.amazonaws.com/amazingspiderman-1963-17.jpg',
          pages: 22,
          publisherId: 1,
          publishedDate: new Date('1964-10-01'),
          runId: 8,
          variant: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 1018,
          title: 'The Amazing Spider-Man #18',
          authorId: 1,
          description: 'The End of Spider-Man! - Sandman appearance',
          imageUrl:
            'https://comics-tracker-2025.s3.us-east-1.amazonaws.com/amazingspiderman-1963-18.jpg',
          pages: 22,
          publisherId: 1,
          publishedDate: new Date('1964-11-01'),
          runId: 8,
          variant: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 1019,
          title: 'The Amazing Spider-Man #19',
          authorId: 1,
          description: 'Spidey Strikes Back! - Sandman and Enforcers',
          imageUrl:
            'https://comics-tracker-2025.s3.us-east-1.amazonaws.com/amazingspiderman-1963-19.jpg',
          pages: 22,
          publisherId: 1,
          publishedDate: new Date('1964-12-01'),
          runId: 8,
          variant: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 1020,
          title: 'The Amazing Spider-Man #20',
          authorId: 1,
          description: 'The Coming of the Scorpion! - First appearance of the Scorpion',
          imageUrl:
            'https://comics-tracker-2025.s3.us-east-1.amazonaws.com/amazingspiderman-1963-20.jpg',
          pages: 22,
          publisherId: 1,
          publishedDate: new Date('1965-01-01'),
          runId: 8,
          variant: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 1021,
          title: 'The Amazing Spider-Man #21',
          authorId: 1,
          description: 'Where Flies the Beetle...! - First appearance of the Beetle',
          imageUrl:
            'https://comics-tracker-2025.s3.us-east-1.amazonaws.com/amazingspiderman-1963-21.jpg',
          pages: 22,
          publisherId: 1,
          publishedDate: new Date('1965-02-01'),
          runId: 8,
          variant: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 1022,
          title: 'The Amazing Spider-Man #22',
          authorId: 1,
          description: 'Preeeeeesenting...the Clown, and his Masters of Menace! - Circus of Crime',
          imageUrl:
            'https://comics-tracker-2025.s3.us-east-1.amazonaws.com/amazingspiderman-1963-22.jpg',
          pages: 22,
          publisherId: 1,
          publishedDate: new Date('1965-03-01'),
          runId: 8,
          variant: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 1023,
          title: 'The Amazing Spider-Man #23',
          authorId: 1,
          description: 'The Goblin and the Gangsters - Green Goblin appearance',
          imageUrl:
            'https://comics-tracker-2025.s3.us-east-1.amazonaws.com/amazingspiderman-1963-23.jpg',
          pages: 22,
          publisherId: 1,
          publishedDate: new Date('1965-04-01'),
          runId: 8,
          variant: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 1024,
          title: 'The Amazing Spider-Man #24',
          authorId: 1,
          description: 'Spider-Man Goes Mad! - Mysterio appearance',
          imageUrl:
            'https://comics-tracker-2025.s3.us-east-1.amazonaws.com/amazingspiderman-1963-24.jpg',
          pages: 22,
          publisherId: 1,
          publishedDate: new Date('1965-05-01'),
          runId: 8,
          variant: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 1025,
          title: 'The Amazing Spider-Man #25',
          authorId: 1,
          description: 'Captured By J.Jonah Jameson! - Spencer Smythe and Spider-Slayer',
          imageUrl:
            'https://comics-tracker-2025.s3.us-east-1.amazonaws.com/amazingspiderman-1963-25.jpg',
          pages: 22,
          publisherId: 1,
          publishedDate: new Date('1965-06-01'),
          runId: 8,
          variant: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 1026,
          title: 'The Amazing Spider-Man #26',
          authorId: 1,
          description: "The Man in the Crime-Master's Mask! - First appearance of Crime Master",
          imageUrl: null,
          pages: 22,
          publisherId: 1,
          publishedDate: new Date('1965-07-01'),
          runId: 8,
          variant: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 1027,
          title: 'The Amazing Spider-Man #27',
          authorId: 1,
          description: 'Bring Back My Goblin to Me! - Green Goblin appearance',
          imageUrl:
            'https://comics-tracker-2025.s3.us-east-1.amazonaws.com/amazingspiderman-1963-27.jpg',
          pages: 22,
          publisherId: 1,
          publishedDate: new Date('1965-08-01'),
          runId: 8,
          variant: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 1028,
          title: 'The Amazing Spider-Man #28',
          authorId: 1,
          description: 'The Menace of the Molten Man! - First appearance of the Molten Man',
          imageUrl:
            'https://comics-tracker-2025.s3.us-east-1.amazonaws.com/amazingspiderman-1963-28.jpg',
          pages: 22,
          publisherId: 1,
          publishedDate: new Date('1965-09-01'),
          runId: 8,
          variant: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 1029,
          title: 'The Amazing Spider-Man #29',
          authorId: 1,
          description: 'Never Step on a Scorpion! - Scorpion returns',
          imageUrl:
            'https://comics-tracker-2025.s3.us-east-1.amazonaws.com/amazingspiderman-1963-29.jpg',
          pages: 22,
          publisherId: 1,
          publishedDate: new Date('1965-10-01'),
          runId: 8,
          variant: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 1030,
          title: 'The Amazing Spider-Man #30',
          authorId: 1,
          description: 'The Claws of the Cat! - First appearance of the Cat Burglar',
          imageUrl:
            'https://comics-tracker-2025.s3.us-east-1.amazonaws.com/amazingspiderman-1963-30.jpg',
          pages: 22,
          publisherId: 1,
          publishedDate: new Date('1965-11-01'),
          runId: 8,
          variant: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 1031,
          title: 'The Amazing Spider-Man #31',
          authorId: 1,
          description: 'If This Be My Destiny...! - Classic story begins',
          imageUrl:
            'https://comics-tracker-2025.s3.us-east-1.amazonaws.com/amazingspiderman-1963-31.jpg',
          pages: 22,
          publisherId: 1,
          publishedDate: new Date('1965-12-01'),
          runId: 8,
          variant: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 1032,
          title: 'The Amazing Spider-Man #32',
          authorId: 1,
          description: 'Man on a Rampage! - Doctor Octopus',
          imageUrl:
            'https://comics-tracker-2025.s3.us-east-1.amazonaws.com/amazingspiderman-1963-32.jpg',
          pages: 22,
          publisherId: 1,
          publishedDate: new Date('1966-01-01'),
          runId: 8,
          variant: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 1033,
          title: 'The Amazing Spider-Man #33',
          authorId: 1,
          description: 'The Final Chapter! - Iconic "lifting the debris" scene',
          imageUrl:
            'https://comics-tracker-2025.s3.us-east-1.amazonaws.com/amazingspiderman-1963-33.jpg',
          pages: 22,
          publisherId: 1,
          publishedDate: new Date('1966-02-01'),
          runId: 8,
          variant: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 1034,
          title: 'The Amazing Spider-Man #34',
          authorId: 1,
          description: 'The Thrill of the Hunt! - Kraven the Hunter returns',
          imageUrl:
            'https://comics-tracker-2025.s3.us-east-1.amazonaws.com/amazingspiderman-1963-34.jpg',
          pages: 22,
          publisherId: 1,
          publishedDate: new Date('1966-03-01'),
          runId: 8,
          variant: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 1035,
          title: 'The Amazing Spider-Man #35',
          authorId: 1,
          description: 'The Molten Man Regrets...! - Molten Man returns',
          imageUrl:
            'https://comics-tracker-2025.s3.us-east-1.amazonaws.com/amazingspiderman-1963-35.jpg',
          pages: 22,
          publisherId: 1,
          publishedDate: new Date('1966-04-01'),
          runId: 8,
          variant: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 1036,
          title: 'The Amazing Spider-Man #36',
          authorId: 1,
          description: 'When Falls the Meteor! - Looter appearance',
          imageUrl:
            'https://comics-tracker-2025.s3.us-east-1.amazonaws.com/amazingspiderman-1963-36.jpg',
          pages: 22,
          publisherId: 1,
          publishedDate: new Date('1966-05-01'),
          runId: 8,
          variant: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 1037,
          title: 'The Amazing Spider-Man #37',
          authorId: 1,
          description: 'Once Upon A Time, There Was A Robot...! - Professor Stromm',
          imageUrl:
            'https://comics-tracker-2025.s3.us-east-1.amazonaws.com/amazingspiderman-1963-37.jpg',
          pages: 22,
          publisherId: 1,
          publishedDate: new Date('1966-06-01'),
          runId: 8,
          variant: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 1038,
          title: 'The Amazing Spider-Man #38',
          authorId: 1,
          description: 'Just A Guy Named Joe! - Joe Smith',
          imageUrl:
            'https://comics-tracker-2025.s3.us-east-1.amazonaws.com/amazingspiderman-1963-38.jpg',
          pages: 22,
          publisherId: 1,
          publishedDate: new Date('1966-07-01'),
          runId: 8,
          variant: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 1039,
          title: 'The Amazing Spider-Man #39',
          authorId: 1,
          description: 'How Green Was My Goblin! - Green Goblin identity revealed',
          imageUrl:
            'https://comics-tracker-2025.s3.us-east-1.amazonaws.com/amazingspiderman-1963-39.jpg',
          pages: 22,
          publisherId: 1,
          publishedDate: new Date('1966-08-01'),
          runId: 8,
          variant: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 1040,
          title: 'The Amazing Spider-Man #40',
          authorId: 1,
          description: 'Spidey Saves the Day! - End of the Green Goblin (temporarily)',
          imageUrl:
            'https://comics-tracker-2025.s3.us-east-1.amazonaws.com/amazingspiderman-1963-40.jpg',
          pages: 22,
          publisherId: 1,
          publishedDate: new Date('1966-09-01'),
          runId: 8,
          variant: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 1041,
          title: 'The Amazing Spider-Man #41',
          authorId: 1,
          description: 'The Horns of the Rhino! - First appearance of the Rhino',
          imageUrl:
            'https://comics-tracker-2025.s3.us-east-1.amazonaws.com/amazingspiderman-1963-41.jpg',
          pages: 22,
          publisherId: 1,
          publishedDate: new Date('1966-10-01'),
          runId: 8,
          variant: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 1042,
          title: 'The Amazing Spider-Man #42',
          authorId: 1,
          description: 'The Birth of a Super-Hero! - Mary Jane Watson face revealed',
          imageUrl:
            'https://comics-tracker-2025.s3.us-east-1.amazonaws.com/amazingspiderman-1963-42.jpg',
          pages: 22,
          publisherId: 1,
          publishedDate: new Date('1966-11-01'),
          runId: 8,
          variant: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 1043,
          title: 'The Amazing Spider-Man #43',
          authorId: 1,
          description: 'Rhino on the Rampage! - Rhino returns',
          imageUrl:
            'https://comics-tracker-2025.s3.us-east-1.amazonaws.com/amazingspiderman-1963-43.jpg',
          pages: 22,
          publisherId: 1,
          publishedDate: new Date('1966-12-01'),
          runId: 8,
          variant: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 1044,
          title: 'The Amazing Spider-Man #44',
          authorId: 1,
          description: 'Where Crawls the Lizard! - Lizard returns',
          imageUrl:
            'https://comics-tracker-2025.s3.us-east-1.amazonaws.com/amazingspiderman-1963-44.jpg',
          pages: 22,
          publisherId: 1,
          publishedDate: new Date('1967-01-01'),
          runId: 8,
          variant: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 1045,
          title: 'The Amazing Spider-Man #45',
          authorId: 1,
          description: 'Spidey Smashes Out! - Lizard conclusion',
          imageUrl:
            'https://comics-tracker-2025.s3.us-east-1.amazonaws.com/amazingspiderman-1963-45.jpg',
          pages: 22,
          publisherId: 1,
          publishedDate: new Date('1967-02-01'),
          runId: 8,
          variant: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 1046,
          title: 'The Amazing Spider-Man #46',
          authorId: 1,
          description: 'The Sinister Shocker! - First appearance of the Shocker',
          imageUrl:
            'https://comics-tracker-2025.s3.us-east-1.amazonaws.com/amazingspiderman-1963-46.jpg',
          pages: 22,
          publisherId: 1,
          publishedDate: new Date('1967-03-01'),
          runId: 8,
          variant: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 1047,
          title: 'The Amazing Spider-Man #47',
          authorId: 1,
          description: 'In the Hands of the Hunter! - Kraven the Hunter',
          imageUrl:
            'https://comics-tracker-2025.s3.us-east-1.amazonaws.com/amazingspiderman-1963-47.jpg',
          pages: 22,
          publisherId: 1,
          publishedDate: new Date('1967-04-01'),
          runId: 8,
          variant: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 1048,
          title: 'The Amazing Spider-Man #48',
          authorId: 1,
          description: 'The Wings of the Vulture! - Vulture and Blackie Drago',
          imageUrl:
            'https://comics-tracker-2025.s3.us-east-1.amazonaws.com/amazingspiderman-1963-48.jpg',
          pages: 22,
          publisherId: 1,
          publishedDate: new Date('1967-05-01'),
          runId: 8,
          variant: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 1049,
          title: 'The Amazing Spider-Man #49',
          authorId: 1,
          description: 'From the Depths of Defeat! - Vulture battle continues',
          imageUrl:
            'https://comics-tracker-2025.s3.us-east-1.amazonaws.com/amazingspiderman-1963-49.jpg',
          pages: 22,
          publisherId: 1,
          publishedDate: new Date('1967-06-01'),
          runId: 8,
          variant: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 1050,
          title: 'The Amazing Spider-Man #50',
          authorId: 1,
          description: 'Spider-Man No More! - Classic story where Peter quits being Spider-Man',
          imageUrl:
            'https://comics-tracker-2025.s3.us-east-1.amazonaws.com/amazingspiderman-1963-50.jpg',
          pages: 22,
          publisherId: 1,
          publishedDate: new Date('1967-07-01'),
          runId: 8,
          variant: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );

    // Insert Trade Paperbacks
    await queryInterface.bulkInsert(
      'TradePaperbacks',
      [
        {
          id: 9,
          title: 'Marvel Masterworks: The Amazing Spider-Man Vol. 1',
          coverImageUrl: null,
          description: 'Collects Amazing Spider-Man #1-10 and Amazing Fantasy #15',
          isbn: '9780785188346',
          publicationDate: new Date('2003-03-01'),
          publisherId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 10,
          title: 'Marvel Masterworks: The Amazing Spider-Man Vol. 2',
          coverImageUrl: null,
          description: 'Collects Amazing Spider-Man #11-19 and Annual #1',
          isbn: '9780785188353',
          publicationDate: new Date('2003-08-01'),
          publisherId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 11,
          title: 'Marvel Masterworks: The Amazing Spider-Man Vol. 3',
          coverImageUrl: null,
          description: 'Collects Amazing Spider-Man #20-30',
          isbn: '9780785188360',
          publicationDate: new Date('2004-02-01'),
          publisherId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 12,
          title: 'Marvel Masterworks: The Amazing Spider-Man Vol. 4',
          coverImageUrl: null,
          description: 'Collects Amazing Spider-Man #31-40 and Annual #2',
          isbn: '9780785188377',
          publicationDate: new Date('2004-08-01'),
          publisherId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 13,
          title: 'Marvel Masterworks: The Amazing Spider-Man Vol. 5',
          coverImageUrl: null,
          description: 'Collects Amazing Spider-Man #41-50',
          isbn: '9780785188384',
          publicationDate: new Date('2005-03-01'),
          publisherId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );

    // Insert cross-references for Trade Paperbacks
    await queryInterface.bulkInsert(
      'TradePaperbackComicXRefs',
      [
        // Marvel Masterworks Vol. 1 (TPB ID 9) - Issues #1-10
        {
          tradePaperbackId: 9,
          comicId: 1001,
          orderInCollection: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        }, // #1
        {
          tradePaperbackId: 9,
          comicId: 1002,
          orderInCollection: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        }, // #2
        {
          tradePaperbackId: 9,
          comicId: 1003,
          orderInCollection: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        }, // #3
        {
          tradePaperbackId: 9,
          comicId: 1004,
          orderInCollection: 4,
          createdAt: new Date(),
          updatedAt: new Date(),
        }, // #4
        {
          tradePaperbackId: 9,
          comicId: 1005,
          orderInCollection: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
        }, // #5
        {
          tradePaperbackId: 9,
          comicId: 1006,
          orderInCollection: 6,
          createdAt: new Date(),
          updatedAt: new Date(),
        }, // #6
        {
          tradePaperbackId: 9,
          comicId: 1007,
          orderInCollection: 7,
          createdAt: new Date(),
          updatedAt: new Date(),
        }, // #7
        {
          tradePaperbackId: 9,
          comicId: 1008,
          orderInCollection: 8,
          createdAt: new Date(),
          updatedAt: new Date(),
        }, // #8
        {
          tradePaperbackId: 9,
          comicId: 1009,
          orderInCollection: 9,
          createdAt: new Date(),
          updatedAt: new Date(),
        }, // #9
        {
          tradePaperbackId: 9,
          comicId: 1010,
          orderInCollection: 10,
          createdAt: new Date(),
          updatedAt: new Date(),
        }, // #10

        // Marvel Masterworks Vol. 2 (TPB ID 10) - Issues #11-19
        {
          tradePaperbackId: 10,
          comicId: 1011,
          orderInCollection: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        }, // #11
        {
          tradePaperbackId: 10,
          comicId: 1012,
          orderInCollection: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        }, // #12
        {
          tradePaperbackId: 10,
          comicId: 1013,
          orderInCollection: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        }, // #13
        {
          tradePaperbackId: 10,
          comicId: 1014,
          orderInCollection: 4,
          createdAt: new Date(),
          updatedAt: new Date(),
        }, // #14
        {
          tradePaperbackId: 10,
          comicId: 1015,
          orderInCollection: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
        }, // #15
        {
          tradePaperbackId: 10,
          comicId: 1016,
          orderInCollection: 6,
          createdAt: new Date(),
          updatedAt: new Date(),
        }, // #16
        {
          tradePaperbackId: 10,
          comicId: 1017,
          orderInCollection: 7,
          createdAt: new Date(),
          updatedAt: new Date(),
        }, // #17
        {
          tradePaperbackId: 10,
          comicId: 1018,
          orderInCollection: 8,
          createdAt: new Date(),
          updatedAt: new Date(),
        }, // #18
        {
          tradePaperbackId: 10,
          comicId: 1019,
          orderInCollection: 9,
          createdAt: new Date(),
          updatedAt: new Date(),
        }, // #19

        // Marvel Masterworks Vol. 3 (TPB ID 11) - Issues #20-30
        {
          tradePaperbackId: 11,
          comicId: 1020,
          orderInCollection: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        }, // #20
        {
          tradePaperbackId: 11,
          comicId: 1021,
          orderInCollection: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        }, // #21
        {
          tradePaperbackId: 11,
          comicId: 1022,
          orderInCollection: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        }, // #22
        {
          tradePaperbackId: 11,
          comicId: 1023,
          orderInCollection: 4,
          createdAt: new Date(),
          updatedAt: new Date(),
        }, // #23
        {
          tradePaperbackId: 11,
          comicId: 1024,
          orderInCollection: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
        }, // #24
        {
          tradePaperbackId: 11,
          comicId: 1025,
          orderInCollection: 6,
          createdAt: new Date(),
          updatedAt: new Date(),
        }, // #25
        {
          tradePaperbackId: 11,
          comicId: 1026,
          orderInCollection: 7,
          createdAt: new Date(),
          updatedAt: new Date(),
        }, // #26
        {
          tradePaperbackId: 11,
          comicId: 1027,
          orderInCollection: 8,
          createdAt: new Date(),
          updatedAt: new Date(),
        }, // #27
        {
          tradePaperbackId: 11,
          comicId: 1028,
          orderInCollection: 9,
          createdAt: new Date(),
          updatedAt: new Date(),
        }, // #28
        {
          tradePaperbackId: 11,
          comicId: 1029,
          orderInCollection: 10,
          createdAt: new Date(),
          updatedAt: new Date(),
        }, // #29
        {
          tradePaperbackId: 11,
          comicId: 1030,
          orderInCollection: 11,
          createdAt: new Date(),
          updatedAt: new Date(),
        }, // #30

        // Marvel Masterworks Vol. 4 (TPB ID 12) - Issues #31-40
        {
          tradePaperbackId: 12,
          comicId: 1031,
          orderInCollection: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        }, // #31
        {
          tradePaperbackId: 12,
          comicId: 1032,
          orderInCollection: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        }, // #32
        {
          tradePaperbackId: 12,
          comicId: 1033,
          orderInCollection: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        }, // #33
        {
          tradePaperbackId: 12,
          comicId: 1034,
          orderInCollection: 4,
          createdAt: new Date(),
          updatedAt: new Date(),
        }, // #34
        {
          tradePaperbackId: 12,
          comicId: 1035,
          orderInCollection: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
        }, // #35
        {
          tradePaperbackId: 12,
          comicId: 1036,
          orderInCollection: 6,
          createdAt: new Date(),
          updatedAt: new Date(),
        }, // #36
        {
          tradePaperbackId: 12,
          comicId: 1037,
          orderInCollection: 7,
          createdAt: new Date(),
          updatedAt: new Date(),
        }, // #37
        {
          tradePaperbackId: 12,
          comicId: 1038,
          orderInCollection: 8,
          createdAt: new Date(),
          updatedAt: new Date(),
        }, // #38
        {
          tradePaperbackId: 12,
          comicId: 1039,
          orderInCollection: 9,
          createdAt: new Date(),
          updatedAt: new Date(),
        }, // #39
        {
          tradePaperbackId: 12,
          comicId: 1040,
          orderInCollection: 10,
          createdAt: new Date(),
          updatedAt: new Date(),
        }, // #40

        // Marvel Masterworks Vol. 5 (TPB ID 13) - Issues #41-50
        {
          tradePaperbackId: 13,
          comicId: 1041,
          orderInCollection: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        }, // #41
        {
          tradePaperbackId: 13,
          comicId: 1042,
          orderInCollection: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        }, // #42
        {
          tradePaperbackId: 13,
          comicId: 1043,
          orderInCollection: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        }, // #43
        {
          tradePaperbackId: 13,
          comicId: 1044,
          orderInCollection: 4,
          createdAt: new Date(),
          updatedAt: new Date(),
        }, // #44
        {
          tradePaperbackId: 13,
          comicId: 1045,
          orderInCollection: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
        }, // #45
        {
          tradePaperbackId: 13,
          comicId: 1046,
          orderInCollection: 6,
          createdAt: new Date(),
          updatedAt: new Date(),
        }, // #46
        {
          tradePaperbackId: 13,
          comicId: 1047,
          orderInCollection: 7,
          createdAt: new Date(),
          updatedAt: new Date(),
        }, // #47
        {
          tradePaperbackId: 13,
          comicId: 1048,
          orderInCollection: 8,
          createdAt: new Date(),
          updatedAt: new Date(),
        }, // #48
        {
          tradePaperbackId: 13,
          comicId: 1049,
          orderInCollection: 9,
          createdAt: new Date(),
          updatedAt: new Date(),
        }, // #49
        {
          tradePaperbackId: 13,
          comicId: 1050,
          orderInCollection: 10,
          createdAt: new Date(),
          updatedAt: new Date(),
        }, // #50
      ],
      {}
    );
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    // Delete in reverse order of dependencies

    // Delete cross-references first
    await queryInterface.bulkDelete('TradePaperbackComicXRefs', {
      tradePaperbackId: [9, 10, 11, 12, 13],
    });

    // Delete Trade Paperbacks
    await queryInterface.bulkDelete('TradePaperbacks', {
      id: [9, 10, 11, 12, 13],
    });

    // Delete Comics
    await queryInterface.bulkDelete('Comics', {
      id: Array.from({ length: 50 }, (_, i) => 58 + i), // IDs 58-107
    });

    // Delete Run
    await queryInterface.bulkDelete('Runs', {
      id: 8,
    });

    // Delete Creators (Stan Lee with ID 1 is created in another seeder, so only delete Steve Ditko and John Romita Sr.)
    await queryInterface.bulkDelete('Creators', {
      id: [16, 17],
    });
  },
};
