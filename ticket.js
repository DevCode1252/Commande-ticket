const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

const ticketCategoryID = '123456789654321';

const ouvrirTicketCommand = new SlashCommandBuilder()
  .setName('ouvrir-ticket')
  .setDescription('Ouvrir un nouveau ticket');

async function execute(interaction) {
  const guild = interaction.guild;
  const user = interaction.user;

  try {

    const ticketChannel = await guild.channels.create(`ticket-${user.username}`, {
      type: 'text',
      parent: ticketCategoryID,
      permissionOverwrites: [
        {
          id: guild.roles.everyone,
          deny: ['VIEW_CHANNEL'],
        },
        {
          id: user.id,
          allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'ATTACH_FILES'],
        },
      ],
    });

    // Création de l'embed d'information
    const embed = new MessageEmbed()
      .setColor('#00ff00')
      .setTitle('Nouveau Ticket')
      .setDescription(`Ticket créé par ${user}`)
      .addField('Utilisateur', user.tag)
      .setTimestamp();


    await ticketChannel.send({ embeds: [embed] });


    await interaction.reply('Un nouveau ticket a été ouvert. Veuillez vérifier vos messages privés pour y accéder.');


    await user.send(`Votre ticket a été ouvert : ${ticketChannel}`);
  } catch (error) {
    console.error('Une erreur s\'est produite lors de l\'ouverture du ticket :', error);
    await interaction.reply('Une erreur s\'est produite lors de l\'ouverture du ticket. Veuillez réessayer plus tard.');
  }
}

module.exports = {
  data: ouvrirTicketCommand,
  execute: execute
};
