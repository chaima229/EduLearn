module.exports = (sequelize, DataTypes) => {
    const Quiz = sequelize.define('Quiz', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        lecon_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'Lecons',
                key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
        cours_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'Cours',
                key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
        titre: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        description: DataTypes.TEXT,
        seuil_reussite_pourcentage: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: true,
        },
    }, {
        tableName: 'Quiz',
        timestamps: false, // Pas de createdAt/updatedAt dans le schéma SQL pour cette table
        // La contrainte chk_quiz_link doit être gérée au niveau de la base de données
        // ou par une validation dans la logique applicative avant sauvegarde.
        // Sequelize ne gère pas directement les contraintes CHECK de cette manière.
        // Vous pouvez ajouter une validation de modèle :
        validate: {
            linkToCourseOrLesson() {
                if (this.lecon_id === null && this.cours_id === null) {
                    throw new Error('Un quiz doit être lié soit à une leçon, soit à un cours.');
                }
                if (this.lecon_id !== null && this.cours_id !== null) {
                    throw new Error('Un quiz ne peut pas être lié à la fois à une leçon et à un cours.');
                }
            }
        }
    });
    return Quiz;
};