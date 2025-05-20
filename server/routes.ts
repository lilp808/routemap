import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  fetchPropertiesFromSheet, 
  addPropertyToSheet, 
  upload, 
  processExcelFile, 
  processCsvFile 
} from "./googleSheetsService";
import { Property } from "../shared/schema";
import path from "path";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all properties from Google Sheets
  app.get('/api/properties', async (req, res) => {
    try {
      const properties = await fetchPropertiesFromSheet();
      res.json(properties);
    } catch (error) {
      console.error('Error fetching properties:', error);
      res.status(500).json({ error: 'Failed to fetch properties from Google Sheets' });
    }
  });

  // Route planning API endpoint
  app.post('/api/route-planning', async (req, res) => {
    try {
      const { user_latitude, user_longtitude, propertyId_list, user_timeselect } = req.body;
      
      // Validate required fields
      if (!user_latitude || !user_longtitude || !propertyId_list) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      
      // Get properties from Google Sheets to have accurate data
      let allProperties;
      try {
        allProperties = await fetchPropertiesFromSheet();
      } catch (error) {
        console.error('Error fetching properties for route planning:', error);
        allProperties = []; // Continue with empty properties if fetch fails
      }
      
      // For demo purposes, calculate a simple route
      const propertyIds = propertyId_list.split(',');
      
      // Generate response with either real property data or fallback
      const data = propertyIds.map((id: string, index: number) => {
        // Find the property in our fetched data
        const property = allProperties.find((p: any) => p.propertyId === id);
        
        if (property) {
          return {
            goto: property.propertyId,
            contact: `K.${property.landlordName} ${property.landlordContact}`,
            maps: property.mapUrl,
            websiteLink: property.websiteLink,
            step: (index + 1).toString(),
            form: index === 0 ? "START" : propertyIds[index - 1],
            distance: index === 0 ? "0 km" : `${Math.round(Math.random() * 20 + 5)} km`,
            duration_text: index === 0 ? "0 mins" : `${Math.round(Math.random() * 30 + 10)} mins`,
            distance_value: "0",
            duration_value: "0"
          };
        } else {
          // Fallback if property not found
          return {
            goto: id,
            contact: `Contact information unavailable`,
            maps: `https://maps.google.com/`,
            websiteLink: `https://www.thaiindustrialproperty.com/`,
            step: (index + 1).toString(),
            form: index === 0 ? "START" : propertyIds[index - 1],
            distance: `${Math.floor(Math.random() * 30 + 5)} km`,
            duration_text: `${Math.floor(Math.random() * 40 + 10)} mins`,
            distance_value: Math.floor(Math.random() * 30000 + 5000).toString(),
            duration_value: Math.floor(Math.random() * 2400 + 600).toString()
          };
        }
      });
      
      // Calculate waypoints from actual property data when available
      const waypoints = propertyIds.map((id: string) => {
        const property = allProperties.find((p: any) => p.propertyId === id);
        if (property && property.coordinates && property.coordinates.lat && property.coordinates.lng) {
          return `${property.coordinates.lat},${property.coordinates.lng}`;
        }
        // Fallback if coordinates not available
        return `${user_latitude + (Math.random() * 0.1)},${user_longtitude + (Math.random() * 0.1)}`;
      });
      
      // Construct the Google Maps URL with waypoints
      const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${user_latitude},${user_longtitude}&destination=${user_latitude},${user_longtitude}&waypoints=${waypoints.join('|')}`;
      
      const response = {
        data,
        origin: `${user_latitude},${user_longtitude}`,
        destination: `${user_latitude},${user_longtitude}`,
        waypoints,
        mapsUrl
      };
      
      res.json(response);
    } catch (error) {
      console.error('Error in route planning:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Webhook test endpoint to match the client request
  app.post('/webhook-test/googlemap-route-calculator', async (req, res) => {
    try {
      const { user_latitude, user_longtitude, propertyid_list } = req.body;
      
      // Validate required fields
      if (!user_latitude || !user_longtitude || !propertyid_list) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      
      // Get properties from Google Sheets
      let allProperties;
      try {
        allProperties = await fetchPropertiesFromSheet();
      } catch (error) {
        console.error('Error fetching properties for webhook:', error);
        allProperties = []; // Continue with empty properties if fetch fails
      }
      
      // Process property IDs
      const propertyIds = propertyid_list.split(',');
      
      // Generate response with property data
      const data = propertyIds.map((id: string, index: number) => {
        // Find the property in our fetched data
        const property = allProperties.find((p: any) => p.propertyId === id);
        
        if (property) {
          return {
            goto: property.propertyId,
            contact: `K.${property.landlordName} ${property.landlordContact}`,
            maps: property.mapUrl,
            "website link": property.websiteLink,
            step: (index + 1).toString(),
            form: index === 0 ? "START" : propertyIds[index - 1],
            distance: index === 0 ? "0 km" : `${Math.round(Math.random() * 20 + 5)} km`,
            duration_text: index === 0 ? "0 mins" : `${Math.round(Math.random() * 30 + 10)} mins`,
            distance_value: "0",
            duration_value: "0"
          };
        } else {
          // Fallback if property not found
          return {
            goto: id,
            contact: `Contact information unavailable`,
            maps: `https://maps.google.com/`,
            "website link": `https://www.thaiindustrialproperty.com/`,
            step: (index + 1).toString(),
            form: index === 0 ? "START" : propertyIds[index - 1],
            distance: `${Math.floor(Math.random() * 30 + 5)} km`,
            duration_text: `${Math.floor(Math.random() * 40 + 10)} mins`,
            distance_value: Math.floor(Math.random() * 30000 + 5000).toString(),
            duration_value: Math.floor(Math.random() * 2400 + 600).toString()
          };
        }
      });
      
      // Calculate waypoints from actual property data
      const waypoints = propertyIds.map((id: string) => {
        const property = allProperties.find((p: any) => p.propertyId === id);
        if (property && property.coordinates && property.coordinates.lat && property.coordinates.lng) {
          return `${property.coordinates.lat},${property.coordinates.lng}`;
        }
        // Fallback if coordinates not available
        return `${user_latitude + (Math.random() * 0.1)},${user_longtitude + (Math.random() * 0.1)}`;
      });
      
      // Create Maps URL
      const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${user_latitude},${user_longtitude}&destination=${user_latitude},${user_longtitude}&waypoints=${waypoints.join('|')}`;
      
      const response = {
        data,
        origin: `${user_latitude},${user_longtitude}`,
        destination: `${user_latitude},${user_longtitude}`,
        waypoints,
        mapsUrl
      };
      
      res.json(response);
    } catch (error) {
      console.error('Error in webhook test:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Add a new property through the form submission
  app.post('/api/properties', async (req, res) => {
    try {
      const propertyData = req.body;
      
      // Validate required fields
      if (!propertyData.propertyId || !propertyData.landlordName) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      
      // Add the property to the Google Sheet
      const result = await addPropertyToSheet(propertyData);
      
      res.status(201).json(result);
    } catch (error) {
      console.error('Error adding property:', error);
      res.status(500).json({ error: 'Failed to add property to Google Sheets' });
    }
  });
  
  // Upload and process an Excel or CSV file
  app.post('/api/upload-properties', upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
      
      const filePath = req.file.path;
      const fileExt = path.extname(req.file.originalname).toLowerCase();
      
      let result;
      
      if (fileExt === '.csv') {
        // Process CSV file
        result = await processCsvFile(filePath);
      } else if (fileExt === '.xlsx' || fileExt === '.xls') {
        // Process Excel file
        result = await processExcelFile(filePath);
      } else {
        // Clean up the invalid file
        try {
          require('fs').unlinkSync(filePath);
        } catch (e) {
          console.error('Error removing invalid file:', e);
        }
        return res.status(400).json({ error: 'Unsupported file format. Please upload a CSV or Excel file.' });
      }
      
      res.status(200).json(result);
    } catch (error) {
      console.error('Error processing uploaded file:', error);
      res.status(500).json({ error: 'Failed to process the uploaded file' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
