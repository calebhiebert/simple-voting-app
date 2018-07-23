package main

import (
	"./models"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
	_ "github.com/jinzhu/gorm/dialects/sqlite"
)

var db *gorm.DB
var err error

func startDatabase() {
	// db, err = gorm.Open("postgres", "host=localhost port=5432 user=postgres dbname=postgres password=password sslmode=disable")
	db, err = gorm.Open("sqlite3", "test.db")
	if err != nil {
		panic(err)
	}

	db.AutoMigrate(&models.Vote{})
	db.AutoMigrate(&models.Subject{})
	db.AutoMigrate(&models.SubjectHistory{})
}
