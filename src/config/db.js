const { Sequelize } = require('sequelize');
const config = require('./index');

const sequelize = new Sequelize(
    config.db.name,
    config.db.user,
    config.db.password,
    {
        host: config.db.host,
        dialect: config.db.dialect,
        logging: false, // Mettre à true pour voir les requêtes SQL
        define: {
            timestamps: false, // Par défaut, Sequelize ajoute createdAt et updatedAt. Ton schéma les gère déjà.
            underscored: true, // Pour utiliser snake_case pour les colonnes auto-générées (ex: foreign keys)
        }
    }
);

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('MySQL Connected...');
        // Synchroniser les modèles (créer les tables si elles n'existent pas)
        // ATTENTION: { force: true } supprime et recrée les tables. À utiliser avec prudence en développement.
        // En production, utiliser des migrations.
        // await sequelize.sync({ alter: true }); // Tente d'altérer les tables pour correspondre aux modèles
        // console.log('Tables synchronisées.');
    } catch (err) {
        console.error('Unable to connect to the database:', err);
        process.exit(1);
    }
};

module.exports = { sequelize, connectDB };