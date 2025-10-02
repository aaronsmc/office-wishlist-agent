-- Create the wishlist_submissions table
CREATE TABLE IF NOT EXISTS wishlist_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_name TEXT NOT NULL,
  must_have_items TEXT NOT NULL,
  nice_to_have_items TEXT NOT NULL,
  preposterous_wishes TEXT NOT NULL,
  snack_preferences TEXT NOT NULL DEFAULT '',
  additional_comments TEXT NOT NULL DEFAULT ''
);

-- Create an index on created_at for better query performance
CREATE INDEX IF NOT EXISTS idx_wishlist_submissions_created_at ON wishlist_submissions(created_at);

-- Create an index on user_name for filtering by user
CREATE INDEX IF NOT EXISTS idx_wishlist_submissions_user_name ON wishlist_submissions(user_name);

-- Enable Row Level Security (RLS)
ALTER TABLE wishlist_submissions ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anyone to insert (for submissions)
CREATE POLICY "Allow public insert on wishlist_submissions" ON wishlist_submissions
  FOR INSERT WITH CHECK (true);

-- Create a policy that allows anyone to read (for viewing submissions)
CREATE POLICY "Allow public read on wishlist_submissions" ON wishlist_submissions
  FOR SELECT USING (true);

-- Create a policy that allows anyone to update (for editing submissions)
CREATE POLICY "Allow public update on wishlist_submissions" ON wishlist_submissions
  FOR UPDATE USING (true);

-- Create a policy that allows anyone to delete (for removing submissions)
CREATE POLICY "Allow public delete on wishlist_submissions" ON wishlist_submissions
  FOR DELETE USING (true);
