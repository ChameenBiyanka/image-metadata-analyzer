document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    document.getElementById('year').textContent = new Date().getFullYear();
    
    const dropArea = document.getElementById('dropArea');
    const fileInput = document.getElementById('fileInput');
    const results = document.getElementById('results');
    const imagePreview = document.getElementById('imagePreview');
    const metadataTable = document.getElementById('metadataTable');
    
    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });
    
    // Highlight drop area when item is dragged over it
    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, unhighlight, false);
    });
    
    // Handle dropped files
    dropArea.addEventListener('drop', handleDrop, false);
    
    // Handle click to select files
    dropArea.addEventListener('click', () => fileInput.click());
    
    // Handle file selection
    fileInput.addEventListener('change', function(e) {
        handleFiles(e.target.files);
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    function highlight() {
        dropArea.style.borderColor = '#4a6bff';
        dropArea.style.backgroundColor = 'rgba(74, 107, 255, 0.1)';
    }
    
    function unhighlight() {
        dropArea.style.borderColor = '#ddd';
        dropArea.style.backgroundColor = 'white';
    }
    
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    }
    
    function handleFiles(files) {
        if (files.length > 0) {
            const file = files[0];
            if (file.type.startsWith('image/')) {
                processImage(file);
            } else {
                alert('Please upload an image file (JPEG, PNG, etc.).');
            }
        }
    }
    
    function processImage(file) {
        // Display image preview
        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview" id="previewImage">`;
            
            // Extract and display metadata
            extractMetadata(file, e.target.result);
        };
        reader.readAsDataURL(file);
    }
    
    function extractMetadata(file, imageData) {
        // Basic file metadata
        const basicMetadata = {
            'File Name': file.name,
            'File Size': formatFileSize(file.size),
            'File Type': file.type,
            'Last Modified': new Date(file.lastModified).toLocaleString()
        };
        
        // Display basic metadata immediately
        displayMetadata(basicMetadata);
        
        // Create image element for EXIF extraction
        const img = new Image();
        img.onload = function() {
            // Add image dimensions to metadata
            const additionalMetadata = {
                'Image Width': `${this.naturalWidth}px`,
                'Image Height': `${this.naturalHeight}px`
            };
            
            // Merge with basic metadata
            const allMetadata = {...basicMetadata, ...additionalMetadata};
            
            // Extract EXIF data
            EXIF.getData(img, function() {
                const exifData = extractExifData(this);
                displayMetadata({...allMetadata, ...exifData});
            });
        };
        img.src = imageData;
    }
    
    function extractExifData(image) {
        const exifData = {};
        const tags = [
            'Make', 'Model', 'Orientation', 'DateTime',
            'ExposureTime', 'FNumber', 'ISOSpeedRatings',
            'FocalLength', 'Software', 'Copyright',
            'GPSLatitude', 'GPSLongitude', 'WhiteBalance'
        ];
        
        tags.forEach(tag => {
            const value = EXIF.getTag(image, tag);
            if (value) {
                // Format some values for better display
                switch(tag) {
                    case 'ExposureTime':
                        if (value < 1) {
                            exifData['Exposure Time'] = `1/${Math.round(1/value)} sec`;
                        } else {
                            exifData['Exposure Time'] = `${value} sec`;
                        }
                        break;
                    case 'FNumber':
                        exifData['Aperture'] = `f/${value}`;
                        break;
                    case 'DateTime':
                        exifData['Date Taken'] = value;
                        break;
                    case 'GPSLatitude':
                        exifData['Latitude'] = convertGPSCoordinates(value);
                        break;
                    case 'GPSLongitude':
                        exifData['Longitude'] = convertGPSCoordinates(value);
                        break;
                    default:
                        exifData[tag] = value;
                }
            }
        });
        
        return exifData;
    }
    
    function convertGPSCoordinates(coords) {
        if (!coords) return null;
        return coords[0] + (coords[1]/60) + (coords[2]/3600);
    }
    
    function displayMetadata(metadata) {
        metadataTable.innerHTML = '';
        
        for (const [key, value] of Object.entries(metadata)) {
            const row = document.createElement('div');
            row.innerHTML = `
                <span>${key}</span>
                <span>${value || 'Not available'}</span>
            `;
            metadataTable.appendChild(row);
        }
        
        results.style.display = 'block';
    }
    
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat(bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i];
    }
});