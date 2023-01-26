package api

import (
	"log"

	echo "github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"

	"echo-squirrel-example/api/jutsu"
	"echo-squirrel-example/api/ninja"
	"echo-squirrel-example/providers"
)

func setupServer(providers *providers.Providers) *echo.Echo {
	// Create echo server
	app := echo.New()

	// Middleware
	app.Use(middleware.LoggerWithConfig(middleware.LoggerConfig{
		Format: "${method} ${uri} ${status} ${latency_human}\n${time_rfc3339}\n\n",
	}))
	/* app.Use(middleware.Logger()) */
	app.Use(middleware.Recover())

	// Add routes
	ninja.RegisterNinja(app, providers)
	jutsu.RegisterJutsu(app, providers)
	ninja.RegisterNinjaJutsu(app, providers)

	return app
}

func Start(providers *providers.Providers) {
	port := ":8080"
	app := setupServer(providers)

	log.Fatal(app.Start(port))
}
