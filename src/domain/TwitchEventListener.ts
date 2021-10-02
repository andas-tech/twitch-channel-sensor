export interface TwitchEventListener {
    target: string
    execute: (...args: any) => void
}