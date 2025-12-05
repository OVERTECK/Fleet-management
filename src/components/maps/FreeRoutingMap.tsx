'use client';

import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Исправляем иконки Leaflet (обязательно!)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface RoutePoint {
    latitude: number;
    longitude: number;
    address?: string;
}

interface FreeRoutingMapProps {
    routePoints: RoutePoint[];
    onRoutePointsChange: (points: RoutePoint[]) => void;
    onDistanceCalculated?: (distanceKm: number) => void;
    height?: string;
}

function MapClickHandler({ onClick }: { onClick: (lat: number, lng: number) => void }) {
    useMapEvents({
        click: (e) => {
            onClick(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
}

export default function FreeRoutingMap({
    routePoints,
    onRoutePointsChange,
    onDistanceCalculated,
    height = '500px'
}: FreeRoutingMapProps) {
    const [polyline, setPolyline] = useState<[number, number][]>([]);

    // Бесплатный маршрут через публичный GraphHopper (работает без ключа!)
    const calculateRoute = async (points: RoutePoint[]) => {
        if (points.length < 2) {
            setPolyline([]);
            onDistanceCalculated?.(0);
            return;
        }

        try {
            const res = await fetch('https://graphhopper.com/api/1/route', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    points: points.map(p => [p.longitude, p.latitude]),
                    profile: 'car',
                    locale: 'ru',
                    instructions: false,
                    points_encoded: false,
                    key: ''
                })
            });

            const data = await res.json();

            if (data.paths?.[0]) {
                const coords = data.paths[0].points.coordinates.map((c: number[]) => [c[1], c[0]] as [number, number]);
                const distanceKm = Math.round(data.paths[0].distance / 1000);

                setPolyline(coords);
                onDistanceCalculated?.(distanceKm);
            }
        } catch (err) {
            console.warn('Маршрут не построен — интернет или лимит. Рисуем прямую.');
            setPolyline(points.map(p => [p.latitude, p.longitude] as [number, number]));
            onDistanceCalculated?.(0);
        }
    };

    useEffect(() => {
        if (routePoints.length >= 2) {
            calculateRoute(routePoints);
        } else {
            setPolyline([]);
            onDistanceCalculated?.(0);
        }
    }, [routePoints]);

    const handleClick = (lat: number, lng: number) => {
        onRoutePointsChange([...routePoints, { latitude: lat, longitude: lng }]);
    };

    const removePoint = (index: number) => {
        onRoutePointsChange(routePoints.filter((_, i) => i !== index));
    };

    return (
        <MapContainer
            center={[55.7558, 37.6173]}
            zoom={10}
            style={{ height, width: '100%', borderRadius: '8px' }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap'
            />

            <MapClickHandler onClick={handleClick} />

            {routePoints.map((point, idx) => (
                <Marker
                    key={idx}
                    position={[point.latitude, point.longitude]}
                    draggable={true}
                    eventHandlers={{
                        dragend: (e) => {
                            const marker = e.target;
                            const pos = marker.getLatLng();
                            const updated = [...routePoints];
                            updated[idx] = { latitude: pos.lat, longitude: pos.lng };
                            onRoutePointsChange(updated);
                        },
                    }}
                >
                    <Popup>
                        Точка {idx + 1}
                        <br />
                        {point.latitude.toFixed(5)}, {point.longitude.toFixed(5)}
                        <br />
                        <button
                            onClick={() => removePoint(idx)}
                            style={{
                                marginTop: '8px',
                                padding: '4px 8px',
                                background: '#ff4444',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Удалить точку
                        </button>
                    </Popup>
                </Marker>
            ))}

            {polyline.length > 1 && (
                <Polyline
                    positions={polyline}
                    color="#1976d2"
                    weight={6}
                    opacity={0.8}
                />
            )}
        </MapContainer>
    );
}