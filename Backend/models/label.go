package models

type Label struct {
	ID        uint   `gorm:"primaryKey"`
	Name      string
	Color     string  
	ProjectID uint
	Project   Project
}
