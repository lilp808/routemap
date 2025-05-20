import axios from "axios";
import { Property, RouteOption } from "../types";
import { error } from "console";

const SHEET_API_URL =
  "https://script.google.com/macros/s/AKfycbyUJuJHa63coLClxg6_Mtq0J7aQpmxnNWKO3PzKmRYc6purDdrBSvMaBLXk4oFxtRDnPw/exec";

export async function fetchProperties(): Promise<Property[]> {
  try {
    const response = await axios.get(SHEET_API_URL);
    const rawData = response.data;

    const properties: Property[] = rawData.map((item: any, index: number) => {
      const [latStr, lngStr] = item["Left, Right Coordinates"]
        .split(",")
        .map((val: string) => val.trim());

      return {
        id: (index + 1).toString(),
        propertyId: item["Property ID (ATS)"],
        landlordName: item["Landlord name or Company name"],
        landlordContact: item["Landlord Contact"].toString(),
        buildingSize: Number(item["Building size (in SQM)"]),
        type: item["Factory or Warehouse"],
        rentOrSale: item["Rent or Sale"],
        price: item["Price"],
        subDistrict: item["Sub-district"],
        district: item["District"],
        province: item["Province"],
        mapUrl: item["Map"],
        coordinates: {
          lat: parseFloat(latStr),
          lng: parseFloat(lngStr),
        },
        websiteLink: item["Website Link"],
      };
    });

    return properties;
  } catch (error) {
    console.error("Error fetching properties from Google Sheet:", error);
    return [];
  }
}

// Transform properties to route options format
export function propertiesToRouteOptions(
  properties: Property[],
): RouteOption[] {
  return properties.map((prop) => ({
    value: prop.propertyId,
    label: `${prop.propertyId} - ${prop.subDistrict}, ${prop.district} , ${prop.buildingSize} sqm , ${prop.coordinates.lat}  , ${prop.coordinates.lng}`,
    coordinates: prop.coordinates,
  }));
}

export async function planRoute(data: {
  user_latitude: number;
  user_longtitude: number; // ใช้ตามชื่อจริงใน data
  propertyid_list: string; // ตัว i ตัวเล็ก
  user_timeselect: number; // เหมือนเดิม
}) {
  console.log("Input data:", data);

  const url =
    "https://4d08-2001-fb1-89-7d24-6d7e-38ce-271e-4fb9.ngrok-free.app/webhook/googlemap-route-calculator";

  const payload = {
    user_latitude: data.user_latitude,
    user_longtitude: data.user_longtitude, // ชื่อตรงกับ data
    propertyId_list: data.propertyid_list, // แปลงตัว i ให้เป็นใหญ่ ถ้า webhook ต้องการแบบนี้
    user_timeselect: data.user_timeselect,
  };

  console.log("Payload to send:", payload);

  try {
    const response = await axios.post(url, payload);
    console.log("Response from webhook:", response.data);
    return response.data; // เพิ่มบรรทัดนี้
  } catch (error) {
    console.error("Error planning route:", error);
    throw error;
  }
}
