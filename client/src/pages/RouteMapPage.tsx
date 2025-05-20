import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { MapPin } from "lucide-react";
import MobileNavbar from "../components/MobileNavbar";
import { RouteResponse, Property, RouteOption } from "../types";
import PropertySelect from "../components/PropertySelect";
import RouteResults from "../components/RouteResults";
import {
  fetchProperties,
  propertiesToRouteOptions,
  planRoute,
} from "../services/propertyService";

const GOOGLE_MAPS_API_KEY = "AIzaSyDfjkja0tfp9ZrubUtt4phw1ZzrEpOaWYw";

const RouteMapPage: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [propertyOptions, setPropertyOptions] = useState<RouteOption[]>([]);
  const [selectedProperties, setSelectedProperties] = useState<RouteOption[]>(
    [],
  );
  const [startTime, setStartTime] = useState("09:00");
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [isPinDraggable, setIsPinDraggable] = useState(false);
  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);
  const [routeResponse, setRouteResponse] = useState<RouteResponse | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProperties, setIsLoadingProperties] = useState(true);

  // Fetch properties from Google Sheets when component mounts
  useEffect(() => {
    async function loadProperties() {
      try {
        const data = await fetchProperties();
        setProperties(data);

        // Convert properties to route options format
        const options = propertiesToRouteOptions(data);
        setPropertyOptions(options);
      } catch (error) {
        console.error("Error loading properties:", error);
        // Fallback to empty data
        setProperties([]);
        setPropertyOptions([]);
      } finally {
        setIsLoadingProperties(false);
      }
    }

    loadProperties();
  }, []);

  // Get user's location when component mounts
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          // Set a default location (Bangkok)
          setUserLocation({ lat: 13.736717, lng: 100.523186 });
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      // Set a default location (Bangkok)
      setUserLocation({ lat: 13.736717, lng: 100.523186 });
    }
  }, []);

  const handleSubmit = async () => {
    if (!userLocation) {
      alert("Please allow access to your location to continue.");
      return;
    }

    if (selectedProperties.length === 0) {
      alert("Please select at least one location.");
      return;
    }

    setIsLoading(true);

    // Make sure to use the current user location (which may have been moved)
    const routeData = {
      user_latitude: userLocation.lat,
      user_longtitude: userLocation.lng,
      propertyid_list: selectedProperties.map((prop) => prop.value).join(","),
      user_timeselect: new Date(`2023-01-01T${startTime}`).getTime() / 1000,
    };
    
    console.log("Sending location:", userLocation);

    try {
      // Call the route planning API
      const response = await planRoute(routeData);
      setRouteResponse(response);

      // Calculate route with Google Maps Directions API
      if (selectedProperties.length > 0 && properties.length > 0) {
        calculateDirections(userLocation, selectedProperties, properties);
      }
    } catch (error) {
      console.error("Error planning route:", error);
      alert("There was an error while planning your route. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to calculate route directions
  const calculateDirections = (
    userLocation: { lat: number; lng: number },
    selectedProps: RouteOption[],
    allProperties: Property[],
  ) => {
    const directionsService = new google.maps.DirectionsService();

    // Find property objects for selected properties
    const selectedPropertyObjects = selectedProps
      .map((selected) =>
        allProperties.find((p) => p.propertyId === selected.value),
      )
      .filter((p) => p !== undefined);

    if (selectedPropertyObjects.length === 0) return;

    // Create waypoints for Google Directions API
    const waypoints = selectedPropertyObjects.slice(1).map((property) => ({
      location: new google.maps.LatLng(
        property!.coordinates.lat,
        property!.coordinates.lng,
      ),
      stopover: true,
    }));

    const firstProperty = selectedPropertyObjects[0]!;

    const request: google.maps.DirectionsRequest = {
      origin: new google.maps.LatLng(userLocation.lat, userLocation.lng),
      destination: new google.maps.LatLng(
        firstProperty.coordinates.lat,
        firstProperty.coordinates.lng,
      ),
      waypoints,
      optimizeWaypoints: true,
      travelMode: google.maps.TravelMode.DRIVING,
    };

    directionsService.route(request, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        setDirections(result);
      } else {
        console.error("Error calculating directions:", status);
      }
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <MobileNavbar currentPage="route" />

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              วางแผนเส้นทางเยี่ยมชมอสังหาริมทรัพย์
            </h2>

            {isLoadingProperties ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                <span className="ml-3 text-gray-600">กำลังโหลดข้อมูล...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    เลือกอสังหาริมทรัพย์
                  </label>
                  <PropertySelect
                    options={propertyOptions}
                    value={selectedProperties}
                    onChange={setSelectedProperties}
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    สามารถเลือกได้หลายรายการ
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    เวลาเริ่มต้น
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 px-3 py-2 border"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-center md:justify-start">
              <button
                onClick={handleSubmit}
                disabled={
                  isLoading ||
                  !userLocation ||
                  selectedProperties.length === 0 ||
                  isLoadingProperties
                }
                className={`${
                  isLoading ||
                  !userLocation ||
                  selectedProperties.length === 0 ||
                  isLoadingProperties
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-yellow-500 hover:bg-gray-700"
                } text-white px-6 py-2 rounded-md font-medium transition-colors flex items-center gap-2`}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                    กำลังคำนวณ...
                  </>
                ) : (
                  <>
                    <MapPin size={18} />
                    คำนวณเส้นทาง
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-3 bg-gray-50 border-b flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-700">แผนที่</h3>
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-2 text-sm">
                      <input 
                        type="checkbox"
                        checked={isPinDraggable}
                        onChange={() => setIsPinDraggable(!isPinDraggable)}
                        className="rounded text-blue-600"
                      />
                      <span className="text-sm font-medium">
                        {isPinDraggable ? 'ย้ายตำแหน่งของฉัน✅' : 'ย้ายตำแหน่งของฉัน'}
                      </span>
                    </label>
                  </div>
                </div>
                
                <div className="h-[450px] md:h-[550px]">
                  <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
                    <GoogleMap
                      mapContainerStyle={{ width: "100%", height: "100%" }}
                      center={userLocation || { lat: 13.7563, lng: 100.5018 }} // Bangkok as default
                      zoom={11}
                    >
                      {userLocation && (
                        <Marker
                          position={userLocation}
                          draggable={isPinDraggable}
                          onDragEnd={(e) => {
                            if (e.latLng) {
                              setUserLocation({
                                lat: e.latLng.lat(),
                                lng: e.latLng.lng()
                              });
                            }
                          }}
                          icon={{
                            url: isPinDraggable 
                              ? "https://maps.google.com/mapfiles/ms/icons/green-dot.png" 
                              : "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                          }}
                        />
                      )}

                      {selectedProperties.map((prop) => {
                        // Find the property in our properties list
                        const property = properties.find(
                          (p) => p.propertyId === prop.value,
                        );
                        if (!property) return null;

                        return (
                          <Marker
                            key={prop.value}
                            position={property.coordinates}
                            title={property.propertyId}
                          />
                        );
                      })}

                      {directions && (
                        <DirectionsRenderer
                          directions={directions}
                          options={{
                            suppressMarkers: true,
                          }}
                        />
                      )}
                    </GoogleMap>
                  </LoadScript>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <RouteResults routeResponse={routeResponse} startTime={startTime} />
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-sm text-gray-600 text-center">
            &copy; 2025 ATSOKO Property Management. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default RouteMapPage;