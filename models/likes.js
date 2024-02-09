module.exports = (sequelize, DataTypes) => {
    const likes = sequelize.define("Likes");

    return likes;
};