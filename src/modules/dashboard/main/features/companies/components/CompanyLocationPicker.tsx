import React from "react";
import { MapPin, Maximize2 } from "lucide-react";

interface Props {
    locationType: "map" | "latlng" | "link";
    onChangeType: (type: "map" | "latlng" | "link") => void;
    latitude: string;
    longitude: string;
    locationLink: string;
    onChangeLatitude: (val: string) => void;
    onChangeLongitude: (val: string) => void;
    onChangeLocationLink: (val: string) => void;
}

export const CompanyLocationPicker: React.FC<Props> = ({
    locationType,
    onChangeType,
    latitude,
    longitude,
    locationLink,
    onChangeLatitude,
    onChangeLongitude,
    onChangeLocationLink,
}) => {
    return (
        <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-[#0F172A]">
                Choose how to enter the location
            </h4>

            {/* Radio options */}
            <div className="flex flex-wrap items-center gap-6 text-xs text-[#334155]">
                <label className="flex items-center gap-2 cursor-pointer font-medium">
                    <input
                        type="radio"
                        name="locationType"
                        value="map"
                        checked={locationType === "map"}
                        onChange={() => onChangeType("map")}
                        className="w-4 h-4 text-[#2563EB] focus:ring-[#2563EB]/20 cursor-pointer"
                    />
                    <span>Pick it on the map</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-medium">
                    <input
                        type="radio"
                        name="locationType"
                        value="latlng"
                        checked={locationType === "latlng"}
                        onChange={() => onChangeType("latlng")}
                        className="w-4 h-4 text-[#2563EB] focus:ring-[#2563EB]/20 cursor-pointer"
                    />
                    <span>Enter latitude and longitude</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-medium">
                    <input
                        type="radio"
                        name="locationType"
                        value="link"
                        checked={locationType === "link"}
                        onChange={() => onChangeType("link")}
                        className="w-4 h-4 text-[#2563EB] focus:ring-[#2563EB]/20 cursor-pointer"
                    />
                    <span>Attach a location link</span>
                </label>
            </div>

            {/* Map Mode */}
            {locationType === "map" && (
                <div className="relative h-52 rounded-2xl border border-[#E2E8F0] overflow-hidden bg-[#E2E8F0]/40 flex items-center justify-center">
                    <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:16px_16px]" />
                    <div className="absolute top-3 left-3 flex items-center bg-white rounded-lg shadow-sm border border-[#E2E8F0] p-0.5 text-xs">
                        <button
                            type="button"
                            className="px-3 py-1 bg-[#2563EB] text-white font-medium rounded-md shadow-xs"
                        >
                            Map
                        </button>
                        <button
                            type="button"
                            className="px-3 py-1 text-[#64748B] hover:text-[#0F172A] font-medium"
                        >
                            Satellite
                        </button>
                    </div>
                    <button
                        type="button"
                        className="absolute top-3 right-3 p-1.5 bg-white text-[#64748B] hover:text-[#0F172A] rounded-lg shadow-sm border border-[#E2E8F0]"
                        aria-label="Fullscreen map"
                    >
                        <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                    <div className="relative flex flex-col items-center">
                        <MapPin className="w-8 h-8 text-[#DC2626] drop-shadow-md animate-bounce" />
                        <span className="px-2 py-0.5 bg-[#0F172A] text-white rounded text-[10px] font-semibold mt-1">
                            Riyadh, Saudi Arabia
                        </span>
                    </div>
                </div>
            )}

            {/* Lat/Long Mode */}
            {locationType === "latlng" && (
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-2">
                        <label className="text-[10px] font-medium text-[#64748B] block">
                            Latitude
                        </label>
                        <input
                            type="text"
                            value={latitude}
                            onChange={(e) => onChangeLatitude(e.target.value)}
                            className="w-full bg-transparent outline-none text-xs font-medium text-[#0F172A]"
                        />
                    </div>
                    <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-2">
                        <label className="text-[10px] font-medium text-[#64748B] block">
                            Longitude
                        </label>
                        <input
                            type="text"
                            value={longitude}
                            onChange={(e) => onChangeLongitude(e.target.value)}
                            className="w-full bg-transparent outline-none text-xs font-medium text-[#0F172A]"
                        />
                    </div>
                </div>
            )}

            {/* Link Mode */}
            {locationType === "link" && (
                <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-2">
                    <label className="text-[10px] font-medium text-[#64748B] block">
                        Location URL
                    </label>
                    <input
                        type="url"
                        value={locationLink}
                        onChange={(e) => onChangeLocationLink(e.target.value)}
                        placeholder="https://maps.google.com/..."
                        className="w-full bg-transparent outline-none text-xs font-medium text-[#0F172A]"
                    />
                </div>
            )}
        </div>
    );
};
