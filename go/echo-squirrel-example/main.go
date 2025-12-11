package main

import (
	"echo-squirrel-example/api"
	"echo-squirrel-example/providers"
)

func main() {
	providers := providers.SetupProviders()
	api.Start(&providers)
}
