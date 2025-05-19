import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';
import Select from 'react-select';
import { Property } from '../types';

const GOOGLE_MAPS_API_KEY = 'AIzaSyDfjkja0tfp9ZrubUtt4phw1ZzrEpOaWYw';
const WEBHOOK_URL = 'http://localhost:5678/webhook-test/googlemap-route-calculator';

const properties: Property[] = [
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
  // Add other properties here
];

interface RouteOption {
  value: string;
  label: string;
  coordinates: { lat: number; lng: number };
}

const RouteMapPage: React.FC = () => {
  const [selectedProperties, setSelectedProperties] = useState<RouteOption[]>([]);
  const [startTime, setStartTime] = useState('09:00');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [webhookResponse, setWebhookResponse] = useState<string>('');

  const propertyOptions: RouteOption[] = properties.map(prop => ({
    value: prop.propertyId,
    label: `${prop.propertyId} - ${prop.subDistrict}, ${prop.district}`,
    coordinates: prop.coordinates
  }));

  useEffect(() => {
    // Get user's location when component mounts
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  const handleSubmit = async () => {
    if (!userLocation) {
      alert('Please enable location services to continue');
      return;
    }

    const routeData = {
      startTime,
      userLocation,
      properties: selectedProperties.map(prop => ({
        propertyId: prop.value,
        coordinates: prop.coordinates
      }))
    };

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(routeData),
      });

      const data = await response.text();
      setWebhookResponse(data);

      // Calculate route
      if (selectedProperties.length > 0) {
        const directionsService = new google.maps.DirectionsService();
        const waypoints = selectedProperties.slice(1, -1).map(prop => ({
          location: new google.maps.LatLng(prop.coordinates.lat, prop.coordinates.lng),
          stopover: true
        }));

        const request: google.maps.DirectionsRequest = {
          origin: new google.maps.LatLng(userLocation.lat, userLocation.lng),
          destination: new google.maps.LatLng(
            selectedProperties[selectedProperties.length - 1].coordinates.lat,
            selectedProperties[selectedProperties.length - 1].coordinates.lng
          ),
          waypoints,
          optimizeWaypoints: true,
          travelMode: google.maps.TravelMode.DRIVING
        };

        directionsService.route(request, (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            setDirections(result);
          }
        });
      }
    } catch (error) {
      console.error('Error sending data to webhook:', error);
      setWebhookResponse('Error sending data to webhook');
    }
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <h1 className="text-2xl font-bold mb-4">Route Planning</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Properties
            </label>
            <Select
              isMulti
              options={propertyOptions}
              value={selectedProperties}
              onChange={(selected) => setSelectedProperties(selected as RouteOption[])}
              className="basic-multi-select"
              classNamePrefix="select"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Time
            </label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Plan Route
        </button>

        {webhookResponse && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md">
            <h2 className="font-semibold mb-2">Webhook Response:</h2>
            <p>{webhookResponse}</p>
          </div>
        )}
      </div>

      <div className="h-[600px] w-full">
        <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100%' }}
            center={userLocation || { lat: 13.7563, lng: 100.5018 }}
            zoom={11}
          >
            {userLocation && (
              <Marker
                position={userLocation}
                icon={{
                  url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                }}
              />
            )}

            {selectedProperties.map((prop) => (
              <Marker
                key={prop.value}
                position={prop.coordinates}
                title={prop.label}
              />
            ))}

            {directions && (
              <DirectionsRenderer
                directions={directions}
                options={{
                  suppressMarkers: true
                }}
              />
            )}
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  );
};

export default RouteMapPage;