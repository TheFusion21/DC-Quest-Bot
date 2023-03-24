/* eslint-disable no-lonely-if */
// eslint-disable-next-line no-unused-vars
const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } = require('discord.js');

const { users, guilds } = require('../dbObjects');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stats')
    .setDescription('Show user statistics')
    .setDMPermission(false)
    .addUserOption(option =>
      option
        .setName('user')
        .setDescription('The user to show the stats for')
        .setRequired(false)),
  /**
  * @param {ChatInputCommandInteraction} interaction
  */
  async execute(interaction) {
    const user = interaction.options.getUser('user') || interaction.user;
    const dbGuild = await guilds.findOrCreate({ where: { guildId: interaction.guild.id } });
    const dbUser = await users.findOrCreate({
      where: { discordId: user.id, guildId: dbGuild.id },
      defaults: { username: user.username },
    });

    const balance = await dbUser[0].balance;


    const embed = new EmbedBuilder()
      .setTitle(`${user.username}'s stats`)
      .setColor(0x00FF00)
      .setDescription('Here are your stats!')
      .setThumbnail(user.avatarURL())
      .addFields({ name: 'Balance', value: `${balance} <:coin:1088747959342071869>`, inline: true });

    await interaction.reply({ embeds: [embed] });
  },
};