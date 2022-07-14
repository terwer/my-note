FROM node:16 as NODE_BUILD
WORKDIR /go/src/github.com/siyuan-note/siyuan/
ADD . /go/src/github.com/siyuan-note/siyuan/
RUN npm config set registry https://registry.npmmirror.com/
RUN npm install -g pnpm
RUN pnpm config set registry https://registry.npmmirror.com/
RUN pnpm config set electron_mirror https://npmmirror.com/mirrors/electron/
RUN cd app && pnpm install && pnpm run build

FROM golang:alpine as GO_BUILD
WORKDIR /go/src/github.com/siyuan-note/siyuan/
COPY --from=NODE_BUILD /go/src/github.com/siyuan-note/siyuan/ /go/src/github.com/siyuan-note/siyuan/
ENV GO111MODULE=on
ENV CGO_ENABLED=1
RUN apk add --no-cache gcc musl-dev git
RUN go env -w GOPROXY=https://goproxy.cn
RUN cd kernel && go build --tags fts5 -v -ldflags "-s -w -X github.com/siyuan-note/siyuan/kernel/util.Mode=prod" && \
    mkdir /opt/siyuan/ && \
    mv /go/src/github.com/siyuan-note/siyuan/app/appearance/ /opt/siyuan/ && \
    mv /go/src/github.com/siyuan-note/siyuan/app/stage/ /opt/siyuan/ && \H
    mv /go/src/github.com/siyuan-note/siyuan/app/guide/ /opt/siyuan/ && \
    mv /go/src/github.com/siyuan-note/siyuan/kernel/kernel /opt/siyuan/ && \
    find /opt/siyuan/ -name .git | xargs rm -rf

FROM alpine:latest
LABEL maintainer="Terwer<youweics@163.com>"

WORKDIR /opt/siyuan/
COPY --from=GO_BUILD /opt/siyuan/ /opt/siyuan/
RUN addgroup --gid 1000 siyuan && adduser --uid 1000 --ingroup siyuan --disabled-password siyuan && apk add --no-cache ca-certificates tzdata && chown -R siyuan:siyuan /opt/siyuan/

ENV TZ=Asia/Shanghai
EXPOSE 6806

USER siyuan
ENTRYPOINT [ "/opt/siyuan/kernel" ]
