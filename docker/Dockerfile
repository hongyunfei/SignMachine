FROM alpine
LABEL AUTHOR="none" \
        VERSION=0.1.3

ENV DEFAULT_LIST_FILE=crontab_list.sh \
        CUSTOM_LIST_MERGE_TYPE=append \
        REPO_URL=https://github.com/hongyunfei/SignMachine.git

RUN set -ex \
        && apk update && apk upgrade\
        && apk add --no-cache tzdata  git  nodejs  moreutils  npm curl jq \
        && ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
        && echo "Asia/Shanghai" > /etc/timezone

RUN git clone ${REPO_URL} /AutoSignMachine \
        && cd /AutoSignMachine \
        && git checkout main \
        && mkdir logs \
        && npm install

RUN cp /scripts/docker/entrypoint.sh /usr/local/bin \
        && chmod +x /usr/local/bin/entrypoint.sh

WORKDIR /AutoSignMachin

ENTRYPOINT ["entrypoint.sh"]

