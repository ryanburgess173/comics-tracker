import { QueryInterface } from 'sequelize';

export default {
  async up(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.bulkInsert(
      'Creators',
      [
        {
          id: 1,
          name: 'Stan Lee',
          creatorType: 'AUTHOR',
          bio: 'Legendary Marvel Comics writer, editor, and publisher who co-created Spider-Man, X-Men, Fantastic Four, and many other iconic characters',
          birthDate: new Date('1922-12-28'),
          deathDate: new Date('2018-11-12'),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          name: 'Jack Kirby',
          creatorType: 'ARTIST',
          bio: 'Pioneering comic book artist and writer, co-creator of Captain America, Fantastic Four, X-Men, and the New Gods',
          birthDate: new Date('1917-08-28'),
          deathDate: new Date('1994-02-06'),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 3,
          name: 'Steve Ditko',
          creatorType: 'ARTIST',
          bio: 'Influential comic book artist and writer, co-creator of Spider-Man and Doctor Strange',
          birthDate: new Date('1927-11-02'),
          deathDate: new Date('2018-06-29'),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 4,
          name: 'Alan Moore',
          creatorType: 'AUTHOR',
          bio: 'British writer known for Watchmen, V for Vendetta, and The Killing Joke',
          birthDate: new Date('1953-11-18'),
          deathDate: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 5,
          name: 'Frank Miller',
          creatorType: 'AUTHOR',
          bio: 'Comic book writer and artist known for Daredevil, Batman: The Dark Knight Returns, and Sin City',
          birthDate: new Date('1957-01-27'),
          deathDate: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 6,
          name: 'Neil Gaiman',
          creatorType: 'AUTHOR',
          bio: 'British author known for The Sandman series and American Gods',
          birthDate: new Date('1960-11-10'),
          deathDate: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 7,
          name: 'Todd McFarlane',
          creatorType: 'ARTIST',
          bio: 'Comic book artist and writer, creator of Spawn and co-founder of Image Comics',
          birthDate: new Date('1961-03-16'),
          deathDate: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 8,
          name: 'Jim Lee',
          creatorType: 'ARTIST',
          bio: 'Korean-American comic book artist and publisher, known for X-Men and co-founder of Image Comics',
          birthDate: new Date('1964-08-11'),
          deathDate: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 9,
          name: 'Grant Morrison',
          creatorType: 'AUTHOR',
          bio: 'Scottish comic book writer known for All-Star Superman, Batman, and The Invisibles',
          birthDate: new Date('1960-01-31'),
          deathDate: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 10,
          name: 'Brian Michael Bendis',
          creatorType: 'AUTHOR',
          bio: 'American comic book writer known for Ultimate Spider-Man, Daredevil, and creating Miles Morales',
          birthDate: new Date('1967-08-18'),
          deathDate: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.bulkDelete(
      'Creators',
      {
        id: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      },
      {}
    );
  },
};
