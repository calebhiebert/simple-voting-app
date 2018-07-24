package main

import (
	"./routes"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
)

func main() {
	startDatabase()
	defer db.Close()

	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowAllOrigins: true,
		AllowMethods:    []string{"PATCH"},
		AllowHeaders:    []string{"Content-Type", "Authorization"},
	}))

	public := r.Group("")
	public.GET("/subjects", wrapHandler(routes.GetSubjects))
	public.GET("/subjects/:id", wrapHandler(routes.GetSubject))
	public.GET("/user/:id", wrapHandler(routes.GetUser))

	private := r.Group("")

	private.Use(Auth())
	private.Use(RequireAuth())
	private.POST("/vote/:subjectid", wrapHandler(routes.PostVote))
	private.POST("/subjects", wrapHandler(routes.PostSubject))
	private.PATCH("/subjects/:id", wrapHandler(routes.PatchSubject))

	r.Run("0.0.0.0:3000")
}

func wrapHandler(handler func(c *gin.Context, db *gorm.DB)) func(c *gin.Context) {
	return func(c *gin.Context) {
		handler(c, db)
	}
}
