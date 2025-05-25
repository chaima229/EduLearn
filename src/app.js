const express = require('express');
const cors = require('cors');
const config = require('./config');
const { connectDB, sequelize } = require('./config/db'); // sequelize pour la synchro
const apiRouter = require('./api'); // Routeur principal de l'API
const errorHandler = require('./middleware/errorMiddleware');

// Initialiser l'application Express
const app = express();

// Connexion à la base de données
connectDB();

// Middleware
app.use(cors()); // Activer CORS pour toutes les routes
app.use(express.json()); // Pour parser les requêtes JSON
app.use(express.urlencoded({ extended: true })); // Pour parser les requêtes URL-encoded

// Monter le routeur de l'API
app.use('/api', apiRouter);

// Gestionnaire d'erreurs global (doit être le dernier middleware)
app.use(errorHandler);

const PORT = config.port;

const startServer = async () => {
    try {
        // Synchroniser la base de données avec les modèles Sequelize
        // ATTENTION: { force: true } supprime et recrée les tables. Ne pas utiliser en production sans migrations.
        // { alter: true } essaie de modifier les tables pour qu'elles correspondent aux modèles.
        // Pour la première exécution et le développement, `alter: true` peut être utile.
        // En production, il est préférable d'utiliser des migrations Sequelize.
        // await sequelize.sync({ alter: true }); // Décommente si tu veux que Sequelize crée/modifie les tables
        // console.log("All models were synchronized successfully.");

        app.listen(PORT, () => {
            console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to synchronize database or start server:', error);
        process.exit(1);
    }
};

startServer();