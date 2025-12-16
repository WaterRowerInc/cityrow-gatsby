    FROM node:20
    WORKDIR /app

   # RUN apk update && apk add build-base autoconf automake libtool pkgconfig nasm

    COPY package.json .
    #COPY package-lock.json .

    RUN npm install -g gatsby-cli && gatsby telemetry --disable 
    
    RUN npm install
    #RUN npm i express
    RUN npm install -g gatsby-cli
    RUN npm run build
    EXPOSE 8000
    
    COPY . .

    #CMD ["npx", "serve", "-s", "public", "-l", "8000"]
    #CMD ["npm", "run", "develop"]
    CMD ["gatsby", "develop", "-H", "0.0.0.0", "--verbose"]

