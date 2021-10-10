import {createLogger} from "../commons/Logger";
import {KafkaClient, Producer} from "kafka-node";
import {TwitchKafkaTopics} from "@andas/streaming-events/dist/Twitch";
import {EventSubChannelFollowEvent} from "@twurple/eventsub";
import {PrivateMessage} from "@twurple/chat";



const logger = createLogger("StreamingEventStreamingClient")
const kafkaHost = process.env.KAFKA_HOST

type ValidTypes =
    | PrivateMessage
    | EventSubChannelFollowEvent

export const ingestMessage = (message: ValidTypes) => {
    if (message instanceof PrivateMessage) {
        publish(TwitchKafkaTopics.KAFKA_TOPIC_TWITCH_MESSAGE_CREATE, JSON.stringify(message))
    } else if (message instanceof EventSubChannelFollowEvent) {
        publish(TwitchKafkaTopics.KAFKA_TOPIC_TWITCH_FOLLOW_CREATE, JSON.stringify(message))
    }
}

const publish = (topic: string, message: string) => {
    const client = new KafkaClient({kafkaHost})
    const producer = new Producer(client)
    producer.on("ready", () => client.refreshMetadata(
        [topic], (err) => {
            if (err) {

                logger.error(err)
                return
            }

            producer.send([
                {
                    topic,
                    messages: [message]
                }
            ], (err => {
                if (err) {
                    logger.error(err)
                    return
                }
            }))
        }))

    producer.on("error", (err) => logger.error(err))
}
