const Discord = require('discord.js');
const client = new Discord.Client();


const botOwner = "600189385765289986";
let botToken = null;
try {
    botToken = process.argv[2];
}
catch (e) {
    console.log("You need to specify a token for the bot.");
}


client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setStatus('away')
    client.user.setPresence({
        game: {
            name: 'with computers',
            type: "PLAYING"
        }
    });

});
client.on("guildMemberAdd", (member) => {
    const guild = member.guild;
    guild.channels.find(channel => channel.name === "server-log").send(member.user + " just connected to the wired!");
    member.addRole(member.guild.roles.find(role => role.name === "lainon"));

});
client.on("guildMemberRemove", (member) => {
    const guild = member.guild;
    guild.channels.find(channel => channel.name === "server-log").send(member.user + " disconnected from the wired!");
});


client.on('message', message => {
    if (message.author.bot)
        return;

    let prefix = ">";
    if (message.content.startsWith(prefix + "avatar")) {
        let user = message.mentions.users.first() || message.author;
        let avatarEmbed = new Discord.RichEmbed()
            .setColor(0x333333)
            .setAuthor(user.username)
            .setImage(user.avatarURL);
        message.channel.send(avatarEmbed);
    }

    else if (message.content.startsWith(prefix + "kick")) {
        let userToKick = message.mentions.users.first() || "";
        if (userToKick === "") {
            message.channel.send("You need to specify an user.");
        }
        else {
            if (message.member.hasPermission("KICK_MEMBERS")) {
                var member = message.mentions.members.first();

                member.kick().then((member) => {
                    message.channel.send(":wave: The user has been successfully kicked !");
                }).catch(() => {
                    console.log("Dickies");
                });
            }
            else {
                message.channel.send("You don't have permission to do that");
            }
        }

    }
    else if (message.content.startsWith(prefix + "ban")) {
        let userToKick = message.mentions.users.first() || "";
        if (userToKick === "") {
            message.channel.send("You need to specify an user.");
        }
        else {
            if (message.member.hasPermission("BAN_MEMBERS")) {
                var member = message.mentions.members.first();

                member.ban().then((member) => {
                    message.channel.send(":wave: The user has been successfully banned !");
                }).catch(() => {
                    console.log("Dickies");
                });
            }
            else {
                message.channel.send("You don't have permission to do that");
            }
        }

    }


});
client.login(botToken);