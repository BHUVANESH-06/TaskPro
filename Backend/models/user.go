package models

import "time"

type User struct {
	ID        uint      `gorm:"primaryKey"`
	Name      string
	Email     string    `gorm:"uniqueIndex"`
	Password  string
	Token     *string   `json:"token"` 
	CreatedAt time.Time
	UpdatedAt time.Time

	ProjectsCreated      []Project       `gorm:"foreignKey:OwnerID"`
	ProjectsCollaborated []ProjectMember `gorm:"foreignKey:UserID"`
	TasksAssigned        []Task          `gorm:"foreignKey:AssignedTo"`
	Comments             []Comment       `gorm:"foreignKey:UserID"`
}
