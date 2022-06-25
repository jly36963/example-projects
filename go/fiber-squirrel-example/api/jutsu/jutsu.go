package jutsu

import (
	"encoding/json"
	"fiber-squirrel-example/providers"
	"fiber-squirrel-example/types"
	"net/http"

	fiber "github.com/gofiber/fiber/v2"
)

func RegisterJutsu(app *fiber.App, providers *providers.Providers) {
	r := app.Group("/api/jutsu")
	{
		// Get jutsu
		r.Get("/:id/", func(c *fiber.Ctx) error {
			id := c.Params("id")
			jutsu, err := providers.PGDAL.GetJutsu(id)
			if err != nil {
				return c.SendStatus(http.StatusInternalServerError)
			}
			return c.JSON(jutsu)
		})

		// Insert jutsu
		r.Post("/", func(c *fiber.Ctx) error {
			var jutsuNew types.JutsuNew
			body := c.Body()
			err := json.Unmarshal(body, &jutsuNew)
			if err != nil {
				return c.SendStatus(http.StatusBadRequest)
			}
			jutsu, err := providers.PGDAL.CreateJutsu(jutsuNew)
			if err != nil {
				return c.SendStatus(http.StatusInternalServerError)
			}
			return c.JSON(jutsu)
		})

		// Update jutsu
		r.Put("/:id/", func(c *fiber.Ctx) error {
			id := c.Params("id")
			var jutsuUpdates types.JutsuNew
			body := c.Body()
			err := json.Unmarshal(body, &jutsuUpdates)
			if err != nil {
				return c.SendStatus(http.StatusBadRequest)
			}
			jutsu, err := providers.PGDAL.UpdateJutsu(id, jutsuUpdates)
			if err != nil {
				return c.SendStatus(http.StatusInternalServerError)
			}
			return c.JSON(jutsu)
		})

		// Delete Jutsu
		r.Delete("/:id/", func(c *fiber.Ctx) error {
			id := c.Params("id")
			jutsu, err := providers.PGDAL.DeleteJutsu(id)
			if err != nil {
				return c.SendStatus(http.StatusInternalServerError)
			}
			return c.JSON(jutsu)
		})
	}
}
