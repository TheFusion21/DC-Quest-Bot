// eslint-disable-next-line no-unused-vars
const { Events, Presence } = require('discord.js');

module.exports = {
  name: Events.PresenceUpdate,
  once: false,
  /**
    * @param {Presence?} oldPresence
    * @param {Presence} newPresence
    */
  async execute(oldPresence, newPresence) {
    console.log(oldPresence);
    console.log(newPresence);
  },
};