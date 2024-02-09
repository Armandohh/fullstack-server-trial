module.exports = (sequelize, DataTypes) => {
    const users = sequelize.define("Users", {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });

    users.associate = (models) => {
        users.hasMany(models.Posts, {
            onDelete: "cascade",
        });

        users.hasMany(models.Likes, {
            onDelete: "cascade",
        });
    }

    return users;
};