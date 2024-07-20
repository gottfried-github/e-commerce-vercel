FROM node

ENV APP_DB_USER a
ENV APP_DB_PASS a
ENV APP_DB_NAME a
ENV NET_NAME a
ENV SESSION_SECRETS a

RUN npm i -g nodemon

CMD ["bash", "-c", "cd /app && nodemon --max_old_space_size=4096 --env-file e-commerce-app/.env e-commerce-app/index.js"]