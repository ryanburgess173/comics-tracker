import { QueryInterface, DataTypes } from 'sequelize';

export default {
  async up(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.createTable('TradePaperbackComicXRefs', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      tradePaperbackId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'TradePaperbacks',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      comicId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Comics',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      orderInCollection: {
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

    await queryInterface.addIndex('TradePaperbackComicXRefs', ['tradePaperbackId']);
    await queryInterface.addIndex('TradePaperbackComicXRefs', ['comicId']);
    await queryInterface.addIndex('TradePaperbackComicXRefs', ['tradePaperbackId', 'comicId'], {
      unique: true,
      name: 'trade_paperback_comic_unique',
    });
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.dropTable('TradePaperbackComicXRefs');
  },
};
