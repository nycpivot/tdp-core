# 1. Set a common base
FROM ubuntu:bionic as base

# 2. Set required CNB information
ENV CNB_USER_ID=1000
ENV CNB_GROUP_ID=1000
ENV CNB_STACK_ID="io.buildpacks.esback.stacks.bionic"
LABEL io.buildpacks.stack.id="io.buildpacks.esback.stacks.bionic"

# 3. Create the user
RUN groupadd cnb --gid ${CNB_GROUP_ID} && \
  useradd --uid ${CNB_USER_ID} --gid ${CNB_GROUP_ID} -m -s /bin/bash cnb

# 4. Install common packages
RUN apt-get update && \
  apt-get install -y --no-install-recommends xz-utils ca-certificates libsqlite3-dev python3 build-essential curl && \
  rm -rf /var/lib/apt/lists/*

RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash -
RUN apt-get install -y --no-install-recommends nodejs
RUN curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | gpg --dearmor | tee /usr/share/keyrings/yarnkey.gpg > /dev/null
RUN echo "deb [signed-by=/usr/share/keyrings/yarnkey.gpg] https://dl.yarnpkg.com/debian stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt-get update && apt-get install yarn
RUN yarn config set python /usr/bin/python3

# 5. Start a new run stage
FROM base as run

# 6. Set user and group (as declared in base image)
USER ${CNB_USER_ID}:${CNB_GROUP_ID}

# 7. Start a new build stage
FROM base as build

# 8. Copy foundation
COPY . /foundation
RUN chmod -R 777 /foundation
WORKDIR /foundation
RUN echo yarn-offline-mirror "./offline-cache" >> .yarnrc
# TODO Remove this
RUN yarn install && yarn tsc

# 9. Set user and group (as declared in base image)
USER ${CNB_USER_ID}:${CNB_GROUP_ID}
