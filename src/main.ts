import * as dotenv from "dotenv"
import {createLogger} from "./commons/Logger";
import {TwitchClientFactory} from "./client";
import {MessageEvents} from "./events/MessageEvents";

dotenv.config() // Read .env file into Environment Variables (process.env...)

const main = () => {
    const logger = createLogger("TwitchChannelSensor")

    const botClient = TwitchClientFactory.get()
    botClient.connect().then(() => {
        logger.info(`client connected`)
        botClient.onRegister(() => {
            logger.info(`client registered as ${botClient.currentNick}`)
            MessageEvents.register(botClient)
        })
    }).catch((err) => logger.error(err))
}

main()
