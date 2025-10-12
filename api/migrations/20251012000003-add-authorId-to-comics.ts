import { QueryInterface, DataTypes } from 'sequelize';

export default {
  async up(queryInterface: QueryInterface): Promise<void> {
    // Remove the old text column and its index
    await queryInterface.removeIndex('Comics', ['author']);
    await queryInterface.removeColumn('Comics', 'author');

    // Add the new foreign key column
    await queryInterface.addColumn('Comics', 'authorId', {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Creators',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    await queryInterface.addIndex('Comics', ['authorId']);
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.removeIndex('Comics', ['authorId']);
    await queryInterface.removeColumn('Comics', 'authorId');

    // Restore the old text column
    await queryInterface.addColumn('Comics', 'author', {
      type: DataTypes.STRING,
      allowNull: false,
    });

    await queryInterface.addIndex('Comics', ['author']);
  },
};
