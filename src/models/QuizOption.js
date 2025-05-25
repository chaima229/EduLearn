const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

class QuizOption extends Model {}

QuizOption.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    question_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'QuestionsQuiz',
            key: 'id',
        },
    },
    texte_option: {
        type: DataTypes.STRING(500),
        allowNull: false,
    },
    est_correcte: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
}, {
    sequelize,
    modelName: 'QuizOption',
    tableName: 'OptionsReponse',
    timestamps: false,
});

module.exports = QuizOption;