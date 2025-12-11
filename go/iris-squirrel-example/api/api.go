package api

import (
	"log"

	iris "github.com/kataras/iris/v12"

	"iris-squirrel-example/api/jutsu"
	"iris-squirrel-example/api/ninja"
	"iris-squirrel-example/providers"
)

func setupServer(providers *providers.Providers) *iris.Application {
	// Create iris server
	app := iris.New()

	// Add routes
	ninja.RegisterNinja(app, providers)
	jutsu.RegisterJutsu(app, providers)
	ninja.RegisterNinjaJutsu(app, providers)

	return app
}

func Start(providers *providers.Providers) {
	port := ":5000"
	app := setupServer(providers)

	log.Fatal(app.Listen(port))
}
