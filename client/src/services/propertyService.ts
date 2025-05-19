import axios from 'axios';
import { Property, RouteOption } from '../types';

// Fetch properties from our backend API (which gets data from Google Sheets)
export async function fetchProperties(): Promise<Property[]> {
  try {
    const response = await axios.get('/api/properties');
    return response.data;
  } catch (error) {
    console.error('Error fetching properties:', error);
    return [];
  }
}

// Transform properties to route options format
export function propertiesToRouteOptions(properties: Property[]): RouteOption[] {
  return properties.map(prop => ({
    value: prop.propertyId,
    label: `${prop.propertyId} - ${prop.subDistrict}, ${prop.district}`,
    coordinates: prop.coordinates
  }));
}

// Plan a route between selected properties
export async function planRoute(data: {
  user_latitude: number;
  user_longtitude: number;
  propertyId_list: string;
  user_timeselect: number;
}) {
  try {
    const response = await axios.post('/webhook-test/googlemap-route-calculator', data);
    return response.data;
  } catch (error) {
    console.error('Error planning route:', error);
    throw error;
  }
}