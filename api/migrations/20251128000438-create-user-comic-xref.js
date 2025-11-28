'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('UserComicXRefs', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      comicId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Comics',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      status: {
        type: Sequelize.ENUM('WISHLIST', 'OWNED', 'READING', 'READ'),
        allowNull: false,
        defaultValue: 'OWNED',
      },
      dateAdded: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      dateStartedReading: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      dateFinished: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      rating: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: {
          min: 1,
          max: 5,
        },
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    // Add unique index for userId + comicId
    await queryInterface.addIndex('UserComicXRefs', ['userId', 'comicId'], {
      unique: true,
      name: 'user_comic_unique',
    });

    // Add index for userId + status (for filtering by status)
    await queryInterface.addIndex('UserComicXRefs', ['userId', 'status'], {
      name: 'user_status_idx',
    });

    // Add index for status (for global status queries)
    await queryInterface.addIndex('UserComicXRefs', ['status'], {
      name: 'status_idx',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('UserComicXRefs');
  },
};
