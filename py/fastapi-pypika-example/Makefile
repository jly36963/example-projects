# ---
# variables
# ---

ALEMBIC=".venv/bin/alembic"

# ---
# commands
# ---

.PHONY: install dev run run-example \
	init-alembic migration migrate rollback rollback-all

install:
	@mkdir -p .venv; pipenv install

dev:
	@pipenv run python3 main.py
	
run:
	@PYTHON_ENV=production pipenv run python3 main.py

run-example: 
	@pipenv run python3 example.py

# ---
# commands (db)
# ---

init-alembic:
	$(ALEMBIC) init alembic

migration:
	@while [ -z "$$MIGRATION_NAME" ]; do \
		read -r -p "Enter Migration Name: " MIGRATION_NAME; \
	done ; \
	$(ALEMBIC) revision -m "$$MIGRATION_NAME"

migrate:
	PYTHONPATH=. $(ALEMBIC) upgrade head

rollback:
	PYTHONPATH=. $(ALEMBIC) downgrade -1

rollback-all:
	PYTHONPATH=. $(ALEMBIC) downgrade base