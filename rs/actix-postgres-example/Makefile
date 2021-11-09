# ---
# variables
# ---

# TODO

# --- 
# commands
# --- 

.PHONY: dev dev-build build run-example

# creates (and runs) execurable in ./target/debug/<project-name>
dev: 
	@cargo run

# creates execurable in ./target/debug/<project-name>
dev-build: 
	@cargo build

# creates executable in ./target/release/<project-name>
build: 
	@cargo build --release

# run example script to test api
run-example:
	@cargo run --bin example

