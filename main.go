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
		AllowHeaders:    []string{"Content-Type"},
	}))

	r.POST("/vote/:subjectid", wrapHandler(routes.PostVote))

	r.POST("/subjects", wrapHandler(routes.PostSubject))
	r.GET("/subjects", wrapHandler(routes.GetSubjects))
	r.GET("/subjects/:id", wrapHandler(routes.GetSubject))
	r.PATCH("/subjects/:id", wrapHandler(routes.PatchSubject))

	r.Run(":3000")
}

func wrapHandler(handler func(c *gin.Context, db *gorm.DB)) func(c *gin.Context) {
	return func(c *gin.Context) {
		handler(c, db)
	}
}
