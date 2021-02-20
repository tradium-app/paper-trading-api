FROM node:14.11.0

RUN apt-get update \
    && apt-get install -y wget gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

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