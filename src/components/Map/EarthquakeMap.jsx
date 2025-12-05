import React, { useState, useEffect } from 'react';
import { Map, AdvancedMarker, useMap } from '@vis.gl/react-google-maps';
import { getMagnitudeColor } from '../../services/earthquakeService';

const MAP_STYLE_DARK = [
    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
    {
        featureType: "administrative.locality",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
    },
    {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
    },
    {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [{ color: "#263c3f" }],
    },
    {
        featureType: "poi.park",
        elementType: "labels.text.fill",
        stylers: [{ color: "#6b9a76" }],
    },
    {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "#38414e" }],
    },
    {
        featureType: "road",
        elementType: "geometry.stroke",
        stylers: [{ color: "#212a37" }],
    },
    {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [{ color: "#9ca5b3" }],
    },
    {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [{ color: "#746855" }],
    },
    {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [{ color: "#1f2835" }],
    },
    {
        featureType: "road.highway",
        elementType: "labels.text.fill",
        stylers: [{ color: "#f3d19c" }],
    },
    {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#17263c" }],
    },
    {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [{ color: "#515c6d" }],
    },
    {
        featureType: "water",
        elementType: "labels.text.stroke",
        stylers: [{ color: "#17263c" }],
    },
];

const EarthquakeMap = ({ earthquakes, userLocation }) => {
    const map = useMap();

    // Center on Bangladesh
    const defaultCenter = { lat: 23.68, lng: 90.37 };

    useEffect(() => {
        if (map && userLocation) {
            map.panTo(userLocation);
            map.setZoom(10);
        }
    }, [map, userLocation]);

    return (
        <Map
            defaultCenter={defaultCenter}
            defaultZoom={7} // Zoom level for Bangladesh
            gestureHandling={'greedy'}
            disableDefaultUI={true} // Minimal look
            styles={MAP_STYLE_DARK}
            mapId={'DEMO_MAP_ID'} // Required for AdvancedMarker, can be any string for dev
            className="map-container"
        >
            {/* User Location Marker */}
            {userLocation && (
                <AdvancedMarker position={userLocation} title="Your Location">
                    <div style={{
                        width: '16px',
                        height: '16px',
                        backgroundColor: '#4285F4',
                        borderRadius: '50%',
                        border: '2px solid white',
                        boxShadow: '0 0 10px #4285F4',
                        animation: 'pulse-blue 2s infinite'
                    }} />
                </AdvancedMarker>
            )}

            {earthquakes.map((quake) => {
                const { geometry, properties, id } = quake;
                const [lng, lat] = geometry.coordinates;
                const color = getMagnitudeColor(properties.mag);

                return (
                    <AdvancedMarker
                        key={id}
                        position={{ lat, lng }}
                        title={properties.title}
                    >
                        <div
                            style={{
                                width: `${Math.max(10, properties.mag * 4)}px`,
                                height: `${Math.max(10, properties.mag * 4)}px`,
                                backgroundColor: color,
                                borderRadius: '50%',
                                opacity: 0.8,
                                boxShadow: `0 0 ${properties.mag * 2}px ${color}`,
                                border: '2px solid rgba(255,255,255,0.8)'
                            }}
                        />
                    </AdvancedMarker>
                );
            })}
        </Map>
    );
};

export default EarthquakeMap;
