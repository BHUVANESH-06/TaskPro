package services

import (
	"errors"
	"time"
	"taskpro/models"
	"taskpro/db"
	"log"
	"fmt"
	"gorm.io/gorm"
	"encoding/json"
)

type ProjectService struct {
	DB *gorm.DB
}

func (s *ProjectService) CreateProject(name string, description string, ownerID uint) (*models.Project, error) {
	fmt.Println("HELLO")
	project := &models.Project{
		Name:        name,
		Description: description,
		OwnerID:     ownerID,
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}
	fmt.Println("I am called")
	if err := db.DB.Create(project).Error; err != nil {
		log.Printf("DB create error: %v",err)
		return nil, err
	}
	return project, nil
}

func (s *ProjectService) GetProjectsByMemberID(userID uint) ([]*models.Project, error) {
    var projectMembers []models.ProjectMember
    var memberProjectIDs []uint
    var projects []*models.Project
    projectMap := make(map[uint]*models.Project)

    if err := db.DB.Where("user_id = ?", userID).Find(&projectMembers).Error; err != nil {
        return nil, err
    }

    for _, pm := range projectMembers {
        memberProjectIDs = append(memberProjectIDs, pm.ProjectID)
    }

    if len(memberProjectIDs) > 0 {
        var memberProjects []*models.Project
        if err := db.DB.Where("id IN ?", memberProjectIDs).Find(&memberProjects).Error; err != nil {
            return nil, err
        }
        for _, p := range memberProjects {
            projectMap[p.ID] = p
        }
    }

    var ownedProjects []*models.Project
    if err := db.DB.Where("owner_id = ?", userID).Find(&ownedProjects).Error; err != nil {
        return nil, err
    }
    for _, p := range ownedProjects {
        projectMap[p.ID] = p 
    }

    for _, project := range projectMap {
        projects = append(projects, project)
    }

    // Optional debug
    if data, err := json.MarshalIndent(projects, "", "  "); err == nil {
        fmt.Println("Combined Projects (JSON):")
        fmt.Println(string(data))
    }

    return projects, nil
}

func (s *ProjectService) GetMembersByProjectID(projectID uint) ([]*models.User, error) {
    var projectMembers []models.ProjectMember
    var userIDs []uint
    var users []*models.User

    if err := db.DB.Where("project_id = ?", projectID).Find(&projectMembers).Error; err != nil {
        return nil, err
    }

    for _, pm := range projectMembers {
        userIDs = append(userIDs, pm.UserID)
    }

    if len(userIDs) > 0 {
        if err := db.DB.Where("id IN ?", userIDs).Find(&users).Error; err != nil {
            return nil, err
        }
    }

    if data, err := json.MarshalIndent(users, "", "  "); err == nil {
        fmt.Println("Project Members:", string(data))
    }

    return users, nil
}


func (s *ProjectService) UpdateProject(id uint, name string, description string) (*models.Project, error) {
	
	project := &models.Project{}
	if err := db.DB.First(project, id).Error; err != nil {
		return nil, errors.New("project not found")
	}

	project.Name = name
	project.Description = description
	project.UpdatedAt = time.Now()

	if err := db.DB.Save(project).Error; err != nil {
		return nil, err
	}
	return project, nil
}

func (s *ProjectService) DeleteProject(id uint) (bool, error) {
	// 1. Get all tasks for this project
	var tasks []models.Task
	if err := db.DB.Where("project_id = ?", id).Find(&tasks).Error; err != nil {
		return false, fmt.Errorf("failed to fetch tasks: %w", err)
	}

	// 2. Get task IDs
	var taskIDs []uint
	for _, task := range tasks {
		taskIDs = append(taskIDs, task.ID)
	}

	// 3. Delete task_labels
	if len(taskIDs) > 0 {
		if err := db.DB.Where("task_id IN ?", taskIDs).Delete(&models.TaskLabel{}).Error; err != nil {
			return false, fmt.Errorf("failed to delete task_labels: %w", err)
		}
	}

	// 4. Delete tasks
	if err := db.DB.Where("project_id = ?", id).Delete(&models.Task{}).Error; err != nil {
		return false, fmt.Errorf("failed to delete tasks: %w", err)
	}

	// 5. Delete labels
	if err := db.DB.Where("project_id = ?", id).Delete(&models.Label{}).Error; err != nil {
		return false, fmt.Errorf("failed to delete labels: %w", err)
	}

	// 6. Delete project_members (the new one)
	if err := db.DB.Where("project_id = ?", id).Delete(&models.ProjectMember{}).Error; err != nil {
		return false, fmt.Errorf("failed to delete project members: %w", err)
	}

	// 7. Delete the project
	project := &models.Project{}
	if err := db.DB.First(project, id).Error; err != nil {
		return false, errors.New("project not found")
	}

	if err := db.DB.Delete(project).Error; err != nil {
		return false, fmt.Errorf("failed to delete project: %w", err)
	}

	return true, nil
}



func (s *ProjectService) GetProject(id uint) (*models.Project, error) {
	project := &models.Project{}
	if err := db.DB.First(project, id).Error; err != nil {
		return nil, errors.New("project not found")
	}
	return project, nil
}

func (s *ProjectService) GetAllProjects(ownerID uint) ([]models.Project, error) {
	var projects []models.Project
	if err := db.DB.Where("owner_id = ?", ownerID).Find(&projects).Error; err != nil {
		return nil, err
	}
	return projects, nil
}

func (s *ProjectService) AddCollaborator(projectID uint, userID uint, role string) (*models.Project, error) {
	fmt.Println("HITTING")
	var proj models.Project
	if err := db.DB.First(&proj, projectID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, fmt.Errorf("project with ID %d not found", projectID)
		}
		return nil, fmt.Errorf("failed to fetch project: %w", err)
	}
	fmt.Println("Hello From AddCollaborator")
	pm := &models.ProjectMember{
		ProjectID: projectID,
		UserID:    userID,
		Role:      role,
		JoinedAt:  time.Now(),
	}
	fmt.Println("Got it");
	if err := db.DB.Create(pm).Error; err != nil {
		return nil, fmt.Errorf("failed to add collaborator: %w", err)
	}
	return &proj, nil
}

func (s *ProjectService) GetCollaboratorsByProjectID(projectID uint) ([]*models.User, error) {
	var collaborators []models.User

	err := db.DB.
		Table("project_members").
		Select("users.id, users.name, users.email").
		Joins("join users on users.id = project_members.user_id").
		Where("project_members.project_id = ?", projectID).
		Find(&collaborators).Error

	if err != nil {
		return nil, err
	}

	result := make([]*models.User, len(collaborators))
	for i := range collaborators {
		result[i] = &collaborators[i]
	}

	return result, nil
}
