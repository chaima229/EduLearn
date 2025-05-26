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
    UserCertificate.associate = function(models) {
        // Un UserCertificate appartient à un Utilisateur
        UserCertificate.belongsTo(models.User, { // `models.User` fait référence au modèle User que Sequelize aura chargé
            foreignKey: 'utilisateur_id', // La clé étrangère dans CertificatsUtilisateur
            as: 'utilisateur' // C'est l'alias crucial ! Le JSON aura la clé "utilisateur"
        });

        // Un UserCertificate appartient à une définition de Certificat
        UserCertificate.belongsTo(models.Certificate, { // `models.Certificate` est le modèle de la table `Certificats`
            foreignKey: 'certificat_id',
            as: 'Certificat' // L'alias sera 'Certificat' (ou 'definition' si vous préférez)
        });

        // Un UserCertificate appartient à un Cours
        UserCertificate.belongsTo(models.Course, { // `models.Course` est le modèle de la table `Cours`
            foreignKey: 'cours_id',
            as: 'Cour' // L'alias sera 'Cour' (ou 'courseDetails' etc.)
        });
    };
    return UserCertificate;
};