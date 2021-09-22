# ---
# variables
# ---

KNEX="node_modules/.bin/knex"

# ---
# commands (start/build)
# ---

install:
	npm i

dev:
	npm run dev

build:
	npm run build

run:
	npm start

# ---
# commands (test)
# ---

test:
	npm run test

# ---
# commands (db)
# ---

# http://knexjs.org/#Installation-migrations

init-migrate:
	$(KNEX) init -x ts

migrate:
	$(KNEX) migrate:latest

migration:
	@while [ -z "$$MIGRATION_NAME" ]; do \
		read -r -p "Enter Migration Name: " MIGRATION_NAME; \
	done ; \
	$(KNEX) migrate:make "$$MIGRATION_NAME" -x ts

rollback:
	$(KNEX) migrate:rollback