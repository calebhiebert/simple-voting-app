package routes

import (
	"../models"
	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
)

// PostVote creates a new vote
func PostVote(c *gin.Context, db *gorm.DB) {
	subject := models.Subject{}

	db.First(&subject, "id = ?", c.Param("subjectid"))

	vote := models.Vote{
		Voter:     "Tests",
		SubjectID: subject.ID,
	}

	db.Create(&vote)

	c.JSON(200, vote)
}
