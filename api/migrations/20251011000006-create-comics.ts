import { QueryInterface, DataTypes } from 'sequelize';

export default {
  async up(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.createTable('Comics', {
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
      author: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      pages: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      publisher: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      publishedDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      runId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'Runs',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      variant: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 1,
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

    await queryInterface.addIndex('Comics', ['title']);
    await queryInterface.addIndex('Comics', ['runId']);
    await queryInterface.addIndex('Comics', ['author']);
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.dropTable('Comics');
  },
};
