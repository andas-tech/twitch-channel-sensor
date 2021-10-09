import {createLogger} from "../commons/Logger";
import {KafkaClient, Producer} from "kafka-node";
import {TwitchPrivateMessage} from "@twurple/chat/lib/commands/TwitchPrivateMessage";
import {TwitchKafkaTopics} from "@andas/streaming-events/dist/Twitch";



const logger = createLogger("StreamingEventStreamingClient")
const kafkaHost = process.env.KAFKA_HOST

type ValidTypes = TwitchPrivateMessage

export const ingestMessage = (message: ValidTypes) => {
    publish(TwitchKafkaTopics.KAFKA_TOPIC_TWITCH_MESSAGE_CREATE, JSON.stringify(message))
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
