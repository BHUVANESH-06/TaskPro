package services

import (
	"errors"
	"taskpro/db"
	"taskpro/models"
	"gorm.io/gorm"
)

type LabelService struct {
	DB *gorm.DB
}
func (s *LabelService) CreateLabel(projectID uint, name string, color string) (*models.Label, error) {
	label := &models.Label{
		Name:      name,
		Color:     color,
		ProjectID: projectID,
	}

	if err := db.DB.Create(label).Error; err != nil {
		return nil, err
	}
	return label, nil
}

func (s *LabelService) AssignLabelToTask(taskID uint, labelID uint) (*models.Task, error) {

	var task models.Task
	if err := db.DB.First(&task, taskID).Error; err != nil {
		return nil, errors.New("task not found")
	}

	var label models.Label
	if err := db.DB.First(&label, labelID).Error; err != nil {
		return nil, errors.New("label not found")
	}

	var existing models.TaskLabel
	if err := db.DB.Where("task_id = ? AND label_id = ?", taskID, labelID).First(&existing).Error; err == nil {
		return nil, errors.New("label already assigned to task")
	}

	taskLabel := &models.TaskLabel{
		TaskID:  taskID,
		LabelID: labelID,
	}
	if err := db.DB.Create(taskLabel).Error; err != nil {
		return nil, err
	}

	return &task, nil
}
