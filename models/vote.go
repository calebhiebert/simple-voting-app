package models

import "github.com/jinzhu/gorm"

// Vote represents a single vote
type Vote struct {
	gorm.Model
	Voter     string `json:"voter"`
	SubjectID uint   `json:"subjectId" gorm:"not null"`
}
