module.exports = (sequelize, DataTypes) => {
    const QuizQuestion = sequelize.define('QuestionsQuiz', {
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
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
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
        tableName: 'QuestionsQuiz',
        timestamps: false,
    });
    return QuizQuestion;
};