const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('Quest_Bot', 'bot', 'u5Dme*svSNt@sEA', {
  host: 'localhost',
  dialect: 'mysql',
});

const users = require('./dbBase').users(sequelize, DataTypes);
const userquests = require('./dbBase').userquests(sequelize, DataTypes);
const quests = require('./dbBase').quests(sequelize, DataTypes);
const games = require('./dbBase').games(sequelize, DataTypes);
const events = require('./dbBase').events(sequelize, DataTypes);
const guilds = require('./dbBase').guilds(sequelize, DataTypes);

users.hasMany(userquests, { foreignKey: 'userId' });
userquests.belongsTo(users, { foreignKey: 'userId' });

quests.hasMany(userquests, { foreignKey: 'questId' });
userquests.belongsTo(quests, { foreignKey: 'questId' });

games.hasMany(quests, { foreignKey: 'gameId' });
quests.belongsTo(games, { foreignKey: 'gameId' });

games.hasMany(events, { foreignKey: 'gameId' });
events.belongsTo(games, { foreignKey: 'gameId' });

guilds.hasMany(events, { foreignKey: 'guildId' });
events.belongsTo(guilds, { foreignKey: 'guildId' });

guilds.hasMany(users, { foreignKey: 'guildId' });
users.belongsTo(guilds, { foreignKey: 'guildId' });

users.hasMany(events, { foreignKey: 'creatorId' });
events.belongsTo(users, { foreignKey: 'creatorId' });

Reflect.defineProperty(users.prototype, 'getQuests', {
  value: (status) => {
    return userquests.findAll({
      where: {
        userId: this.id,
        status,
      },
      include: games,
    });
  },
});

/**
 * @param {games} game
 * @param {Date} startTime
 * @param {Date} endTime
 * @param {string} title
 * @param {string | null} description
 * @param {users} creator
 * @returns {Promise<events>}
 */
const createEvent = async (game, startTime, endTime, title, description, creator) => {
  const guild = await guilds.findOne({
    where: {
      id: creator.guildId,
    },
  });
  if (!guild) {
    throw new Error('Guild not found');
  }
  const event = await events.create({
    gameId: game.id,
    startTime,
    endTime,
    title,
    description,
    creatorId: creator.id,
    guildId: guild.id,
  });
  return event;
};

Reflect.defineProperty(events.prototype, 'delete', {
  value: async (userId) => {
    await events.destroy({
      where: {
        id: this.id,
        creatorId: userId,
      },
    });
  },
});

const getUpcomingEvents = async (guild) => {
  const guildRecord = await guilds.findOne({
    where: {
      guildId: guild.id,
    },
  });
  if (!guildRecord) {
    throw new Error('Guild not found');
  }
  const guildEvents = await events.findAll({
    where: {
      guildId: guildRecord.id,
      startTime: {
        [Sequelize.Op.lte]: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
      },
    },
    include: games,
  });
  return guildEvents;
};

const getActiveEvents = async (guild) => {
  const guildRecord = await guilds.findOne({
    where: {
      guildId: guild.id,
    },
  });
  if (!guildRecord) {
    throw new Error('Guild not found');
  }
  const guildEvents = await events.findAll({
    where: {
      guildId: guildRecord.id,
      startTime: {
        [Sequelize.Op.lte]: new Date(),
      },
      endTime: {
        [Sequelize.Op.gte]: new Date(),
      },
    },
    include: games,
  });
  return guildEvents;
};

module.exports = {
  users,
  userquests,
  quests,
  games,
  events,
  guilds,
  getActiveEvents,
  getUpcomingEvents,
  createEvent,
};