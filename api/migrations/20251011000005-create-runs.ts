import { QueryInterface, DataTypes } from 'sequelize';

export default {
  async up(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.createTable('Runs', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      seriesName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      keyAuthorId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'Creators',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      keyArtistId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'Creators',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      startIssue: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      endIssue: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      universeId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'Universes',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    });

    await queryInterface.addIndex('Runs', ['seriesName']);
    await queryInterface.addIndex('Runs', ['universeId']);
    await queryInterface.addIndex('Runs', ['keyAuthorId']);
    await queryInterface.addIndex('Runs', ['keyArtistId']);
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.dropTable('Runs');
  },
};
