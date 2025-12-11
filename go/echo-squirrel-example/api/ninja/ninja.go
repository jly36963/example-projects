package ninja

import (
	"net/http"

	echo "github.com/labstack/echo/v4"

	"echo-squirrel-example/providers"
	"echo-squirrel-example/types"
)

func RegisterNinja(app *echo.Echo, providers *providers.Providers) {
	r := app.Group("/api/ninja")
	{
		// Get ninja
		r.GET("/:id", func(c echo.Context) error {
			id := c.Param("id")
			ninja, err := providers.PGDAL.GetNinja(id)
			if err != nil {
				return c.NoContent(http.StatusInternalServerError)
			}
			return c.JSON(http.StatusOK, ninja)
		})

		// Insert ninja
		r.POST("", func(c echo.Context) error {
			var ninjaNew types.NinjaNew
			err := c.Bind(&ninjaNew)
			if err != nil {
				return c.NoContent(http.StatusBadRequest)
			}
			ninja, err := providers.PGDAL.CreateNinja(ninjaNew)
			if err != nil {
				return c.NoContent(http.StatusInternalServerError)
			}
			return c.JSON(http.StatusOK, ninja)
		})

		// Update ninja
		r.PUT("/:id", func(c echo.Context) error {
			id := c.Param("id")
			var ninjaUpdates types.NinjaNew
			err := c.Bind(&ninjaUpdates)
			if err != nil {
				return c.NoContent(http.StatusBadRequest)
			}
			ninja, err := providers.PGDAL.UpdateNinja(id, ninjaUpdates)
			if err != nil {
				return c.NoContent(http.StatusInternalServerError)
			}
			return c.JSON(http.StatusOK, ninja)
		})

		// Delete Ninja
		r.DELETE("/:id", func(c echo.Context) error {
			id := c.Param("id")
			ninja, err := providers.PGDAL.DeleteNinja(id)
			if err != nil {
				return c.NoContent(http.StatusInternalServerError)
			}
			return c.JSON(http.StatusOK, ninja)
		})

		// Get ninja with jutsus
		r.GET("/:id/jutsus", func(c echo.Context) error {
			id := c.Param("id")
			ninja, err := providers.PGDAL.GetNinjaWithJutsus(id)
			if err != nil {
				return c.NoContent(http.StatusInternalServerError)
			}
			return c.JSON(http.StatusOK, ninja)
		})
	}
}

func RegisterNinjaJutsu(app *echo.Echo, providers *providers.Providers) {
	r := app.Group("/api/ninja-jutsu")
	{
		// Associate ninja & jutsu
		r.POST("/:ninjaID/:jutsuID", func(c echo.Context) error {
			ninjaID := c.Param("ninjaID")
			jutsuID := c.Param("jutsuID")
			err := providers.PGDAL.AssociateNinjaJutsu(ninjaID, jutsuID)
			if err != nil {
				return c.NoContent(http.StatusInternalServerError)
			}
			return c.NoContent(http.StatusOK)
		})

		// Dissociate ninja & jutsu
		r.DELETE("/:ninjaID/:jutsuID", func(c echo.Context) error {
			ninjaID := c.Param("ninjaID")
			jutsuID := c.Param("jutsuID")
			err := providers.PGDAL.DissociateNinjaJutsu(ninjaID, jutsuID)
			if err != nil {
				return c.NoContent(http.StatusInternalServerError)
			}
			return c.NoContent(http.StatusOK)
		})
	}
}
