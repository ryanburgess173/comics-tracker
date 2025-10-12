import { QueryInterface, DataTypes } from 'sequelize';

export default {
  async up(queryInterface: QueryInterface): Promise<void> {
    // Remove the old text column
    await queryInterface.removeColumn('TradePaperbacks', 'publisher');

    // Add the new foreign key column
    await queryInterface.addColumn('TradePaperbacks', 'publisherId', {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Publishers',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    await queryInterface.addIndex('TradePaperbacks', ['publisherId']);
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.removeIndex('TradePaperbacks', ['publisherId']);
    await queryInterface.removeColumn('TradePaperbacks', 'publisherId');

    // Restore the old text column
    await queryInterface.addColumn('TradePaperbacks', 'publisher', {
      type: DataTypes.STRING,
      allowNull: true,
    });
  },
};
