'use client';

import { useEffect, useState } from 'react';
import {
    YMaps,
    Map,
    Placemark,
    Polyline,
    ZoomControl,
    GeolocationControl,
} from '@pbe/react-yandex-maps';

interface RoutePoint {
    latitude: number;
    longitude: number;
    address?: string;
}

interface FreeRoutingMapYandexProps {
    routePoints: RoutePoint[];
    onRoutePointsChange: (points: RoutePoint[]) => void;
    onDistanceCalculated?: (distanceKm: number) => void;
    height?: string;
}

export default function FreeRoutingMapYandex({
    routePoints,
    onRoutePointsChange,
    onDistanceCalculated,
    height = '500px',
}: FreeRoutingMapYandexProps) {
    const [routeCoords, setRouteCoords] = useState<number[][]>([]);

    const buildRoute = async (points: RoutePoint[]) => {
        if (points.length < 2) {
            setRouteCoords([]);
            onDistanceCalculated?.(0);
            return;
        }

        try {
            const pointsParam = points
                .map(p => `${p.longitude},${p.latitude}`)
                .join('/');

            const response = await fetch(
                `https://api.routing.yandex.net/v2/route?waypoints=${pointsParam}&mode=driving&apikey=`
            );
            const data = await response.json();

            if (data.routes?.[0]?.legs) {
                const coordinates: number[][] = data.routes[0].geometry.coordinates;
                const distanceMeters = data.routes[0].distance.value;
                const distanceKm = Math.round(distanceMeters / 1000);

                setRouteCoords(coordinates);
                onDistanceCalculated?.(distanceKm);
            }
        } catch (err) {
            console.warn('Не удалось построить маршрут через Yandex, рисуем прямые линии');
            setRouteCoords(points.map(p => [p.latitude, p.longitude]));
            onDistanceCalculated?.(0);
        }
    };

    useEffect(() => {
        if (routePoints.length >= 2) {
            buildRoute(routePoints);
        } else {
            setRouteCoords([]);
            onDistanceCalculated?.(0);
        }
    }, [routePoints]);

    const handleMapClick = (e: any) => {
        const coords = e.get('coords');
        const [lat, lng] = coords;
        onRoutePointsChange([...routePoints, { latitude: lat, longitude: lng }]);
    };

    const handleDragEnd = (e: any, index: number) => {
        const coords = e.get('target').getCoords();
        const [lat, lng] = coords;
        const updated = [...routePoints];
        updated[index] = { ...updated[index], latitude: lat, longitude: lng };
        onRoutePointsChange(updated);
    };

    const removePoint = (index: number) => {
        onRoutePointsChange(routePoints.filter((_, i) => i !== index));
    };

    return (
        <YMaps query={{ lang: 'ru_RU' }}>
            <div style={{ height, width: '100%', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <Map
                    width="100%"
                    height="100%"
                    defaultState={{
                        center: [55.7558, 37.6173], // Москва
                        zoom: 10,
                        controls: [],
                    }}
                    onClick={handleMapClick}
                    modules={['geoObject.addon.balloon']}
                >
                    <ZoomControl options={{ position: { right: 10, top: 100 } }} />
                    <GeolocationControl options={{ position: { left: 10, top: 100 } }} />

                    {/* Маркеры */}
                    {routePoints.map((point, idx) => (
                        <Placemark
                            key={idx}
                            geometry={[point.latitude, point.longitude]}
                            properties={{
                                hintContent: `Точка ${idx + 1}`,
                                balloonContent: `
                                    <div style="padding:10px; font-family:system-ui">
                                        <strong>Точка ${idx + 1}</strong><br/>
                                        ${point.latitude.toFixed(5)}, ${point.longitude.toFixed(5)}
                                        <br/><br/>
                                        <button onclick="window.removePoint(${idx})" 
                                                style="background:#ff4444;color:white;border:none;padding:6px 12px;border-radius:4px;cursor:pointer">
                                            Удалить точку
                                        </button>
                                    </div>
                                `,
                            }}
                            options={{
                                preset: idx === 0 ? 'islands#greenDotIcon' : idx === routePoints.length - 1 ? 'islands#redDotIcon' : 'islands#blueDotIcon',
                                draggable: true,
                            }}
                            instanceRef={(ref: any) => {
                                if (ref) {
                                    (window as any).removePoint = removePoint;
                                }
                            }}
                            onDragend={(e: any) => handleDragEnd(e, idx)}
                        />
                    ))}

                    {/* Полилиния маршрута */}
                    {routeCoords.length > 1 && (
                        <Polyline
                            geometry={routeCoords}
                            options={{
                                strokeColor: '#1976d2',
                                strokeWidth: 6,
                                strokeOpacity: 0.9,
                            }}
                        />
                    )}
                </Map>
            </div>
        </YMaps>
    );
}