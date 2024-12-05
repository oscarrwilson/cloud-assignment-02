# Stage 1: Build
FROM gcc:12 as builder
WORKDIR /usr/src/app
RUN apt-get update && apt-get install -y libmicrohttpd-dev
COPY src/ ./src/
RUN gcc -o server src/http_server.c src/palindrome.c -lmicrohttpd

# Stage 2: Runtime
FROM debian:bookworm-slim
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/server /usr/src/app/
RUN apt-get update && apt-get install -y libmicrohttpd12
CMD ["./server"]