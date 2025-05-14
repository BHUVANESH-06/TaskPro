package models

import "time"

type Task struct {
	ID          uint      `gorm:"primaryKey"`
	Title       string
	Description string
	Status      TaskStatus
	Priority    TaskPriority
	DueDate     *time.Time
	ProjectID   uint
	Project     Project
	AssignedTo  *uint
	Assignee    *User     `gorm:"foreignKey:AssignedTo"`
	CreatedAt   time.Time
	UpdatedAt   time.Time

	Comments []Comment
	Labels   []TaskLabel
}
