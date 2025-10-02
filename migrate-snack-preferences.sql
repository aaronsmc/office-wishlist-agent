-- Simple migration to change snack_preferences from TEXT[] to TEXT
-- This script handles the column type change without recreating policies

-- Check if the column exists and is of type TEXT[]
DO $$
BEGIN
    -- Check if snack_preferences is currently TEXT[]
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'wishlist_submissions' 
        AND column_name = 'snack_preferences' 
        AND data_type = 'ARRAY'
    ) THEN
        -- Add a temporary column
        ALTER TABLE wishlist_submissions 
        ADD COLUMN snack_preferences_temp TEXT DEFAULT '';
        
        -- Copy data from array to text (convert array to comma-separated string)
        UPDATE wishlist_submissions 
        SET snack_preferences_temp = array_to_string(snack_preferences, ', ')
        WHERE snack_preferences IS NOT NULL AND array_length(snack_preferences, 1) > 0;
        
        -- Drop the old array column
        ALTER TABLE wishlist_submissions 
        DROP COLUMN snack_preferences;
        
        -- Rename the temp column to the original name
        ALTER TABLE wishlist_submissions 
        RENAME COLUMN snack_preferences_temp TO snack_preferences;
        
        -- Set NOT NULL constraint
        ALTER TABLE wishlist_submissions 
        ALTER COLUMN snack_preferences SET NOT NULL;
        
        -- Set default value
        ALTER TABLE wishlist_submissions 
        ALTER COLUMN snack_preferences SET DEFAULT '';
        
        RAISE NOTICE 'Successfully migrated snack_preferences from TEXT[] to TEXT';
    ELSE
        RAISE NOTICE 'snack_preferences column is already TEXT type or does not exist';
    END IF;
END $$;
