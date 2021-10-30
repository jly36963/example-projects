package ninja

import (
	"net/http"

	"gin-squirrel-example/types"
	"gin-squirrel-example/xctx"

	"github.com/gin-gonic/gin"
)

func RegisterNinja(r *gin.Engine) {
	sr := r.Group("/api/ninja")
	{
		// Get ninja
		sr.GET("/:id", func(c *gin.Context) {
			ctx := xctx.ExtendContext(c)
			id := c.Param("id")
			ninja, err := ctx.Providers.PGDAL.GetNinja(id)
			if err != nil {
				c.Status(http.StatusInternalServerError)
				return
			}
			c.JSON(http.StatusOK, ninja)
		})

		// Insert ninja
		sr.POST("/", func(c *gin.Context) {
			ctx := xctx.ExtendContext(c)
			var ninjaNew types.NinjaNew
			err := c.BindJSON(&ninjaNew)
			if err != nil {
				c.Status(http.StatusBadRequest)
				return
			}
			ninja, err := ctx.Providers.PGDAL.CreateNinja(ninjaNew)
			if err != nil {
				c.Status(http.StatusInternalServerError)
				return
			}
			c.JSON(http.StatusOK, ninja)
		})

		// Update ninja
		sr.PUT("/:id", func(c *gin.Context) {
			ctx := xctx.ExtendContext(c)
			id := c.Param("id")
			var ninjaUpdates types.NinjaNew
			err := c.BindJSON(&ninjaUpdates)
			if err != nil {
				c.Status(http.StatusBadRequest)
				return
			}
			ninja, err := ctx.Providers.PGDAL.UpdateNinja(id, ninjaUpdates)
			if err != nil {
				c.Status(http.StatusInternalServerError)
				return
			}
			c.JSON(http.StatusOK, ninja)
		})

		// Delete Ninja
		sr.DELETE("/:id", func(c *gin.Context) {
			ctx := xctx.ExtendContext(c)
			id := c.Param("id")
			ninja, err := ctx.Providers.PGDAL.DeleteNinja(id)
			if err != nil {
				c.Status(http.StatusInternalServerError)
				return
			}
			c.JSON(http.StatusOK, ninja)
		})

		// Get ninja with jutsus
		sr.GET("/:id/jutsus", func(c *gin.Context) {
			ctx := xctx.ExtendContext(c)
			id := c.Param("id")
			ninja, err := ctx.Providers.PGDAL.GetNinjaWithJutsus(id)
			if err != nil {
				c.Status(http.StatusInternalServerError)
				return
			}
			c.JSON(http.StatusOK, ninja)
		})
	}
}

func RegisterNinjaJutsu(r *gin.Engine) {
	sr := r.Group("/api/ninja-jutsu")
	{
		// Associate ninja & jutsu
		sr.POST("/:ninjaID/:jutsuID", func(c *gin.Context) {
			ctx := xctx.ExtendContext(c)
			ninjaID := c.Param("ninjaID")
			jutsuID := c.Param("jutsuID")
			err := ctx.Providers.PGDAL.AssociateNinjaJutsu(ninjaID, jutsuID)
			if err != nil {
				c.Status(http.StatusInternalServerError)
				return
			}
			c.Status(http.StatusOK)
		})

		// Dissociate ninja & jutsu
		sr.DELETE("/:ninjaID/:jutsuID", func(c *gin.Context) {
			ctx := xctx.ExtendContext(c)
			ninjaID := c.Param("ninjaID")
			jutsuID := c.Param("jutsuID")
			err := ctx.Providers.PGDAL.DissociateNinjaJutsu(ninjaID, jutsuID)
			if err != nil {
				c.Status(http.StatusInternalServerError)
				return
			}
			c.Status(http.StatusOK)
		})
	}
}
