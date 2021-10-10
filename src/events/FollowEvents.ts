import {EventSubListener} from "@twurple/eventsub";
import {ingestMessage} from "../services/StreamingEventStreamingClient";
import {createLogger} from "../commons/Logger";

const logger = createLogger("FollowEvents")

export class FollowEvents {
    public static register(listener: EventSubListener, broadcaster: string) {
        listener.subscribeToChannelFollowEvents(broadcaster, (event) => {
            ingestMessage(event)
        }).then((event) => logger.info(`registering listener for ${broadcaster}`))
    }
}
