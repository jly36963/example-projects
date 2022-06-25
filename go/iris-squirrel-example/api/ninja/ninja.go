package ninja

import (
	iris "github.com/kataras/iris/v12"

	"iris-squirrel-example/providers"
	"iris-squirrel-example/types"
)

func RegisterNinja(app *iris.Application, providers *providers.Providers) {
	r := app.Party("/api/ninja")
	{
		// Get ninja
		r.Get("/{id}", func(c iris.Context) {
			id := c.Params().Get("id")
			ninja, err := providers.PGDAL.GetNinja(id)
			if err != nil {
				c.StatusCode(iris.StatusInternalServerError)
				return
			}
			c.JSON(ninja)
		})

		// Insert ninja
		r.Post("/", func(c iris.Context) {
			var ninjaNew types.NinjaNew
			err := c.ReadJSON(&ninjaNew)
			if err != nil {
				c.StatusCode(iris.StatusBadRequest)
				return
			}
			ninja, err := providers.PGDAL.CreateNinja(ninjaNew)
			if err != nil {
				c.StatusCode(iris.StatusInternalServerError)
				return
			}
			c.JSON(ninja)
		})

		// Update ninja
		r.Put("/{id}", func(c iris.Context) {
			id := c.Params().Get("id")
			var ninjaUpdates types.NinjaNew
			err := c.ReadJSON(&ninjaUpdates)
			if err != nil {
				c.StatusCode(iris.StatusBadRequest)
				return
			}
			ninja, err := providers.PGDAL.UpdateNinja(id, ninjaUpdates)
			if err != nil {
				c.StatusCode(iris.StatusInternalServerError)
				return
			}
			c.JSON(ninja)
		})

		// Delete Ninja
		r.Delete("/{id}", func(c iris.Context) {
			id := c.Params().Get("id")
			ninja, err := providers.PGDAL.DeleteNinja(id)
			if err != nil {
				c.StatusCode(iris.StatusInternalServerError)
				return
			}
			c.JSON(ninja)
		})

		// Get ninja with jutsus
		r.Get("/{id}/jutsus", func(c iris.Context) {
			id := c.Params().Get("id")
			ninja, err := providers.PGDAL.GetNinjaWithJutsus(id)
			if err != nil {
				c.StatusCode(iris.StatusInternalServerError)
				return
			}
			c.JSON(ninja)
		})
	}
}

func RegisterNinjaJutsu(app *iris.Application, providers *providers.Providers) {
	r := app.Party("/api/ninja-jutsu")
	{
		// Associate ninja & jutsu
		r.Post("/{ninjaID}/{jutsuID}", func(c iris.Context) {
			ninjaID := c.Params().Get("ninjaID")
			jutsuID := c.Params().Get("jutsuID")
			err := providers.PGDAL.AssociateNinjaJutsu(ninjaID, jutsuID)
			if err != nil {
				c.StatusCode(iris.StatusInternalServerError)
				return
			}
			c.StatusCode(iris.StatusOK)
		})

		// Dissociate ninja & jutsu
		r.Delete("/{ninjaID}/{jutsuID}", func(c iris.Context) {
			ninjaID := c.Params().Get("ninjaID")
			jutsuID := c.Params().Get("jutsuID")
			err := providers.PGDAL.DissociateNinjaJutsu(ninjaID, jutsuID)
			if err != nil {
				c.StatusCode(iris.StatusInternalServerError)
				return
			}
			c.StatusCode(iris.StatusOK)
		})
	}
}
