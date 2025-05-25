module.exports = (sequelize, DataTypes) => {
    const ResponseOption = sequelize.define('OptionsReponse', {
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
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
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
        tableName: 'OptionsReponse',
        timestamps: false,
    });
    return ResponseOption;
};