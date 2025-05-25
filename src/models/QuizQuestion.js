const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

class QuizQuestion extends Model {}

QuizQuestion.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    quiz_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Quiz',
            key: 'id',
        },
    },
    texte_question: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    type_question: {
        type: DataTypes.ENUM('QCM', 'VRAI_FAUX', 'REPONSE_COURTE'),
        allowNull: false,
        defaultValue: 'QCM',
    },
    ordre: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'QuizQuestion',
    tableName: 'QuestionsQuiz',
    timestamps: false,
});

module.exports = QuizQuestion;