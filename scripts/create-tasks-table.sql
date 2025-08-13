-- Tasks Management System for Supabase
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  notes JSONB DEFAULT '{}', -- Rich text content from Tiptap
  status TEXT CHECK (status IN ('todo', 'in-progress', 'review', 'done')) DEFAULT 'todo',
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
  assignee_id UUID REFERENCES auth.users(id),
  assignee_name TEXT,
  due_date TIMESTAMPTZ,
  tags TEXT[] DEFAULT '{}',
  project_id UUID,
  parent_task_id UUID REFERENCES tasks(id),
  position INTEGER DEFAULT 0,
  estimated_hours INTEGER,
  actual_hours INTEGER,
  completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Task Comments
CREATE TABLE IF NOT EXISTS task_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content JSONB NOT NULL, -- Rich text content from Tiptap
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Task Attachments
CREATE TABLE IF NOT EXISTS task_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  file_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Task Time Tracking
CREATE TABLE IF NOT EXISTS task_time_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  description TEXT,
  hours_spent DECIMAL(5,2) NOT NULL,
  date_logged DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_assignee_id ON tasks(assignee_id);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_task_comments_task_id ON task_comments(task_id);
CREATE INDEX IF NOT EXISTS idx_task_attachments_task_id ON task_attachments(task_id);
CREATE INDEX IF NOT EXISTS idx_task_time_entries_task_id ON task_time_entries(task_id);

-- RLS Policies
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_time_entries ENABLE ROW LEVEL SECURITY;

-- Tasks policies
CREATE POLICY "Users can view their own tasks" ON tasks FOR SELECT USING (user_id = auth.uid() OR assignee_id = auth.uid());
CREATE POLICY "Users can create their own tasks" ON tasks FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update their own tasks" ON tasks FOR UPDATE USING (user_id = auth.uid() OR assignee_id = auth.uid());
CREATE POLICY "Users can delete their own tasks" ON tasks FOR DELETE USING (user_id = auth.uid());

-- Comments policies
CREATE POLICY "Users can view comments on accessible tasks" ON task_comments FOR SELECT USING (
  EXISTS (SELECT 1 FROM tasks WHERE tasks.id = task_comments.task_id AND (tasks.user_id = auth.uid() OR tasks.assignee_id = auth.uid()))
);
CREATE POLICY "Users can create comments on accessible tasks" ON task_comments FOR INSERT WITH CHECK (
  user_id = auth.uid() AND EXISTS (SELECT 1 FROM tasks WHERE tasks.id = task_comments.task_id AND (tasks.user_id = auth.uid() OR tasks.assignee_id = auth.uid()))
);

-- Attachments policies
CREATE POLICY "Users can view attachments on accessible tasks" ON task_attachments FOR SELECT USING (
  EXISTS (SELECT 1 FROM tasks WHERE tasks.id = task_attachments.task_id AND (tasks.user_id = auth.uid() OR tasks.assignee_id = auth.uid()))
);
CREATE POLICY "Users can create attachments on accessible tasks" ON task_attachments FOR INSERT WITH CHECK (
  user_id = auth.uid() AND EXISTS (SELECT 1 FROM tasks WHERE tasks.id = task_attachments.task_id AND (tasks.user_id = auth.uid() OR tasks.assignee_id = auth.uid()))
);

-- Time entries policies
CREATE POLICY "Users can view time entries on accessible tasks" ON task_time_entries FOR SELECT USING (
  EXISTS (SELECT 1 FROM tasks WHERE tasks.id = task_time_entries.task_id AND (tasks.user_id = auth.uid() OR tasks.assignee_id = auth.uid()))
);
CREATE POLICY "Users can create their own time entries" ON task_time_entries FOR INSERT WITH CHECK (user_id = auth.uid());

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_task_comments_updated_at BEFORE UPDATE ON task_comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
