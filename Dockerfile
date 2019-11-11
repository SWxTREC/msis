FROM nginx:alpine
COPY entrypoint.sh /
COPY dist/Project-name /usr/share/nginx/html/
COPY nginx.conf.template /etc/nginx/
RUN rm /etc/nginx/conf.d/default.conf
RUN apk update --no-cache && \
    apk upgrade --no-cache && \
    apk add --no-cache gettext bash
VOLUME /usr/share/nginx/html
VOLUME /etc/nginx
ENV NGINX_CONTEXT_ROOT /
EXPOSE 80
CMD /entrypoint.sh && nginx -g 'daemon off;'
