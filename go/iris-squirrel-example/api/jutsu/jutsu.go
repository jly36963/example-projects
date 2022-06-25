package jutsu

import (
	"iris-squirrel-example/providers"
	"iris-squirrel-example/types"

	iris "github.com/kataras/iris/v12"
)

func RegisterJutsu(app *iris.Application, providers *providers.Providers) {
	r := app.Party("/api/jutsu")
	{
		// Get jutsu
		r.Get("/{id}", func(c iris.Context) {
			id := c.Params().Get("id")
			jutsu, err := providers.PGDAL.GetJutsu(id)
			if err != nil {
				c.StatusCode(iris.StatusInternalServerError)
				return
			}
			c.JSON(jutsu)
		})

		// Insert jutsu
		r.Post("/", func(c iris.Context) {
			var jutsuNew types.JutsuNew
			err := c.ReadJSON(&jutsuNew)
			if err != nil {
				c.StatusCode(iris.StatusBadRequest)
				return
			}
			jutsu, err := providers.PGDAL.CreateJutsu(jutsuNew)
			if err != nil {
				c.StatusCode(iris.StatusInternalServerError)
				return
			}
			c.JSON(jutsu)
		})

		// Update jutsu
		r.Put("/{id}", func(c iris.Context) {
			id := c.Params().Get("id")
			var jutsuUpdates types.JutsuNew
			err := c.ReadJSON(&jutsuUpdates)
			if err != nil {
				c.StatusCode(iris.StatusBadRequest)
				return
			}
			jutsu, err := providers.PGDAL.UpdateJutsu(id, jutsuUpdates)
			if err != nil {
				c.StatusCode(iris.StatusInternalServerError)
				return
			}
			c.JSON(jutsu)
		})

		// Delete Jutsu
		r.Delete("/{id}", func(c iris.Context) {
			id := c.Params().Get("id")
			jutsu, err := providers.PGDAL.DeleteJutsu(id)
			if err != nil {
				c.StatusCode(iris.StatusInternalServerError)
				return
			}
			c.JSON(jutsu)
		})
	}
}
