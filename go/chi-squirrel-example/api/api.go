package api

import (
	"log"
	"net/http"

	chi "github.com/go-chi/chi/v5"

	"chi-squirrel-example/api/jutsu"
	"chi-squirrel-example/api/ninja"
	"chi-squirrel-example/providers"
)

func setupServer(providers *providers.Providers) chi.Router {
	app := chi.NewRouter()

	ninja.RegisterNinja(app, providers)
	jutsu.RegisterJutsu(app, providers)
	ninja.RegisterNinjaJutsu(app, providers)

	return app
}

func Start(providers *providers.Providers) {
	port := ":3000"
	app := setupServer(providers)

	log.Println("Starting server on port", port)
	log.Fatal(http.ListenAndServe(port, app))
}
