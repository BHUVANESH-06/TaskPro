package models

type TaskStatus string

const (
	TaskStatusTODO       TaskStatus = "TODO"
	TaskStatusINPROGRESS TaskStatus = "IN_PROGRESS"
	TaskStatusDONE       TaskStatus = "DONE"
)

type TaskPriority string

const (
	TaskPriorityLOW    TaskPriority = "LOW"
	TaskPriorityMEDIUM TaskPriority = "MEDIUM"
	TaskPriorityHIGH   TaskPriority = "HIGH"
)
