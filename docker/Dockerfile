# debian:bullseye-slimベースnodeイメージ
FROM node:22.9.0-bullseye-slim

# 言語対応
ENV LANG C.UTF-8
# タイムゾーン対応
ENV TZ Asia/Tokyo
# 必要なパッケージの追加
RUN apt-get update && apt-get install -y git vim-tiny

# 作業ディレクトリ設定とファイルコピー
WORKDIR /app
COPY . .

RUN yarn install
