module.exports = (sequelize, DataTypes) => {
    const CourseEnrollment = sequelize.define('InscriptionsCours', {
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
        cours_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Cours',
                key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
        date_inscription: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        progression_pourcentage: {
            type: DataTypes.DECIMAL(5, 2),
            defaultValue: 0.00,
        },
        date_achevement: DataTypes.DATE,
    }, {
        tableName: 'InscriptionsCours',
        timestamps: true,
        createdAt: 'date_inscription',
        updatedAt: false, // Pas de champ 'updatedAt' défini explicitement dans ton schéma pour cette table
        indexes: [
            {
                unique: true,
                fields: ['utilisateur_id', 'cours_id']
            }
        ]
    });
    return CourseEnrollment;
};