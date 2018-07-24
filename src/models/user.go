package models

// User the user table
type User struct {
	UserID string `json:"userId" gorm:"not null;primary_key"`
	Name   string `json:"name" gorm:"not null"`
	Banned bool   `json:"banned" gorm:"not null"`
}
