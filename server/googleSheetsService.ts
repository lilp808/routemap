import { google } from 'googleapis';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import * as xlsx from 'xlsx';
import csvParser from 'csv-parser';

// Google Sheets configuration
const SHEET_ID = '1SKMOTXoWMNGp2YmSGAF4Ph1bBq4vCgLa9B92yuWm4Ps';
const SHEET_NAME = 'ชีต1';
const SHEET_RANGE = 'A2:N100'; // Adjust range as needed - skip header row

// Configure multer for file uploads
export const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadDir = path.join(__dirname, '../uploads');
      
      // Create uploads directory if it doesn't exist
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
    }
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    // Accept only Excel and CSV files
    if (
      file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || // xlsx
      file.mimetype === 'application/vnd.ms-excel' || // xls
      file.mimetype === 'text/csv' // csv
    ) {
      cb(null, true);
    } else {
      cb(new Error('Only Excel and CSV files are allowed'));
    }
  }
});

// Simplified function to fetch data directly from Google Sheets using its public API
// This works for public sheets without authentication
export async function fetchPropertiesFromSheet() {
  try {
    // Use the public Google Sheets API endpoint
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}!${SHEET_RANGE}?key=${process.env.VITE_FIREBASE_API_KEY}`;
    
    const response = await axios.get(url);
    const rows = response.data.values;
    
    if (!rows || rows.length === 0) {
      console.log('No data found in the Google Sheet');
      return [];
    }

    // Transform the raw data into property objects
    const properties = rows.map((row: any) => {
      // Parse coordinates
      const coordinates = row[12] ? row[12].split(',').map((coord: string) => parseFloat(coord.trim())) : [0, 0];
      
      return {
        id: row[0],
        propertyId: row[1],
        landlordName: row[2] || '',
        landlordContact: row[3] || '',
        buildingSize: parseFloat(row[4]) || 0,
        type: row[5] === 'warehouse' ? 'warehouse' : row[5] === 'factory' ? 'factory' : 'both',
        rentOrSale: row[6] === 'rent' ? 'rent' : 'sale',
        price: row[7] || '',
        subDistrict: row[8] || '',
        district: row[9] || '',
        province: row[10] || '',
        mapUrl: row[11] || '',
        coordinates: { 
          lat: coordinates[0] || 0, 
          lng: coordinates[1] || 0 
        },
        websiteLink: row[13] || ''
      };
    });

    return properties;
  } catch (error) {
    console.error('Error fetching property data from Google Sheets:', error);
    throw error;
  }
}

// Alternate implementation using the Google Sheets API with service account
// This requires credentials for authentication
export async function fetchPropertiesWithServiceAccount() {
  try {
    const auth = new google.auth.GoogleAuth({
      // This would require service account credentials
      // scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: `${SHEET_NAME}!${SHEET_RANGE}`,
    });

    const rows = response.data.values;
    
    if (!rows || rows.length === 0) {
      console.log('No data found in the Google Sheet');
      return [];
    }

    // Transform the raw data into property objects
    const properties = rows.map((row) => {
      // Parse coordinates
      const coordinates = row[12] ? row[12].split(',').map((coord: string) => parseFloat(coord.trim())) : [0, 0];
      
      return {
        id: row[0],
        propertyId: row[1],
        landlordName: row[2] || '',
        landlordContact: row[3] || '',
        buildingSize: parseFloat(row[4]) || 0,
        type: row[5] === 'warehouse' ? 'warehouse' : row[5] === 'factory' ? 'factory' : 'both',
        rentOrSale: row[6] === 'rent' ? 'rent' : 'sale',
        price: row[7] || '',
        subDistrict: row[8] || '',
        district: row[9] || '',
        province: row[10] || '',
        mapUrl: row[11] || '',
        coordinates: { 
          lat: coordinates[0] || 0, 
          lng: coordinates[1] || 0 
        },
        websiteLink: row[13] || ''
      };
    });

    return properties;
  } catch (error) {
    console.error('Error fetching property data from Google Sheets:', error);
    throw error;
  }
}

// Function to add a new property to the Google Sheet
export async function addPropertyToSheet(property: any) {
  try {
    // Get the current count of properties to generate a new ID
    const properties = await fetchPropertiesFromSheet();
    const newId = `P${properties.length + 1}`;
    
    // Format coordinates string
    const coordinatesStr = `${property.coordinates.split(',')[0]?.trim() || '0'},${property.coordinates.split(',')[1]?.trim() || '0'}`;
    
    // Prepare the row to append
    const newRow = [
      newId, // Auto-generated ID
      property.propertyId,
      property.landlordName,
      property.landlordContact,
      property.buildingSize,
      property.type,
      property.rentOrSale,
      property.price,
      property.subDistrict,
      property.district,
      property.province,
      property.mapUrl,
      coordinatesStr,
      property.websiteLink
    ];
    
    // Set up the API request to append the data
    // For this to work, the sheet needs to be publicly writable or you need proper authentication
    // This would typically use a service account or OAuth2 in a production setting
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}!A:N:append?valueInputOption=USER_ENTERED&key=${process.env.VITE_FIREBASE_API_KEY}`;
    
    await axios.post(url, {
      values: [newRow]
    });
    
    return { success: true, id: newId };
  } catch (error) {
    console.error('Error adding property to Google Sheet:', error);
    throw error;
  }
}

// Process uploaded Excel file and add data to Google Sheet
export async function processExcelFile(filePath: string) {
  try {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(worksheet);
    
    for (const row of jsonData) {
      await addPropertyToSheet(formatPropertyData(row));
    }
    
    // Clean up the file after processing
    fs.unlinkSync(filePath);
    
    return { success: true, count: jsonData.length };
  } catch (error) {
    console.error('Error processing Excel file:', error);
    throw error;
  }
}

// Process uploaded CSV file and add data to Google Sheet
export async function processCsvFile(filePath: string) {
  return new Promise<{ success: boolean, count: number }>((resolve, reject) => {
    const results: any[] = [];
    
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        try {
          for (const row of results) {
            await addPropertyToSheet(formatPropertyData(row));
          }
          
          // Clean up the file after processing
          fs.unlinkSync(filePath);
          
          resolve({ success: true, count: results.length });
        } catch (error) {
          reject(error);
        }
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

// Helper function to format property data from various sources
function formatPropertyData(data: any) {
  // This function helps normalize property data from different sources (form, Excel, CSV)
  // Convert keys to expected format, handle different column names, etc.
  
  const formatted: any = {};
  
  // Map common field variations
  formatted.propertyId = data.propertyId || data.property_id || data['Property ID'] || '';
  formatted.landlordName = data.landlordName || data.landlord_name || data['Landlord Name'] || '';
  formatted.landlordContact = data.landlordContact || data.landlord_contact || data['Contact'] || '';
  formatted.buildingSize = data.buildingSize || data.building_size || data['Building Size'] || '0';
  formatted.type = data.type || data['Type'] || 'warehouse';
  formatted.rentOrSale = data.rentOrSale || data.rent_or_sale || data['Rent/Sale'] || 'rent';
  formatted.price = data.price || data['Price'] || '';
  formatted.subDistrict = data.subDistrict || data.sub_district || data['Sub District'] || '';
  formatted.district = data.district || data['District'] || '';
  formatted.province = data.province || data['Province'] || '';
  formatted.mapUrl = data.mapUrl || data.map_url || data['Map URL'] || '';
  formatted.coordinates = data.coordinates || data.coords || data['Coordinates'] || '0,0';
  formatted.websiteLink = data.websiteLink || data.website_link || data['Website Link'] || '';
  
  return formatted;
}