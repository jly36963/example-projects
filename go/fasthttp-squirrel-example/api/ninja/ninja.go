package ninja

import (
	"encoding/json"

	"github.com/fasthttp/router"
	"github.com/valyala/fasthttp"

	"fasthttp-squirrel-example/providers"
	"fasthttp-squirrel-example/types"
)

func RegisterNinja(r *router.Router, providers *providers.Providers) {
	sr := r.Group("/api/ninja")
	{
		// Get ninja
		sr.GET("/{id}/", func(ctx *fasthttp.RequestCtx) {
			id := ctx.UserValue("id").(string)
			ninja, err := providers.PGDAL.GetNinja(id)
			if err != nil {
				ctx.SetStatusCode(fasthttp.StatusInternalServerError)
				return
			}
			payload, err := json.Marshal(ninja)
			if err != nil {
				ctx.SetStatusCode(fasthttp.StatusInternalServerError)
				return
			}
			ctx.SetContentType("application/json")
			ctx.SetStatusCode(fasthttp.StatusOK)
			ctx.SetBody(payload)
		})

		// Insert ninja
		sr.POST("/", func(ctx *fasthttp.RequestCtx) {
			var ninjaNew types.NinjaNew
			body := ctx.PostBody()
			err := json.Unmarshal(body, &ninjaNew)
			if err != nil {
				ctx.SetStatusCode(fasthttp.StatusBadRequest)
				return
			}
			ninja, err := providers.PGDAL.CreateNinja(ninjaNew)
			if err != nil {
				ctx.SetStatusCode(fasthttp.StatusInternalServerError)
				return
			}
			payload, err := json.Marshal(ninja)
			if err != nil {
				ctx.SetStatusCode(fasthttp.StatusInternalServerError)
				return
			}
			ctx.SetContentType("application/json")
			ctx.SetStatusCode(fasthttp.StatusOK)
			ctx.SetBody(payload)
		})

		// Update ninja
		sr.PUT("/{id}/", func(ctx *fasthttp.RequestCtx) {
			id := ctx.UserValue("id").(string)
			var ninjaUpdates types.NinjaNew
			body := ctx.PostBody()
			err := json.Unmarshal(body, &ninjaUpdates)
			if err != nil {
				ctx.SetStatusCode(fasthttp.StatusBadRequest)
				return
			}
			ninja, err := providers.PGDAL.UpdateNinja(id, ninjaUpdates)
			if err != nil {
				ctx.SetStatusCode(fasthttp.StatusInternalServerError)
				return
			}
			payload, err := json.Marshal(ninja)
			if err != nil {
				ctx.SetStatusCode(fasthttp.StatusInternalServerError)
				return
			}
			ctx.SetContentType("application/json")
			ctx.SetStatusCode(fasthttp.StatusOK)
			ctx.SetBody(payload)
		})

		// Delete Ninja
		sr.DELETE("/{id}/", func(ctx *fasthttp.RequestCtx) {
			id := ctx.UserValue("id").(string)
			ninja, err := providers.PGDAL.DeleteNinja(id)
			if err != nil {
				ctx.SetStatusCode(fasthttp.StatusInternalServerError)
				return
			}
			payload, err := json.Marshal(ninja)
			if err != nil {
				ctx.SetStatusCode(fasthttp.StatusInternalServerError)
				return
			}
			ctx.SetContentType("application/json")
			ctx.SetStatusCode(fasthttp.StatusOK)
			ctx.SetBody(payload)
		})

		// Get ninja with jutsus
		sr.GET("/{id}/jutsus/", func(ctx *fasthttp.RequestCtx) {
			id := ctx.UserValue("id").(string)
			ninja, err := providers.PGDAL.GetNinjaWithJutsus(id)
			if err != nil {
				ctx.SetStatusCode(fasthttp.StatusInternalServerError)
				return
			}
			payload, err := json.Marshal(ninja)
			if err != nil {
				ctx.SetStatusCode(fasthttp.StatusInternalServerError)
				return
			}
			ctx.SetContentType("application/json")
			ctx.SetStatusCode(fasthttp.StatusOK)
			ctx.SetBody(payload)
		})
	}
}

func RegisterNinjaJutsu(r *router.Router, providers *providers.Providers) {
	sr := r.Group("/api/ninja-jutsu")
	{
		// Associate ninja & jutsu
		sr.POST("/{ninjaID}/{jutsuID}/", func(ctx *fasthttp.RequestCtx) {
			ninjaID := ctx.UserValue("ninjaID").(string)
			jutsuID := ctx.UserValue("jutsuID").(string)
			err := providers.PGDAL.AssociateNinjaJutsu(ninjaID, jutsuID)
			if err != nil {
				ctx.SetStatusCode(fasthttp.StatusInternalServerError)
				return
			}
			ctx.SetStatusCode(fasthttp.StatusOK)
		})

		// Dissociate ninja & jutsu
		sr.DELETE("/{ninjaID}/{jutsuID}/", func(ctx *fasthttp.RequestCtx) {
			ninjaID := ctx.UserValue("ninjaID").(string)
			jutsuID := ctx.UserValue("jutsuID").(string)
			err := providers.PGDAL.DissociateNinjaJutsu(ninjaID, jutsuID)
			if err != nil {
				ctx.SetStatusCode(fasthttp.StatusInternalServerError)
				return
			}
			ctx.SetStatusCode(fasthttp.StatusOK)
		})
	}
}
