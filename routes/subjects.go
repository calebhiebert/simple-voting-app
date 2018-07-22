package routes

import (
	"../models"
	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
)

// PostSubject creates a new subject
func PostSubject(c *gin.Context, db *gorm.DB) {
	subject := models.Subject{}

	if err := c.ShouldBindJSON(&subject); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	db.Create(&subject)

	c.JSON(200, subject)
}

// GetSubjects returns a list of all subjects
func GetSubjects(c *gin.Context, db *gorm.DB) {
	subjects := []models.Subject{}

	db.Find(&subjects)

	c.JSON(200, subjects)
}
