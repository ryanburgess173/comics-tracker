'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Get admin user ID
    const [adminUser] = await queryInterface.sequelize.query(
      `SELECT id FROM "Users" WHERE username = 'admin' LIMIT 1;`
    );
    
    if (!adminUser || adminUser.length === 0) {
      throw new Error('Admin user not found');
    }
    
    const adminId = adminUser[0].id;
    const now = new Date();

    // Comics marked as READ: Fantastic Four 2001-2005, Spider-Man 1001-1004, Star Wars 1-5
    const readComics = new Set([
      ...Array.from({ length: 5 }, (_, i) => i + 2001), // Fantastic Four 2001-2005
      ...Array.from({ length: 4 }, (_, i) => i + 1001),  // Spider-Man 1001-1004
      ...Array.from({ length: 5 }, (_, i) => i + 1),  // Star Wars 1-5
    ]);

    // All comic ranges to own (using new ID ranges)
    const comicRanges = [
      [1, 15],         // Star Wars 1-25
      [76, 76],        // Vader Down 76
      [101, 126],      // Darth Vader 101-126
      [1001, 1010],    // Spider-Man 1001-1010
      [2001, 2010],    // Fantastic Four 2001-2010
      [3001, 3012],    // Dune House Atreides 3001-3012
      [4001, 4005],    // Alien Thaw 4001-4005
    ];

    const userComicXRefs = [];

    for (const [start, end] of comicRanges) {
      for (let comicId = start; comicId <= end; comicId++) {
        const status = readComics.has(comicId) ? 'READ' : 'OWNED';
        userComicXRefs.push({
          userId: adminId,
          comicId: comicId,
          status: status,
          dateAdded: now,
          dateStartedReading: readComics.has(comicId) ? now : null,
          dateFinished: readComics.has(comicId) ? now : null,
          rating: null,
          notes: null,
          createdAt: now,
          updatedAt: now,
        });
      }
    }

    await queryInterface.bulkInsert('UserComicXRefs', userComicXRefs);
  },

  async down (queryInterface, Sequelize) {
    // Get admin user ID
    const [adminUser] = await queryInterface.sequelize.query(
      `SELECT id FROM "Users" WHERE username = 'admin' LIMIT 1;`
    );
    
    if (!adminUser || adminUser.length === 0) {
      return; // Admin user doesn't exist, nothing to delete
    }
    
    const adminId = adminUser[0].id;

    await queryInterface.bulkDelete('UserComicXRefs', {
      userId: adminId
    }, {});
  }
};
