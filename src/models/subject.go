package models

// Subject represents a single subject that can be voted on
type Subject struct {
	Model
	PersonName         string           `json:"personName" binding:"required" gorm:"not null"`
	CostumeDescription string           `json:"costumeDescription" binding:"required" gorm:"not null"`
	Votes              []Vote           `json:"votes"`
	History            []SubjectHistory `json:"history"`
	VoteCount          int              `gorm:"-" json:"voteCount"`
}
