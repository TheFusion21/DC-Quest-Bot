// eslint-disable-next-line no-unused-vars
const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } = require('discord.js');

const { getActiveEvents, getUpcomingEvents } = require('../dbObjects');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('events')
    .setDescription('Show all events')
    .setDMPermission(false)
    .addSubcommand(subcommand =>
      subcommand
        .setName('active')
        .setDescription('Show all active events'))
    .addSubcommand(subcommand =>
      subcommand
        .setName('upcoming')
        .setDescription('Show all upcoming events')),
  /**
  * @param {ChatInputCommandInteraction} interaction
  */
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    let eventsToShow = [];
    if (subcommand == 'active') {
      eventsToShow = await getActiveEvents(interaction.guild);
      if (eventsToShow.length == 0) {
        await interaction.reply('There are currently no active events');
        return;
      }
    } else if (subcommand == 'upcoming') {
      eventsToShow = await getUpcomingEvents(interaction.guild);
      if (eventsToShow.length == 0) {
        await interaction.reply('There are currently no upcoming events');
        return;
      }
    }
    const embeds = [];
    eventsToShow.filter((_, i) => i < 10).forEach(event => {
      console.log(event.title);
      let embed = new EmbedBuilder()
        .setTitle(event.title)
        .setColor(0x00FF00)
        .setThumbnail(event.game.imageUrl);
      if (event.description) {
        embed = embed.setDescription(event.description);
      }
      embed = embed.addFields(
        { name: 'Game', value: event.game.name, inline: false },
        { name: 'Reward', value: event.reward, inline: false },
        { name: 'Start', value: event.startTime.toLocaleString(interaction.locale), inline: true },
        { name: 'End', value: event.endTime.toLocaleString(interaction.locale), inline: true },
      ).setFooter({ text: `Event ID: ${event.id}` });
      embeds.push(embed);
    });
    await interaction.reply({ embeds });
  },
};