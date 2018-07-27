package main

import (
	"encoding/json"
	"io/ioutil"
	"net/http"
	"os"
	"strings"

	"github.com/jinzhu/gorm"

	"./models"
	"github.com/gin-gonic/gin"
)

// Auth middleware to parse auth0 tokens
func Auth() gin.HandlerFunc {
	return func(c *gin.Context) {
		bearerToken := c.GetHeader("Authorization")

		if len(strings.TrimSpace(bearerToken)) > 0 {
			parsedToken := bearerToken[len("Bearer "):len(bearerToken)]
			userInfo, err := getUserInfo(parsedToken)
			if err != nil {
				c.AbortWithStatusJSON(401, gin.H{"error": "Invalid token"})
				return
			}

			dbUserInfo, err := findOrCreateUser(&models.User{
				UserID: userInfo["sub"].(string),
				Name:   userInfo["name"].(string),
				Banned: false,
				Admin:  strings.Contains(os.Getenv("ADMINS"), userInfo["sub"].(string)),
			})
			if err != nil {
				c.AbortWithStatusJSON(500, gin.H{"error": err})
			}

			c.Set("user-info", dbUserInfo)
		} else {
			c.Next()
		}
	}
}

func RequireAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		_, exists := c.Get("user-info")

		if !exists {
			c.AbortWithStatusJSON(401, gin.H{"error": "Must be logged in"})
			return
		} else {
			c.Next()
		}
	}
}

// CheckBanned middleware to make sure the user is not banned
func CheckBanned() gin.HandlerFunc {
	return func(c *gin.Context) {
		userInfo, _ := c.Get("user-info")

		if userInfo.(*models.User).Banned {
			c.AbortWithStatus(403)
			return
		} else {
			c.Next()
		}
	}
}

func findOrCreateUser(user *models.User) (*models.User, error) {
	dbUser := models.User{}

	if err := db.Find(&dbUser, models.User{UserID: user.UserID}).Error; gorm.IsRecordNotFoundError(err) {
		if createErr := db.Create(&user).Error; createErr != nil {
			return nil, createErr
		}

		return user, nil
	}

	return &dbUser, nil
}

func getUserInfo(accessToken string) (map[string]interface{}, error) {
	client := &http.Client{}

	req, err := http.NewRequest("GET", "https://halloween-voting.auth0.com/userinfo", nil)
	if err != nil {
		return nil, err
	}

	req.Header.Add("Authorization", "Bearer "+accessToken)
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	bdy := map[string]interface{}{}

	err = json.Unmarshal(body, &bdy)
	if err != nil {
		return nil, err
	}

	return bdy, nil
}
