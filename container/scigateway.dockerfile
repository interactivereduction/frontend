FROM harbor.stfc.ac.uk/datagateway/scigateway:develop

WORKDIR /usr/local/apache2/htdocs
COPY --chown=www-data:www-data settings.json ./settings.json
COPY --chown=www-data:www-data default.json ./res/default.json

