import pino from "pino"


export const createLogger = (name: string): pino.Logger => {
    return pino({ name })
}