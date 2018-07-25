package main

import (
	"os"
	"path/filepath"
	"strconv"
	"time"

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
			"Authorization",
			"Content-Security-Policy",
			"X-Frame-Options",
			"X-Content-Type-Options",
			"X-XSS-Protection",
			"Strict-Transport-Security"},
	}))

	headersHandler := func(c *gin.Context) {
		c.Header("Content-Security-Policy", "frame-ancestors 'none'")
		c.Header("X-Frame-Options", "DENY")
		c.Header("Strict-Transport-Security", "max-age="+strconv.FormatInt(time.Now().Add(24*time.Hour).Unix(), 10)+"; preload")
		c.Header("X-Content-Type-Options", "nosniff")
		c.Header("X-XSS-Protection", "1; mode=block")
		c.Header("Cache-Control", "max-age=3600")
	}

	baseAPI := r.Group("/api")

	public := baseAPI.Group("")
	public.GET("/subjects", wrapHandler(routes.GetSubjects))
	public.GET("/subjects/:id", wrapHandler(routes.GetSubject))
	public.GET("/user/:id", wrapHandler(routes.GetUser))

	private := baseAPI.Group("")

	private.Use(Auth())
	private.Use(RequireAuth())
	private.GET("/me", wrapHandler(routes.GetMe))
	private.GET("/users", wrapHandler(routes.GetUsers))
	private.POST("/users/:id/ban", wrapHandler(routes.SetUserBanStatus(true)))
	private.POST("/users/:id/unban", wrapHandler(routes.SetUserBanStatus(false)))

	banApplied := baseAPI.Group("")
	banApplied.Use(Auth())
	banApplied.Use(RequireAuth())
	banApplied.Use(CheckBanned())
	banApplied.POST("/vote/:subjectid", wrapHandler(routes.PostVote))
	banApplied.POST("/subjects", wrapHandler(routes.PostSubject))
	banApplied.PATCH("/subjects/:id", wrapHandler(routes.PatchSubject))
	banApplied.DELETE("/subjects/:id", wrapHandler(routes.DeleteSubject))

	r.Use(headersHandler)

	r.Use(static.Serve("/", static.LocalFile(exPath+"/dist", false)))
	r.Any("", func(c *gin.Context) {
		c.Header("Cache-Control", "no-cache")
		c.File(exPath + "/dist/index.html")
	})

	r.Run()
}

func wrapHandler(handler func(c *gin.Context, db *gorm.DB)) func(c *gin.Context) {
	return func(c *gin.Context) {
		handler(c, db)
	}
}
