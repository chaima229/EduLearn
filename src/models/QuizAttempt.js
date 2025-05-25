const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

class QuizAttempt extends Model {}

QuizAttempt.init({
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
    },
    quiz_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Quiz',
            key: 'id',
        },
    },
    score_obtenu: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
    },
    date_tentative: {
        type: DataTypes.TIMESTAMP,
        defaultValue: DataTypes.NOW,
    },
    reponses_utilisateur: {
        type: DataTypes.JSON,
        allowNull: true,
    },
}, {
    sequelize,
    modelName: 'QuizAttempt',
    tableName: 'TentativesQuiz',
    timestamps: false,
});

module.exports = QuizAttempt;