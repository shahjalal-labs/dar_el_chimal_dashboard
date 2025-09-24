"use client";

import {
    useLoadScript,
    GoogleMap,
    Marker,
    Autocomplete,
} from "@react-google-maps/api";
import { useState, useRef, useCallback, useEffect } from "react";

const containerStyle = {
    width: "100%",
    height: "400px",
};

const defaultCenter = {
    lat: 34.0209,
    lng: -6.8416,
};

type Props = {
    defaultLocation?: { address: string; latitude: number; longitude: number };
    onLocationSelect: (lat: number, lng: number, address: string) => void;
};

export default function GoogleMapSelector({
    onLocationSelect,
    defaultLocation,
}: Props) {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: "AIzaSyA67631C8V946h8M9FhhEnrvPXETBVsQBk"!,
        libraries: ["places"],
    });


    const [marker, setMarker] = useState<{ lat: number; lng: number } | null>(
        defaultLocation
            ? { lat: defaultLocation.latitude, lng: defaultLocation.longitude }
            : null
    );

    const [center, setCenter] = useState<{ lat: number; lng: number }>(
        defaultLocation
            ? { lat: defaultLocation.latitude, lng: defaultLocation.longitude }
            : defaultCenter
    );

    useEffect(() => {
        if (defaultLocation) {
            setMarker({
                lat: defaultLocation.latitude,
                lng: defaultLocation.longitude,
            });
            setCenter({
                lat: defaultLocation.latitude,
                lng: defaultLocation.longitude,
            });
        }
    }, [defaultLocation]);

    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
    const mapRef = useRef<google.maps.Map | null>(null);

    const onMapLoad = useCallback((map: google.maps.Map) => {
        mapRef.current = map;
    }, []);

    // const handlePlaceChanged = () => {
    //   const place: any = autocompleteRef.current?.getPlace();
    //   if (place?.geometry?.location) {
    //     const lat = place.geometry.location.lat();
    //     const lng = place.geometry.location.lng();

    //     setCenter({ lat, lng });
    //     setMarker({ lat, lng });
    //     mapRef.current?.panTo({ lat, lng });

    //     const geocoder = new google.maps.Geocoder();
    //     geocoder.geocode({ location: { lat, lng } }, (results) => {
    //       const address = results?.[0]?.formatted_address || "";
    //       onLocationSelect(lat, lng, address);
    //     });
    //   }
    // };

    const handlePlaceChanged = () => {
        const place = autocompleteRef.current?.getPlace();
        if (place?.geometry?.location) {
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();

            setCenter({ lat, lng });
            setMarker({ lat, lng });
            mapRef.current?.panTo({ lat, lng });

            const placeName = place.name || "";
            const geocoder = new google.maps.Geocoder();

            geocoder.geocode({ location: { lat, lng } }, (results) => {
                const address = results?.[0]?.formatted_address || "";
                const finalAddress = placeName ? `${placeName}, ${address}` : address;

                onLocationSelect(lat, lng, finalAddress);
            });
        }
    };

    const handleMapClick = async (e: google.maps.MapMouseEvent) => {
        const lat = e.latLng?.lat();
        const lng = e.latLng?.lng();
        if (lat && lng) {
            setMarker({ lat, lng });
            setCenter({ lat, lng });

            const geocoder = new google.maps.Geocoder();
            const { results } = await geocoder.geocode({ location: { lat, lng } });
            const address = results[0]?.formatted_address || "";

            onLocationSelect(lat, lng, address);
        }
    };

    if (!isLoaded) return <div>Loading map...</div>;

    return (
        <div className="mb-4">
            <Autocomplete
                onLoad={(ref) => (autocompleteRef.current = ref)}
                onPlaceChanged={handlePlaceChanged}
            >
                <input
                    type="text"
                    placeholder="Search a location"
                    className="w-full mb-2 px-4 py-2 border rounded-lg"
                />
            </Autocomplete>

            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={14}
                onClick={handleMapClick}
                onLoad={onMapLoad}
            >
                {marker && <Marker position={marker} />}
            </GoogleMap>
        </div>
    );
}