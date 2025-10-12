import { QueryInterface, DataTypes } from 'sequelize';

export default {
  async up(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.createTable('TradePaperbacks', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      coverImageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      publicationDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      isbn: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      pageCount: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      publisher: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      volume: {
        type: DataTypes.INTEGER,
        allowNull: true,
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

    await queryInterface.addIndex('TradePaperbacks', ['title']);
    await queryInterface.addIndex('TradePaperbacks', ['isbn']);
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.dropTable('TradePaperbacks');
  },
};
