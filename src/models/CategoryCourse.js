module.exports = (sequelize, DataTypes) => {
    const CategoryCourse = sequelize.define('CategoriesCours', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        nom_categorie: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
        },
        description: DataTypes.TEXT,
    }, {
        tableName: 'CategoriesCours',
        timestamps: false, // Pas de createdAt/updatedAt dans ton schéma pour cette table
    });
    return CategoryCourse;
};