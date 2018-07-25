package main

import (
	"log"
	"os"
	"strings"

	"./models"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
	_ "github.com/jinzhu/gorm/dialects/sqlite"
)

var db *gorm.DB
var err error

func startDatabase() {
	switch os.Getenv("DATABASE") {
	case "postgres":
		connectionString := os.Getenv("POSTGRES_CONNECTION_STRING")

		if len(strings.TrimSpace(connectionString)) == 0 {
			log.Fatal("Missing postgres connection string")
		} else {
			db, err = gorm.Open("postgres", connectionString)
		}
		break
	case "sqlite":
		db, err = gorm.Open("sqlite3", "votes.db")
		break
	default:
		println("Database type " + os.Getenv("DATABASE") + "is not supported, using sqlite")
		db, err = gorm.Open("sqlite3", "votes.db")
		break
	}

	if err != nil {
		panic(err)
	}

	db.AutoMigrate(&models.Vote{})
	db.AutoMigrate(&models.Subject{})
	db.AutoMigrate(&models.SubjectHistory{})
	db.AutoMigrate(&models.User{})
}
