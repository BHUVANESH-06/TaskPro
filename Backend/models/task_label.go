package models

type TaskLabel struct {
	ID      uint `gorm:"primaryKey"`
	TaskID  uint
	LabelID uint
}
