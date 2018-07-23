package main

import (
	"encoding/json"
	"io/ioutil"
	"net/http"
	"strings"

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

			c.Set("user-info", userInfo)
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
