package services

import (
	"context"
	"errors"
	"fmt"
	"taskpro/db"
	"taskpro/models"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type UserService struct {
	DB *gorm.DB
}

var secretKey = []byte("64CA8299BF8647718F77B5CBD857F")

func (s *UserService) Register(ctx context.Context, name string, email string, password string) (*models.User, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	user := &models.User{
		Name:      name,
		Email:     email,
		Password:  string(hashedPassword),
		CreatedAt: time.Now(),
	}

	if err := db.DB.Create(user).Error; err != nil {
		return nil, err
	}

	return user, nil
}

func (s *UserService) GetAllUsers() ([]models.User, error) {
	var users []models.User
	if err := db.DB.Find(&users).Error; err != nil {
		return nil, err
	}
	return users, nil
}

func (s *UserService) Login(ctx context.Context, email string, password string) (*models.User, error) {
	var user models.User
	if err := db.DB.Where("email = ?", email).First(&user).Error; err != nil {
		return nil, errors.New("invalid email or password")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)); err != nil {
		return nil, errors.New("invalid email or password")
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.ID,
		"email":   user.Email,
		"exp":     time.Now().Add(time.Hour * 72).Unix(),
	})

	tokenString, err := token.SignedString(secretKey)
	if err != nil {
		return nil, errors.New("could not generate token")
	}
	fmt.Println(tokenString)
	user.Token = &tokenString
	return &user, nil
}

func (s *UserService) Me(ctx context.Context, userID string) (*models.User, error) {
	var user models.User
	if err := db.DB.First(&user, "id = ?", userID).Error; err != nil {
		return nil, err
	}
	return &user, nil
}  

func (s *UserService) MyProjects(ctx context.Context, userID string) ([]*models.Project, error) {
	var projects []*models.Project
	if err := db.DB.Preload("Collaborators").Where("owner_id = ?", userID).Find(&projects).Error; err != nil {
		return nil, err
	}
	return projects, nil
}
