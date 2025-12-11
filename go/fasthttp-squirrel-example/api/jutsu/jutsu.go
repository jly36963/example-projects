package jutsu

import (
	"encoding/json"
	"fasthttp-squirrel-example/providers"
	"fasthttp-squirrel-example/types"

	"github.com/fasthttp/router"
	"github.com/valyala/fasthttp"
)

func RegisterJutsu(r *router.Router, providers *providers.Providers) {
	sr := r.Group("/api/jutsu")
	{
		// Get jutsu
		sr.GET("/{id}/", func(ctx *fasthttp.RequestCtx) {
			id := ctx.UserValue("id").(string)
			jutsu, err := providers.PGDAL.GetJutsu(id)
			if err != nil {
				ctx.SetStatusCode(fasthttp.StatusInternalServerError)
				return
			}
			payload, err := json.Marshal(jutsu)
			if err != nil {
				ctx.SetStatusCode(fasthttp.StatusInternalServerError)
				return
			}
			ctx.SetContentType("application/json")
			ctx.SetStatusCode(fasthttp.StatusOK)
			ctx.SetBody(payload)
		})

		// Insert jutsu
		sr.POST("/", func(ctx *fasthttp.RequestCtx) {
			var ninjaNew types.JutsuNew
			body := ctx.PostBody()
			err := json.Unmarshal(body, &ninjaNew)
			if err != nil {
				ctx.SetStatusCode(fasthttp.StatusBadRequest)
				return
			}
			jutsu, err := providers.PGDAL.CreateJutsu(ninjaNew)
			if err != nil {
				ctx.SetStatusCode(fasthttp.StatusInternalServerError)
				return
			}
			payload, err := json.Marshal(jutsu)
			if err != nil {
				ctx.SetStatusCode(fasthttp.StatusInternalServerError)
				return
			}
			ctx.SetContentType("application/json")
			ctx.SetStatusCode(fasthttp.StatusOK)
			ctx.SetBody(payload)
		})

		// Update jutsu
		sr.PUT("/{id}/", func(ctx *fasthttp.RequestCtx) {
			id := ctx.UserValue("id").(string)
			var ninjaUpdates types.JutsuNew
			body := ctx.PostBody()
			err := json.Unmarshal(body, &ninjaUpdates)
			if err != nil {
				ctx.SetStatusCode(fasthttp.StatusBadRequest)
				return
			}
			jutsu, err := providers.PGDAL.UpdateJutsu(id, ninjaUpdates)
			if err != nil {
				ctx.SetStatusCode(fasthttp.StatusInternalServerError)
				return
			}
			payload, err := json.Marshal(jutsu)
			if err != nil {
				ctx.SetStatusCode(fasthttp.StatusInternalServerError)
				return
			}
			ctx.SetContentType("application/json")
			ctx.SetStatusCode(fasthttp.StatusOK)
			ctx.SetBody(payload)
		})

		// Delete Jutsu
		sr.DELETE("/{id}/", func(ctx *fasthttp.RequestCtx) {
			id := ctx.UserValue("id").(string)
			jutsu, err := providers.PGDAL.DeleteJutsu(id)
			if err != nil {
				ctx.SetStatusCode(fasthttp.StatusInternalServerError)
				return
			}
			payload, err := json.Marshal(jutsu)
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
