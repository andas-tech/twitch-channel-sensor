import {ChatClient} from "@twurple/chat";
import {RefreshingAuthProvider, StaticAuthProvider} from "@twurple/auth";

export class TwitchClientFactory {

    private static _client: ChatClient

    public static get(): ChatClient {
        if (!TwitchClientFactory._client) {
            TwitchClientFactory._client = TwitchClientFactory.createClient();
        }
        return TwitchClientFactory._client;
    }

    private static getChannelList(): string[] {
        const channelList = process.env.CHANNEL_LIST as string
        return channelList.split(',') || []
    }

    private static createClient(): ChatClient {
        const clientId = process.env.TWITCH_CLIENT_ID as string
        const clientSecret = process.env.TWITCH_CLIENT_SECRET as string
        const accessToken = process.env.TWITCH_ACCESS_TOKEN as string
        const refreshToken = process.env.TWITCH_REFRESH_TOKEN as string

        const authProvider = new RefreshingAuthProvider(
            {
                clientId,
                clientSecret
            },
            {
                accessToken,
                refreshToken,
                expiresIn: null,
                obtainmentTimestamp: Date.now(),
            })

        const channels = TwitchClientFactory.getChannelList()
        if (channels.length === 0) {
            throw Error('no channels defined')
        }

        return new ChatClient({
            authProvider: authProvider,
            channels,
        });
    }
}
