package graph

import (
	"context"
	"fmt"
	"strconv"
	"taskpro/graph/generated"
	"taskpro/graph/model"
    "taskpro/models"
	"time"
    "taskpro/services"
)

type Resolver struct {
	UserService     *services.UserService
	ProjectService  *services.ProjectService
	TaskService     *services.TaskService
	CommentService  *services.CommentService
	LabelService    *services.LabelService
}

func (r *mutationResolver) Register(ctx context.Context, name string, email string, password string) (*model.User, error) {
	user, err := r.UserService.Register(ctx,name, email, password)
	if err != nil {
		return nil, err
	}
	return &model.User{
		ID:    fmt.Sprint("%d",user.ID),
		Name:  user.Name,
		Email: user.Email,
	}, nil
}

func (r *mutationResolver) Login(ctx context.Context, email string, password string) (*model.User, error) {
	user, err := r.UserService.Login(ctx,email, password)
	if err != nil {
		return nil, err
	}
	return &model.User{
		ID:   strconv.FormatUint(uint64(user.ID), 10),
		Name:  user.Name,
		Email: user.Email,
		Token: user.Token,
	}, nil
}

func (r *mutationResolver) CreateProject(ctx context.Context, name string, description *string, ownerID string) (*model.Project, error) {
	if description == nil {
		defaultDesc := ""
		description = &defaultDesc
	}
    fmt.Println("INSIDE RESOLVE")
	ownerIDUint, err := strconv.ParseUint(ownerID, 10, 32)
	if err != nil {
		return nil, fmt.Errorf("invalid owner ID: %v", err)
	}

	project, err := r.ProjectService.CreateProject(name, *description, uint(ownerIDUint))
	if err != nil {
		return nil, err
	}

	return &model.Project{
		ID:          fmt.Sprintf("%d", project.ID),
		Name:        project.Name,
		Description: &project.Description,
		Owner:       &model.User{ID: fmt.Sprintf("%d", project.OwnerID)},
	}, nil
}
func (r *mutationResolver) UpdateProject(ctx context.Context, id string, name *string, description *string) (*model.Project, error) {

    idUint, err := strconv.ParseUint(id, 10, 32)
    if err != nil {
        return nil, fmt.Errorf("invalid project ID: %v", err)
    }

    var nameVal, descVal string
    if name != nil {
        nameVal = *name
    }
    if description != nil {
        descVal = *description
    }
    project, err := r.ProjectService.UpdateProject(uint(idUint), nameVal, descVal)
    if err != nil {
        return nil, err
    }

    return &model.Project{
        ID:          fmt.Sprintf("%d", project.ID),
        Name:        project.Name,
        Description: &project.Description,
        Owner:       &model.User{ID: fmt.Sprintf("%d", project.OwnerID)},
        CreatedAt:   project.CreatedAt.Format(time.RFC3339),
        UpdatedAt:   project.UpdatedAt.Format(time.RFC3339),
    }, nil
}


func (r *mutationResolver) DeleteProject(ctx context.Context, id string) (bool, error) {
    fmt.Println("HITTING DELETE PROJECT",id)
    idUint, err := strconv.ParseUint(id, 10, 32)
    if err != nil {
        return false, fmt.Errorf("invalid project ID: %v", err)
    }
    return r.ProjectService.DeleteProject(uint(idUint))
}


func (r *mutationResolver) AddCollaborator(ctx context.Context, projectID string, userID string) (*model.Project, error) {
    // parse IDs
    fmt.Println("HITTING")
    pid, err := strconv.ParseUint(projectID, 10, 32)
    if err != nil {
        return nil, fmt.Errorf("invalid project ID: %v", err)
    }
    uid, err := strconv.ParseUint(userID, 10, 32)
    if err != nil {
        return nil, fmt.Errorf("invalid user ID: %v", err)
    }

    proj, err := r.ProjectService.AddCollaborator(uint(pid), uint(uid), "collaborator")
    if err != nil {
        return nil, err
    }

    return &model.Project{
        ID:          fmt.Sprintf("%d", proj.ID),
        Name:        proj.Name,
        Description: &proj.Description,
        Owner:       &model.User{ID: fmt.Sprintf("%d", proj.OwnerID)},
        Collaborators: func() []*model.ProjectMember {
            var list []*model.ProjectMember
            for _, cm := range proj.Collaborators {
                list = append(list, &model.ProjectMember{
                    ID:        fmt.Sprintf("%d", cm.ID),
                    ProjectID: fmt.Sprintf("%d", cm.ProjectID),
                    UserID:    fmt.Sprintf("%d", cm.UserID),
                    Role:      cm.Role,
                    JoinedAt:  cm.JoinedAt.Format(time.RFC3339),
                })
            }
            return list
        }(),
    }, nil
}
func (r *queryResolver) Collaborators(ctx context.Context, projectID string) ([]*model.User, error) {
    fmt.Println("HITTING COLLABORATORS",projectID)
    pid, err := strconv.ParseUint(projectID, 10, 32)
    if err != nil {
        return nil, fmt.Errorf("invalid project ID: %v", err)
    }

    users, err := r.ProjectService.GetCollaboratorsByProjectID(uint(pid))
    if err != nil {
        return nil, err
    }

    var result []*model.User
    for _, u := range users {
        result = append(result, &model.User{
            ID:    fmt.Sprintf("%d", u.ID),
            Name:  u.Name,
            Email: u.Email,
        })
    }

    return result, nil
}

func (r *queryResolver) GetProjectMembers(ctx context.Context, projectID string) ([]*model.User, error) {
    idUint, err := strconv.ParseUint(projectID, 10, 32)
    if err != nil {
        return nil, fmt.Errorf("invalid project ID: %v", err)
    }

    // Step 1: Fetch from service
    dbUsers, err := r.ProjectService.GetMembersByProjectID(uint(idUint))
    if err != nil {
        return nil, err
    }

    // Step 2: Convert models.User to model.User
    var gqlUsers []*model.User
    for _, u := range dbUsers {
        gqlUsers = append(gqlUsers, &model.User{
            ID:    fmt.Sprint(u.ID),
            Name:  u.Name,
            Email: u.Email,
        })
    }

    return gqlUsers, nil
}



func (r *mutationResolver) CreateTask(
    ctx context.Context,
    projectID string,
    title string,
    description *string,
    status model.TaskStatus,
    priority model.TaskPriority,
    dueDate *string,
    assignedToID *string,
) (*model.Task, error) {
    fmt.Println("HELLO")
    pid, err := strconv.ParseUint(projectID, 10, 32)
    if err != nil {
        return nil, fmt.Errorf("invalid project ID: %v", err)
    }
    descVal := ""
    if description != nil {
        descVal = *description
    }
    dueVal := ""
    if dueDate != nil {
        dueVal = *dueDate
    }
    var aID uint64
    if assignedToID != nil {
        aID, err = strconv.ParseUint(*assignedToID, 10, 32)
        if err != nil {
            return nil, fmt.Errorf("invalid assignedToID: %v", err)
        }
    }
    fmt.Println("Resolver createTask manh")
    task, err := r.TaskService.CreateTask(
        uint(pid),
        title,
        descVal,
        string(status),
        string(priority),
        dueVal,
        uint(aID),
    )
    if err != nil {
        return nil, err
    }
    createdAt := task.CreatedAt.Format(time.RFC3339)
    updatedAt := task.UpdatedAt.Format(time.RFC3339)
    var duePtr *string
    if task.DueDate != nil {
        s := task.DueDate.Format(time.RFC3339)
        duePtr = &s
    }
    var userPtr *model.User
    if task.AssignedTo != nil {
        uid := fmt.Sprintf("%d", *task.AssignedTo)
        userPtr = &model.User{ID: uid}
    }
    return &model.Task{
        ID:          fmt.Sprintf("%d", task.ID),
        Title:       task.Title,
        Description: &task.Description,
        Status:      model.TaskStatus(task.Status),
        Priority:    model.TaskPriority(task.Priority),
        DueDate:     duePtr,
        CreatedAt:   createdAt,
        UpdatedAt:   updatedAt,
        Project:     &model.Project{ID: fmt.Sprintf("%d", task.ProjectID)},
        AssignedTo:  userPtr,
        Comments:    []*model.Comment{},
        Labels:      []*model.Label{},
    }, nil
}


func (r *mutationResolver) UpdateTask(
    ctx context.Context,
    id string,
    title *string,
    description *string,
    status *model.TaskStatus,
    priority *model.TaskPriority,
    dueDate *string,
    assignedToID *string,
) (*model.Task, error) {

    tid, err := strconv.ParseUint(id, 10, 32)
    if err != nil {
        return nil, fmt.Errorf("invalid task ID: %v", err)
    }
   
    titleVal := ""
    if title != nil {
        titleVal = *title
    }
   
    descVal := ""
    if description != nil {
        descVal = *description
    }
    
    statusVal := ""
    if status != nil {
        statusVal = string(*status)
    }
  
    priorityVal := ""
    if priority != nil {
        priorityVal = string(*priority)
    }
    dueVal := ""
    if dueDate != nil {
        dueVal = *dueDate
    }
    var aid uint64
    if assignedToID != nil {
        aid, err = strconv.ParseUint(*assignedToID, 10, 32)
        if err != nil {
            return nil, fmt.Errorf("invalid assignedToID: %v", err)
        }
    }
    task, err := r.TaskService.UpdateTask(
        uint(tid),
        titleVal,
        descVal,
        statusVal,
        priorityVal,
        dueVal,
        uint(aid),
    )
    if err != nil {
        return nil, err
    }
    createdAt := task.CreatedAt.Format(time.RFC3339)
    updatedAt := task.UpdatedAt.Format(time.RFC3339)
    var duePtr *string
    if task.DueDate != nil {
        s := task.DueDate.Format(time.RFC3339)
        duePtr = &s
    }
    var userPtr *model.User
    if task.AssignedTo != nil {
        uid := fmt.Sprintf("%d", *task.AssignedTo)
        userPtr = &model.User{ID: uid}
    }
    return &model.Task{
        ID:          fmt.Sprintf("%d", task.ID),
        Title:       task.Title,
        Description: &task.Description,
        Status:      model.TaskStatus(task.Status),
        Priority:    model.TaskPriority(task.Priority),
        DueDate:     duePtr,
        CreatedAt:   createdAt,
        UpdatedAt:   updatedAt,
        Project:     &model.Project{ID: fmt.Sprintf("%d", task.ProjectID)},
        AssignedTo:  userPtr,
        Comments:    []*model.Comment{},
        Labels:      []*model.Label{},
    }, nil
}

func (r *mutationResolver) DeleteTask(ctx context.Context, id string) (bool, error) {
    tid, err := strconv.ParseUint(id, 10, 32)
    if err != nil {
        return false, fmt.Errorf("invalid task ID: %v", err)
    }
    return r.TaskService.DeleteTask(uint(tid))
}

func (r *mutationResolver) AddCommentToProject(ctx context.Context, projectID string, content string) (*model.Comment, error) {
    fmt.Println("DEBUG: projectID =", projectID)

    userID := getUserIDFromContext(ctx)
    fmt.Println("DEBUG: userID =", userID)
    pid, err := strconv.ParseUint(projectID, 10, 32)
    fmt.Println("HELLO OF PID STRCONV",err)
    if err != nil {
        fmt.Println("YES GOT ERR")
        return nil, fmt.Errorf("invalid project ID: %v", err)
    }

    userIDStr := getUserIDFromContext(ctx)
    uid, err := strconv.ParseUint(userIDStr, 10, 32)
    fmt.Println("ERROR OF STRCONV",err)
    comment, err := r.CommentService.AddCommentToProject(uint(pid), content, uint(uid))
    if err != nil {
        return nil, err
    }
    fmt.Println("HELLO AFTER ERR",err)
    createdAt := comment.CreatedAt.Format(time.RFC3339)
    return &model.Comment{
        ID:        fmt.Sprintf("%d", comment.ID),
        Content:   comment.Content,
        CreatedAt: createdAt,
        Author:    &model.User{ID: fmt.Sprintf("%d", comment.UserID)},
        Project:   &model.Project{ID: fmt.Sprintf("%d", *comment.ProjectID)},
        Task:      nil,
    }, nil
}

func (r *mutationResolver) AddCommentToTask(ctx context.Context, taskID string, content string) (*model.Comment, error) {
    tid, err := strconv.ParseUint(taskID, 10, 32)
    if err != nil {
        return nil, fmt.Errorf("invalid task ID: %v", err)
    }
	userIDStr := getUserIDFromContext(ctx)
	uid, err := strconv.ParseUint(userIDStr, 10, 32)
    if err != nil {
        return nil, fmt.Errorf("invalid user ID: %v", err)
    }
    comment, err := r.CommentService.AddCommentToTask(uint(tid), content, uint(uid))
    if err != nil {
        return nil, err
    }
    createdAt := comment.CreatedAt.Format(time.RFC3339)
    var taskPtr *model.Task
    if comment.TaskID != nil {
        taskPtr = &model.Task{ID: fmt.Sprintf("%d", *comment.TaskID)}
    }
    return &model.Comment{
        ID:        fmt.Sprintf("%d", comment.ID),
        Content:   comment.Content,
        CreatedAt: createdAt,
        Author:    &model.User{ID: fmt.Sprintf("%d", comment.UserID)},
        Project:   nil,
        Task:      taskPtr,
    }, nil
}

func (r *mutationResolver) CreateLabel(ctx context.Context, projectID string, name string, color string) (*model.Label, error) {
    pid, err := strconv.ParseUint(projectID, 10, 32)
    if err != nil {
        return nil, fmt.Errorf("invalid project ID: %v", err)
    }
    label, err := r.LabelService.CreateLabel(uint(pid), name, color)
    if err != nil {
        return nil, err
    }
    return &model.Label{
        ID:    fmt.Sprintf("%d", label.ID),
        Name:  label.Name,
        Color: label.Color,
        Project: &model.Project{
            ID: fmt.Sprintf("%d", label.ProjectID),
        },
    }, nil
}

func (r *mutationResolver) AssignLabelToTask(ctx context.Context, taskID string, labelID string) (*model.Task, error) {
    tid, err := strconv.ParseUint(taskID, 10, 32)
    if err != nil {
        return nil, fmt.Errorf("invalid task ID: %v", err)
    }
    lid, err := strconv.ParseUint(labelID, 10, 32)
    if err != nil {
        return nil, fmt.Errorf("invalid label ID: %v", err)
    }
    task, err := r.LabelService.AssignLabelToTask(uint(tid), uint(lid))
    if err != nil {
        return nil, err
    }
    return &model.Task{
        ID:    fmt.Sprintf("%d", task.ID),
        Title: task.Title,
        Project: &model.Project{
            ID: fmt.Sprintf("%d", task.ProjectID),
        },
    }, nil
}

func (r *queryResolver) Me(ctx context.Context) (*model.User, error) {
    userIDStr := getUserIDFromContext(ctx)
    user, err := r.UserService.Me(ctx, userIDStr)
    if err != nil {
        return nil, err
    }
    createdAt := user.CreatedAt.Format(time.RFC3339)
    var token *string
    if user.Token != nil {
        token = user.Token
    }
    return &model.User{
        ID:                    fmt.Sprintf("%d", user.ID),
        Name:                  user.Name,
        Email:                 user.Email,
        Token:                 token,
        CreatedAt:             createdAt,
        ProjectsCreated:       []*model.Project{},
        ProjectsCollaborating: []*model.Project{},
        TasksAssigned:         []*model.Task{},
        Comments:              []*model.Comment{},
    }, nil
}


func (r *queryResolver) MyProjects(ctx context.Context, ownerID string) ([]*model.Project, error) {
    id, err := strconv.ParseUint(ownerID, 10, 64)
    if err != nil {
        return nil, err
    }
    proList, err := r.ProjectService.GetProjectsByMemberID(uint(id))
    if err != nil {
        return nil, err
    }
    fmt.Println("RESOLVER HELLO")
    var gqlProjects []*model.Project
    for _, pro := range proList {
        progress := CalculateProgress(pro.Tasks)
        fmt.Printf("Project %s progress: %d%%\n", pro.Name, progress)
        gqlProjects = append(gqlProjects, &model.Project{
            ID:          strconv.FormatUint(uint64(pro.ID), 10),
            Name:        pro.Name,
            Description: &pro.Description,
            Owner: &model.User{
                ID:    strconv.FormatUint(uint64(pro.Owner.ID), 10),
                Name:  pro.Owner.Name,
                Email: pro.Owner.Email,
            },
            Progress: progress,
            CreatedAt: pro.CreatedAt.Format(time.RFC3339),
            UpdatedAt: pro.UpdatedAt.Format(time.RFC3339),
            Collaborators: []*model.ProjectMember{},
            Tasks:         []*model.Task{},
            Comments:      []*model.Comment{},
            Labels:        []*model.Label{},
        })
        
    }
    return gqlProjects, nil
}
type UserService struct{}

func (r *queryResolver) Users(ctx context.Context) ([]*model.User, error) {

    users, err := r.UserService.GetAllUsers()
    if err != nil {
        return nil, fmt.Errorf("failed to fetch users: %w", err)
    }

    var gqlUsers []*model.User
    for _, u := range users {
        gqlUsers = append(gqlUsers, &model.User{
            ID:    fmt.Sprintf("%d", u.ID),
            Name:  u.Name,
            Email: u.Email,
        })
    }

    return gqlUsers, nil
}


func (r *queryResolver) Project(ctx context.Context, id string) (*model.Project, error) {
	return nil,nil;
}

func (r *queryResolver) Task(ctx context.Context, id string) (*model.Task, error) {
	return nil,nil;
}

func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }
func (r *Resolver) Query() generated.QueryResolver       { return &queryResolver{r} }

type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }

func getUserIDFromContext(ctx context.Context) string {
	// Placeholder: replace with your actual context extraction logic
	return ctx.Value("userID").(string)
}
func CalculateProgress(tasks []models.Task) int {
    total := len(tasks)
    if total == 0 {
        return 0
    }
    completed := 0
    for _, task := range tasks {
        if task.Status=="DONE" {
            completed++
        }
    }
    return (completed * 100) / total
}
