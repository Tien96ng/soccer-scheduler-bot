const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("reactions")
    .setDescription("Count Reactions for a message")
    .addStringOption((option) =>
      option
        .setName("messageid")
        .setDescription("The message id")
        .setRequired(true)
    ),
  async execute(interaction) {
    const channel = await interaction.guild.channels.fetch(
      interaction.channelId
    );
    const messageId = interaction.options.getString("messageid");
    const msg = await channel.messages.fetch(messageId);
    const msgCache = await msg.reactions.cache;
    const msgLink = `https://discord.com/channels/${interaction.guildId}/${interaction.channelId}/${messageId}`;
    let embedMsg = msg.embeds[0];
    let s =
      "Reactions for " +
      msgLink +
      " \n ✅ Can Attend\t ❌ Can't Attend\t ⚪ Substitute\n\n";
    for (const reaction of msgCache.values()) {
      const users = await reaction.users.fetch();
      users.forEach((user) => {
        if (!user.bot) {
          s += reaction.emoji.name + ` <@${user.id}> ` + "\n";
        }
      });
      s += "\n";
    }
    const embed = new EmbedBuilder()
      .setTitle("Attendees for latest game")
      .addFields({
        name: embedMsg.fields[0].name,
        value: embedMsg.fields[0].value,
      })
      .addFields({
        name: "Date | Time",
        value: embedMsg.fields[2].value + " | " + embedMsg.fields[3].value,
      });
    await interaction.reply({
      embeds: [embed],
      withResponse: true,
    });
    await interaction.followUp(s);
  },
};
