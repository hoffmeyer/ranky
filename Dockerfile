FROM node:latest

RUN mkdir /src

RUN npm install -g gulp bower nodemon

WORKDIR /src
ADD . /src
RUN npm install

EXPOSE 3000

CMD npm start
#CMD ["/bin/bash"]
