import {ChatClient} from "@twurple/chat";
import {ClientCredentialsAuthProvider, RefreshingAuthProvider} from "@twurple/auth";
import {ApiClient} from "@twurple/api";

export class TwitchClientFactory {

    private static _authProvider: RefreshingAuthProvider

    private static _apiClient: ApiClient
    private static _botClient: ChatClient

    public static getBotClient(): ChatClient {
        if (!TwitchClientFactory._botClient) {
            TwitchClientFactory._botClient = TwitchClientFactory.createBotClient();
        }
        return TwitchClientFactory._botClient;
    }

    public static getChannelList(): string[] {
        const channelList = process.env.CHANNEL_LIST as string
        return channelList.split(',') || []
    }

    private static createBotClient(): ChatClient {
        const authProvider = TwitchClientFactory.getRefreshingAuthProvider();
        const channels = TwitchClientFactory.getChannelList()
        if (channels.length === 0) {
            throw Error('no channels defined')
        }

        return new ChatClient({
            authProvider: authProvider,
            channels,
        });
    }

    public static getApiClient(): ApiClient {
        if (!TwitchClientFactory._apiClient) {
            TwitchClientFactory._apiClient = TwitchClientFactory.createApiClient();
        }
        return TwitchClientFactory._apiClient;
    }

    private static createApiClient(): ApiClient {
        const clientId = process.env.TWITCH_CLIENT_ID as string
        const clientSecret = process.env.TWITCH_CLIENT_SECRET as string

        const authProvider = new ClientCredentialsAuthProvider(
            clientId,
            clientSecret,
        )

        return new ApiClient({
            authProvider
        })
    }

    private static getRefreshingAuthProvider() {
        if (!TwitchClientFactory._authProvider) {
            TwitchClientFactory._authProvider = TwitchClientFactory.createRefreshingAuthProvider()
        }
        return TwitchClientFactory._authProvider
    }

    private static createRefreshingAuthProvider() {
        const clientId = process.env.TWITCH_CLIENT_ID as string
        const clientSecret = process.env.TWITCH_CLIENT_SECRET as string
        const accessToken = process.env.TWITCH_ACCESS_TOKEN as string
        const refreshToken = process.env.TWITCH_REFRESH_TOKEN as string

        return new RefreshingAuthProvider(
            {
                clientId,
                clientSecret
            },
            {
                accessToken,
                refreshToken,
                expiresIn: null,
                obtainmentTimestamp: Date.now(),
            });
    }
}
