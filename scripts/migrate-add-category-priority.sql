-- Migration script to add category and priority columns to todos table
-- Run this if you already have an existing todos table

-- Add category column
ALTER TABLE todos ADD COLUMN IF NOT EXISTS category TEXT;

-- Add priority column with check constraint
ALTER TABLE todos ADD COLUMN IF NOT EXISTS priority TEXT;

-- Add check constraint for priority values
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'todos_priority_check'
  ) THEN
    ALTER TABLE todos ADD CONSTRAINT todos_priority_check 
    CHECK (priority IN ('low', 'medium', 'high') OR priority IS NULL);
  END IF;
END $$;

-- Create index for category for better query performance
CREATE INDEX IF NOT EXISTS idx_todos_category ON todos(category);

-- Create index for priority for better query performance
CREATE INDEX IF NOT EXISTS idx_todos_priority ON todos(priority);

