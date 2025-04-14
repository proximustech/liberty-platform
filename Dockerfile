# Build with: docker build -t lp .
FROM node:alpine
WORKDIR /app
#RUN apt update
COPY ./ /app/
RUN cd /app
RUN npm install --force
CMD ["npm","start"]
