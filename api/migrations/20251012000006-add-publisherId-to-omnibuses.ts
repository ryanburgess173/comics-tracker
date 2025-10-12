import { QueryInterface, DataTypes } from 'sequelize';

export default {
  async up(queryInterface: QueryInterface): Promise<void> {
    // Remove the old text column
    await queryInterface.removeColumn('Omnibuses', 'publisher');

    // Add the new foreign key column
    await queryInterface.addColumn('Omnibuses', 'publisherId', {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Publishers',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    await queryInterface.addIndex('Omnibuses', ['publisherId']);
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.removeIndex('Omnibuses', ['publisherId']);
    await queryInterface.removeColumn('Omnibuses', 'publisherId');

    // Restore the old text column
    await queryInterface.addColumn('Omnibuses', 'publisher', {
      type: DataTypes.STRING,
      allowNull: true,
    });
  },
};
