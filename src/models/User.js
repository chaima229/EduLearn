const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('Utilisateurs', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        nom_utilisateur: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true,
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        mot_de_passe_hash: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        prenom: DataTypes.STRING(100),
        nom_famille: DataTypes.STRING(100),
        role: {
            type: DataTypes.ENUM('etudiant', 'instructeur', 'admin'),
            allowNull: false,
            defaultValue: 'etudiant',
        },
        date_inscription: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        derniere_connexion: DataTypes.DATE,
    }, {
        tableName: 'Utilisateurs',
        timestamps: true, // Sequelize gérera createdAt et updatedAt
        createdAt: 'date_inscription', // Mappe la colonne date_inscription
        updatedAt: false, // Si tu ne veux pas de champ updatedAt géré par Sequelize
        hooks: {
            beforeCreate: async (user) => {
                if (user.mot_de_passe_hash) {
                    const salt = await bcrypt.genSalt(10);
                    user.mot_de_passe_hash = await bcrypt.hash(user.mot_de_passe_hash, salt);
                }
            },
            beforeUpdate: async (user) => {
                if (user.changed('mot_de_passe_hash') && user.mot_de_passe_hash) {
                     const salt = await bcrypt.genSalt(10);
                    user.mot_de_passe_hash = await bcrypt.hash(user.mot_de_passe_hash, salt);
                }
            }
        }
    });

    User.prototype.comparePassword = async function (candidatePassword) {
        return bcrypt.compare(candidatePassword, this.mot_de_passe_hash);
    };

    return User;
};