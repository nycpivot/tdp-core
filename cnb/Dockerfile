FROM ubuntu:bionic as base

# Required CNB information
ENV CNB_USER_ID=1000
ENV CNB_GROUP_ID=1000
ENV CNB_STACK_ID="io.buildpacks.esback.stacks.bionic"
LABEL io.buildpacks.stack.id="io.buildpacks.esback.stacks.bionic"
RUN groupadd cnb --gid ${CNB_GROUP_ID} && \
  useradd --uid ${CNB_USER_ID} --gid ${CNB_GROUP_ID} -m -s /bin/bash cnb

# Install node/yarn and other OS requirements
RUN apt-get update && \
  apt-get install -y --no-install-recommends xz-utils ca-certificates libsqlite3-dev python3 build-essential curl && \
  rm -rf /var/lib/apt/lists/*
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash -
RUN apt-get install -y --no-install-recommends nodejs
RUN curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | gpg --dearmor | tee /usr/share/keyrings/yarnkey.gpg > /dev/null
RUN echo "deb [signed-by=/usr/share/keyrings/yarnkey.gpg] https://dl.yarnpkg.com/debian stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt-get update && apt-get install yarn
RUN yarn config set python /usr/bin/python3

# Run image
FROM base as run
USER ${CNB_USER_ID}:${CNB_GROUP_ID}

# Intermediary image to build bootstrap cli
FROM base as bootstrap-builder
COPY cli /bootstrap
WORKDIR /bootstrap
RUN curl -O -L "https://go.dev/dl/go1.18.6.linux-amd64.tar.gz" \
        && rm -rf /usr/local/go \
        && tar -C /usr/local -xzf "go1.18.6.linux-amd64.tar.gz" \
        && rm "go1.18.6.linux-amd64.tar.gz"
ENV PATH="${PATH}:/usr/local/go/bin"
RUN go mod tidy && go build .

# Builder image
FROM base as build
COPY . /foundation
COPY --from=bootstrap-builder /bootstrap/bootstrap /foundation
RUN chmod -R 777 /foundation
WORKDIR /foundation
RUN echo yarn-offline-mirror "./offline-cache" >> .yarnrc
RUN yarn install
USER ${CNB_USER_ID}:${CNB_GROUP_ID}
