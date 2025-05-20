import React from "react";
import Select from "react-select";
import { RouteOption } from "../types";

interface PropertySelectProps {
  options: RouteOption[];
  value: RouteOption[];
  onChange: (selected: RouteOption[]) => void;
}

const PropertySelect: React.FC<PropertySelectProps> = ({
  options,
  value,
  onChange,
}) => {
  return (
    <Select
      isMulti
      options={options}
      value={value}
      onChange={(selected) => onChange(selected as RouteOption[])}
      placeholder="Select the place you want to visit..."
      noOptionsMessage={() => "ไม่พบข้อมูลที่ตรงกับการค้นหา"}
      classNamePrefix="property-select"
      className="basic-multi-select"
      styles={{
        control: (base) => ({
          ...base,
          borderColor: "#e5e7eb",
          "&:hover": {
            borderColor: "#d1d5db",
          },
          boxShadow: "none",
          borderRadius: "0.375rem",
          padding: "2px",
        }),
        multiValue: (base) => ({
          ...base,
          backgroundColor: "rgba(59, 130, 246, 0.1)",
          borderRadius: "0.25rem",
          border: "1px solid rgba(59, 130, 246, 0.3)",
        }),
        multiValueLabel: (base) => ({
          ...base,
          color: "#3b82f6",
          fontSize: "0.875rem",
          padding: "0 4px",
        }),
        multiValueRemove: (base) => ({
          ...base,
          color: "#3b82f6",
          ":hover": {
            backgroundColor: "rgba(59, 130, 246, 0.2)",
            color: "#2563eb",
          },
        }),
        menu: (base) => ({
          ...base,
          zIndex: 10,
          borderRadius: "0.375rem",
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        }),
        option: (base, { isFocused, isSelected }) => ({
          ...base,
          backgroundColor: isSelected
            ? "#3b82f6"
            : isFocused
              ? "rgba(59, 130, 246, 0.1)"
              : undefined,
          color: isSelected ? "white" : "#374151",
          ":active": {
            backgroundColor: isSelected ? "#2563eb" : "rgba(59, 130, 246, 0.2)",
          },
        }),
      }}
    />
  );
};

export default PropertySelect;
