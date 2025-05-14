package models

import "time"

type ProjectMember struct {
	ID        uint `gorm:"primaryKey"`
	ProjectID uint
	UserID    uint
	Role      string    
	JoinedAt  time.Time
}
