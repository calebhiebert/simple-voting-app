package routes

import (
	"../models"
	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
)

// PostVote creates a new vote
func PostVote(c *gin.Context, db *gorm.DB) {
	vote := models.Vote{
		Voter: "Tests",
	}

	db.Create(&vote)

	c.JSON(200, vote)
}
