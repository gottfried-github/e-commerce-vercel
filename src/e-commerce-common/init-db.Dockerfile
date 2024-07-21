FROM mongo

ENV ADMIN_USER a
ENV ADMIN_PSSWD a
ENV APP_USER a
ENV APP_PSSWD a
ENV DB_NAME a
ENV NET_NAME a

COPY init-db.sh /init-db.sh

CMD ["bash", "-c", "/init-db.sh"]