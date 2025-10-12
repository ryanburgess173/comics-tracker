import { QueryInterface, DataTypes } from 'sequelize';

export default {
  async up(queryInterface: QueryInterface): Promise<void> {
    // Remove the old text column
    await queryInterface.removeColumn('Universes', 'publisher');

    // Add the new foreign key column
    await queryInterface.addColumn('Universes', 'publisherId', {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Publishers',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    await queryInterface.addIndex('Universes', ['publisherId']);
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.removeIndex('Universes', ['publisherId']);
    await queryInterface.removeColumn('Universes', 'publisherId');

    // Restore the old text column
    await queryInterface.addColumn('Universes', 'publisher', {
      type: DataTypes.STRING,
      allowNull: true,
    });
  },
};
