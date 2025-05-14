package db

import (
	"fmt"
	"log"
	"os"
	"taskpro/models"
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Init() {
	err1 := godotenv.Load()
	if err1 != nil {
		log.Fatal("Error loading .env file")
	}
	dsn := os.Getenv("DATABASE_URL")
	fmt.Println(dsn)
	if dsn == "" {
		log.Fatal("DATABASE_URL not set")
	}

	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("failed to connect database: ", err)
	}

	err = DB.AutoMigrate(&models.User{}, &models.Project{}, &models.Task{}, &models.Comment{}, &models.Label{}, &models.ProjectMember{},&models.TaskLabel{})
	if err != nil {
		log.Fatal("failed migration: ", err)
	}

	fmt.Println("DB connected & migrated ✅")
}
