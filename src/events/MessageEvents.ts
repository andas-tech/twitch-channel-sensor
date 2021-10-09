import {ChatClient} from "@twurple/chat";
import {createLogger} from "../commons/Logger";
import {ingestMessage} from "../services/StreamingEventStreamingClient";

const logger = createLogger("MessageEvents")

export class MessageEvents{
    public static register(client: ChatClient): void {
        client.onMessage(async (channel, user, message, messageObj) => {
            logger.trace(`${user}@${channel} -> ${message}`)
            ingestMessage(messageObj)
        })
    }
}