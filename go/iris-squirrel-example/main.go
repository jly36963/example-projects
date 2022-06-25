package main

import (
	"iris-squirrel-example/api"
	"iris-squirrel-example/providers"
)

func main() {
	providers := providers.SetupProviders()
	api.Start(&providers)
}
