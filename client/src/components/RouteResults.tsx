import React from 'react';
import { RouteResponse } from '../types';
import { Clock, MapPin, ExternalLink } from 'lucide-react';

interface RouteResultsProps {
  routeResponse: RouteResponse | null;
  startTime: string;
}

const RouteResults: React.FC<RouteResultsProps> = ({ routeResponse, startTime }) => {
  if (!routeResponse) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 h-[500px] md:h-[600px] overflow-y-auto">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">แผนเส้นทาง</h2>
        
        <div className="text-center py-12">
          <svg className="mx-auto text-gray-400 mb-4" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <p className="text-gray-500">กรุณาเลือกสถานที่และกดวางแผนเส้นทาง</p>
        </div>
      </div>
    );
  }
  
  // Calculate estimated times
  const times = routeResponse.data.map((route, index) => {
    if (index === 0) {
      return startTime;
    }
    
    // Parse the previous time
    const [hours, minutes] = routeResponse.data[index - 1].duration_text.split(' ')[0] !== "0" 
      ? [parseInt(startTime.split(':')[0]), parseInt(startTime.split(':')[1]) + parseInt(routeResponse.data[index - 1].duration_text.split(' ')[0])]
      : [parseInt(startTime.split(':')[0]), parseInt(startTime.split(':')[1])];
    
    // Adjust for minutes overflow
    const adjustedHours = hours + Math.floor(minutes / 60);
    const adjustedMinutes = minutes % 60;
    
    return `${adjustedHours.toString().padStart(2, '0')}:${adjustedMinutes.toString().padStart(2, '0')}`;
  });

  return (
    <div className="bg-white rounded-lg shadow-md p-6 h-[500px] md:h-[600px] overflow-y-auto">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">แผนเส้นทาง</h2>
      
      <div>
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-2">Property Visit Plan</h3>
          <p className="text-gray-600">เริ่มต้น: <span className="font-medium">{startTime}</span></p>
        </div>
        
        {routeResponse.data.map((route, index) => (
          <div key={route.goto} className="border-l-4 border-yellow-500 pl-4 pb-8 relative">
            <div className="absolute w-4 h-4 rounded-full bg-yellow-500 -left-[10px]"></div>
            <div className="mb-2">
              <div className="flex justify-between">
                <span className="font-semibold text-lg">{route.step}. {route.goto}</span>
                <span className="text-gray-600">{times[index]}</span>
              </div>
              <a 
                href={route.websiteLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm block mb-2"
              >
                ดูรายละเอียดเพิ่มเติม &#8599;
              </a>
            </div>
            
            <div className="text-gray-700 mb-2">
              <p className="font-medium">{route.contact.split(' ')[0]}</p>
              <p>Contact: {route.contact.split(' ').slice(1).join(' ')}</p>
            </div>
            
            <div className="flex items-center gap-2 mt-3">
              <MapPin size={16} className="text-red-500" />
              <a 
                href={route.maps} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm"
              >
                ดูตำแหน่งที่ตั้ง
              </a>
            </div>
            
            {index > 0 && (
              <div className="mt-3 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  <span>{route.duration_text}</span>
                </div>
                <div className="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                  <span>{route.distance}</span>
                </div>
              </div>
            )}
          </div>
        ))}
        
        <div className="mt-6 pt-6 border-t">
          <a 
            href={routeResponse.mapsUrl}
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 w-full"
          >
            <ExternalLink size={18} />
            เปิดใน Google Maps
          </a>
        </div>
      </div>
    </div>
  );
};

export default RouteResults;
