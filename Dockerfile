# Use a multi-stage build for efficiency
FROM node:22-alpine AS builder

WORKDIR /tmp/

# Coping Web to tmp directory
COPY client/ . client/
COPY server/ . server/

# Install dependencies for backend
WORKDIR /tmp/server
RUN npm install

# Install dependencies for frontend
WORKDIR /tmp/client
RUN npm install --force

# TODO: get real env from somewhere better
RUN cp .env.example .env.production

# Build frontend
RUN npm run build


WORKDIR /usr/src/app
# Copy backend
COPY server/ .

RUN npm install

# Build Backend
RUN npm run build
# Copy static frontent to public folder in backend
RUN mkdir -p ./dist/public
RUN cp -a /tmp/client/dist/. ./dist/public/
RUN ls -la ./dist/public



# Define ENV Variables
ENV ADDRESS=0.0.0.0
ENV PORT=8080
ENV NODE_ENV=production

# Start application \
CMD ["npm", "run", "start"]