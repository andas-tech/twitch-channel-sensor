import * as dotenv from "dotenv"
import {RefreshingAuthProvider, StaticAuthProvider} from '@twurple/auth';
import {ChatClient} from '@twurple/chat';
import {createLogger} from "./commons/Logger";
import path from "path";
import fs from "fs";

dotenv.config() // Read .env file into Environment Variables (process.env...)

const main = () => {
    const logger = createLogger("main")

    const clientId = process.env.TWITCH_CLIENT_ID as string
    const clientSecret = process.env.TWITCH_CLIENT_SECRET as string
    const accessToken = process.env.TWITCH_ACCESS_TOKEN as string
    const refreshToken = process.env.TWITCH_REFRESH_TOKEN as string

    const authProvider = new StaticAuthProvider(clientId, accessToken)
    const refreshingAuthProvider = new RefreshingAuthProvider(
        {
            clientId,
            clientSecret,
        },
        {
            accessToken,
            refreshToken,
        })
    const moduleLocations = [
        './events'
    ]

    const botClient = new ChatClient({authProvider: refreshingAuthProvider, channels: ['heytimmy64']});
    botClient.connect().then(() => {
        moduleLocations.forEach((location) => {
            const modulePath = path.join(__dirname, location)
            fs.readdir(modulePath, (err, files) => {
                if (err != undefined) {
                    throw err
                }
                files.forEach((file) => {
                    const filePath = path.join(modulePath, file)
                    import(filePath).then((modules) => {
                        Object.keys(modules).filter((event) => event !== "default")
                            .forEach((handler) => {
                                const {execute, target, once} = modules[handler]
                                logger.info(`wiring up ${file} module for 'on' ${target}`)
                                botClient.on(target, (...args) => execute(...args))
                            })
                    })
                })
            })
        })
    })
}

main()
