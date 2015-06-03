FROM node

RUN npm install -g gulp && \
    npm install -g bower

WORKDIR /src

CMD ["/bin/bash"]
