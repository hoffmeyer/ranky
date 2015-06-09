FROM node:0.12.4

RUN npm install -g gulp bower nodemon
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ONBUILD RUN npm install

EXPOSE 3000

CMD [ "npm", "start" ]
#CMD ["/bin/bash"]
