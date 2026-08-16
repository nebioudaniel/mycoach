FROM golang:1.23-alpine AS builder

WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -o /bin/mycoach-api ./cmd/server

FROM alpine:3.20
RUN apk add --no-cache ca-certificates
COPY --from=builder /bin/mycoach-api /usr/local/bin/mycoach-api
COPY internal/db/migrations /app/migrations
WORKDIR /app
EXPOSE 8080
CMD ["mycoach-api"]
