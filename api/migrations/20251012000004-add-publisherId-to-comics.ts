import { QueryInterface, DataTypes } from 'sequelize';

export default {
  async up(queryInterface: QueryInterface): Promise<void> {
    // Remove the old text column
    await queryInterface.removeColumn('Comics', 'publisher');

    // Add the new foreign key column
    await queryInterface.addColumn('Comics', 'publisherId', {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Publishers',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    await queryInterface.addIndex('Comics', ['publisherId']);
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.removeIndex('Comics', ['publisherId']);
    await queryInterface.removeColumn('Comics', 'publisherId');

    // Restore the old text column
    await queryInterface.addColumn('Comics', 'publisher', {
      type: DataTypes.STRING,
      allowNull: true,
    });
  },
};
