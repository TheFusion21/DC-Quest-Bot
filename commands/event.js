// eslint-disable-next-line no-unused-vars
const { SlashCommandBuilder, ChatInputCommandInteraction, AutocompleteInteraction, PermissionFlagsBits } = require('discord.js');
const dayjs = require('dayjs');
const parserPlugin = require('dayjs-parser');
dayjs.extend(parserPlugin);

const { createEvent, games, users, guilds, events } = require('../dbObjects');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('event')
    .setDescription('Manage events')
    .setDMPermission(false)
    .addSubcommand(subcommand =>
      subcommand
        .setName('create')
        .setDescription('Create a new event')
        .addStringOption(option =>
          option
            .setName('game')
            .setDescription('The game the event is for')
            .setRequired(true)
            .setAutocomplete(true))
        .addStringOption(option =>
          option
            .setName('start-time')
            .setDescription('The start time of the event (YYYY-MM-DD HH:mm)')
            .setRequired(true))
        .addNumberOption(option =>
          option
            .setName('duration')
            .setDescription('The duration of the event in minutes')
            .setRequired(true))
        .addStringOption(option =>
          option
            .setName('title')
            .setDescription('The title of the event')
            .setRequired(true))
        .addStringOption(option =>
          option
            .setName('description')
            .setDescription('The description of the event')
            .setRequired(false)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('delete')
        .setDescription('Delete an event')
        .addNumberOption(option =>
          option
            .setName('event-id')
            .setDescription('The ID of the event to delete')
            .setRequired(true)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('list')
        .setDescription('List all events')),
  /**
  * @param {ChatInputCommandInteraction} interaction
  */
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const guild = await guilds.findOrCreate({ where: { guildId: interaction.guild.id } });
    if (subcommand === 'create') {
      const game = interaction.options.get('game', true);
      const title = interaction.options.get('title', true);
      const description = interaction.options.get('description');
      const startTime = interaction.options.get('start-time', true);
      const duration = interaction.options.get('duration', true);

      const startDate = dayjs(startTime.value).isValid() ? dayjs(startTime.value).valueOf() : NaN;

      // Check if dates are valid
      if (isNaN(startDate)) {
        await interaction.reply({ content: 'Invalid date format!', ephemeral: true });
        return;
      }
      if (isNaN(duration.value) || duration.value <= 0) {
        await interaction.reply({ content: 'Invalid duration!', ephemeral: true });
        return;
      }
      if (game.value?.trim() === '') {
        await interaction.reply({ content: 'Invalid game!', ephemeral: true });
        return;
      }
      if (title.value?.trim() === '') {
        await interaction.reply({ content: 'Invalid title!', ephemeral: true });
        return;
      }
      if (description && description.value?.trim() === '') {
        await interaction.reply({ content: 'Invalid description!', ephemeral: true });
        return;
      }
      const gameEntry = await games.findOne({ where: { label: game.value } });
      if (!gameEntry) {
        await interaction.reply({ content: 'Game not found!', ephemeral: true });
        return;
      }
      const user = await users.findOrCreate(
        {
          where: {
            discordId: interaction.user.id,
            guildId: guild.id,
          },
          defaults: {
            username: interaction.user.username,
          },
        },
      );
      const event = await createEvent(
        gameEntry,
        new Date(startDate),
        new Date(startDate + duration.value * 60 * 1000),
        title.value,
        description?.value,
        user[0],
      );
      await interaction.reply({ content: `Event ${event.id} created!`, ephemeral: true });
    } else if (subcommand === 'delete') {
      const eventId = interaction.options.get('event-id', true);

      const event = await events.findOne({ where: { id: eventId.value, guildId: guild.id } });
      if (!event) {
        await interaction.reply({ content: 'Event not found!', ephemeral: true });
        return;
      }
      if (event.userId !== interaction.user.id && !interaction.member.permissions.has(PermissionFlagsBits.MANAGE_GUILD)) {
        await interaction.reply({ content: 'You do not have permission to delete this event!', ephemeral: true });
        return;
      }
      await event.destroy();
      await interaction.reply({ content: `Event ${eventId.value} deleted!`, ephemeral: true });
    } else if (subcommand === 'list') {
      const allEvents = await events.findAll({ where: { guildId: guild.id } });
      const eventList = allEvents.map(e => {
        return `**${e.id}** - ${e.title} (${e.game.name}) - ${dayjs(e.startTime).format('YYYY-MM-DD HH:mm')} - ${dayjs(e.endTime).format('YYYY-MM-DD HH:mm')}`;
      });
      await interaction.reply({ content: eventList.join('\n'), ephemeral: true });
    }
  },
  /**
  * @param {AutocompleteInteraction} interaction
  */
  async autocomplete(interaction) {
    const subcommand = interaction.options.getSubcommand();
    if (subcommand === 'create') {
      const game = interaction.options.get('game');
      if (game) {
        const allGames = await games.findAll({ attributes: ['name', 'label'] });
        const results = allGames.filter(g => g.name.toLowerCase().startsWith(game.value.toLowerCase()))
          .map(g => { return { name: g.name, value: g.label };});
        await interaction.respond(results);
      }
    }
  },
};