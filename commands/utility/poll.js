const { SlashCommandBuilder, EmbedBuilder, hyperlink } = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("poll")
    .setDescription("Creates an embedded poll")
    .addStringOption((option) =>
      option
        .setName("location")
        .setDescription("Location of the game")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("time")
        .setDescription("Time of the game pst")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("date")
        .setDescription("Date of the game")
        .setRequired(true)
    ),
  async execute(interaction) {
    const location = interaction.options.getString("location");
    const locationLink = hyperlink(
      location,
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        location
      )}`
    );
    const time = interaction.options.getString("time");
    const date = interaction.options.getString("date");
    const embed = new EmbedBuilder()
      .setTitle(":soccer: React with your availability for the game! :soccer:")
      .setColor(0x0099ff)
      .addFields(
        { name: ":map: Location", value: locationLink, inline: false },
        { name: "\n", value: "" },
        { name: ":calendar_spiral: Date", value: date, inline: true },
        { name: ":clock3: Time", value: time + " PST", inline: true },
        { name: "\n", value: "" }
      )
      .addFields(
        { name: "Yes", value: "✅", inline: true },
        { name: "No", value: "❌", inline: true },
        { name: "Sub", value: "⚪", inline: true }
      )
      .setTimestamp();
    const msg = await interaction.reply({
      embeds: [embed],
      withResponse: true,
    });
    try {
      await msg.resource.message.react("✅");
      await msg.resource.message.react("❌");
      await msg.resource.message.react("⚪");
    } catch (error) {
      console.log(error);
    }
  },
};
