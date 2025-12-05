export const USGS_API_URL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson';

// Approximate Bounding Box for Bangladesh (and slightly surrounding areas for context)
const BANGLADESH_BOUNDS = {
    minLat: 20.0,
    maxLat: 27.0,
    minLng: 88.0,
    maxLng: 93.0
};

export const fetchEarthquakeData = async () => {
    try {
        const response = await fetch(USGS_API_URL);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching earthquake data:", error);
        return null;
    }
};

export const filterForBangladesh = (features) => {
    if (!features) return [];

    return features.filter(feature => {
        const [lng, lat] = feature.geometry.coordinates;
        const isInside = (
            lat >= BANGLADESH_BOUNDS.minLat &&
            lat <= BANGLADESH_BOUNDS.maxLat &&
            lng >= BANGLADESH_BOUNDS.minLng &&
            lng <= BANGLADESH_BOUNDS.maxLng
        );
        return isInside;
    });
};

export const getMagnitudeColor = (mag) => {
    if (mag >= 6.0) return '#ff2a2a'; // Red - Critical
    if (mag >= 4.5) return '#ffae00'; // Orange - Warning
    return '#00f3ff'; // Cyan - Normal
};

export const fetchHistoricalData = async () => {
    // 30 days ago
    const endTime = new Date();
    const startTime = new Date();
    startTime.setDate(startTime.getDate() - 30);

    const startStr = startTime.toISOString();
    const endStr = endTime.toISOString();

    // Query for Bangladesh region specifically to keep payload light(er)
    const url = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${startStr}&endtime=${endStr}&minlatitude=20&maxlatitude=27&minlongitude=88&maxlongitude=93&orderby=time`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        return data.features;
    } catch (error) {
        console.error("Error fetching historical data:", error);
        return [];
    }
};
