const Discord = require('discord.js');
const client = new Discord.Client();
const config = require("./config.json");
client.music = require("discord.js-musicbot-addon");


let botOwner = config.ownerId;
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
client.music.start(client, {
    // Set the api key used for YouTube.
    youtubeKey: config.youtubeToken,
    play: {
        // Usage text for the help command.
        usage: "!play some tunes",
        // Whether or not to exclude the command from the help command.
        exclude: false
    },

    anyoneCanSkip: true,

    ownerOverMember: true,
    ownerID: botOwner,

    cooldown: {
        enabled: false
    }
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

    let prefix = config.botPrefix;
    if (message.content.startsWith(prefix + "avatar")) {
        let user = message.mentions.users.first() || message.author;
        let avatarEmbed = new Discord.RichEmbed()
            .setColor(0x333333)
            .setAuthor(user.username)
            .setImage(user.avatarURL);
        message.channel.send(avatarEmbed);
    }
    else if (message.content.startsWith(prefix + "play")) {
        client.music.bot.playFunction(message, prefix);

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

    else if (message.content.startsWith(prefix + "help")) {
        let helpEmbed = new Discord.RichEmbed()
            .setTitle("List of commands for Lain")
            .setAuthor(client.user.username)
            .setColor(0x00AE86)
            .setDescription("\n- >help : What you're reading right now.\n- >avatar : Get a direct link to your avatar or a mentioned user\n- >ban : ban a specified user \n- >kick : kick a specified user \n- >color : assign yourself a cool color (optional paramater \"remove\" to remove an already assigned color.)- \n!help : Shows the help dialog for the music add-on")
            .setThumbnail(client.user.avatarURL)
            .setTimestamp()
            .setURL("https://discord.js.org/#/docs/main/indev/class/RichEmbed")
            message.channel.send(helpEmbed);

    }
    else if (message.content.startsWith(prefix + "8ball")){
        let answers = ["Probably", "No.", "What kind of question is that?", "Press X to doubt.", "Worship me and I might give you an honest answer.", "Yes.", "I guess.", "Most certainely.", "Fortunately yes."];
        let botAnswer = answers[Math.floor(Math.random() * answers.length)];
        message.channel.send(botAnswer);
    }
    else if (message.content.startsWith(prefix + "color")) {
        let bits = message.content.split(" ");
        let rolesNotToAssign = ["Admins", "Moderators"]
        if (bits.length == 1) {
            message.channel.send("You need to specify a color");
        }
        else {
            if (bits[1] === "remove") {
                let role = message.guild.roles.find(r => r.name === bits[2]);
                let member = message.member;
                member.removeRole(role).catch(message.channel.send("Something went wrong ,check spelling."));
            }
            else {
                for (let i = 0; i < rolesNotToAssign.length; i++) {
                    if (bits[1] == rolesNotToAssign[i]) {
                        message.channel.send("You can't assign yourself this role.");
                        break;
                    }
                    else {
                        let role = message.guild.roles.find(r => r.name === bits[1]);
                        let member = message.member;
                        member.addRole(role).catch(message.channel.send("Something went wrong ,check spelling."));
                    }
                }
            }
        }

    }


});
client.login(botToken);