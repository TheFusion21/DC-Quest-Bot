/* eslint-disable no-unused-vars */
const { Sequelize, DataTypes } = require('sequelize');
const { database1, databaseName, databaseHost, databaseDialect } = require('./config.json');
const sequelize = new Sequelize(databaseName, database1.username, database1.password, {
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

const force = process.argv.includes('--force') || process.argv.includes('-f');

sequelize.sync({ force }).then(async () => {
  const baseInserts = [
    games.upsert({ name: 'Divinity: Original Sin 2', label: 'dos2', imageUrl: null }),
    games.upsert({ name: 'Payday 2', label: 'payday2', imageUrl: null }),
    games.upsert({ name: 'Battlerite', label: 'battlerite', imageUrl: null }),
    games.upsert({ name: 'Duelyst', label: 'duelyst', imageUrl: null }),
    games.upsert({ name: 'SpeedRunners', label: 'speedrunners', imageUrl: null }),
    games.upsert({ name: 'Tooth & Tail', label: 'toothandtail', imageUrl: null }),
    games.upsert({ name: 'Foxhole', label: 'foxhole', imageUrl: null }),
    games.upsert({ name: 'Unturned', label: 'unturned', imageUrl: null }),
    games.upsert({ name: 'osu!', label: 'osu', imageUrl: null }),
    games.upsert({ name: 'Holodrive', label: 'holodrive', imageUrl: null }),
    games.upsert({ name: 'Killing Floor 2', label: 'killingfloor2', imageUrl: null }),
    games.upsert({ name: 'Brawlhalla', label: 'brawlhalla', imageUrl: null }),
    games.upsert({ name: 'Squad', label: 'squad', imageUrl: null }),
    games.upsert({ name: 'GRIP: Combat Racing', label: 'grip', imageUrl: null }),
    games.upsert({ name: 'We Need to Go Deeper', label: 'wentodeeper', imageUrl: null }),
    games.upsert({ name: 'Move or Die', label: 'moveordie', imageUrl: null }),
    games.upsert({ name: 'Hellion', label: 'hellion', imageUrl: null }),
    games.upsert({ name: 'Ballistic Overkill', label: 'ballisticoverkill', imageUrl: null }),
    games.upsert({ name: 'Descenders', label: 'descenders', imageUrl: null }),
    games.upsert({ name: 'League of Legends', label: 'leagueoflegends', imageUrl: 'https://static-cdn.jtvnw.net/ttv-boxart/21779-188x250.jpg' }),
    games.upsert({ name: 'PUBG', label: 'pubg', imageUrl: 'https://static-cdn.jtvnw.net/ttv-boxart/493057-285x380.jpg' }),
    games.upsert({ name: 'Counter-Strike: Global Offensive', label: 'csgo', imageUrl: 'https://static-cdn.jtvnw.net/ttv-boxart/32399_IGDB-188x250.jpg' }),
    games.upsert({ name: 'Overwatch 2', label: 'overwatch2', imageUrl: 'https://static-cdn.jtvnw.net/ttv-boxart/515025-285x380.jpg' }),
    games.upsert({ name: 'Apex Legends', label: 'apexlegends', imageUrl: 'https://static-cdn.jtvnw.net/ttv-boxart/511224-188x250.jpg' }),
    games.upsert({ name: 'Dota 2', label: 'dota2', imageUrl: 'https://static-cdn.jtvnw.net/ttv-boxart/29595-188x250.jpg' }),
  ];
  await Promise.all(baseInserts);

  // quest templates
  const questTemplatesInserts = [

  ];
  await Promise.all(questTemplatesInserts);

  // achievements
  const achievementsInserts = [
    achievements.upsert({ gameId: 22, name: 'The head game', description: 'Get 1000 headshots' }),
    achievements.upsert({ gameId: 22, name: 'Addicted', description: 'Play 1000 hours' }),
    achievements.upsert({ gameId: 22, name: 'The best', description: 'Get 10000 kills' }),
  ];

  await Promise.all(achievementsInserts);

  console.log('Database synced');

  sequelize.close();
}).catch(console.error);