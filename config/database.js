const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('projekUasDB', 'postgres', 'Admin123', {
  host: 'database-1.c9yooyycyee0.ap-southeast-2.rds.amazonaws.com',
  dialect: 'postgres',
  port: 5432,
  dialectOptions: {
    ssl: {
      require: true,       // Memaksa koneksi pakai SSL
      rejectUnauthorized: false  // Terima sertifikat self-signed (AWS RDS pakai ini)
    }
  }
});

module.exports = sequelize;
