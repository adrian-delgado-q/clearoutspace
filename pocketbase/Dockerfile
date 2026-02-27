FROM alpine:3.20

ARG PB_VERSION=0.36.5

RUN apk add --no-cache ca-certificates wget unzip python3 && \
    wget -q "https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip" \
         -O /tmp/pb.zip && \
    unzip -q /tmp/pb.zip -d /pb && \
    rm /tmp/pb.zip

COPY scripts/ /pb/scripts/
COPY entrypoint.sh /pb/entrypoint.sh

EXPOSE 8090

VOLUME ["/pb/pb_data"]

ENTRYPOINT ["/pb/entrypoint.sh"]
