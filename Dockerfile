FROM node:14.11.0

WORKDIR /usr/src/app

USER root

# Install dependencies
COPY package.json yarn.lock .yarnrc ./
COPY packages/admin/package.json packages/admin/
COPY packages/server/package.json packages/server/

RUN yarn install --frozen-lockfile --production=true

COPY . .

RUN npm rebuild node-sass
RUN yarn build

EXPOSE 8080

CMD [ "yarn", "start" ]