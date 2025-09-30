import { Sequelize } from "sequelize";

const sequelize: Sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
});

export default sequelize;