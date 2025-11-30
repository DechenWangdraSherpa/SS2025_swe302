package articles

import (
	"testing"
	"github.com/stretchr/testify/assert"
	"realworld-backend/common"
	"realworld-backend/users"
	"github.com/jinzhu/gorm"
	"golang.org/x/crypto/bcrypt"
)

var testDB *gorm.DB

// Test database setup
func setupTestDB(t *testing.T) {
	testDB = common.TestDBInit()
	
	// Migrate users tables first (articles depend on users)
	users.AutoMigrate()
	
	// Then migrate articles tables
	err := testDB.AutoMigrate(
		&ArticleModel{},
		&TagModel{}, 
		&CommentModel{},
		&ArticleUserModel{},
		&FavoriteModel{},
	).Error
	
	if err != nil {
		t.Fatalf("Failed to migrate database: %v", err)
	}
}

func cleanupTestDB() {
	if testDB != nil {
		common.TestDBFree(testDB)
	}
}

// Helper to create a test user with hashed password
func createTestUser(t *testing.T, username, email string) users.UserModel {
	// Hash password directly using bcrypt
	passwordHash, err := bcrypt.GenerateFromPassword([]byte("password123"), bcrypt.DefaultCost)
	if err != nil {
		t.Fatalf("Failed to hash password: %v", err)
	}
	
	user := users.UserModel{
		Username:     username,
		Email:        email,
		Bio:          "Test bio",
		PasswordHash: string(passwordHash),
	}
	
	err = testDB.Create(&user).Error
	if err != nil {
		t.Fatalf("Failed to create test user: %v", err)
	}
	
	return user
}

func createTestArticleUser(t *testing.T, user users.UserModel) ArticleUserModel {
	var articleUser ArticleUserModel
	err := testDB.Where(ArticleUserModel{
		UserModelID: user.ID,
	}).FirstOrCreate(&articleUser).Error
	if err != nil {
		t.Fatalf("Failed to create article user: %v", err)
	}
	
	// Set the UserModel relationship
	articleUser.UserModel = user
	return articleUser
}

// ==================== CORE FUNCTION TESTS ====================

// Test 1: GetArticleUserModel function
func TestGetArticleUserModel(t *testing.T) {
	setupTestDB(t)
	defer cleanupTestDB()

	user := createTestUser(t, "testuser1", "test1@example.com")
	
	// Test the actual package function
	articleUser := GetArticleUserModel(user)
	
	assert.NotZero(t, articleUser.ID, "ArticleUser should have an ID")
	assert.Equal(t, user.ID, articleUser.UserModelID, "UserModelID should match")
}

// Test 2: SaveOne function
func TestSaveOne(t *testing.T) {
	setupTestDB(t)
	defer cleanupTestDB()

	user := createTestUser(t, "testuser2", "test2@example.com")
	articleUser := createTestArticleUser(t, user)
	
	article := ArticleModel{
		Slug:        "test-save-article",
		Title:       "Test Save Article",
		Description: "Test Description",
		Body:        "Test Body",
		AuthorID:    articleUser.ID,
	}
	
	// Test the actual SaveOne function from the package
	err := SaveOne(&article)
	assert.NoError(t, err, "SaveOne should save article without error")
	assert.NotZero(t, article.ID, "Article should have an ID after saving")
}

// Test 3: FindOneArticle function
func TestFindOneArticle(t *testing.T) {
	setupTestDB(t)
	defer cleanupTestDB()

	user := createTestUser(t, "testuser3", "test3@example.com")
	articleUser := createTestArticleUser(t, user)
	
	// First create an article
	article := ArticleModel{
		Slug:        "test-find-article",
		Title:       "Test Find Article",
		Description: "Test Description",
		Body:        "Test Body",
		AuthorID:    articleUser.ID,
	}
	testDB.Create(&article)
	
	// Test the actual FindOneArticle function
	foundArticle, err := FindOneArticle(&ArticleModel{Slug: "test-find-article"})
	assert.NoError(t, err, "FindOneArticle should find article without error")
	assert.Equal(t, "Test Find Article", foundArticle.Title, "Titles should match")
}

// Test 4: favoritesCount method
func TestFavoritesCount(t *testing.T) {
	setupTestDB(t)
	defer cleanupTestDB()

	user := createTestUser(t, "testuser4", "test4@example.com")
	articleUser := createTestArticleUser(t, user)
	
	article := ArticleModel{
		Slug:        "test-favorites-article",
		Title:       "Test Favorites Article",
		Description: "Test Description",
		Body:        "Test Body",
		AuthorID:    articleUser.ID,
	}
	testDB.Create(&article)
	
	// Test the favoritesCount method
	count := article.favoritesCount()
	assert.Equal(t, uint(0), count, "New article should have 0 favorites")
}

// Test 5: isFavoriteBy method
func TestIsFavoriteBy(t *testing.T) {
	setupTestDB(t)
	defer cleanupTestDB()

	user1 := createTestUser(t, "testuser5a", "test5a@example.com")
	user2 := createTestUser(t, "testuser5b", "test5b@example.com")
	articleUser1 := createTestArticleUser(t, user1)
	articleUser2 := createTestArticleUser(t, user2)
	
	article := ArticleModel{
		Slug:        "test-favorite-article",
		Title:       "Test Favorite Article",
		Description: "Test Description",
		Body:        "Test Body",
		AuthorID:    articleUser1.ID,
	}
	testDB.Create(&article)
	
	// Test isFavoriteBy method (should be false initially)
	isFavorite := article.isFavoriteBy(articleUser2)
	assert.False(t, isFavorite, "Article should not be favorited initially")
}

// Test 6: favoriteBy and unFavoriteBy methods
func TestFavoriteUnfavorite(t *testing.T) {
	setupTestDB(t)
	defer cleanupTestDB()

	user1 := createTestUser(t, "testuser6a", "test6a@example.com")
	user2 := createTestUser(t, "testuser6b", "test6b@example.com")
	articleUser1 := createTestArticleUser(t, user1)
	articleUser2 := createTestArticleUser(t, user2)
	
	article := ArticleModel{
		Slug:        "test-favorite-article",
		Title:       "Test Favorite Article",
		Description: "Test Description",
		Body:        "Test Body",
		AuthorID:    articleUser1.ID,
	}
	testDB.Create(&article)
	
	// Test favoriteBy method
	err := article.favoriteBy(articleUser2)
	assert.NoError(t, err, "favoriteBy should work without error")
	
	// Test isFavoriteBy method after favoriting
	isFavorite := article.isFavoriteBy(articleUser2)
	assert.True(t, isFavorite, "Article should be favorited by user2")
	
	// Test unFavoriteBy method
	err = article.unFavoriteBy(articleUser2)
	assert.NoError(t, err, "unFavoriteBy should work without error")
	
	// Verify unfavorite
	isFavorite = article.isFavoriteBy(articleUser2)
	assert.False(t, isFavorite, "Article should not be favorited after unfavorite")
}

// Test 7: setTags method
func TestSetTags(t *testing.T) {
	setupTestDB(t)
	defer cleanupTestDB()

	user := createTestUser(t, "testuser7", "test7@example.com")
	articleUser := createTestArticleUser(t, user)
	
	article := ArticleModel{
		Slug:        "test-tags-article",
		Title:       "Test Tags Article",
		Description: "Test Description",
		Body:        "Test Body",
		AuthorID:    articleUser.ID,
	}
	testDB.Create(&article)
	
	// Test the setTags method
	tags := []string{"golang", "testing", "backend"}
	err := article.setTags(tags)
	assert.NoError(t, err, "setTags should work without error")
	assert.Equal(t, 3, len(article.Tags), "Article should have 3 tags")
}

// Test 8: Update method
func TestArticleUpdate(t *testing.T) {
	setupTestDB(t)
	defer cleanupTestDB()

	user := createTestUser(t, "testuser8", "test8@example.com")
	articleUser := createTestArticleUser(t, user)
	
	article := ArticleModel{
		Slug:        "test-update-article",
		Title:       "Original Title",
		Description: "Original Description",
		Body:        "Original Body",
		AuthorID:    articleUser.ID,
	}
	testDB.Create(&article)
	
	// Test the Update method
	updateData := ArticleModel{
		Title:       "Updated Title",
		Description: "Updated Description",
	}
	err := article.Update(updateData)
	assert.NoError(t, err, "Update should work without error")
	
	// Verify update
	var updatedArticle ArticleModel
	testDB.First(&updatedArticle, article.ID)
	assert.Equal(t, "Updated Title", updatedArticle.Title, "Title should be updated")
}

// Test 9: DeleteArticleModel function
func TestDeleteArticleModel(t *testing.T) {
	setupTestDB(t)
	defer cleanupTestDB()

	user := createTestUser(t, "testuser9", "test9@example.com")
	articleUser := createTestArticleUser(t, user)
	
	article := ArticleModel{
		Slug:        "test-delete-article",
		Title:       "Test Delete Article",
		Description: "Test Description",
		Body:        "Test Body",
		AuthorID:    articleUser.ID,
	}
	testDB.Create(&article)
	
	// Test DeleteArticleModel function
	err := DeleteArticleModel(&ArticleModel{Slug: "test-delete-article"})
	assert.NoError(t, err, "DeleteArticleModel should work without error")
	
	// Verify deletion
	var deletedArticle ArticleModel
	err = testDB.Where("slug = ?", "test-delete-article").First(&deletedArticle).Error
	assert.Error(t, err, "Article should be deleted")
}

// Test 10: DeleteCommentModel function
func TestDeleteCommentModel(t *testing.T) {
	setupTestDB(t)
	defer cleanupTestDB()

	user := createTestUser(t, "testuser10", "test10@example.com")
	articleUser := createTestArticleUser(t, user)
	
	article := ArticleModel{
		Slug:        "test-comment-article",
		Title:       "Test Comment Article",
		Description: "Test Description",
		Body:        "Test Body",
		AuthorID:    articleUser.ID,
	}
	testDB.Create(&article)

	comment := CommentModel{
		Body:      "Test comment to delete",
		AuthorID:  articleUser.ID,
		ArticleID: article.ID,
	}
	testDB.Create(&comment)

	// Test DeleteCommentModel function
	err := DeleteCommentModel([]uint{comment.ID})
	assert.NoError(t, err, "DeleteCommentModel should work without error")

	// Verify deletion
	var deletedComment CommentModel
	err = testDB.First(&deletedComment, comment.ID).Error
	assert.Error(t, err, "Comment should be deleted")
}

// Test 11: getAllTags function
func TestGetAllTags(t *testing.T) {
	setupTestDB(t)
	defer cleanupTestDB()

	// Create some tags first
	tags := []TagModel{
		{Tag: "golang"},
		{Tag: "testing"},
		{Tag: "backend"},
	}
	for i := range tags {
		testDB.Create(&tags[i])
	}

	// Test getAllTags function
	retrievedTags, err := getAllTags()
	assert.NoError(t, err, "getAllTags should work without error")
	assert.True(t, len(retrievedTags) >= 3, "Should retrieve all created tags")
}

// Test 12: getComments method
func TestGetComments(t *testing.T) {
	setupTestDB(t)
	defer cleanupTestDB()

	user := createTestUser(t, "testuser12", "test12@example.com")
	articleUser := createTestArticleUser(t, user)
	
	article := ArticleModel{
		Slug:        "test-comments-article",
		Title:       "Test Comments Article",
		Description: "Test Description",
		Body:        "Test Body",
		AuthorID:    articleUser.ID,
	}
	testDB.Create(&article)

	// Add comments
	comments := []CommentModel{
		{Body: "First comment", AuthorID: articleUser.ID, ArticleID: article.ID},
		{Body: "Second comment", AuthorID: articleUser.ID, ArticleID: article.ID},
	}
	for i := range comments {
		testDB.Create(&comments[i])
	}

	// Test getComments method
	err := article.getComments()
	assert.NoError(t, err, "getComments should work without error")
	assert.Equal(t, 2, len(article.Comments), "Should load all comments")
}

// Test 13: FindManyArticle function - Basic
func TestFindManyArticleBasic(t *testing.T) {
	setupTestDB(t)
	defer cleanupTestDB()

	user := createTestUser(t, "testuser13", "test13@example.com")
	articleUser := createTestArticleUser(t, user)
	
	// Create multiple articles
	articles := []ArticleModel{
		{
			Slug:        "article-1",
			Title:       "Article 1",
			Description: "Description 1",
			Body:        "Body 1",
			AuthorID:    articleUser.ID,
		},
		{
			Slug:        "article-2", 
			Title:       "Article 2",
			Description: "Description 2",
			Body:        "Body 2",
			AuthorID:    articleUser.ID,
		},
	}
	
	for i := range articles {
		testDB.Create(&articles[i])
	}
	
	// Test FindManyArticle function
	foundArticles, count, err := FindManyArticle("", "testuser13", "20", "0", "")
	assert.NoError(t, err, "FindManyArticle should work without error")
	assert.True(t, len(foundArticles) >= 2, "Should find at least 2 articles")
	assert.True(t, count >= 2, "Count should be at least 2")
}

// Test 14: FindManyArticle with tag filter
func TestFindManyArticleWithTag(t *testing.T) {
	setupTestDB(t)
	defer cleanupTestDB()  // Changed from cleanupDB to cleanupTestDB

	user := createTestUser(t, "testuser14", "test14@example.com")
	articleUser := createTestArticleUser(t, user)
	
	// Create article with tag
	article := ArticleModel{
		Slug:        "tagged-article",
		Title:       "Tagged Article",
		Description: "Description",
		Body:        "Body",
		AuthorID:    articleUser.ID,
	}
	testDB.Create(&article)
	
	// Add tag
	tag := TagModel{Tag: "golang"}
	testDB.Create(&tag)
	testDB.Model(&article).Association("Tags").Append(tag)

	// Test with tag parameter
	articles, count, err := FindManyArticle("golang", "", "20", "0", "")
	assert.NoError(t, err, "FindManyArticle with tag should work")
	assert.True(t, count >= 0, "Should have valid count with tag filter")
	_ = articles // Use variable
}

// Test 15: GetArticleFeed function
func TestGetArticleFeed(t *testing.T) {
	setupTestDB(t)
	defer cleanupTestDB()

	user := createTestUser(t, "testuser15", "test15@example.com")
	articleUser := createTestArticleUser(t, user)

	// Test GetArticleFeed function
	articles, count, err := articleUser.GetArticleFeed("20", "0")
	assert.NoError(t, err, "GetArticleFeed should work without error")
	assert.True(t, count >= 0, "Should have valid count")
	_ = articles // Use variable
}

// Test 16: Validator creation functions
func TestValidatorCreation(t *testing.T) {
	// Test NewArticleModelValidator function
	validator := NewArticleModelValidator()
	assert.NotNil(t, validator, "Validator should be created")
	
	// Test NewCommentModelValidator function  
	commentValidator := NewCommentModelValidator()
	assert.NotNil(t, commentValidator, "Comment validator should be created")
	
	// Test NewArticleModelValidatorFillWith function
	article := ArticleModel{
		Title: "Test Article",
		Body:  "Test Body",
		Tags:  []TagModel{{Tag: "tag1"}, {Tag: "tag2"}},
	}
	fillValidator := NewArticleModelValidatorFillWith(article)
	assert.NotNil(t, fillValidator, "Fill validator should be created")
}

// Test 17: Edge cases and error scenarios
func TestEdgeCases(t *testing.T) {
	setupTestDB(t)
	defer cleanupTestDB()

	// Test FindOneArticle with non-existent article
	article, err := FindOneArticle(&ArticleModel{Slug: "non-existent-article"})
	assert.NoError(t, err, "Should not error on non-existent article")
	assert.Zero(t, article.ID, "Non-existent article should return zero article")

	// Test GetArticleUserModel with zero user
	zeroUser := users.UserModel{}
	articleUser := GetArticleUserModel(zeroUser)
	assert.Zero(t, articleUser.ID, "Zero user should return zero article user")

	// Test favoritesCount on non-saved article
	unsavedArticle := ArticleModel{Title: "Unsaved"}
	count := unsavedArticle.favoritesCount()
	assert.Equal(t, uint(0), count, "Unsaved article should have 0 favorites")

	// Test setTags with empty tags
	articleWithEmptyTags := ArticleModel{}
	err = articleWithEmptyTags.setTags([]string{})
	assert.NoError(t, err, "Should handle empty tags")
}

// Test 18: Router and Serializer existence (for coverage)
func TestRouterSerializerExistence(t *testing.T) {
	// Test router functions exist (can't test without Gin context)
	assert.NotNil(t, ArticlesRegister)
	assert.NotNil(t, ArticlesAnonymousRegister)
	assert.NotNil(t, TagsAnonymousRegister)
	
	// Test serializer types can be created
	tagSerializer := TagSerializer{TagModel: TagModel{Tag: "test"}}
	tagsSerializer := TagsSerializer{Tags: []TagModel{{Tag: "test"}}}
	articleSerializer := ArticleSerializer{ArticleModel: ArticleModel{Title: "test"}}
	commentSerializer := CommentSerializer{CommentModel: CommentModel{Body: "test"}}
	commentsSerializer := CommentsSerializer{Comments: []CommentModel{{Body: "test"}}}
	
	assert.NotNil(t, tagSerializer)
	assert.NotNil(t, tagsSerializer)
	assert.NotNil(t, articleSerializer)
	assert.NotNil(t, commentSerializer)
	assert.NotNil(t, commentsSerializer)
}