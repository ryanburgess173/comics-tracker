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

    // Comics marked as READ: 108-112, 58-61, 13-17
    const readComics = new Set([
      ...Array.from({ length: 5 }, (_, i) => i + 108), // 108-112
      ...Array.from({ length: 4 }, (_, i) => i + 58),  // 58-61
      ...Array.from({ length: 5 }, (_, i) => i + 13),  // 13-17
    ]);

    // All comic ranges to own (adjusted to only include existing comics starting from ID 13)
    const comicRanges = [
      [13, 27],    // 13-27 (comics 1-12 don't exist in the database)
      [31, 46],    // 31-46
      [58, 67],    // 58-67
      [108, 117],  // 108-117
      [158, 169],  // 158-169
      [170, 170],  // 170
      [171, 175],  // 171-175
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
