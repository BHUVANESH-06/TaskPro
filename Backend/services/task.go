package services

import (
	"errors"
	"fmt"
	"gorm.io/gorm"
	"taskpro/db"
	"taskpro/models"
	"time"
)

type TaskService struct {
	DB *gorm.DB
}

func (s *TaskService) CreateTask(
	projectID uint,
	title string,
	description string,
	status string,
	priority string,
	dueDate string,
	assignedToID uint,
) (*models.Task, error) {
	var taskStatus models.TaskStatus
	var taskPriority models.TaskPriority
	switch status {
	case "TODO":
		taskStatus = models.TaskStatusTODO
	case "IN_PROGRESS":
		taskStatus = models.TaskStatusINPROGRESS
	case "DONE":
		taskStatus = models.TaskStatusDONE
	default:
		return nil, errors.New("invalid status")
	}

	switch priority {
	case "LOW":
		taskPriority = models.TaskPriorityLOW
	case "MEDIUM":
		taskPriority = models.TaskPriorityMEDIUM
	case "HIGH":
		taskPriority = models.TaskPriorityHIGH
	default:
		return nil, errors.New("invalid priority")
	}

	parsedDueDate, err := time.Parse("2006-01-02", dueDate)
	if err != nil {
		return nil, errors.New("invalid date format")
	}
	fmt.Println("TaskManh")
	task := &models.Task{
		ProjectID:   projectID,
		Title:       title,
		Description: description,
		Status:      taskStatus,
		Priority:    taskPriority,
		DueDate:     &parsedDueDate,
		AssignedTo:  &assignedToID,
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}

	if err := db.DB.Create(task).Error; err != nil {
		return nil, err
	}
	fmt.Println(task)
	return task, nil
}

func (s *TaskService) GetTasksByAssignedTo(assignedToID uint) ([]*models.Task, error) {
    var tasks []*models.Task
    err := db.DB.Where("assigned_to = ?", assignedToID).Find(&tasks).Error
    if err != nil {
        return nil, err
    }

    return tasks, nil
}


func (s *TaskService) UpdateTask(id uint, title string, description string, status string, priority string, dueDate string, assignedToID uint) (*models.Task, error) {

	task := &models.Task{}
	if err := db.DB.First(task, id).Error; err != nil {
		return nil, errors.New("task not found")
	}

	var taskStatus models.TaskStatus
	switch status {
	case "TODO":
		taskStatus = models.TaskStatusTODO
	case "IN_PROGRESS":
		taskStatus = models.TaskStatusINPROGRESS
	case "DONE":
		taskStatus = models.TaskStatusDONE
	default:
		return nil, errors.New("invalid status")
	}

	var taskPriority models.TaskPriority
	switch priority {
	case "LOW":
		taskPriority = models.TaskPriorityLOW
	case "MEDIUM":
		taskPriority = models.TaskPriorityMEDIUM
	case "HIGH":
		taskPriority = models.TaskPriorityHIGH
	default:
		return nil, errors.New("invalid priority")
	}

	parsedDueDate, err := time.Parse("2006-01-02", dueDate)
	if err != nil {
		return nil, errors.New("invalid date format")
	}

	task.Title = title
	task.Description = description
	task.Status = taskStatus
	task.Priority = taskPriority
	task.DueDate = &parsedDueDate
	task.AssignedTo = &assignedToID
	task.UpdatedAt = time.Now()

	if err := db.DB.Save(task).Error; err != nil {
		return nil, err
	}
	return task, nil
}

func (s *TaskService) DeleteTask(id uint) (bool, error) {
	var task models.Task
	if err := db.DB.First(&task, id).Error; err != nil {
		return false, errors.New("task not found")
	}

	if err := db.DB.Where("task_id = ?", id).Delete(&models.TaskLabel{}).Error; err != nil {
		return false, fmt.Errorf("failed to delete related task_labels: %w", err)
	}

	if err := db.DB.Delete(&task).Error; err != nil {
		return false, fmt.Errorf("failed to delete task: %w", err)
	}

	return true, nil
}
