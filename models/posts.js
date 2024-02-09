module.exports = (sequelize, DataTypes) => {
    const posts = sequelize.define("Posts", {
        title: {
            type: DataTypes.STRING, 
            allowNull: false,
        },
        postText: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });

    posts.associate = (models) => {
        posts.hasMany(models.Comments, {
            onDelete: "cascade",
        });

        posts.hasMany(models.Likes, {
            onDelete: "cascade",
        });
    }
    
    return posts;
};