package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"regexp"
	"time"
)

const graphqlEndpoint = "http://localhost:8080/query"

type GraphQLRequest struct {
	Query string `json:"query"`
}

type GraphQLError struct {
	Message string   `json:"message"`
	Path    []string `json:"path"`
}

type GraphQLResponse struct {
	Data   map[string]json.RawMessage `json:"data"`
	Errors []GraphQLError             `json:"errors"`
}

// sendRequest sends the GraphQL query and returns the raw response body
func sendRequest(query, token string) ([]byte, error) {
	bodyBytes, err := json.Marshal(GraphQLRequest{Query: query})
	if err != nil {
		return nil, err
	}

	req, err := http.NewRequest("POST", graphqlEndpoint, bytes.NewBuffer(bodyBytes))
	if err != nil {
		return nil, err
	}
	req.Header.Set("Content-Type", "application/json")
	if token != "" {
		req.Header.Set("Authorization", "Bearer "+token)
	}

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	return ioutil.ReadAll(resp.Body)
}

// printResponse unmarshals and logs any GraphQL errors, or prints the data field
func printResponse(label string, resp []byte) {
	var gqlResp GraphQLResponse
	if err := json.Unmarshal(resp, &gqlResp); err != nil {
		fmt.Printf("[%s] failed to unmarshal response: %v\nraw: %s\n", label, err, string(resp))
		return
	}

	if len(gqlResp.Errors) > 0 {
		fmt.Printf("[%s] GraphQL ERRORS:\n", label)
		for _, e := range gqlResp.Errors {
			fmt.Printf("  - %s (path: %v)\n", e.Message, e.Path)
		}
	} else {
		fmt.Printf("[%s] OK, data keys: %v\n", label, keys(gqlResp.Data))
	}
}

// keys returns the map keys as a slice (for debug)
func keys(m map[string]json.RawMessage) []string {
	out := make([]string, 0, len(m))
	for k := range m {
		out = append(out, k)
	}
	return out
}

// cleanID extracts the first integer substring from s.
func cleanID(s string) string {
	re := regexp.MustCompile(`\d+`)
	if m := re.FindString(s); m != "" {
		return m
	}
	return s
}

// parseID pulls "id" out of a raw message and cleans it.
func parseID(raw json.RawMessage) string {
	var m map[string]interface{}
	if err := json.Unmarshal(raw, &m); err != nil {
		return ""
	}
	if idVal, ok := m["id"].(string); ok {
		return cleanID(idVal)
	}
	return ""
}

func main() {
	var (
		userID, projectID, taskID, labelID, token string
	)

	// 1) REGISTER
	email := fmt.Sprintf("john+%d@example.com", time.Now().Unix())
	registerQ := fmt.Sprintf(`
mutation {
  register(name:"John", email:"%s", password:"1234") {
    id name email
  }
}`, email)

	resp, err := sendRequest(registerQ, "")
	if err != nil {
		log.Fatalf("Register request failed: %v", err)
	}
	printResponse("REGISTER", resp)
	fmt.Println(resp)
	var regResp GraphQLResponse
	json.Unmarshal(resp, &regResp)
	userID = parseID(regResp.Data["register"])

	// 2) LOGIN
	loginQ := fmt.Sprintf(`
mutation {
  login(email:"%s", password:"1234") {
    id name email token
  }
}`, email)

	resp, err = sendRequest(loginQ, "")
	if err != nil {
		log.Fatalf("Login request failed: %v", err)
	}
	printResponse("LOGIN", resp)

	var loginResp GraphQLResponse
	json.Unmarshal(resp, &loginResp)
	if raw, ok := loginResp.Data["login"]; ok {
		var tmp struct {
			Token string `json:"token"`
		}
		json.Unmarshal(raw, &tmp)
		token = tmp.Token
	}

	// 3) CREATE PROJECT
	createProjQ := fmt.Sprintf(`
mutation {
  createProject(name:"Test Project", description:"desc", ownerId:"%s") {
    id name description
  }
}`, userID)

	resp, err = sendRequest(createProjQ, token)
	if err != nil {
		log.Fatalf("CreateProject request failed: %v", err)
	}
	printResponse("CREATE_PROJECT", resp)

	var cpResp GraphQLResponse
	json.Unmarshal(resp, &cpResp)
	projectID = parseID(cpResp.Data["createProject"])

	// 4) CREATE TASK
	createTaskQ := fmt.Sprintf(`
mutation {
  createTask(
    projectId:"%s",
    title:"Task1",
    description:"desc",
    status:TODO,
    priority:HIGH,
    dueDate:"2025-06-01",
    assignedToId:"%s"
  ) { id title status priority }
}`, projectID, userID)

	resp, err = sendRequest(createTaskQ, token)
	if err != nil {
		log.Fatalf("CreateTask request failed: %v", err)
	}
	printResponse("CREATE_TASK", resp)

	var ctResp GraphQLResponse
	json.Unmarshal(resp, &ctResp)
	taskID = parseID(ctResp.Data["createTask"])

	// 5) ADD COMMENT TO PROJECT
	cmtProjQ := fmt.Sprintf(`
mutation {
  addCommentToProject(projectId:"%s", content:"Looks good!") {
    id content
  }
}`, projectID)

	resp, err = sendRequest(cmtProjQ, token)
	if err != nil {
		log.Fatalf("AddCommentToProject request failed: %v", err)
	}
	printResponse("ADD_COMMENT_PROJECT", resp)

	// 6) ADD COMMENT TO TASK
	cmtTaskQ := fmt.Sprintf(`
mutation {
  addCommentToTask(taskId:"%s", content:"Update soon") {
    id content
  }
}`, taskID)

	resp, err = sendRequest(cmtTaskQ, token)
	if err != nil {
		log.Fatalf("AddCommentToTask request failed: %v", err)
	}
	printResponse("ADD_COMMENT_TASK", resp)

	// 7) CREATE LABEL
	createLabelQ := fmt.Sprintf(`
mutation {
  createLabel(projectId:"%s", name:"Urgent", color:"red") {
    id name color
  }
}`, projectID)

	resp, err = sendRequest(createLabelQ, token)
	if err != nil {
		log.Fatalf("CreateLabel request failed: %v", err)
	}
	printResponse("CREATE_LABEL", resp)

	var clResp GraphQLResponse
	json.Unmarshal(resp, &clResp)
	labelID = parseID(clResp.Data["createLabel"])

	//Add Collaborator
	addCollabQ := fmt.Sprintf(`
	mutation {
	  addCollaborator(projectId: "%s", userId: "%s") {
		id
		name
		collaborators {
		  id
		  userId
		  role
		  joinedAt
		}
	  }
	}`, projectID, userID)

	resp, err = sendRequest(addCollabQ, token)
	if err != nil {
		log.Fatalf("AddCollaborator request failed: %v", err)
	}
	printResponse("ADD_COLLABORATOR", resp)

	var acResp GraphQLResponse
	json.Unmarshal(resp, &acResp)

	// 8) ASSIGN LABEL TO TASK
	assignLabelQ := fmt.Sprintf(`
mutation {
  assignLabelToTask(taskId:"%s", labelId:"%s") {
    id title
  }
}`, taskID, labelID)

	resp, err = sendRequest(assignLabelQ, token)
	if err != nil {
		log.Fatalf("AssignLabelToTask request failed: %v", err)
	}
	printResponse("ASSIGN_LABEL_TASK", resp)

	// 9) QUERY ME
	meQ := `query { me { id name email } }`
	resp, err = sendRequest(meQ, token)
	if err != nil {
		log.Fatalf("Me request failed: %v", err)
	}
	printResponse("ME", resp)

	// 10) QUERY MY PROJECTS
	myProjQ := `query { myProjects { id name description } }`
	resp, err = sendRequest(myProjQ, token)
	if err != nil {
		log.Fatalf("MyProjects request failed: %v", err)
	}
	printResponse("MY_PROJECTS", resp)
	// 11) UPDATE PROJECT
	updateProjQ := `
			mutation {
				updateProject(id:"18", name:"buvi Project", description:"Updated desc") {
					id
					name
					description
				}
			}`

	resp, err = sendRequest(updateProjQ, token)
	if err != nil {
		log.Fatalf("UpdateProject request failed: %v", err)
	}
	printResponse("UPDATE_PROJECT", resp)
	fmt.Println(string(resp)) // raw response

	// 12) DELETE PROJECT
	deleteProjQ := `
		mutation {
		  deleteProject(id:"19")
		}`

	resp, err = sendRequest(deleteProjQ, token)
	if err != nil {
		log.Fatalf("DeleteProject request failed: %v", err)
	}
	printResponse("DELETE_PROJECT", resp)
	fmt.Println(string(resp)) // raw response

	// 13) UPDATE TASK
	updateTaskQ := fmt.Sprintf(`
	mutation {
	  updateTask(
		id: "%s",
		title: "Updated Task1",
		description: "Updated description",
		status: IN_PROGRESS,
		priority: MEDIUM,
		dueDate: "2025-07-01",
		assignedToId: "%s"
	  ) {
		id
		title
		status
		priority
		description
		dueDate
	  }
	}`, taskID, userID)

	resp, err = sendRequest(updateTaskQ, token)
	if err != nil {
		log.Fatalf("UpdateTask request failed: %v", err)
	}
	printResponse("UPDATE_TASK", resp)
	fmt.Println(string(resp)) // Optional: print raw JSON

	// 14) DELETE TASK
	deleteTaskQ := fmt.Sprintf(`
	mutation {
	  deleteTask(id: "%s")
	}`, taskID)

	resp, err = sendRequest(deleteTaskQ, token)
	if err != nil {
		log.Fatalf("DeleteTask request failed: %v", err)
	}
	printResponse("DELETE_TASK", resp)
	fmt.Println(string(resp)) // Optional: print raw JSON

}
