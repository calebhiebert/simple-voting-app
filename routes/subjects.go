package routes

import (
	models "../models"
	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
)

// PostSubject creates a new subject
func PostSubject(c *gin.Context, db *gorm.DB) {
	subject := models.Subject{}
	userInfo, _ := c.Get("user-info")

	if err := c.ShouldBindJSON(&subject); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	db.Create(&subject)

	db.Create(&models.SubjectHistory{
		Editor:             userInfo.(*models.User).UserID,
		PersonName:         subject.PersonName,
		CostumeDescription: subject.CostumeDescription,
		SubjectID:          subject.ID,
	})

	c.JSON(200, subject)
}

// PatchSubject used for updating subjects
func PatchSubject(c *gin.Context, db *gorm.DB) {
	subject := models.Subject{}
	userInfo, _ := c.Get("user-info")

	if err := c.ShouldBindJSON(&subject); err != nil {
		c.JSON(400, &gin.H{"error": err.Error()})
		return
	}

	dbSubject := models.Subject{}

	db.First(&dbSubject, "id = ?", c.Param("id"))

	if dbSubject.PersonName == subject.PersonName && dbSubject.CostumeDescription == subject.CostumeDescription {
		c.JSON(200, dbSubject)
		return
	}

	db.Create(&models.SubjectHistory{
		Editor:             userInfo.(*models.User).UserID,
		PersonName:         subject.PersonName,
		CostumeDescription: subject.CostumeDescription,
		SubjectID:          dbSubject.ID,
	})

	dbSubject.PersonName = subject.PersonName
	dbSubject.CostumeDescription = subject.CostumeDescription
	db.Save(&dbSubject)

	c.JSON(200, &dbSubject)
}

// DeleteSubject deletes a subject
func DeleteSubject(c *gin.Context, db *gorm.DB) {
	subject := models.Subject{}
	id := c.Param("id")

	if err := db.First(&subject, "id = ?", id).Error; err != nil {
		if gorm.IsRecordNotFoundError(err) {
			c.AbortWithStatus(404)
		} else {
			c.AbortWithStatusJSON(500, gin.H{"error": err})
		}
		return
	}

	db.Delete(&subject)

	c.JSON(200, subject)
}

// GetSubjects returns a list of all subjects
func GetSubjects(c *gin.Context, db *gorm.DB) {
	subjects := []models.Subject{}

	db.Preload("Votes").Find(&subjects)

	c.JSON(200, subjects)
}

// GetSubject gets a single subject
func GetSubject(c *gin.Context, db *gorm.DB) {
	subject := models.Subject{}
	id := c.Param("id")

	if err := db.Preload("Votes").Preload("History").First(&subject, "id = ?", id).Error; err != nil {
		if gorm.IsRecordNotFoundError(err) {
			c.AbortWithStatus(404)
			return
		} else {
			c.AbortWithStatusJSON(500, gin.H{"error": err})
			return
		}
	}

	c.JSON(200, subject)
}
