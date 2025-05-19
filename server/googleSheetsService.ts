import { google } from 'googleapis';
import axios from 'axios';

// Google Sheets configuration
const SHEET_ID = '1SKMOTXoWMNGp2YmSGAF4Ph1bBq4vCgLa9B92yuWm4Ps';
const SHEET_NAME = 'ชีต1';
const SHEET_RANGE = 'A2:N100'; // Adjust range as needed - skip header row

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