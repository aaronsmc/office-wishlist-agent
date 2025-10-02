-- Update snack_preferences column from TEXT[] to TEXT
-- This migration changes the snack_preferences column to be consistent with other fields

-- First, add a new column with the correct type
ALTER TABLE wishlist_submissions 
ADD COLUMN snack_preferences_new TEXT DEFAULT '';

-- Copy data from the old array column to the new text column
-- Convert array to comma-separated string
UPDATE wishlist_submissions 
SET snack_preferences_new = array_to_string(snack_preferences, ', ')
WHERE snack_preferences IS NOT NULL AND array_length(snack_preferences, 1) > 0;

-- Drop the old column
ALTER TABLE wishlist_submissions 
DROP COLUMN snack_preferences;

-- Rename the new column to the original name
ALTER TABLE wishlist_submissions 
RENAME COLUMN snack_preferences_new TO snack_preferences;

-- Set NOT NULL constraint
ALTER TABLE wishlist_submissions 
ALTER COLUMN snack_preferences SET NOT NULL;

-- Set default value
ALTER TABLE wishlist_submissions 
ALTER COLUMN snack_preferences SET DEFAULT '';
