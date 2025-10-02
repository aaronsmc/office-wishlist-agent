# Profile Images Setup Guide

## Current Status
✅ **Images are now properly organized** in `/public/images/profiles/`
✅ **Code has been updated** to use the new paths
✅ **All existing images** have been moved to the correct location

## Missing Images
The following placeholder files need to be replaced with actual photos:

- `arun.jpg` - Arun (CTO)
- `siddarth.jpg` - Siddarth (Engineer) 
- `joshua.jpg` - Joshua (Engineer)
- `sergey.jpg` - Sergey (Engineer)
- `ivan.jpg` - Ivan (Engineer)
- `ian.jpg` - Ian (Growth)

## How to Add Images

### Option 1: Direct File Replacement
1. Navigate to `/public/images/profiles/`
2. Replace the placeholder files with actual `.jpg` images
3. Keep the same filenames (e.g., `arun.jpg`, `siddarth.jpg`, etc.)

### Option 2: Drag and Drop
1. Open the `/public/images/profiles/` folder in Finder
2. Drag your actual photos into the folder
3. Rename them to match the expected filenames

## Image Requirements
- **Format**: JPG or PNG
- **Size**: Recommended 200x200px or larger
- **Aspect Ratio**: Square (1:1) works best for profile photos
- **File Size**: Keep under 1MB for fast loading

## Testing
After adding images:
1. Refresh your browser at http://localhost:5173
2. Check that profile photos appear in the chat interface
3. Verify images load correctly in the dashboard

## Current Working Images
These images are already working:
- Aaron, Amy, Julien, Malini, Joki, Maria, Stephen, Jack, Anand, Kunal

## File Structure
```
public/
├── images/
│   └── profiles/
│       ├── aaron.jpg ✅
│       ├── amy.jpg ✅
│       ├── anand.jpg ✅
│       ├── arun.jpg ⚠️ (placeholder)
│       ├── ian.jpg ⚠️ (placeholder)
│       ├── ivan.jpg ⚠️ (placeholder)
│       ├── jack.jpg ✅
│       ├── joki.jpg ✅
│       ├── joshua.jpg ⚠️ (placeholder)
│       ├── julien.jpg ✅
│       ├── kunal.jpg ✅
│       ├── malini.jpg ✅
│       ├── maria.jpg ✅
│       ├── sergey.jpg ⚠️ (placeholder)
│       ├── siddarth.jpg ⚠️ (placeholder)
│       └── stephen.jpg ✅
└── Line_Stack__Name_Health__Color_black-removebg-preview.png
```
