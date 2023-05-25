#################################################################################
#     Stage 1: Install Verdaccio, populate its storage and embed it in builder  #
#################################################################################
FROM harbor-repo.vmware.com/dockerhub-proxy-cache/library/node:16.17-bullseye-slim as installer

RUN apt-get update && \
    apt-get install -y --no-install-recommends libsqlite3-dev python3 build-essential curl ca-certificates jq && \
    rm -rf /var/lib/apt/lists/* && \
    yarn config set python /usr/bin/python3

COPY packages/builder builder

# Install forever & verdaccio in a separate folder to avoid issues when purging node_modules
RUN mkdir registry
RUN cp builder/conf/verdaccio/package.pack.json registry/package.json
RUN cp builder/conf/verdaccio/online_config.yaml registry
RUN cp builder/conf/verdaccio/offline_config.yaml registry
RUN cp builder/conf/verdaccio/start_offline.sh registry
RUN cp builder/conf/verdaccio/stop_offline.sh registry
RUN yarn --cwd registry install

# Specify that we will use Verdaccio as our registry
RUN echo 'registry "http://localhost:4873"' > builder/.yarnrc

# Install the builder dependencies using verdaccio to populate the registry's storage
RUN cp builder/conf/verdaccio/setup.sh setup_verdaccio.sh
RUN ./setup_verdaccio.sh
RUN rm setup_verdaccio.sh && rm registry/online_config.yaml

# Embed verdaccio in the builder folder
RUN cp -R registry builder/registry

# Add preinstall & postinstall scripts
RUN cp builder/package.json builder/package.original.json
RUN cat builder/package.json | jq --arg preinstall 'yarn --cwd registry start' '. * {"scripts": {preinstall: $preinstall}}' > builder/package.1.json
RUN cat builder/package.1.json | jq --arg start 'yarn --cwd portal start-portal' '. * {"scripts": {start: $start}}' > builder/package.2.json
RUN cp builder/package.2.json builder/package.json
RUN rm builder/package.1.json && rm builder/package.2.json


##################################################################################
##             Stage 2: Only keep the builder folder for the buildpack              #
##################################################################################
FROM scratch

COPY --from=installer builder builder

### What's left (at least) ?
# - clean up duplicated stuff (localhost:4873 vs .yarnrc)
# - generate a yarn.lock file for the builder (eventually move it outside packages)
# - trimming the generated portal if possible
