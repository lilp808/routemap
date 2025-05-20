export interface Property {
  id: string;
  propertyId: string;
  landlordName: string;
  landlordContact: string;
  buildingSize: number;
  type: 'factory' | 'warehouse' | 'both';
  rentOrSale: 'rent' | 'sale';
  price: string;
  subDistrict: string;
  district: string;
  province: string;
  mapUrl: string;
  coordinates: { lat: number; lng: number };
  websiteLink: string;
}

export interface RouteStep {
  goto: string;
  contact: string;
  maps: string;
  "website link": string; // This is how it's returned from the API
  websiteLink?: string;   // Alternative property name
  step: string;
  form: string;
  distance: string;
  duration_minute?: number; // Added from API response
  duration_text?: string;   // Alternative property name
  distance_value: string;
  duration_value: string;
}

export interface RouteResponse {
  data: RouteStep[];
  origin: string;
  destination: string;
  waypoints: string[];
  mapsUrl: string;
}

export interface RouteOption {
  value: string;
  label: string;
  coordinates: { lat: number; lng: number };
}
