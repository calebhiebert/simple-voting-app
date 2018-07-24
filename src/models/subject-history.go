package models

import "github.com/jinzhu/gorm"

// SubjectHistory holds an edit copy of the subject
type SubjectHistory struct {
	gorm.Model
	Editor             string `gorm:"not null" json:"editor"`
	PersonName         string `gorm:"not null" json:"personName"`
	CostumeDescription string `gorm:"not null" json:"costumeDescription"`
	SubjectID          uint   `gorm:"not null" json:"subjectId"`
}
