# docker image with node v11.10.1 installed
FROM node:11.10.1

LABEL authors="syuraj@gmail.com, shrestha2lt8@gmail.com"

# read DATABASE_URL variable from either .env file or heroku config
ENV DATABASE_URL=$DATABASE_URL

RUN mkdir /etc/nepaltoday

WORKDIR /etc/nepaltoday

# Expose port for local development, HEROKU Ignores EXPOSE command
EXPOSE 4000

# Add your source files
COPY . .

CMD ["npm","start"]
