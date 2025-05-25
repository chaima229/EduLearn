module.exports = (sequelize, DataTypes) => {
    const LessonProgress = sequelize.define('ProgressionLecons', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        inscription_cours_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'InscriptionsCours',
                key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
        lecon_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Lecons',
                key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
        est_completee: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        date_completion: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    }, {
        tableName: 'ProgressionLecons',
        timestamps: false, // Pas de createdAt/updatedAt gérés par Sequelize pour cette table
        indexes: [
            {
                unique: true,
                fields: ['inscription_cours_id', 'lecon_id']
            }
        ]
    });
    return LessonProgress;
};