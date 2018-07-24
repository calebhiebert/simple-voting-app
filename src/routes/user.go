package routes

import (
	"../models"
	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
)

// GetUser gets a single user
func GetUser(c *gin.Context, db *gorm.DB) {
	id := c.Param("id")

	user := models.User{}

	if err := db.First(&user, "user_id = ?", id).Error; err != nil {
		if gorm.IsRecordNotFoundError(err) {
			c.AbortWithStatus(404)
		} else {
			c.AbortWithStatusJSON(500, gin.H{"error": err})
		}
	}

	c.JSON(200, user)
}

// GetUsers returns a list of all users
func GetUsers(c *gin.Context, db *gorm.DB) {
	users := []models.User{}

	db.Find(&users)

	c.JSON(200, users)
}

// GetMe returns the logged in user's information
func GetMe(c *gin.Context, db *gorm.DB) {
	user, _ := c.Get("user-info")

	c.JSON(200, user)
}

// SetUserBanStatus sets whether or not a user is banned
func SetUserBanStatus(banStatus bool) func(c *gin.Context, db *gorm.DB) {
	return func(c *gin.Context, db *gorm.DB) {
		id := c.Param("id")
		user := models.User{}

		if err := db.First(&user, "user_id = ?", id).Error; err != nil {
			if gorm.IsRecordNotFoundError(err) {
				c.AbortWithStatus(404)
				return
			}

			panic(err)
		}

		user.Banned = banStatus
		db.Save(&user)

		c.JSON(200, user)
	}
}
