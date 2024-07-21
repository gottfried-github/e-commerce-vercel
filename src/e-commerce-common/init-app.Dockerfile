FROM node

ENV APP_DB_USER a
ENV APP_DB_PASS a
ENV APP_DB_NAME a
ENV NET_NAME a

ENV USER_NAME a
ENV USER_PSSWD a
ENV USER_EMAIL a

COPY init-app.sh /init-app.sh

CMD ["bash", "-c", "/init-app.sh"]