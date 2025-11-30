package main

import (
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/gin-contrib/cors"

	"github.com/jinzhu/gorm"
	"realworld-backend/articles"
	"realworld-backend/common"
	"realworld-backend/users"
)

func Migrate(db *gorm.DB) {
	users.AutoMigrate()
	db.AutoMigrate(&articles.ArticleModel{})
	db.AutoMigrate(&articles.TagModel{})
	db.AutoMigrate(&articles.FavoriteModel{})
	db.AutoMigrate(&articles.ArticleUserModel{})
	db.AutoMigrate(&articles.CommentModel{})
}

// Create performance indexes based on actual database schema
func CreatePerformanceIndexes(db *gorm.DB) {
	fmt.Println("Creating performance indexes...")
	
	// Article performance indexes
	db.Exec("CREATE INDEX IF NOT EXISTS idx_articles_created_at ON article_models(created_at)")
	db.Exec("CREATE INDEX IF NOT EXISTS idx_articles_author_id ON article_models(author_id)")
	db.Exec("CREATE INDEX IF NOT EXISTS idx_articles_slug ON article_models(slug)")
	db.Exec("CREATE INDEX IF NOT EXISTS idx_articles_deleted_at ON article_models(deleted_at)")
	
	// User performance indexes
	db.Exec("CREATE INDEX IF NOT EXISTS idx_users_email ON user_models(email)")
	db.Exec("CREATE INDEX IF NOT EXISTS idx_users_username ON user_models(username)")
	
	// Comments performance indexes (actual columns: article_id, author_id)
	db.Exec("CREATE INDEX IF NOT EXISTS idx_comments_article_id ON comment_models(article_id)")
	db.Exec("CREATE INDEX IF NOT EXISTS idx_comments_author_id ON comment_models(author_id)")
	db.Exec("CREATE INDEX IF NOT EXISTS idx_comments_deleted_at ON comment_models(deleted_at)")
	
	// Favorites performance indexes (actual columns: favorite_id, favorite_by_id)
	db.Exec("CREATE INDEX IF NOT EXISTS idx_favorites_favorite_id ON favorite_models(favorite_id)")
	db.Exec("CREATE INDEX IF NOT EXISTS idx_favorites_favorite_by_id ON favorite_models(favorite_by_id)")
	db.Exec("CREATE INDEX IF NOT EXISTS idx_favorites_deleted_at ON favorite_models(deleted_at)")
	
	// Follow performance indexes (actual columns: following_id, followed_by_id)
	db.Exec("CREATE INDEX IF NOT EXISTS idx_follows_following_id ON follow_models(following_id)")
	db.Exec("CREATE INDEX IF NOT EXISTS idx_follows_followed_by_id ON follow_models(followed_by_id)")
	db.Exec("CREATE INDEX IF NOT EXISTS idx_follows_deleted_at ON follow_models(deleted_at)")
	
	// ArticleUser performance indexes
	db.Exec("CREATE INDEX IF NOT EXISTS idx_article_users_user_id ON article_user_models(user_model_id)")
	db.Exec("CREATE INDEX IF NOT EXISTS idx_article_users_deleted_at ON article_user_models(deleted_at)")
	
	// Tag indexes
	db.Exec("CREATE INDEX IF NOT EXISTS idx_tags_tag ON tag_models(tag)")
	db.Exec("CREATE INDEX IF NOT EXISTS idx_tags_deleted_at ON tag_models(deleted_at)")
	
	// Article-Tag junction table indexes
	db.Exec("CREATE INDEX IF NOT EXISTS idx_article_tags_article_id ON article_tags(article_model_id)")
	db.Exec("CREATE INDEX IF NOT EXISTS idx_article_tags_tag_id ON article_tags(tag_model_id)")
	
	fmt.Println("✅ Performance indexes created successfully!")
	fmt.Println("📊 Indexes improve query performance for:")
	fmt.Println("   - Article listing and filtering")
	fmt.Println("   - User lookups and authentication")
	fmt.Println("   - Comments on articles")
	fmt.Println("   - Favorite/Unfavorite operations")
	fmt.Println("   - User follow/unfollow")
	fmt.Println("   - Tag filtering")
	fmt.Println("   - Soft delete queries (deleted_at)")
}

func main() {

	db := common.Init()
	
	// Run migrations first
	Migrate(db)
	
	// Create performance indexes after migration
	CreatePerformanceIndexes(db)
	
	defer db.Close()

	r := gin.Default()

	// Configure CORS
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:4100"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

	v1 := r.Group("/api")
	users.UsersRegister(v1.Group("/users"))
	v1.Use(users.AuthMiddleware(false))
	articles.ArticlesAnonymousRegister(v1.Group("/articles"))
	articles.TagsAnonymousRegister(v1.Group("/tags"))

	v1.Use(users.AuthMiddleware(true))
	users.UserRegister(v1.Group("/user"))
	users.ProfileRegister(v1.Group("/profiles"))

	articles.ArticlesRegister(v1.Group("/articles"))

	testAuth := r.Group("/api/ping")

	testAuth.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})

	// test 1 to 1
	tx1 := db.Begin()
	userA := users.UserModel{
		Username: "AAAAAAAAAAAAAAAA",
		Email:    "aaaa@g.cn",
		Bio:      "hehddeda",
		Image:    nil,
	}
	tx1.Save(&userA)
	tx1.Commit()
	fmt.Println(userA)

	r.Run() // listen and serve on 0.0.0.0:8080
}