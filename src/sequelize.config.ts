import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize("postgres://default:6JFwc1bnxSuD@ep-orange-water-192746-pooler.us-east-1.postgres.vercel-storage.com:5432/verceldb", {
  dialect: "postgres",
  logging: true,
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
});
