package api

import (
	"log"

	fiber "github.com/gofiber/fiber/v2"

	"fiber-squirrel-example/api/jutsu"
	"fiber-squirrel-example/api/ninja"
	"fiber-squirrel-example/providers"
)

func setupServer(providers *providers.Providers) *fiber.App {
	// create fiber server
	app := fiber.New()

	// add routes
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
