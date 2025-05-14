package models

import "time"

type Comment struct {
	ID        uint      `gorm:"primaryKey"`
	Content   string
	TaskID    *uint
	ProjectID *uint
	UserID    uint
	User      User
	CreatedAt time.Time
}
