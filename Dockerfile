FROM node:14.11.0

WORKDIR /usr/src/app

USER root

# Install dependencies
COPY package.json yarn.lock .yarnrc ./
RUN yarn install --frozen-lockfile --production=true

COPY . .

EXPOSE 8080

CMD [ "yarn", "start" ]