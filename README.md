# Image Metadata Analyzer

A simple web-based tool to analyze and view metadata from uploaded images.

## Features

- Drag and drop image upload
- Displays basic file metadata (name, size, type)
- Shows image dimensions
- Basic EXIF data extraction (would need enhancement with a proper library)

## How to Use

1. Visit the website
2. Drag and drop an image file or click to browse
3. View the extracted metadata

## Deployment

### GitHub Pages

1. Upload all files to a GitHub repository
2. Go to repository Settings > Pages
3. Select the main branch and click Save
4. Your site will be published at `https://[username].github.io/[repository-name]/`

### Wix.com

1. Log in to your Wix account
2. Create a new site or edit an existing one
3. Go to "Site" > "Site Settings" > "Custom Code"
4. Click "+ Add Custom Code"
5. Paste the contents of index.html into the HTML section
6. Upload style.css and script.js as external files and link them
7. Alternatively, use Wix's "Code" feature to create a custom page with your code

## Technologies Used

- HTML5
- CSS3
- JavaScript

## Future Improvements

- Integrate a proper EXIF library for more comprehensive metadata extraction
- Add support for batch processing
- Include more detailed image analysis