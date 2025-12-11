package jutsu

import (
	"net/http"

	echo "github.com/labstack/echo/v4"

	"echo-squirrel-example/providers"
	"echo-squirrel-example/types"
)

func RegisterJutsu(app *echo.Echo, providers *providers.Providers) {
	r := app.Group("/api/jutsu")
	{
		// Get jutsu
		r.GET("/:id", func(c echo.Context) error {
			id := c.Param("id")
			jutsu, err := providers.PGDAL.GetJutsu(id)
			if err != nil {
				return c.NoContent(http.StatusInternalServerError)
			}
			return c.JSON(http.StatusOK, jutsu)
		})

		// Insert jutsu
		r.POST("", func(c echo.Context) error {
			var jutsuNew types.JutsuNew
			err := c.Bind(&jutsuNew)
			if err != nil {
				return c.NoContent(http.StatusBadRequest)
			}
			jutsu, err := providers.PGDAL.CreateJutsu(jutsuNew)
			if err != nil {
				return c.NoContent(http.StatusInternalServerError)
			}
			return c.JSON(http.StatusOK, jutsu)
		})

		// Update jutsu
		r.PUT("/:id", func(c echo.Context) error {
			id := c.Param("id")
			var jutsuUpdates types.JutsuNew
			err := c.Bind(&jutsuUpdates)
			if err != nil {
				return c.NoContent(http.StatusBadRequest)
			}
			jutsu, err := providers.PGDAL.UpdateJutsu(id, jutsuUpdates)
			if err != nil {
				return c.NoContent(http.StatusInternalServerError)
			}
			return c.JSON(http.StatusOK, jutsu)
		})

		// Delete Jutsu
		r.DELETE("/:id", func(c echo.Context) error {
			id := c.Param("id")
			jutsu, err := providers.PGDAL.DeleteJutsu(id)
			if err != nil {
				return c.NoContent(http.StatusInternalServerError)
			}
			return c.JSON(http.StatusOK, jutsu)
		})
	}
}
