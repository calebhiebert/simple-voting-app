package routes

import (
	"../models"
	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
)

// PostVote creates a new vote
func PostVote(c *gin.Context, db *gorm.DB) {
	subject := models.Subject{}
	user, _ := c.Get("user-info")
	userData := user.(map[string]interface{})

	db.First(&subject, "id = ?", c.Param("subjectid"))

	vote := models.Vote{
		Voter:     userData["sub"].(string),
		SubjectID: subject.ID,
	}

	db.Create(&vote)

	c.JSON(200, vote)
}
