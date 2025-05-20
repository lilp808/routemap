import React, { useState, useRef } from 'react';
import { FileSpreadsheet, Plus, Upload as UploadIcon } from 'lucide-react';
import MobileNavbar from '../components/MobileNavbar';

// Define property structure according to Google Sheet columns
interface PropertyFormData {
  propertyId: string;
  landlordName: string;
  landlordContact: string;
  buildingSize: string;
  type: 'factory' | 'warehouse' | 'both';
  rentOrSale: 'rent' | 'sale';
  price: string;
  subDistrict: string;
  district: string;
  province: string;
  mapUrl: string;
  coordinates: string;
  websiteLink: string;
}

const UploadInfoPage: React.FC = () => {
  const initialFormData: PropertyFormData = {
    propertyId: '',
    landlordName: '',
    landlordContact: '',
    buildingSize: '',
    type: 'warehouse',
    rentOrSale: 'rent',
    price: '',
    subDistrict: '',
    district: '',
    province: '',
    mapUrl: '',
    coordinates: '',
    websiteLink: ''
  };

  const [formData, setFormData] = useState<PropertyFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState({ text: '', type: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ text: '', type: '' });

    try {
      // In a real implementation, this would send data to your backend API
      // which would then update the Google Sheet
      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage({ text: 'ข้อมูลถูกบันทึกเรียบร้อยแล้ว', type: 'success' });
        setFormData(initialFormData); // Reset form
      } else {
        const error = await response.text();
        setMessage({ text: `เกิดข้อผิดพลาด: ${error}`, type: 'error' });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setMessage({ text: 'เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const fileType = file.name.split('.').pop()?.toLowerCase();
      
      // Check file type
      if (!['xlsx', 'xls', 'csv'].includes(fileType || '')) {
        setUploadMessage({ text: 'กรุณาอัพโหลดไฟล์ Excel หรือ CSV เท่านั้น', type: 'error' });
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }
      
      setSelectedFile(file);
      setUploadMessage({ text: '', type: '' });
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      setUploadMessage({ text: 'กรุณาเลือกไฟล์ก่อนอัพโหลด', type: 'error' });
      return;
    }

    setIsUploading(true);
    setUploadMessage({ text: '', type: '' });

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      // In a real implementation, this would send the file to your backend API
      // which would process it and update the Google Sheet
      const response = await fetch('/api/upload-properties', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setUploadMessage({ text: 'ไฟล์ถูกอัพโหลดและประมวลผลเรียบร้อยแล้ว', type: 'success' });
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      } else {
        const error = await response.text();
        setUploadMessage({ text: `เกิดข้อผิดพลาด: ${error}`, type: 'error' });
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadMessage({ text: 'เกิดข้อผิดพลาดในการอัพโหลดไฟล์', type: 'error' });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <MobileNavbar currentPage="upload" />
      
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">เพิ่มข้อมูลอสังหาริมทรัพย์</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Form Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-2 mb-6">
                <Plus className="text-blue-600" />
                <h2 className="text-xl font-semibold">เพิ่มข้อมูลด้วยแบบฟอร์ม</h2>
              </div>
              
              {message.text && (
                <div className={`mb-4 p-3 rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {message.text}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="propertyId" className="block text-sm font-medium text-gray-700 mb-1">
                      รหัสทรัพย์สิน (Property ID) *
                    </label>
                    <input
                      type="text"
                      id="propertyId"
                      name="propertyId"
                      value={formData.propertyId}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="landlordName" className="block text-sm font-medium text-gray-700 mb-1">
                      ชื่อเจ้าของ/บริษัท *
                    </label>
                    <input
                      type="text"
                      id="landlordName"
                      name="landlordName"
                      value={formData.landlordName}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="landlordContact" className="block text-sm font-medium text-gray-700 mb-1">
                    ข้อมูลติดต่อ *
                  </label>
                  <input
                    type="text"
                    id="landlordContact"
                    name="landlordContact"
                    value={formData.landlordContact}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="buildingSize" className="block text-sm font-medium text-gray-700 mb-1">
                      ขนาดอาคาร (ตร.ม.) *
                    </label>
                    <input
                      type="text"
                      id="buildingSize"
                      name="buildingSize"
                      value={formData.buildingSize}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                      ประเภท *
                    </label>
                    <select
                      id="type"
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="warehouse">คลังสินค้า</option>
                      <option value="factory">โรงงาน</option>
                      <option value="both">ทั้งสองอย่าง</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="rentOrSale" className="block text-sm font-medium text-gray-700 mb-1">
                      ให้เช่า/ขาย *
                    </label>
                    <select
                      id="rentOrSale"
                      name="rentOrSale"
                      value={formData.rentOrSale}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="rent">ให้เช่า</option>
                      <option value="sale">ขาย</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                    ราคา *
                  </label>
                  <input
                    type="text"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="เช่น THB 35,000"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="subDistrict" className="block text-sm font-medium text-gray-700 mb-1">
                      ตำบล/แขวง *
                    </label>
                    <input
                      type="text"
                      id="subDistrict"
                      name="subDistrict"
                      value={formData.subDistrict}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-1">
                      อำเภอ/เขต *
                    </label>
                    <input
                      type="text"
                      id="district"
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="province" className="block text-sm font-medium text-gray-700 mb-1">
                      จังหวัด *
                    </label>
                    <input
                      type="text"
                      id="province"
                      name="province"
                      value={formData.province}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="mapUrl" className="block text-sm font-medium text-gray-700 mb-1">
                    ลิงค์แผนที่ *
                  </label>
                  <input
                    type="url"
                    id="mapUrl"
                    name="mapUrl"
                    value={formData.mapUrl}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://goo.gl/maps/..."
                  />
                </div>
                
                <div>
                  <label htmlFor="coordinates" className="block text-sm font-medium text-gray-700 mb-1">
                    พิกัด (Latitude, Longitude) *
                  </label>
                  <input
                    type="text"
                    id="coordinates"
                    name="coordinates"
                    value={formData.coordinates}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="13.744306, 100.707444"
                  />
                </div>
                
                <div>
                  <label htmlFor="websiteLink" className="block text-sm font-medium text-gray-700 mb-1">
                    ลิงค์เว็บไซต์
                  </label>
                  <input
                    type="url"
                    id="websiteLink"
                    name="websiteLink"
                    value={formData.websiteLink}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://www.thaiindustrialproperty.com/..."
                  />
                </div>
                
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md font-medium transition-all duration-200 ${
                      isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'
                    }`}
                  >
                    {isSubmitting ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
                  </button>
                </div>
              </form>
            </div>
            
            {/* File Upload Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-2 mb-6">
                <FileSpreadsheet className="text-blue-600" />
                <h2 className="text-xl font-semibold">อัพโหลดไฟล์ข้อมูล</h2>
              </div>
              
              {uploadMessage.text && (
                <div className={`mb-4 p-3 rounded-md ${uploadMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {uploadMessage.text}
                </div>
              )}
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center">
                <FileSpreadsheet className="text-gray-400 mb-4" size={48} />
                <h3 className="text-lg font-medium text-gray-700 mb-2">อัพโหลดไฟล์ Excel หรือ CSV</h3>
                <p className="text-gray-500 mb-4">ลากและวางไฟล์ที่นี่ หรือคลิกเพื่อเลือกไฟล์</p>
                
                <input
                  type="file"
                  id="fileUpload"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".xlsx,.xls,.csv"
                  className="hidden"
                />
                
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-md font-medium transition-all duration-200"
                >
                  เลือกไฟล์
                </button>
                
                {selectedFile && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-md w-full">
                    <p className="text-blue-700 font-medium">{selectedFile.name}</p>
                    <p className="text-blue-600 text-sm">
                      {(selectedFile.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                )}
              </div>
              
              <div className="mt-6">
                <button
                  onClick={handleFileUpload}
                  disabled={isUploading || !selectedFile}
                  className={`w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-md font-medium transition-all duration-200 ${
                    isUploading || !selectedFile ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'
                  }`}
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                      กำลังอัพโหลด...
                    </>
                  ) : (
                    <>
                      <UploadIcon size={18} />
                      อัพโหลดไฟล์
                    </>
                  )}
                </button>
              </div>
              
              <div className="mt-6 border-t pt-6">
                <h3 className="text-lg font-medium text-gray-700 mb-3">รูปแบบไฟล์</h3>
                <p className="text-gray-600 mb-3">รูปแบบไฟล์ที่ถูกต้องควรมีคอลัมน์ตามลำดับดังนี้:</p>
                <ol className="list-decimal list-inside text-gray-600 space-y-1">
                  <li>Property ID (ATS)</li>
                  <li>Landlord name or Company name</li>
                  <li>Landlord Contact</li>
                  <li>Building size (in SQM)</li>
                  <li>Factory or Warehouse</li>
                  <li>Rent or Sale</li>
                  <li>Price</li>
                  <li>Sub-district</li>
                  <li>District</li>
                  <li>Province</li>
                  <li>Map URL</li>
                  <li>Latitude, Longitude</li>
                  <li>Website Link</li>
                </ol>
                <p className="text-sm text-gray-500 mt-3">
                  หมายเหตุ: ไฟล์ตัวอย่างสามารถดาวน์โหลดได้{' '}
                  <a href="/template.xlsx" className="text-blue-600 hover:underline">ที่นี่</a>
                </p>
              </div>
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

export default UploadInfoPage;