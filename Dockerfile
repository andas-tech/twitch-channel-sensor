FROM node:16-alpine3.14

RUN apk update && apk upgrade
RUN apk add supervisor

RUN mkdir /app
ADD ./ /app/

RUN cd /app && \
    npm ci --production && \
    npm run build

WORKDIR /app
CMD supervisord -c supervisor.conf