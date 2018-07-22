package models

import "github.com/jinzhu/gorm"

type Vote struct {
	gorm.Model
	Voter string `json:"voter"`
}
