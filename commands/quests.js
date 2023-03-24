/* eslint-disable no-lonely-if */
// eslint-disable-next-line no-unused-vars
const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } = require('discord.js');

const { quests, games } = require('../dbObjects');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('quests')
    .setDescription('Show daily/weekly quests')
    .setDMPermission(false)
    .addStringOption(option =>
      option
        .setName('game')
        .setDescription('The game the event is for')
        .setRequired(false)
        .addChoices(
          { name: 'Trackmania', value: 'trackmania' },
          { name: 'Rocket League', value: 'rocket-league' },
          { name: 'League of Legends', value: 'league-of-legends' },
          { name: 'Valorant', value: 'valorant' },
          { name: 'Overwatch', value: 'overwatch' },
          { name: 'Minecraft', value: 'minecraft' },
          { name: 'Fortnite', value: 'fortnite' },
          { name: 'Apex Legends', value: 'apex-legends' },
          { name: 'Among Us', value: 'among-us' },
          { name: 'Call of Duty', value: 'call-of-duty' },
          { name: 'Counter-Strike: Global Offensive', value: 'counter-strike-global-offensive' },
          { name: 'Hearthstone', value: 'hearthstone' },
          { name: 'Rainbow Six Siege', value: 'rainbow-six-siege' },
          { name: 'Halo', value: 'halo' },
          { name: 'Genshin Impact', value: 'genshin-impact' },
          { name: 'World of Warcraft', value: 'world-of-warcraft' },
          { name: 'Dota 2', value: 'dota-2' },
          { name: 'StarCraft II', value: 'starcraft-ii' },
        ))
    .addStringOption(option =>
      option
        .setName('type')
        .setDescription('The type of quest')
        .setRequired(false)
        .addChoices(
          { name: 'Daily', value: '0' },
          { name: 'Weekly', value: '1' },
        )),
  /**
  * @param {ChatInputCommandInteraction} interaction
  */
  async execute(interaction) {
    const game = interaction.options.getString('game', false);
    const type = interaction.options.getString('type', false);
    if (game) {
      const gameEntry = await games.findOne({ where: { label: game } });
      if (!gameEntry) {
        await interaction.reply(`Game ${game} not found`);
        return;
      }
      if (type == '0') {
        const gamesDailyQuests = await quests.findAll({ where: { gameId: gameEntry.id, type: 0 } });
        if (gamesDailyQuests.length == 0) {
          await interaction.reply(`There are no quests for ${game}`);
          return;
        }
        const embeds = [];
        gamesDailyQuests.forEach(quest => {
          const embed = new EmbedBuilder()
            .setTitle(`Daily Quest for ${gameEntry.name}`)
            .setColor(0x00FF00)
            .setDescription(quest.description)
            .addFields(
              { name: 'reward', value: `${quest.reward} <:coin:1088747959342071869>`, inline: false })
            .setFooter({ text: `Quest ID: ${quest.id}` });
          embeds.push(embed);
        });
        await interaction.reply({ embeds, ephemeral: true });
      } else if (type == '1') {
        const gamesWeeklyQuests = await quests.findAll({ where: { gameId: gameEntry.id, type: 1 } });
        if (gamesWeeklyQuests.length == 0) {
          await interaction.reply(`There are no quests for ${game}`);
          return;
        }
        const embeds = [];
        gamesWeeklyQuests.forEach(quest => {
          const embed = new EmbedBuilder()
            .setTitle(`Weekly Quest for ${gameEntry.name}`)
            .setColor(0x00FF00)
            .setDescription(quest.description)
            .addFields(
              { name: 'reward', value: `${quest.reward} <:coin:1088747959342071869>`, inline: false })
            .setFooter({ text: `Quest ID: ${quest.id}` });
          embeds.push(embed);
        });
        await interaction.reply({ embeds, ephemeral: true });
      } else {
        const gamesQuests = await quests.findAll({ where: { gameId: gameEntry.id } });
        if (gamesQuests.length == 0) {
          await interaction.reply(`There are no quests for ${game}`);
          return;
        }
        const embeds = [];
        gamesQuests.forEach(quest => {
          const embed = new EmbedBuilder()
            .setTitle(`Quest for ${gameEntry.name}`)
            .setColor(0x00FF00)
            .setDescription(quest.description)
            .addFields(
              { name: 'reward', value: `${quest.reward} <:coin:1088747959342071869>`, inline: false })
            .setFooter({ text: `Quest ID: ${quest.id}` });
          embeds.push(embed);
        });
        await interaction.reply({ embeds, ephemeral: true });
      }
    } else {
      if (type == '0') {
        const dailyQuests = await quests.findAll({ where: { type: 0 } });
        if (dailyQuests.length == 0) {
          await interaction.reply('There are no daily quests');
          return;
        }
        const embeds = [];
        // daily quests limited to 10
        dailyQuests.filter((_, i) => i < 10).forEach(quest => {
          const embed = new EmbedBuilder()
            .setTitle(`Daily Quest for ${quest.game.name}`)
            .setColor(0x00FF00)
            .setDescription(quest.description)
            .addFields(
              { name: 'reward', value: `${quest.reward} <:coin:1088747959342071869>`, inline: false })
            .setFooter({ text: `Quest ID: ${quest.id}` });
          embeds.push(embed);
        });
        await interaction.reply({ embeds, ephemeral: true });
      } else if (type == '1') {
        const weeklyQuests = await quests.findAll({ where: { type: 1 } });
        if (weeklyQuests.length == 0) {
          await interaction.reply('There are no weekly quests');
          return;
        }
        const embeds = [];
        // weekly quests limited to 10
        weeklyQuests.filter((_, i) => i < 10).forEach(quest => {
          const embed = new EmbedBuilder()
            .setTitle(`Weekly Quest for ${quest.game.name}`)
            .setColor(0x00FF00)
            .setDescription(quest.description)
            .addFields(
              { name: 'reward', value: `${quest.reward} <:coin:1088747959342071869>`, inline: false })
            .setFooter({ text: `Quest ID: ${quest.id}` });
          embeds.push(embed);
        });
        await interaction.reply({ embeds, ephemeral: true });
      } else {
        const allQuests = await quests.findAll({
          include: games,
          order: [
            ['gameId', 'ASC'],
          ],
        });
        if (allQuests.length == 0) {
          await interaction.reply('There are no quests');
          return;
        }
        const embeds = [];
        // all quests limited to 10
        allQuests.filter((_, i) => i < 10).forEach(quest => {
          const embed = new EmbedBuilder()
            .setTitle(`Quest for ${quest.game.name}`)
            .setColor(0x00FF00)
            .setDescription(quest.description)
            .addFields(
              { name: 'reward', value: `${quest.reward} <:coin:1088747959342071869>`, inline: false })
            .setFooter({ text: `Quest ID: ${quest.id}` });
          embeds.push(embed);
        });
        await interaction.reply({ embeds, ephemeral: true });
      }
    }
  },
};