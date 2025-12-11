package api

import (
	"github.com/fasthttp/router"
	"github.com/valyala/fasthttp"

	"fasthttp-squirrel-example/api/jutsu"
	"fasthttp-squirrel-example/api/ninja"
	"fasthttp-squirrel-example/providers"
)

func setupServer(providers *providers.Providers) *router.Router {
	// create fasthttp server
	r := router.New()

	// add routes
	ninja.RegisterNinja(r, providers)
	jutsu.RegisterJutsu(r, providers)
	ninja.RegisterNinjaJutsu(r, providers)

	return r
}

func Start(providers *providers.Providers) {
	port := ":5000"
	r := setupServer(providers)

	fasthttp.ListenAndServe(port, r.Handler)
}
