package main

import (
	"fasthttp-squirrel-example/api"
	"fasthttp-squirrel-example/providers"
)

func main() {
	providers := providers.SetupProviders()
	api.Start(&providers)
}
