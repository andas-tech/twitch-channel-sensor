import {TwitchEventListener} from "../domain/TwitchEventListener";

import {ingestMessage} from "../services/StreamingEventStreamingClient";

module.exports = [
    {
        target: "onMessage",
        execute(message: Message): void {
            ingestMessage(message, "messageCreate")
        }
    },
    {
        target: "onSub",
        execute(message: Presence): void {
            ingestMessage(message)
        }
    }


] as TwitchEventListener[]
