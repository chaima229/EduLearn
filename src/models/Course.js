module.exports = (sequelize, DataTypes) => {
    const Course = sequelize.define('Cours', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        titre: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        description: DataTypes.TEXT,
        instructeur_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'Utilisateurs', // Nom de la table
                key: 'id',
            },
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
        },
        categorie_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'CategoriesCours', // Nom de la table
                key: 'id',
            },
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
        },
        niveau_difficulte: DataTypes.STRING(50),
        image_url_couverture: DataTypes.STRING(255),
        est_publie: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        date_creation: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        date_mise_a_jour: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            onUpdate: DataTypes.NOW, // Sequelize ne gère pas ON UPDATE CURRENT_TIMESTAMP directement pour MySQL de cette manière
                                    // Il faudra le gérer via des hooks ou le laisser à la DB
        },
    }, {
        tableName: 'Cours',
        timestamps: true,
        createdAt: 'date_creation',
        updatedAt: 'date_mise_a_jour',
    });
    return Course;
};