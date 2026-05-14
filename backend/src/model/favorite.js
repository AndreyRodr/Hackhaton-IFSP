const Sequelize = require('sequelize');
const db = require('../config/bd_Sequelize');

const Favorite = db.define('Favorite', {
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  ongId: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
}, {
  indexes: [
    {
      unique: true,
      fields: ['userId', 'ongId']
    }
  ]
});

Favorite.sync();

const addFavorite = async (userId, ongId) =>
  await Favorite.create({ userId, ongId });

const removeFavorite = async (userId, ongId) =>
  await Favorite.destroy({ where: { userId, ongId } });

const listFavoritesByUser = async (userId) =>
  await Favorite.findAll({ where: { userId } });

const findFavorite = async (userId, ongId) =>
  await Favorite.findOne({ where: { userId, ongId } });

module.exports = { Favorite, addFavorite, removeFavorite, listFavoritesByUser, findFavorite };
