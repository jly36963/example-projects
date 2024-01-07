package main

import (
	"chi-squirrel-example/api"
	"chi-squirrel-example/providers"
)

func main() {
	providers := providers.SetupProviders()
	api.Start(&providers)
}
