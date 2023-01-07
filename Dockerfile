FROM node:latest

RUN apt-get update && \
    apt-get install -yq tzdata && \
    ln -fs /usr/share/zoneinfo/America/New_York /etc/localtime && \
    dpkg-reconfigure -f noninteractive tzdata


WORKDIR /usr/src/app

COPY package.json ./

RUN npm install

COPY . .

CMD ["node", "index.js"]