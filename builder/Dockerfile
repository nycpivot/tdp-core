#################################################################################
#     Stage 1: Install Verdaccio, populate its storage and embed it in builder  #
#################################################################################
FROM harbor-repo.vmware.com/dockerhub-proxy-cache/library/node:16-bullseye-slim@sha256:726698a073f984efd26cb31c176a35b39200c4a82f4dc6f933c7cc957403b567 as installer

RUN apt-get update && \
    apt-get install -y --no-install-recommends libsqlite3-dev python3 build-essential curl ca-certificates jq && \
    rm -rf /var/lib/apt/lists/* && \
    yarn config set python /usr/bin/python3

COPY ./builder-source /builder

# Install forever & verdaccio in a separate folder to avoid issues when purging node_modules
RUN mkdir /registry
COPY ./verdaccio/package.pack.json /registry/package.json
COPY ./verdaccio/online_config.yaml /registry
COPY ./verdaccio/offline_config.yaml /registry
COPY ./verdaccio/start_offline.sh /registry
COPY ./verdaccio/stop_offline.sh /registry
RUN yarn --cwd registry install

# Specify that we will use Verdaccio as our registry
COPY ./builder-verdaccio-yarnrc /builder/.yarnrc

# Install the builder dependencies using verdaccio to populate the registry's storage
COPY ./verdaccio/setup.sh /setup_verdaccio.sh
RUN /setup_verdaccio.sh && \
    rm setup_verdaccio.sh /registry/online_config.yaml

# Embed verdaccio in the builder folder
RUN cp -r registry /builder/registry

# Add preinstall & postinstall scripts
COPY ./builder-source/package.json /builder/package.original.json
RUN jq \
    --arg preinstall 'yarn --cwd registry start' \
    --arg start 'yarn --cwd portal start-portal' \
    '. * {"scripts": {preinstall: $preinstall}} * {"scripts": {start: $start}}' \
    <builder/package.original.json \
    >builder/package.json && \
    rm /builder/package.original.json


##################################################################################
##             Stage 2: Only keep the builder folder for the buildpack              #
##################################################################################
FROM scratch

COPY --from=installer builder /builder

### What's left (at least) ?
# - generate a yarn.lock file for the builder (eventually move it outside packages)
# - trimming the generated portal if possible
# - maybe inline setup_verdaccio.sh
#   - it is only run within this dockerfile
#   - what belongs in a script as opposed to inlining?
