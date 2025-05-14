package services

import (
	"errors"
	"time"
	"taskpro/db"
	"taskpro/models"
	"fmt"
	"gorm.io/gorm"
)

type CommentService struct {
	DB *gorm.DB
}

func (s *CommentService) AddCommentToProject(projectID uint, content string, userID uint) (*models.Comment, error) {
	fmt.Println("HELLO FROM ACP")
	var project models.Project
	if err := db.DB.First(&project, projectID).Error; err != nil {
		return nil, errors.New("project not found")
	}

	comment := &models.Comment{
		Content:   content,
		ProjectID: &projectID,
		UserID:    userID,
		CreatedAt: time.Now(),
	}

	if err := db.DB.Create(comment).Error; err != nil {
		return nil, err
	}
	return comment, nil
}

func (s *CommentService) AddCommentToTask(taskID uint, content string, userID uint) (*models.Comment, error) {
	var task models.Task
	if err := db.DB.First(&task, taskID).Error; err != nil {
		return nil, errors.New("task not found")
	}

	comment := &models.Comment{
		Content: content,
		TaskID:  &taskID,
		UserID:  userID,
		CreatedAt: time.Now(),
	}

	if err := db.DB.Create(comment).Error; err != nil {
		return nil, err
	}
	return comment, nil
}
