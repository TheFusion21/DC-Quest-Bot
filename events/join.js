// eslint-disable-next-line no-unused-vars
const { Events, Guild } = require('discord.js');

const { guilds, users } = require('../dbObjects');

module.exports = {
  name: Events.GuildCreate,
  once: false,
  /**
    * @param {Guild} guild
    */
  async execute(guild) {
    console.log(`Joined guild: ${guild.name} (${guild.id})`);
    const guildRecord = await guilds.findOrCreate({
      where: {
        guildId: guild.id,
      },
    });
    // Create users for already existing members
    for (const member of guild.members.cache.values()) {
      await users.findOrCreate({
        where: {
          discordId: member.id,
          guildId: guildRecord.id,
        },
        defaults: {
          username: member.user.username,
        },
      });
    }

  },
};