package models

// SubjectHistory holds an edit copy of the subject
type SubjectHistory struct {
	Model
	Editor             string `gorm:"not null" json:"editor"`
	PersonName         string `gorm:"not null" json:"personName"`
	CostumeDescription string `gorm:"not null" json:"costumeDescription"`
	SubjectID          uint   `gorm:"not null" json:"subjectId"`
}
