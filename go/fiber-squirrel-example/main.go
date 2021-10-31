package main

import (
	"fiber-squirrel-example/api"
	"fiber-squirrel-example/providers"
)

func main() {
	providers := providers.SetupProviders()
	api.Start(&providers)
}
