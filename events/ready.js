// eslint-disable-next-line no-unused-vars
const { Events, ActivityType, PresenceUpdateStatus, Client } = require('discord.js');

module.exports = {
  name: Events.ClientReady,
  once: true,
  /**
    * @param {Client} client
    */
  async execute(client) {
    console.log(`Ready! Logged in as ${client.user?.tag}`);
    // Set Bot activity
    client.user?.setStatus(PresenceUpdateStatus.Online);
    client.user?.setActivity({ name: 'Games', type: ActivityType.Playing });
    // client.guilds.cache.forEach(guild => {
    //   console.log(`Guild: ${guild.name} (${guild.id})`);
    //   guild.members.fetch().then(members => {
    //     console.log(`Members: ${members.size}`);
    //     members.forEach(member => {
    //       console.log(`Member: ${member.user.tag} (${member.user.id})`);
    //       console.log(member.presence);
    //     });
    //   });
    // });
  },
};