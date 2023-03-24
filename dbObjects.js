const { Sequelize, DataTypes } = require('sequelize');
const { database2, databaseName, databaseHost, databaseDialect } = require('./config.json');
const sequelize = new Sequelize(databaseName, database2.username, database2.password, {
  host: databaseHost,
  dialect: databaseDialect,
});

const users = require('./dbBase').users(sequelize, DataTypes);
const userquests = require('./dbBase').userquests(sequelize, DataTypes);
const quests = require('./dbBase').quests(sequelize, DataTypes);
const games = require('./dbBase').games(sequelize, DataTypes);
const events = require('./dbBase').events(sequelize, DataTypes);
const guilds = require('./dbBase').guilds(sequelize, DataTypes);
const questTemplates = require('./dbBase').questTemplates(sequelize, DataTypes);
const userachievements = require('./dbBase').userachievements(sequelize, DataTypes);
const achievements = require('./dbBase').achievements(sequelize, DataTypes);

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

games.hasMany(questTemplates, { foreignKey: 'gameId' });
questTemplates.belongsTo(games, { foreignKey: 'gameId' });

games.hasMany(achievements, { foreignKey: 'gameId' });
achievements.belongsTo(games, { foreignKey: 'gameId' });

users.hasMany(userachievements, { foreignKey: 'userId' });
userachievements.belongsTo(users, { foreignKey: 'userId' });

achievements.hasMany(userachievements, { foreignKey: 'achievementId' });
userachievements.belongsTo(achievements, { foreignKey: 'achievementId' });

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
  achievements,
  userachievements,
  questTemplates,
  getActiveEvents,
  getUpcomingEvents,
  createEvent,
};