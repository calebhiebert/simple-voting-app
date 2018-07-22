package models

import "github.com/jinzhu/gorm"

type Subject struct {
	gorm.Model
	Name string `json:"name" binding:"required"`
}
