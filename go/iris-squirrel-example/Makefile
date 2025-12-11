# ---
# variables
# ---

# go
ENTRY="main.go"
OUTPUT="bin/app.exe"

# migrations
PG_MIGRATE_URL="pgx://postgres:postgres@localhost:5432/practice"
MIGRATIONS_PATH="./dal/pg/migrations"

# ---
# commands
# ---

.PHONY: install dev run run-example build run-build \
	migrate rollback migration

default:
	install build run-build

install:
	go mod download

dev: 
	air

run: 
	go run $(ENTRY)

run-example:
	go run ./example/main.go

build: 
	go build -o $(OUTPUT)

run-build:
	./$(OUTPUT)

# ---
# migrations
# ---

migrate:
	migrate -database $(PG_MIGRATE_URL) -path $(MIGRATIONS_PATH) up

rollback:
	migrate -database $(PG_MIGRATE_URL) -path $(MIGRATIONS_PATH) down

migration:
	@echo "Enter migration name"; \
	read NAME; \
	migrate create -ext sql -dir $(MIGRATIONS_PATH) -seq $$NAME;


