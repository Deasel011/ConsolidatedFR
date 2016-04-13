FROM node:4-onbuild


COPY package.json /src/package.json

RUN cd /src; npm install

COPY src/ /src/
COPY log/ /log/

EXPOSE 3001
EXPOSE 3001/udp

CMD ["node","/src/main.js"]
