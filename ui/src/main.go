package main

import (
	"./routes"

	"github.com/gin-contrib/cors"
	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
)

func main() {
	startDatabase()
	defer db.Close()

	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowAllOrigins: true,
		AllowMethods:    []string{"PATCH", "DELETE"},
		AllowHeaders:    []string{"Content-Type", "Authorization"},
	}))

	r.Use(static.Serve("/", static.LocalFile("./dist", true)))
	r.NoRoute(func(c *gin.Context) {
		c.File("./dist/index.html")
	})

	baseApi := r.Group("/api")

	public := baseApi.Group("")
	public.GET("/subjects", wrapHandler(routes.GetSubjects))
	public.GET("/subjects/:id", wrapHandler(routes.GetSubject))
	public.GET("/user/:id", wrapHandler(routes.GetUser))

	private := baseApi.Group("")

	private.Use(Auth())
	private.Use(RequireAuth())
	private.GET("/me", wrapHandler(routes.GetMe))
	private.GET("/users", wrapHandler(routes.GetUsers))
	private.POST("/users/:id/ban", wrapHandler(routes.SetUserBanStatus(true)))
	private.POST("/users/:id/unban", wrapHandler(routes.SetUserBanStatus(false)))

	banApplied := baseApi.Group("")
	banApplied.Use(Auth())
	banApplied.Use(RequireAuth())
	banApplied.Use(CheckBanned())
	banApplied.POST("/vote/:subjectid", wrapHandler(routes.PostVote))
	banApplied.POST("/subjects", wrapHandler(routes.PostSubject))
	banApplied.PATCH("/subjects/:id", wrapHandler(routes.PatchSubject))
	banApplied.DELETE("/subjects/:id", wrapHandler(routes.DeleteSubject))

	r.Run()
}

func wrapHandler(handler func(c *gin.Context, db *gorm.DB)) func(c *gin.Context) {
	return func(c *gin.Context) {
		handler(c, db)
	}
}
