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
  websiteLink: string;
  step: string;
  form: string;
  distance: string;
  duration_text: string;
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
