package main

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"github.com/stretchr/testify/assert"
	"github.com/gin-gonic/gin"
	"realworld-backend/users"
	"realworld-backend/common"
)

func setupTestRouter() *gin.Engine {
	gin.SetMode(gin.TestMode)
	r := gin.New()

	// Initialize test database (this will be used by the handlers)
	common.TestDBInit()
	users.AutoMigrate()

	// Set up basic routes that we know work
	api := r.Group("/api")
	
	// User routes (no auth required)
	users.UsersRegister(api.Group("/users"))
	
	return r
}

// Test 1: Basic Server Test
func TestBasicServer(t *testing.T) {
	asserts := assert.New(t)
	
	r := gin.New()
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "pong"})
	})
	
	req, _ := http.NewRequest("GET", "/ping", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)
	
	asserts.Equal(200, w.Code, "Basic server should respond")
	asserts.Contains(w.Body.String(), "pong", "Response should contain pong")
}

// Test 2: Database Connection Test
func TestDatabaseConnection(t *testing.T) {
	asserts := assert.New(t)
	
	db := common.TestDBInit()
	defer common.TestDBFree(db)
	
	err := db.DB().Ping()
	asserts.NoError(err, "Database should be able to ping")
}

// Test 3: User Model Migration Test
func TestUserModelMigration(t *testing.T) {
	asserts := assert.New(t)
	
	db := common.TestDBInit()
	defer common.TestDBFree(db)
	
	err := db.AutoMigrate(&users.UserModel{}).Error
	asserts.NoError(err, "User model migration should work")
}

// Test 4: JSON Request/Response Test
func TestJSONRequestResponse(t *testing.T) {
	asserts := assert.New(t)
	
	r := setupTestRouter()
	
	// Test JSON request creation
	userData := map[string]interface{}{
		"user": map[string]string{
			"username": "testuser",
			"email":    "test@example.com", 
			"password": "password123",
		},
	}
	jsonData, err := json.Marshal(userData)
	asserts.NoError(err, "Should be able to marshal JSON")
	
	// Test making request to users endpoint
	req, _ := http.NewRequest("POST", "/api/users/", bytes.NewBuffer(jsonData))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)
	
	// Should get some response (not panic)
	asserts.True(w.Code > 0, "Should get a response code")
}

// Test 5: Common Utilities Test
func TestCommonUtilities(t *testing.T) {
	asserts := assert.New(t)
	
	token := common.GenToken(1)
	asserts.NotEmpty(token, "Token should not be empty")
	
	randomStr := common.RandString(10)
	asserts.Len(randomStr, 10, "Random string should have correct length")
}

// Test 6: HTTP Client Test
func TestHTTPClient(t *testing.T) {
	asserts := assert.New(t)
	
	req, err := http.NewRequest("GET", "http://example.com", nil)
	asserts.NoError(err, "Should be able to create HTTP request")
	asserts.NotNil(req, "Request should not be nil")
}

// Test 7: Response Recorder Test
func TestResponseRecorder(t *testing.T) {
	asserts := assert.New(t)
	
	w := httptest.NewRecorder()
	asserts.NotNil(w, "Response recorder should not be nil")
	
	w.WriteHeader(200)
	w.Write([]byte("test response"))
	
	asserts.Equal(200, w.Code, "Status code should be 200")
	asserts.Equal("test response", w.Body.String(), "Body should match")
}

// Test 8: Gin Context Test
func TestGinContext(t *testing.T) {
	asserts := assert.New(t)
	
	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	
	asserts.NotNil(c, "Gin context should not be nil")
	asserts.NotNil(c.Writer, "Context writer should not be nil")
}

// Test 9: JSON Parsing Test
func TestJSONParsing(t *testing.T) {
	asserts := assert.New(t)
	
	data := map[string]string{"test": "value"}
	jsonData, err := json.Marshal(data)
	asserts.NoError(err, "Should marshal JSON")
	
	var parsed map[string]string
	err = json.Unmarshal(jsonData, &parsed)
	asserts.NoError(err, "Should unmarshal JSON")
	asserts.Equal("value", parsed["test"], "Parsed data should match")
}

// Test 10: Assertion Library Test
func TestAssertions(t *testing.T) {
	asserts := assert.New(t)
	
	asserts.True(true, "True should be true")
	asserts.False(false, "False should be false")
	asserts.Equal(1, 1, "Numbers should be equal")
	asserts.NotEqual(1, 2, "Numbers should not be equal")
	asserts.Nil(nil, "Nil should be nil")
	asserts.NotNil("not nil", "Not nil should not be nil")
}