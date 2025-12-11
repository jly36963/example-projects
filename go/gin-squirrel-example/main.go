package main

import (
	"gin-squirrel-example/api"
	"gin-squirrel-example/providers"
)

func main() {
	providers := providers.SetupProviders()
	api.Start(&providers)
}
