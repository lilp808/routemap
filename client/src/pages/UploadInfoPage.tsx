import React, { useState, useRef } from "react";
import { FileSpreadsheet, Plus, Upload as UploadIcon } from "lucide-react";
import MobileNavbar from "../components/MobileNavbar";

// Define property structure according to Google Sheet columns
interface PropertyFormData {
  propertyId: string;
  landlordName: string;
  landlordContact: string;
  buildingSize: string;
  type: "factory" | "warehouse" | "both";
  rentOrSale: "rent" | "sale";
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
    propertyId: "",
    landlordName: "",
    landlordContact: "",
    buildingSize: "",
    type: "warehouse",
    rentOrSale: "rent",
    price: "",
    subDistrict: "",
    district: "",
    province: "",
    mapUrl: "",
    coordinates: "",
    websiteLink: "",
  };

  const [formData, setFormData] = useState<PropertyFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState({ text: "", type: "" });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedSubDistrict, setSelectedSubDistrict] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const locationData = {
    "Pathum Thani": {
      districts: {
        "Mueang Pathum Thani": [
          "Bang Kadi",
          "Bang Prok",
          "Bang Phun",
          "Ban Klang",
          "Lak Hok",
          "Ban Mai",
          "Rangsit",
          "Chao Khlong",
          "Khlong Nueng",
          "Khlong Song",
          "Khlong Sam",
          "Khlong Si",
          "Khlong Ha",
          "Khlong Hok",
          "Khlong Chet",
        ],
        "Lat Lum Kaeo": [
          "Lat Lum Kaeo",
          "Na Mai",
          "Khlong Khlong Khwang",
          "Khlong Phra Udom",
          "Bung Khong Long",
          "Khu Khwang",
          "Khu Bang Luang",
        ],
        Thanyaburi: [
          "Prachathipat",
          "Bueng Yitho",
          "Lam Phak Chi",
          "Lam Sai",
          "Bueng Nam Rak",
          "Bueng Sanam Chai",
        ],
        "Khlong Luang": [
          "Khlong Nueng",
          "Khlong Song",
          "Khlong Sam",
          "Khlong Si",
          "Khlong Ha",
          "Khlong Hok",
          "Khlong Chet",
        ],
        "Nong Suea": [
          "Nong Suea",
          "Bueng Bakad",
          "Sala Khlong",
          "Nong Sam Wang",
        ],
        "Sam Khok": [
          "Sam Khok",
          "Bang Toey",
          "Khlong Khwai",
          "Ban Pathum",
          "Bang Teen Ped",
          "Thai Ko",
          "Chiang Rak Yai",
          "Chiang Rak Noi",
          "Bang Sai",
          "Khlong Khwai",
          "Bang Kacha",
        ],
        "Lam Luk Ka": [
          "Lam Luk Ka",
          "Bung Kham Phroi",
          "Lam Sai",
          "Lam Sing",
          "Phaya Man",
          "Bueng Thong Lang",
          "Khlong Sip",
          "Khlong Sip Song",
          "Khlong Sip Sam",
        ],
      },
    },
    Nonthaburi: {
      districts: {
        "Mueang Nonthaburi": [
          "Suan Yai",
          "Talat Khwan",
          "Bang Khen",
          "Bang Kraso",
          "Tha Sai",
          "Bang Pha",
        ],
        "Bang Bua Thong": [
          "Bang Bua Thong",
          "Bang Khu Wat",
          "Lahan",
          "Phimon",
          "Bang Rak Phatthana",
          "Bang Mae Nang",
          "Sai Ma",
        ],
        "Bang Kruai": [
          "Bang Kruai",
          "Wat Chalo",
          "Bang Si Thong",
          "Bang Khanun",
          "Bang Khu Wiang",
          "Bang Muang",
          "Om Kret",
          "Plai Bang",
          "Sala Klang",
        ],
        "Bang Yai": [
          "Bang Yai",
          "Bang Mae Nang",
          "Bang Muang",
          "Bang Len",
          "Sai Noi",
        ],
        "Sai Noi": [
          "Sai Noi",
          "Thawi Watthana",
          "Khlong Khwang",
          "Nong Phra Ngu",
          "Sai Yai",
        ],
        "Pak Kret": [
          "Pak Kret",
          "Bang Talat",
          "Ban Mai",
          "Bang Phut",
          "Khlong Khoi",
          "Bang Ko Wat",
          "Om Kret",
          "Khlong Phra Udom",
          "Ko Kret",
        ],
      },
    },
    Bangkok: {
      // Bangkok is a special administrative area, districts are called 'khet' (เขต)
      districts: {
        "Phra Nakhon": [
          "Phra Borom Maha Ratchawang",
          "Wang Burapha Phirom",
          "Wat Ratchabophit",
          "San Chaopho Suea",
          "Phra Sing",
        ],
        Dusit: [
          "Dusit",
          "Wachira Phayaban",
          "Suan Chitlada",
          "Si Yaek Mahanak",
          "Khlong Ton Sai",
        ],
        "Nong Chok": [
          "Nong Chok",
          "Khlong Sip",
          "Khlong Sip Song",
          "Khlong Sip Sam",
          "Khlong Sip Si",
          "Khlong Sip Hok",
          "Kutong",
        ],
        "Bang Rak": [
          "Maha Phruettharam",
          "Si Lom",
          "Suriyawong",
          "Bang Rak",
          "Si Phraya",
        ],
        "Bang Khen": ["Anusawari", "Tha Raeng"],
        "Bang Kapi": ["Khlong Chan", "Hua Mak", "Saphan Sung"],
        "Pathum Wan": ["Wang Mai", "Pathum Wan", "Lumphini", "Rong Mueang"],
        "Pom Prap Sattru Phai": [
          "Pom Prap",
          "Wat Thep Sirin",
          "Khlong Mahanak",
          "Ban Bat",
          "Wat Sommanat",
        ],
        "Phaya Thai": ["Sam Sen Nai", "Phaya Thai"], // Note: Bang Sue is a separate district now
        "Khlong Toei": ["Khlong Toei", "Khlong Tan", "Phra Khanong"], // Note: Phra Khanong is a separate district now
        "Lat Phrao": [
          "Lat Phrao",
          "Chorake Bua",
          "Khlong Chaokhun Sing",
          "Phlap Phla",
        ],
        "Huai Khwang": [
          "Huai Khwang",
          "Bang Kapi",
          "Sam Sen Nok",
          "Wang Thonglang",
        ],
        Chatuchak: ["Lat Yao", "Chomphon", "Chatuchak", "Chandrakasem"],
        "Bang Sue": ["Bang Sue", "Wong Sawang"],
        "Bang Kho Laem": [
          "Bang Kho Laem",
          "Wat Phraya Krai",
          "Bang Khlo",
          "Bang Nam Chon",
        ],
        "Suan Luang": ["Suan Luang", "Prawet", "On Nut"],
        "Don Mueang": ["Si Kan", "Don Mueang", "Saen Saep"],
        Ladkrabang: [
          "Lat Krabang",
          "Khlong Sam Prawet",
          "Khlong Ton Nun",
          "Lam Pla Thio",
          "Thap Yao",
          "Khlong Luang Phaeng",
        ],
        "Saphan Sung": ["Saphan Sung", "Ratchathewi", "Bang Kapi"], // Note: Ratchathewi is a separate district
        Prawet: ["Prawet", "Nong Bon", "Dokmai"],
        // ... (มีอีกหลายเขตในกรุงเทพฯ ซึ่งข้อมูลข้างต้นเป็นเพียงบางส่วนเท่านั้น)
      },
    },
    Ayutthaya: {
      districts: {
        "Phra Nakhon Si Ayutthaya": [
          "Khlong Sa Bua",
          "Hantra",
          "Pratu Chai",
          "Hua Ro",
          "Pho Sam Ton",
          "Pak Kran",
          "Thanu",
          "Phai Ling",
          "Wat Tum",
          "Phu Khao Thong",
          "Ban Pom",
          "Ban Ko",
          "Ban Mai",
        ],
        "Tha Ruea": [
          "Tha Ruea",
          "Pak Tha",
          "Tha Chao Sanuk",
          "Champa",
          "Thanon Khlong",
          "Cham Phli",
        ],
        "Wang Noi": [
          "Wang Noi",
          "Lam Sai",
          "Lam Ta Sao",
          "Khlong Phlu",
          "Khlong Pra Wet",
          "San Chao Rong Thong",
          "Phraem",
          "Chamaep",
        ],
        "Bang Sai": [
          "Bang Sai",
          "Khlong Khlong Khwai",
          "Ban Klang",
          "Bang Sai Phatthana",
          "Chonglom",
        ],
        Uthai: [
          "Uthai",
          "Khok Mo",
          "Nong Mai",
          "Ban Ko",
          "Pho Sao",
          "Thap Ti Lek",
        ],
        Sena: [
          "Sena",
          "Hua Wiang",
          "Bang Nom Kho",
          "Chai Na",
          "Baan Phaen",
          "Lam Sam Kaeo",
        ],
        "Bang Pahan": [
          "Bang Pahan",
          "Khlong Kaeo",
          "Pho Ro",
          "Ban Lane",
          "Wat Tan",
          "Khlong Kum",
          "Thung Makham Yong",
        ],
        "Nakhon Luang": [
          "Nakhon Luang",
          "Tha Chang",
          "Bang Rakam",
          "Khlong Sakae",
          "Khlong Phra Kaeo",
          "Bueng Plakrot",
        ],
        Phachi: ["Phachi", "Rong Chang", "Phak Hai", "Don Ya Nang"],
        "Lat Bua Luang": [
          "Lat Bua Luang",
          "Khlong Sip",
          "Phra Khao",
          "Khai Bok Wua",
        ],
        "Bang Ban": ["Bang Ban", "Bang Hak", "Sai Noi", "Thung Plakrot"],
        "Phak Hai": ["Phak Hai", "Lad Nam", "Tha Din Daeng", "Ban Luek"],
        "Maha Rat": ["Maha Rat", "Na Mai", "Tha Luang", "Bang Num Chai"],
        "Ban Phraek": ["Ban Phraek", "Khlong Noi", "Phra Kaeo"],
        "Bang Sai (Sai Noi)": [
          "Sai Noi",
          "Khlong Noi",
          "Bang Plakot",
          "Khlong Phra Ayutthaya",
        ],
        "Ban Phraek": ["Ban Phraek", "Khlong Noi", "Phra Kaeo"],
      },
    },
    Chonburi: {
      districts: {
        "Mueang Chonburi": [
          "Bang Pla Soi",
          "Makham Yong",
          "Ban Suan",
          "Nong Mai Daeng",
          "Khlong Tamru",
          "Na Pa",
          "Huai Kapi",
          "Samet",
          "Ang Sila",
          "Saen Suk",
          "Don Hua Lo",
        ],
        "Si Racha": [
          "Si Racha",
          "Sura Sak",
          "Nong Kham",
          "Bo Win",
          "Bueng",
          "Nong Kho",
        ],
        "Bang Lamung": [
          "Na Kluea",
          "Nong Prue",
          "Nong Pla Lai",
          "Huai Yai",
          "Chak Ngam",
          "Bang Lamung",
        ],
        Sattahip: [
          "Sattahip",
          "Na Chom Thian",
          "Bang Sare",
          "Phlu Ta Luang",
          "Samae San",
          "Bang Chang",
        ],
        "Ban Bueng": [
          "Ban Bueng",
          "Khlong Kio",
          "Nong Irun",
          "Nong Sam Sak",
          "Thung Khwang",
        ],
        "Phan Thong": ["Phan Thong", "Nong Hong", "Khok Sook", "Marb Pong"],
        "Bo Thong": ["Bo Thong", "That Thong", "Phan Thong", "Khlong Kio"],
        "Nong Yai": ["Nong Yai", "Khlong Phlu", "Bang Nang"],
        "Koh Si Chang": ["Tha Thewawong"], // Koh Si Chang is an island district
        "Bang Lamung (Pattaya City)": ["Nong Prue", "Nong Pla Lai"], // Specific sub-districts for Pattaya City area
        "Na Chom Thian": ["Na Chom Thian", "Bang Sare"], // Specific sub-districts for Na Chom Thian area
      },
    },
    Rayong: {
      districts: {
        "Mueang Rayong": [
          "Tha Pradu",
          "Noen Phra",
          "Choeng Noen",
          "Tapong",
          "Nam Khok",
          "Huai Pong",
          "Map Ta Phut",
          "Samnak Thong",
          "Klaeng",
          "Ban Chong",
        ],
        Klaeng: [
          "Klaeng",
          "Kong Din",
          "Wang Chan",
          "Chakbok",
          "Na Bon",
          "Thung Khwai Kin",
          "Pak Nam Pra Sae",
        ],
        "Ban Khai": [
          "Ban Khai",
          "Chang Khwang",
          "Nong Takao",
          "Ta Khan",
          "Bang But",
          "Nong Lai",
          "Khun Song",
        ],
        "Wang Chan": ["Wang Chan", "Chak Bok", "Pa Kha"],
        "Ban Chang": ["Ban Chang", "Samnak Thong", "Phla", "Samnak Ton Ngio"],
        "Pluak Daeng": ["Pluak Daeng", "Mab Yang Phon", "Nong Rai", "Ta Sit"],
        "Khao Chamao": ["Khao Chamao", "Huai Thap Mon", "Cham Khap"],
        "Nikhom Phatthana": [
          "Nikhom Phatthana",
          "Map Kha",
          "Phatthana",
          "Chak Bon",
        ],
        "Mae Ramphueng": ["Mae Ramphueng", "Chak Phong"], // A specific sub-district known for beaches
      },
    },
    Samutprakarn: {
      districts: {
        "Mueang Samut Prakan": [
          "Pak Nam",
          "Bang Mueang",
          "Tai Ban",
          "Bang Pu Mai",
          "Bang Hua Suea",
          "Bang Prong",
          "Bang Ya Phraek",
          "Bang Duea",
          "Bang Nam Chuet",
          "Khlong Dan",
          "Phraek Sa",
          "Phrasa Mai",
          "Bang Pli Yai",
          "Bang Thao",
        ],
        "Bang Phli": [
          "Bang Phli Yai",
          "Bang Chalong",
          "Nong Prue",
          "Racha Thewa",
          "Bang Pla",
          "Bang Kaeo",
        ],
        "Phra Pradaeng": [
          "Talat",
          "Bang Phung",
          "Bang Yakphra",
          "Bang Chak",
          "Bang Khru",
          "Bang Nam Phueng",
          "Song Khanong",
          "Sam Rong",
          "Bang Krasop",
        ],
        "Phra Samut Chedi": [
          "Pak Khlong Bang Pla Kot",
          "Na Kluea",
          "Ban Khlong Suan",
          "Khlong Bang Pla Kot",
          "Laem Fa Pha",
        ],
        "Bang Bo": [
          "Bang Bo",
          "Khlong Dan",
          "Khlong Suan",
          "Bang Phli Noi",
          "Khlong Khut",
        ],
        "Bang Sao Thong": ["Bang Sao Thong", "Khlong Dan", "Khlong Suan"],
      },
    },
    Chachoengsao: {
      districts: {
        "Mueang Chachoengsao": [
          "Na Mueang",
          "Khlong Nakhon Nueang Khet",
          "Tha Khai",
          "Bang Tin Pet",
          "Wang Tanot",
          "Bang Phai",
          "Bang Kaew",
          "Laem Fa Pha",
          "Salat",
          "Tha Sa-an",
          "Bang Khon Thi",
          "Khlong Luang Phaeng",
          "Khlong Udom Chonlachon",
        ],
        "Bang Khla": [
          "Bang Khla",
          "Bang Suan",
          "Tha Thong Lang",
          "Tha Sakae",
          "Tao Sut",
          "Bang Krut",
        ],
        "Ban Pho": [
          "Ban Pho",
          "Bang Khon Thi",
          "Don Sai",
          "Bang Samak",
          "Khlong Pra Wet",
          "San Phutthabat",
          "Thung Phaya Maen",
        ],
        "Bang Pakong": [
          "Bang Pakong",
          "Bang Saen",
          "Khlong Udom Chonlachon",
          "Tha Sa-an",
          "Tha Khai",
        ],
        "Phanom Sarakham": [
          "Phanom Sarakham",
          "Khao Hin Son",
          "Ban Song",
          "Phan Thong",
          "Hua Samrong",
        ],
        Ratchasan: ["Ratchasan", "Bang Kha", "Don Ket"],
        "Sanam Chai Khet": ["Sanam Chai Khet", "Thung Phaya Maen", "Tha Khai"],
        "Plaeng Yao": [
          "Plaeng Yao",
          "Wang Lek",
          "Nong Saeng",
          "Huai Chorakhe Mak",
        ],
        "Tha Takiap": ["Tha Takiap", "Khlong Takrao"],
        "Khlong Khuean": ["Khlong Khuean", "Bang Kaeo", "Bang Phra"],
        "Bang Nam Priao": [
          "Bang Nam Priao",
          "Bang Khanak",
          "Singto Thong",
          "Don Ko",
          "Don Chim Phli",
        ],
      },
    },
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ text: "", type: "" });

    try {
      console.log(JSON.stringify(formData));
      // เรียก API ด้วย fetch
      const response = await fetch(
        "https://d217-2001-fb1-8b-7ff4-14a2-f3c4-192e-73c5.ngrok-free.app/webhook/upload",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Response from API:", data);

      setMessage({ text: "ส่งข้อมูลเรียบร้อยแล้ว", type: "success" });
    } catch (error) {
      console.error("Error submitting form:", error);
      setMessage({
        text: "เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const fileType = file.name.split(".").pop()?.toLowerCase();

      // Check file type
      if (!["xlsx", "xls", "csv"].includes(fileType || "")) {
        setUploadMessage({
          text: "Please upload .xlsx files only.",
          type: "error",
        });
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

      setSelectedFile(file);
      setUploadMessage({ text: "", type: "" });
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      setUploadMessage({
        text: "Please select a file before uploading.",
        type: "error",
      });
      return;
    }

    setIsUploading(true);
    setUploadMessage({ text: "", type: "" });

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      // In a real implementation, this would send the file to your backend API
      // which would process it and update the Google Sheet
      const response = await fetch(
        "https://d217-2001-fb1-8b-7ff4-14a2-f3c4-192e-73c5.ngrok-free.app/webhook/upload-file",
        {
          method: "POST",
          body: formData,
        },
      );

      if (response.ok) {
        setUploadMessage({
          text: "The file has been uploaded and processed successfully.",
          type: "success",
        });
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        const error = await response.text();
        setUploadMessage({
          text: `An error occurred.: ${error}`,
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadMessage({
        text: "An error occurred while uploading the file.",
        type: "error",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <MobileNavbar currentPage="upload" />

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Add Property Information
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Form Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-2 mb-6">
                <Plus className="text-blue-600" />
                <h2 className="text-xl font-semibold">Add data with forms</h2>
              </div>

              {message.text && (
                <div
                  className={`mb-4 p-3 rounded-md ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                >
                  {message.text}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="propertyId"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Property ID (ATS) *
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
                    <label
                      htmlFor="landlordName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Company or Landlord name *
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
                  <label
                    htmlFor="landlordContact"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Landlord Contact *
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
                    <label
                      htmlFor="buildingSize"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Building size (in SQM) *
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
                    <label
                      htmlFor="type"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Factory or Warehouse *
                    </label>
                    <select
                      id="type"
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="warehouse">warehouse</option>
                      <option value="factory">factory</option>
                      <option value="both">both</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="rentOrSale"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Rent or Sale *
                    </label>
                    <select
                      id="rentOrSale"
                      name="rentOrSale"
                      value={formData.rentOrSale}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="rent">rent</option>
                      <option value="sale">sale</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Price *
                  </label>
                  <input
                    type="text"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex THB 35,000"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label
                      htmlFor="province"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Province *
                    </label>
                    <select
                      name="province"
                      value={selectedProvince}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={(e) => {
                        const province = e.target.value;
                        setSelectedProvince(province);
                        setSelectedDistrict("");
                        setSelectedSubDistrict("");
                        setFormData((prev) => ({ ...prev, province }));
                      }}
                    >
                      <option value="" className="text-sm" disabled>
                        {" "}
                        Choose Province{" "}
                      </option>
                      {Object.keys(locationData).map((province) => (
                        <option key={province} value={province}>
                          {province}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="district"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      District *
                    </label>
                    {selectedProvince && (
                      <select
                        name="district"
                        value={selectedDistrict}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => {
                          const district = e.target.value;
                          setSelectedDistrict(district);
                          setSelectedSubDistrict("");
                          setFormData((prev) => ({ ...prev, district }));
                        }}
                      >
                        <option value="" className="text-sm" disabled>
                          {" "}
                          Choose District{" "}
                        </option>
                        {Object.keys(
                          locationData[selectedProvince].districts,
                        ).map((district) => (
                          <option key={district} value={district}>
                            {district}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="subDistrict"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Sub District *
                    </label>
                    {selectedDistrict && (
                      <select
                        name="subDistrict"
                        value={selectedSubDistrict}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => {
                          const subDistrict = e.target.value;
                          setSelectedSubDistrict(subDistrict);
                          setFormData((prev) => ({ ...prev, subDistrict }));
                        }}
                      >
                        <option value="" className="text-sm" disabled>
                          {" "}
                          Choose Sub District{" "}
                        </option>
                        {locationData[selectedProvince].districts[
                          selectedDistrict
                        ].map((sub) => (
                          <option key={sub} value={sub}>
                            {sub}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="mapUrl"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Google Maps Link *
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
                  <label
                    htmlFor="coordinates"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Location (Latitude, Longitude) *
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
                  <label
                    htmlFor="websiteLink"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Website Link *
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
                      isSubmitting
                        ? "opacity-70 cursor-not-allowed"
                        : "hover:bg-blue-700"
                    }`}
                  >
                    {isSubmitting ? "Saving..." : "Save Infomation"}
                  </button>
                </div>
              </form>
            </div>

            {/* File Upload Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-2 mb-6">
                <FileSpreadsheet className="text-blue-600" />
                <h2 className="text-xl font-semibold">Upload data files</h2>
              </div>

              {uploadMessage.text && (
                <div
                  className={`mb-4 p-3 rounded-md ${uploadMessage.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                >
                  {uploadMessage.text}
                </div>
              )}

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center">
                <FileSpreadsheet className="text-gray-400 mb-4" size={48} />
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  Upload Excel (.xlsx) file
                </h3>
                <p className="text-gray-500 mb-4">
                  Drag and drop files here or click to select files.
                </p>

                <input
                  type="file"
                  id="fileUpload"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".xlsx" //".xlsx,.xls,.csv"
                  className="hidden"
                />

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-md font-medium transition-all duration-200"
                >
                  Choose File
                </button>

                {selectedFile && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-md w-full">
                    <p className="text-blue-700 font-medium">
                      {selectedFile.name}
                    </p>
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
                    isUploading || !selectedFile
                      ? "opacity-70 cursor-not-allowed"
                      : "hover:bg-blue-700"
                  }`}
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <UploadIcon size={18} />
                      Upload File
                    </>
                  )}
                </button>
              </div>

              <div className="mt-6 border-t pt-6">
                <h3 className="text-lg font-medium text-gray-700 mb-3">
                  File format
                </h3>
                <p className="text-gray-600 mb-3">
                  A valid file format should have the columns in the following
                  order:
                </p>
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
                  Note: Sample files are available for download.{" "}
                  <a
                    href="/template.xlsx"
                    className="text-blue-600 hover:underline"
                  >
                    Here
                  </a>
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
