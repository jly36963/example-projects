# ---
# variables
# ---

ORATOR=".venv/bin/orator"
PG_CONFIG="./connections/pg.py"

# ---
# commands (start/build)
# ---

install:
	mkdir -p .venv
	pipenv install --dev

dev:
	pipenv run python3 main.py

run:
	pipenv run python3 main.py

# ---
# commands (test)
# ---

test:
	echo "No tests implemented"

# ---
# commands (db)
# ---

migrate:
	$(ORATOR) migrate -c $(PG_CONFIG) -vvv

migration:
	@while [ -z "$$MIGRATION_NAME" ]; do \
		read -r -p "Enter Migration Name: " MIGRATION_NAME; \
	done ; \
	$(ORATOR) make:migration "$$MIGRATION_NAME"

rollback:
	$(ORATOR) migrate:rollback -c $(PG_CONFIG) -vvv

rollback-all:
	$(ORATOR) migrate:reset -c $(PG_CONFIG) -vvv

migrate-status:
	$(ORATOR) migrate:status -c $(PG_CONFIG) -vvv
