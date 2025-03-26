# Build with: docker build -t lp .
FROM node:20-slim
WORKDIR /app
RUN apt update
COPY ./ /app/
RUN cd /app
RUN npm install --force
CMD ["npm","start"]
