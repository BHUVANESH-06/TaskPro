package models

import "time"

type Project struct {
	ID          uint      `gorm:"primaryKey"`
	Name        string
	Description string
	OwnerID     uint
	Owner       User      `gorm:"foreignKey:OwnerID"`
	CreatedAt   time.Time
	UpdatedAt   time.Time
	Progress     int       `gorm:"default:0"` 
	Tasks        []Task
	Comments     []Comment
	Collaborators []ProjectMember `gorm:"foreignKey:ProjectID"`
	Labels       []Label
}
