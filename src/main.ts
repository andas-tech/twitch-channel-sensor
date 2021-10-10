import * as dotenv from "dotenv"
import {createLogger} from "./commons/Logger";
import {TwitchClientFactory} from "./TwitchClientFactory";
import {MessageEvents} from "./events/MessageEvents";
import {EventSubListener, ReverseProxyAdapter} from "@twurple/eventsub";
import {FollowEvents} from "./events/FollowEvents";

dotenv.config() // Read .env file into Environment Variables (process.env...)

const main = () => {
    const logger = createLogger("TwitchChannelSensor")

    const botClient = TwitchClientFactory.getBotClient()
    botClient.connect().then(() => {
        logger.info(`client connected`)
        botClient.onRegister(() => {
            logger.info(`client registered as ${botClient.currentNick}`)
            MessageEvents.register(botClient)
        })
    }).catch((err) => logger.error(err))

    const apiClient = TwitchClientFactory.getApiClient()
    const eventSubAdapter = new ReverseProxyAdapter({
        hostName: process.env.HOST as unknown as string,
        port: process.env.PORT as unknown as number,
        pathPrefix: "/twitch/eventsub/"
    })
    const eventSubListener = new EventSubListener({
        apiClient,
        adapter: eventSubAdapter,
        secret: process.env.TWITCH_EVENTSUB_SECRET as string,
    })

    eventSubListener.listen().then(() => {
        const channelList = TwitchClientFactory.getChannelList()
        apiClient.users.getUsersByNames(channelList).then((broadcasters) => {
            broadcasters.forEach((broadcaster) => {
                FollowEvents.register(eventSubListener, broadcaster.id)
            })
        })
    })
}

main()
