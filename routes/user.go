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
