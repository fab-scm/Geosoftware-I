FROM    node:latest
# ENV     NODE_ENV=production
# ENV     PORT=3000
WORKDIR /app
COPY    . /app
RUN     npm install
EXPOSE  3000
CMD     ["npm", "start"]