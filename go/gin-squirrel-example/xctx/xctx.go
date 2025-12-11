package xctx

import (
	"context"
	"sync"

	"gin-squirrel-example/providers"

	"github.com/gin-gonic/gin"
)

type Context struct {
	Providers *providers.Providers
	parent    context.Context
	lock      sync.RWMutex
}

func NewContext(parent context.Context, providers *providers.Providers) *Context {
	return &Context{
		parent:    parent,
		Providers: providers,
	}
}

func ExtendContext(c *gin.Context) *Context {
	value, _ := c.Get("new-context")
	ctx, _ := value.(*Context)
	return ctx
}
