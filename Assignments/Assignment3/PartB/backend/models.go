// Add this function to create performance indexes
func CreatePerformanceIndexes() {
    db := common.GetDB()
    
    fmt.Println("Creating performance indexes...")
    
    // Article performance indexes
    db.Exec("CREATE INDEX IF NOT EXISTS idx_articles_created_at ON articles(created_at)")
    db.Exec("CREATE INDEX IF NOT EXISTS idx_articles_author_id ON articles(author_id)")
    db.Exec("CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug)")
    
    // User performance indexes  
    db.Exec("CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)")
    db.Exec("CREATE INDEX IF NOT EXISTS idx_users_username ON users(username)")
    
    // Comments performance indexes
    db.Exec("CREATE INDEX IF NOT EXISTS idx_comments_article_id ON comments(article_id)")
    db.Exec("CREATE INDEX IF NOT EXISTS idx_comments_author_id ON comments(author_id)")
    
    // Favorites performance indexes
    db.Exec("CREATE INDEX IF NOT EXISTS idx_favorites_article_id ON favorites(article_id)")
    db.Exec("CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id)")
    
    // Follows performance indexes
    db.Exec("CREATE INDEX IF NOT EXISTS idx_follows_follower_id ON follows(follower_id)")
    db.Exec("CREATE INDEX IF NOT EXISTS idx_follows_following_id ON follows(following_id)")
    
    fmt.Println("Performance indexes created successfully")
}

// Call this function in your main initialization, after AutoMigrate
func InitializeDatabase() {
    AutoMigrate()
    CreatePerformanceIndexes()
}