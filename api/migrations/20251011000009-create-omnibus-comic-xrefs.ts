import { QueryInterface, DataTypes } from 'sequelize';

export default {
  async up(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.createTable('OmnibusComicXRefs', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      omnibusId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Omnibuses',
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

    await queryInterface.addIndex('OmnibusComicXRefs', ['omnibusId']);
    await queryInterface.addIndex('OmnibusComicXRefs', ['comicId']);
    await queryInterface.addIndex('OmnibusComicXRefs', ['omnibusId', 'comicId'], {
      unique: true,
      name: 'omnibus_comic_unique',
    });
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.dropTable('OmnibusComicXRefs');
  },
};
