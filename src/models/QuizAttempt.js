module.exports = (sequelize, DataTypes) => {
    const QuizAttempt = sequelize.define('TentativesQuiz', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        utilisateur_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Utilisateurs',
                key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
        quiz_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Quiz',
                key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
        score_obtenu: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: false,
        },
        date_tentative: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        reponses_utilisateur: { // Stocke les réponses de l'utilisateur
            type: DataTypes.JSON,
            allowNull: true,
        },
    }, {
        tableName: 'TentativesQuiz',
        timestamps: true, // Gère date_tentative
        createdAt: 'date_tentative',
        updatedAt: false, // Pas de champ updatedAt
    });
    return QuizAttempt;
};