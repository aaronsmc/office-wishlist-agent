-- Migration to replace snack_preferences with dream_snacks
-- This script adds the new dream_snacks field and removes the old snack_preferences field

-- Add the new dream_snacks column
ALTER TABLE wishlist_submissions 
ADD COLUMN dream_snacks TEXT DEFAULT '';

-- Copy any existing data from snack_preferences to dream_snacks (if it exists and is text)
DO $$
BEGIN
    -- Check if snack_preferences column exists and is TEXT type
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'wishlist_submissions' 
        AND column_name = 'snack_preferences' 
        AND data_type = 'text'
    ) THEN
        -- Copy data from snack_preferences to dream_snacks
        UPDATE wishlist_submissions 
        SET dream_snacks = snack_preferences
        WHERE snack_preferences IS NOT NULL AND snack_preferences != '';
        
        -- Drop the old snack_preferences column
        ALTER TABLE wishlist_submissions 
        DROP COLUMN snack_preferences;
        
        RAISE NOTICE 'Successfully migrated from snack_preferences to dream_snacks';
    ELSE
        RAISE NOTICE 'snack_preferences column does not exist or is not TEXT type';
    END IF;
END $$;

-- Set NOT NULL constraint on dream_snacks
ALTER TABLE wishlist_submissions 
ALTER COLUMN dream_snacks SET NOT NULL;

-- Set default value
ALTER TABLE wishlist_submissions 
ALTER COLUMN dream_snacks SET DEFAULT '';
