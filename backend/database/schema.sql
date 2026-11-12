
-- 1. Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Papers table
CREATE TABLE IF NOT EXISTS papers (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path TEXT,
    total_pages INTEGER,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Paper analyses table
CREATE TABLE IF NOT EXISTS paper_analyses (
    id SERIAL PRIMARY KEY,
    paper_id INTEGER UNIQUE NOT NULL
        REFERENCES papers(id) ON DELETE CASCADE,
    analysis JSONB NOT NULL,
    analyzed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Paper relationships table
CREATE TABLE IF NOT EXISTS paper_relationships (
    id SERIAL PRIMARY KEY,
    source_paper_id INTEGER NOT NULL
        REFERENCES papers(id) ON DELETE CASCADE,
    target_paper_id INTEGER NOT NULL
        REFERENCES papers(id) ON DELETE CASCADE,
    relationship_type VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(source_paper_id, target_paper_id, relationship_type),
    CHECK (source_paper_id <> target_paper_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_papers_user_id
ON papers(user_id);

CREATE INDEX IF NOT EXISTS idx_paper_relationships_source
ON paper_relationships(source_paper_id);

CREATE INDEX IF NOT EXISTS idx_paper_relationships_target
ON paper_relationships(target_paper_id);
