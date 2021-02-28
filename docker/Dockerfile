FROM alpine:latest

WORKDIR /SignMachine/

ENV REPO_URL=https://github.com/hongyunfei/SignMachine.git


RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.tuna.tsinghua.edu.cn/g' /etc/apk/repositories
RUN apk add --no-cache tzdata nodejs npm
RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime

# 复制代码
RUN npm install --registry https://registry.npm.taobao.org

RUN git clone ${REPO_URL} /SignMachine \
        && cd /SignMachine \
        && git checkout main \
        && mkdir logs \
        && npm install
RUN cp /SignMachine/docker/entrypoint.sh /usr/local/bin \
        && chmod +x /usr/local/bin/entrypoint.sh  

ENTRYPOINT ["entrypoint.sh"]

