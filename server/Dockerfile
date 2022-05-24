FROM alekzonder/puppeteer:1
WORKDIR /usr/src/app

COPY ["package.json", "package-lock.json*", "./"]
USER root
RUN npm install --production --silent && mv node_modules ../
COPY . .

EXPOSE 5000
RUN chown -R node /usr/src/app