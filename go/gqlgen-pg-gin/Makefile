# ---
# variables
# ---

ENTRY="main.go"
OUTPUT="bin/app.exe"

# ---
# commands
# ---

dev: 
	air

run: 
	go run $(ENTRY)

build: 
	go build -o $(OUTPUT)

run-build:
	./$(OUTPUT)

lint: 
	go fmt ./...

install: 
	go get -d ./...

# ---
# gqlgen
# ---

gqlgen-init:
	go run github.com/99designs/gqlgen init

gqlgen-prepare:
	go run github.com/99designs/gqlgen generate

gqlgen-generate:
	go generate ./...

# ---
# migrations
# ---

migration-init:
	go run migrations/*.go init

migrate:
	go run migrations/*.go up

rollback:
	go run migrations/*.go down

rollback-all:
	go run migrations/*.go reset
