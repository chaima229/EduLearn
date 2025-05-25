module.exports = (sequelize, DataTypes) => {
    const UserCertificate = sequelize.define('CertificatsUtilisateur', {
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
        certificat_id: { // Le type de certificat
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Certificats',
                key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
        cours_id: { // Redondant mais pratique pour les requêtes
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Cours',
                key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
        date_obtention: {
            type: DataTypes.DATEONLY, // DATE sans l'heure
            allowNull: false,
        },
        url_certificat_genere: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
    }, {
        tableName: 'CertificatsUtilisateur',
        timestamps: false, // date_obtention est gérée manuellement
        indexes: [
            {
                unique: true,
                fields: ['utilisateur_id', 'certificat_id']
            }
        ]
    });
    return UserCertificate;
};