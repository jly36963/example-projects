package jutsu

import (
	"net/http"

	"gin-squirrel-example/types"
	"gin-squirrel-example/xctx"

	"github.com/gin-gonic/gin"
)

func RegisterJutsu(r *gin.Engine) {
	sr := r.Group("/api/jutsu")
	{
		// Get jutsu
		sr.GET("/:id", func(c *gin.Context) {
			ctx := xctx.ExtendContext(c)
			id := c.Param("id")
			jutsu, err := ctx.Providers.PGDAL.GetJutsu(id)
			if err != nil {
				c.Status(http.StatusInternalServerError)
				return
			}
			c.JSON(http.StatusOK, jutsu)
		})

		// Insert jutsu
		sr.POST("/", func(c *gin.Context) {
			ctx := xctx.ExtendContext(c)
			var jutsuNew types.JutsuNew
			err := c.BindJSON(&jutsuNew)
			if err != nil {
				c.Status(http.StatusBadRequest)
				return
			}
			jutsu, err := ctx.Providers.PGDAL.CreateJutsu(jutsuNew)
			if err != nil {
				c.Status(http.StatusInternalServerError)
				return
			}
			c.JSON(http.StatusOK, jutsu)
		})

		// Update jutsu
		sr.PUT("/:id", func(c *gin.Context) {
			ctx := xctx.ExtendContext(c)
			id := c.Param("id")
			var jutsuUpdates types.JutsuNew
			err := c.BindJSON(&jutsuUpdates)
			if err != nil {
				c.Status(http.StatusBadRequest)
				return
			}
			jutsu, err := ctx.Providers.PGDAL.UpdateJutsu(id, jutsuUpdates)
			if err != nil {
				c.Status(http.StatusInternalServerError)
				return
			}
			c.JSON(http.StatusOK, jutsu)
		})

		// Delete Jutsu
		sr.DELETE("/:id", func(c *gin.Context) {
			ctx := xctx.ExtendContext(c)
			id := c.Param("id")
			jutsu, err := ctx.Providers.PGDAL.DeleteJutsu(id)
			if err != nil {
				c.Status(http.StatusInternalServerError)
				return
			}
			c.JSON(http.StatusOK, jutsu)
		})
	}

}
