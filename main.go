package main

import (
	"./routes"

	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
)

func main() {
	startDatabase()
	defer db.Close()

	r := gin.Default()

	r.POST("/vote", wrapHandler(routes.PostVote))

	r.POST("/subjects", wrapHandler(routes.PostSubject))
	r.GET("/subjects", wrapHandler(routes.GetSubjects))

	r.Run()
}

func wrapHandler(handler func(c *gin.Context, db *gorm.DB)) func(c *gin.Context) {
	return func(c *gin.Context) {
		handler(c, db)
	}
}
