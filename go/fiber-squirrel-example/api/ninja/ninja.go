package ninja

import (
	"encoding/json"
	"net/http"

	fiber "github.com/gofiber/fiber/v2"

	"fiber-squirrel-example/providers"
	"fiber-squirrel-example/types"
)

func RegisterNinja(app *fiber.App, providers *providers.Providers) {
	r := app.Group("/api/ninja")
	{
		// Get ninja
		r.Get("/:id/", func(c *fiber.Ctx) error {
			id := c.Params("id")
			ninja, err := providers.PGDAL.GetNinja(id)
			if err != nil {
				return c.SendStatus(http.StatusInternalServerError)
			}
			return c.JSON(ninja)
		})

		// Insert ninja
		r.Post("/", func(c *fiber.Ctx) error {
			var ninjaNew types.NinjaNew
			body := c.Body()
			err := json.Unmarshal(body, &ninjaNew)
			if err != nil {
				return c.SendStatus(http.StatusBadRequest)
			}
			ninja, err := providers.PGDAL.CreateNinja(ninjaNew)
			if err != nil {
				return c.SendStatus(http.StatusInternalServerError)
			}
			return c.JSON(ninja)
		})

		// Update ninja
		r.Put("/:id/", func(c *fiber.Ctx) error {
			id := c.Params("id")
			var ninjaUpdates types.NinjaNew
			body := c.Body()
			err := json.Unmarshal(body, &ninjaUpdates)
			if err != nil {
				return c.SendStatus(http.StatusBadRequest)
			}
			ninja, err := providers.PGDAL.UpdateNinja(id, ninjaUpdates)
			if err != nil {
				return c.SendStatus(http.StatusInternalServerError)
			}
			return c.JSON(ninja)
		})

		// Delete Ninja
		r.Delete("/:id/", func(c *fiber.Ctx) error {
			id := c.Params("id")
			ninja, err := providers.PGDAL.DeleteNinja(id)
			if err != nil {
				return c.SendStatus(http.StatusInternalServerError)
			}
			return c.JSON(ninja)
		})

		// Get ninja with jutsus
		r.Get("/:id/jutsus/", func(c *fiber.Ctx) error {
			id := c.Params("id")
			ninja, err := providers.PGDAL.GetNinjaWithJutsus(id)
			if err != nil {
				return c.SendStatus(http.StatusInternalServerError)
			}
			return c.JSON(ninja)
		})
	}
}

func RegisterNinjaJutsu(app *fiber.App, providers *providers.Providers) {
	r := app.Group("/api/ninja-jutsu")
	{
		// Associate ninja & jutsu
		r.Post("/:ninjaID/:jutsuID/", func(c *fiber.Ctx) error {
			ninjaID := c.Params("ninjaID")
			jutsuID := c.Params("jutsuID")
			err := providers.PGDAL.AssociateNinjaJutsu(ninjaID, jutsuID)
			if err != nil {
				return c.SendStatus(http.StatusInternalServerError)
			}
			return c.SendStatus(http.StatusOK)
		})

		// Dissociate ninja & jutsu
		r.Delete("/:ninjaID/:jutsuID/", func(c *fiber.Ctx) error {
			ninjaID := c.Params("ninjaID")
			jutsuID := c.Params("jutsuID")
			err := providers.PGDAL.DissociateNinjaJutsu(ninjaID, jutsuID)
			if err != nil {
				return c.SendStatus(http.StatusInternalServerError)
			}
			return c.SendStatus(http.StatusOK)
		})
	}
}
