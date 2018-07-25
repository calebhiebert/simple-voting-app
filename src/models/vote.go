package models

// Vote represents a single vote
type Vote struct {
	Model
	Voter     string `json:"voter"`
	SubjectID uint   `json:"subjectId" gorm:"not null"`
}
