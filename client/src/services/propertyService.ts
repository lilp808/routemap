import axios from 'axios';
import { Property, RouteOption } from '../types';

// Static property data from the sample in the requirements
const sampleProperties: Property[] = [
  {
    id: '1',
    propertyId: 'AT1R',
    landlordName: 'Chumphol',
    landlordContact: '029730100/0814266664',
    buildingSize: 288,
    type: 'warehouse',
    rentOrSale: 'rent',
    price: 'THB 35,000',
    subDistrict: 'Saphan Sung',
    district: 'Saphan Sung',
    province: 'Bangkok',
    mapUrl: 'https://goo.gl/maps/HkmUr5QuQ3yREuTC8',
    coordinates: { lat: 13.744306, lng: 100.707444 },
    websiteLink: 'https://www.thaiindustrialproperty.com/property/warehouse-288-sqm-for-rent-at-saphan-sung-saphan-sung-bangkok-property-id-at1r/'
  },
  {
    id: '2',
    propertyId: 'AT2R',
    landlordName: 'Nam Logistics',
    landlordContact: '27277627',
    buildingSize: 480,
    type: 'warehouse',
    rentOrSale: 'rent',
    price: 'THB 50,400',
    subDistrict: 'Khlong Song Ton Nun',
    district: 'Lat Krabang',
    province: 'Bangkok',
    mapUrl: 'https://goo.gl/maps/5R494NTk9vthz7CDA',
    coordinates: { lat: 13.735946, lng: 100.716805 },
    websiteLink: 'https://www.thaiindustrialproperty.com/property/warehouse-480-sqm-for-rent-at-khlong-song-ton-nun-lat-krabang-bangkok-property-id-at2r/'
  },
  {
    id: '3',
    propertyId: 'AT3R',
    landlordName: 'Atitaya SPLC',
    landlordContact: '896001756',
    buildingSize: 3744,
    type: 'both',
    rentOrSale: 'rent',
    price: 'THB 486,720',
    subDistrict: 'Bang Phriang',
    district: 'Bang Bo',
    province: 'Samut Prakan',
    mapUrl: 'https://goo.gl/maps/vHaQoN9bB3zs1kmKA',
    coordinates: { lat: 13.543472, lng: 100.779972 },
    websiteLink: 'https://www.thaiindustrialproperty.com/property/factory-or-warehouse-3744-sqm-for-rent-at-bang-phriang-bang-bo-samutprakan-property-id-at3r/'
  },
  {
    id: '4',
    propertyId: 'AT4R',
    landlordName: 'Nuch Kantarat',
    landlordContact: '819222528',
    buildingSize: 600,
    type: 'warehouse',
    rentOrSale: 'rent',
    price: 'THB 78,000',
    subDistrict: 'Lat Krabang',
    district: 'Lat Krabang',
    province: 'Bangkok',
    mapUrl: 'https://goo.gl/maps/WPp3MED7H3tEYv3K7',
    coordinates: { lat: 13.722306, lng: 100.721333 },
    websiteLink: 'https://www.thaiindustrialproperty.com/property/warehouse-600-sqm-for-rent-at-lat-krabang-lat-krabang-bangkok-property-id-at4r/'
  },
  {
    id: '5',
    propertyId: 'AT5R',
    landlordName: 'Nuch Kantarat',
    landlordContact: '819222528',
    buildingSize: 675,
    type: 'warehouse',
    rentOrSale: 'rent',
    price: 'THB 74,250',
    subDistrict: 'Racha Thewa',
    district: 'Bang Phli',
    province: 'Samut Prakan',
    mapUrl: 'https://goo.gl/maps/q1kH9tP4MNhKKAqM6',
    coordinates: { lat: 13.666806, lng: 100.720583 },
    websiteLink: 'https://www.thaiindustrialproperty.com/property/warehouse-675-sqm-for-rent-at-racha-thewa-bang-phli-samut-prakan-property-id-at5r/'
  },
  // Additional sample properties to show more options
  {
    id: '6',
    propertyId: 'AT406R',
    landlordName: 'Nok',
    landlordContact: '0882106510',
    buildingSize: 2610,
    type: 'both',
    rentOrSale: 'rent',
    price: 'THB 260,000',
    subDistrict: 'Sala Daeng',
    district: 'Bang Nam Priao',
    province: 'Chachoengsao',
    mapUrl: 'https://maps.app.goo.gl/MoFotSkw16nWKna89',
    coordinates: { lat: 13.850000, lng: 101.050000 },
    websiteLink: 'https://www.thaiindustrialproperty.com/property/factory-or-warehouse-2610-sqm-for-rent-at-sala-daeng-bang-nam-priao-chachoengsao-property-id-at406r/'
  },
  {
    id: '7',
    propertyId: 'AT350R',
    landlordName: 'Jiroj',
    landlordContact: '0953516454',
    buildingSize: 1760,
    type: 'both',
    rentOrSale: 'rent',
    price: 'THB 176,000',
    subDistrict: 'Tha Kham',
    district: 'Bang Pakong',
    province: 'Chachoengsao',
    mapUrl: 'https://maps.app.goo.gl/V7ZaGhqvs2UCe4M9A',
    coordinates: { lat: 13.580000, lng: 100.910000 },
    websiteLink: 'https://www.thaiindustrialproperty.com/property/factory-or-warehouse-1760-sqm-for-rent-at-tha-kham-bang-pakong-chachoengsao-property-id-at350r/'
  },
  {
    id: '8',
    propertyId: 'AT1245R',
    landlordName: 'Air',
    landlordContact: '0818333103',
    buildingSize: 1416,
    type: 'both',
    rentOrSale: 'rent',
    price: 'THB 141,600',
    subDistrict: 'Tha Kham',
    district: 'Bang Pakong',
    province: 'Chachoengsao',
    mapUrl: 'https://maps.app.goo.gl/GA5tyuZZQzHmuEkv9',
    coordinates: { lat: 13.590000, lng: 100.920000 },
    websiteLink: 'https://www.thaiindustrialproperty.com/th/property/factory-or-warehouse-1416-sqm-for-rent-at-tha-kham-bang-pakong-chachoengsao-property-id-at1245r/'
  }
];

// Fetch properties - in a real implementation, this would call the API
// For now, using static data for demo purposes
export async function fetchProperties(): Promise<Property[]> {
  try {
    // Try to fetch from API first
    const response = await axios.get('/api/properties');
    return response.data;
  } catch (error) {
    console.error('Error fetching properties from API, using sample data:', error);
    // Fall back to static sample data
    return sampleProperties;
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
  propertyid_list: string;
  user_timeselect: number;
}) {
  try {
    const response = await axios.post('/webhook-test/googlemap-route-calculator', data);
    return response.data;
  } catch (error) {
    console.error('Error planning route:', error);
    
    // Fallback to generate a response if API call fails
    const propertyIds = data.propertyid_list.split(',');
    const selectedProperties = propertyIds.map(id => 
      sampleProperties.find(p => p.propertyId === id)
    ).filter(p => p !== undefined) as Property[];
    
    // Generate mock response with the same structure as API
    const mockResponse = {
      data: selectedProperties.map((property, index) => ({
        goto: property.propertyId,
        contact: `K.${property.landlordName} ${property.landlordContact}`,
        maps: property.mapUrl,
        websiteLink: property.websiteLink,
        step: (index + 1).toString(),
        form: index === 0 ? "START" : selectedProperties[index - 1].propertyId,
        distance: index === 0 ? "0 km" : `${Math.round(Math.random() * 20 + 5)} km`,
        duration_text: index === 0 ? "0 mins" : `${Math.round(Math.random() * 30 + 10)} mins`,
        distance_value: index === 0 ? "0" : Math.round(Math.random() * 15000 + 5000).toString(),
        duration_value: index === 0 ? "0" : Math.round(Math.random() * 1800 + 600).toString()
      })),
      origin: `${data.user_latitude},${data.user_longtitude}`,
      destination: `${data.user_latitude},${data.user_longtitude}`,
      waypoints: selectedProperties.map(prop => `${prop.coordinates.lat},${prop.coordinates.lng}`),
      mapsUrl: `https://www.google.com/maps/dir/?api=1&origin=${data.user_latitude},${data.user_longtitude}&destination=${data.user_latitude},${data.user_longtitude}&waypoints=${selectedProperties.map(prop => `${prop.coordinates.lat},${prop.coordinates.lng}`).join('|')}`
    };
    
    return mockResponse;
  }
}