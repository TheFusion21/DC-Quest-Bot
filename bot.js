const { token, client_id } = require('./config.json');
// eslint-disable-next-line no-unused-vars
const { REST, Routes, Collection, Events, Client, GatewayIntentBits, GuildMember } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
  ],
});
client.commands = new Collection();

const commands = [];

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

const questingEvents = require('./eventing.js').questingEvents;

const { achievements, guilds, users } = require('./dbObjects');

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  // Set a new item in the Collection with the key as the command name and the value as the exported module
  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
    commands.push(command.data.toJSON());
  } else {
    console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
  }
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

const rest = new REST({ version: '10' }).setToken(token);


(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(Routes.applicationCommands(client_id), { body: commands });

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();

client.on(Events.InteractionCreate, async (interaction) => {
  console.log(interaction);
  if (interaction.isChatInputCommand()) {
    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      console.error(`No command matching ${interaction.commandName} was found.`);
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(`Error executing ${interaction.commandName}`);
      console.error(error);
    }
  } else if (interaction.isAutocomplete()) {
    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      console.error(`No command matching ${interaction.commandName} was found.`);
      return;
    }

    try {
      await command.autocomplete(interaction);
    } catch (error) {
      console.error(`Error autocompleting ${interaction.commandName}`);
      console.error(error);
    }
  }

});

/**
  * @param {GuildMember} member
  * @param {achievements} achievement
 */
// eslint-disable-next-line no-empty-function
questingEvents.on('achievement', async (member, achievement) => {

});

// eslint-disable-next-line no-empty-function
questingEvents.on('questcomplete', async (member, quest) => {

});


client.login(token);

// https://discord.com/api/oauth2/authorize?client_id=1078678661445722162&permissions=388694542400&scope=bot%20applications.commands