package api

import (
	"context"
	"net/http"

	"github.com/gin-gonic/gin"

	"gin-squirrel-example/api/jutsu"
	"gin-squirrel-example/api/ninja"
	"gin-squirrel-example/providers"
	"gin-squirrel-example/xctx"
)

func setupServer(providers *providers.Providers) *gin.Engine {
	// create gin server
	r := gin.New()
	r.Use(gin.Recovery())
	r.MaxMultipartMemory = 8 << 20 // 8 MiB (default is 32 MiB)

	// middleware to extend context
	r.Use(func(c *gin.Context) {
		ctx, cancel := context.WithCancel(c.Request.Context())
		c.Set("new-context", xctx.NewContext(ctx, providers))
		c.Next()
		defer cancel()
	})

	// add routes
	ninja.RegisterNinja(r)
	jutsu.RegisterJutsu(r)
	ninja.RegisterNinjaJutsu(r)

	return r
}

func Start(providers *providers.Providers) {
	r := setupServer(providers)
	server := &http.Server{
		Addr:    ":5000",
		Handler: r,
	}
	server.ListenAndServe()
}
