module.exports = (sequelize, DataTypes) => {
    const Lesson = sequelize.define('Lecons', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
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
        titre: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        contenu: DataTypes.TEXT,
        ordre: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        duree_estimee_min: DataTypes.INTEGER,
    }, {
        tableName: 'Lecons',
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ['cours_id', 'ordre']
            }
        ]
    });
    return Lesson;
};