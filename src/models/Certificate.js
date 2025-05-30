module.exports = (sequelize, DataTypes) => {
    const Certificate = sequelize.define('Certificats', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        cours_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true, // Un type de certificat est lié à un cours spécifique
            references: {
                model: 'Cours',
                key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
        titre_certificat: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        description_modele: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    }, {
        tableName: 'Certificats',
        timestamps: false,
    });
    return Certificate;
};