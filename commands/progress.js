/* eslint-disable no-lonely-if */
// eslint-disable-next-line no-unused-vars
const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } = require('discord.js');

const { Sequelize } = require('sequelize');
const { users, guilds, quests, userquests } = require('../dbObjects');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('progress')
    .setDescription('Show your quest progress')
    .setDMPermission(false)
    .addStringOption(option =>
      option
        .setName('type')
        .setDescription('The type of quest')
        .setRequired(true)
        .addChoices(
          { name: 'Daily', value: '0' },
          { name: 'Weekly', value: '1' },
        )),
  /**
  * @param {ChatInputCommandInteraction} interaction
  */
  async execute(interaction) {
    const dbGuild = await guilds.findOrCreate({ where: { guildId: interaction.guild.id } });
    const dbUser = await users.findOrCreate({
      where: { discordId: interaction.user.id, guildId: dbGuild[0].id },
      defaults: { username: interaction.user.username },
    });
    const type = interaction.options.getString('type');

    const progressingUserQuests = await userquests.findAll({
      where: {
        userId: dbUser[0].id,
        status: parseInt(type),
        progress: {
          [Sequelize.Op.gt]: 0,
        },
      },
      include: [quests],
    });

    if (progressingUserQuests.length == 0) {
      await interaction.reply(`You have no ${type == '0' ? 'daily' : 'weekly'} quests in progress`);
      return;
    }

    const embed = new EmbedBuilder()
      .setTitle(`${type == '0' ? 'Daily' : 'Weekly'} Quests in Progress`)
      .setColor(0x00ff00)
      .setDescription('Here are your quests in progress!');
    for (const userquest of progressingUserQuests) {
      const percent = Math.round((userquest.progress / userquest.quest.limit) * 20);
      const bar = '▇'.repeat(percent) + '—'.repeat(20 - percent);
      embed.addFields({ name: userquest.quest.description, value: `[${bar}] ${userquest.progress}/${userquest.quest.limit}`, inline: false });
    }

    await interaction.reply({ embeds: [embed] });

  },
};