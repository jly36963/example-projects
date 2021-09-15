# Rocket

https://github.com/SergioBenitez/Rocket
https://rocket.rs/v0.4/overview/

## Setup

- [docs](https://rocket.rs/v0.4/guide/quickstart/)
- [docs](https://rocket.rs/v0.4/guide/getting-started/)

- Rocket requires nightly version of rust
  - rustup default nightly
  - rustup update && cargo update
- Add this line to `Cargo.toml` file:
  - `rocket = "0.4.10"`

## Startup

```bash
# dev (requires "air")
make dev
# run
make run
# build / run
make build; make run-build
```
