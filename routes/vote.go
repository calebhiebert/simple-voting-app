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

	if err := db.First(&subject, "id = ?", c.Param("subjectid")).Error; err != nil {
		if gorm.IsRecordNotFoundError(err) {
			c.AbortWithStatusJSON(404, gin.H{"error": "not found"})
			return
		} else {
			panic(err)
		}
	}

	existingVote := models.Vote{}

	if err := db.First(&existingVote, "voter = ?", user.(*models.User).UserID).Error; err != nil {
		if gorm.IsRecordNotFoundError(err) {
			vote := models.Vote{
				Voter:     user.(*models.User).UserID,
				SubjectID: subject.ID,
			}

			db.Create(&vote)
			c.JSON(200, vote)
		}
	} else {
		existingVote.SubjectID = subject.ID

		db.Save(existingVote)
		c.JSON(200, existingVote)
	}

}
