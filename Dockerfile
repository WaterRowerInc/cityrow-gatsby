    FROM node:18
    WORKDIR /app

   # RUN apk update && apk add build-base autoconf automake libtool pkgconfig nasm

    COPY package.json .
    #COPY package-lock.json .

    #RUN npm install -g gatsby-cli && gatsby telemetry --disable 
    
    RUN npm install
    #RUN npm i express
    RUN npm install -g gatsby-cli
    #RUN npm run build
    
    COPY . .
    
    EXPOSE 8000
    
    # Define environment variable to ensure file watching works correctly in Docker
    ENV NODE_ENV=development
    ENV CHOKIDAR_USEPOLLING=true
    
    #CMD ["npx", "serve", "-s", "public", "-l", "8000"]
    #CMD ["npm", "run", "develop"]
    #CMD ["gatsby", "develop", "-H", "0.0.0.0", "-p", "--inspect"]
    CMD ["gatsby", "develop", "-H", "0.0.0.0"]

