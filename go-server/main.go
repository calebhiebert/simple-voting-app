package main

import (
	"os"
	"path/filepath"

	"./models"
	"./routes"

	"github.com/gin-contrib/cors"
	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
)

func main() {
	ex, _ := os.Executable()
	exPath := filepath.Dir(ex)
	println("Looking for static resources at " + exPath + "/dist")

	startDatabase()
	defer db.Close()

	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowAllOrigins: true,
		AllowMethods:    []string{"PATCH", "DELETE"},
		AllowHeaders: []string{
			"Content-Type",
			"Authorization"},
	}))

	baseAPI := r.Group("/api")

	public := baseAPI.Group("")
	public.GET("/subjects", wrapHandler(routes.GetSubjects))
	public.GET("/subjects/:id", wrapHandler(routes.GetSubject))
	public.GET("/user/:id", wrapHandler(routes.GetUser))

	private := baseAPI.Group("")

	private.Use(Auth())
	private.Use(RequireAuth())
	private.GET("/me", wrapHandler(routes.GetMe))

	banApplied := baseAPI.Group("")
	banApplied.Use(Auth())
	banApplied.Use(RequireAuth())
	banApplied.Use(CheckBanned())
	banApplied.POST("/vote/:subjectid", wrapHandler(routes.PostVote))
	banApplied.POST("/subjects", wrapHandler(routes.PostSubject))
	banApplied.PATCH("/subjects/:id", wrapHandler(routes.PatchSubject))
	banApplied.DELETE("/subjects/:id", wrapHandler(routes.DeleteSubject))

	admin := baseAPI.Group("")
	admin.Use(Auth())
	admin.Use(RequireAuth())
	admin.Use(func(c *gin.Context) {
		userInfo, _ := c.Get("user-info")

		if !userInfo.(*models.User).Admin {
			c.AbortWithStatus(401)
		} else {
			c.Next()
		}
	})
	admin.GET("/users", wrapHandler(routes.GetUsers))
	admin.POST("/users/:id/ban", wrapHandler(routes.SetUserBanStatus(true)))
	admin.POST("/users/:id/unban", wrapHandler(routes.SetUserBanStatus(false)))

	r.Use(func(c *gin.Context) {
		c.Header("Cache-Control", "max-age=3600")
	})

	r.Use(static.Serve("/", static.LocalFile(exPath+"/dist", false)))
	r.NoRoute(func(c *gin.Context) {
		c.Header("Cache-Control", "max-age=300")
		c.File(exPath + "/dist/index.html")
	})

	r.Run()
}

func wrapHandler(handler func(c *gin.Context, db *gorm.DB)) func(c *gin.Context) {
	return func(c *gin.Context) {
		handler(c, db)
	}
}
