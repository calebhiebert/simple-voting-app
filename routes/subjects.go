package routes

import (
	models "../models"
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

	db.Create(&models.SubjectHistory{
		Editor:             "Joe Shmoe",
		PersonName:         subject.PersonName,
		CostumeDescription: subject.CostumeDescription,
		SubjectID:          subject.ID,
	})

	c.JSON(200, subject)
}

// PatchSubject used for updating subjects
func PatchSubject(c *gin.Context, db *gorm.DB) {
	subject := models.Subject{}

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
		Editor:             "TODO",
		PersonName:         subject.PersonName,
		CostumeDescription: subject.CostumeDescription,
		SubjectID:          dbSubject.ID,
	})

	dbSubject.PersonName = subject.PersonName
	dbSubject.CostumeDescription = subject.CostumeDescription
	db.Save(&dbSubject)

	c.JSON(200, &dbSubject)
}

// GetSubjects returns a list of all subjects
func GetSubjects(c *gin.Context, db *gorm.DB) {
	subjects := []models.Subject{}

	db.Find(&subjects)

	c.JSON(200, subjects)
}

// GetSubject gets a single subject
func GetSubject(c *gin.Context, db *gorm.DB) {
	subject := models.Subject{}
	id := c.Param("id")

	db.Preload("Votes").Preload("History").First(&subject, "id = ?", id)

	c.JSON(200, subject)
}
