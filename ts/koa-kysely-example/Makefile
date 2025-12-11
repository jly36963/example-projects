# ---
# variables
# ---

KNEX="node_modules/.bin/knex"

# ---
# commands (start/build)
# ---

.PHONY: install dev build run run-example \
	init-migrate migration migrate-up migrate-all migrate-down migrate-rollback

install:
	npm i

dev:
	npm run dev

build:
	npm run build

run:
	npm start

# ---
# commands (example)
# ---

run-example:
	npm run run-example

# ---
# commands (db)
# ---

# http://knexjs.org/#Installation-migrations

migrate-init:
	$(KNEX) init -x ts

migration:
	@while [ -z "$$MIGRATION_NAME" ]; do \
		read -r -p "Enter Migration Name: " MIGRATION_NAME; \
	done ; \
	$(KNEX) migrate:make "$$MIGRATION_NAME" -x --esm

migrate-up:
	$(KNEX) migrate:up --esm

migrate-all:
	$(KNEX) migrate:latest --esm

migrate-down:
	$(KNEX) migrate:down --esm

migrate-rollback:
	$(KNEX) migrate:rollback --esm

