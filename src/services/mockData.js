// Mock data because real-time earthquakes in Bangladesh are rare, we need to see the UI working.
export const MOCK_QUAKE = {
    type: "Feature",
    properties: {
        mag: 5.2,
        place: "24km N of Sylhet, Bangladesh",
        time: Date.now() - 3600000, // 1 hour ago
        url: "https://earthquake.usgs.gov/earthquakes/eventpage/custom",
        title: "M 5.2 - 24km N of Sylhet, Bangladesh"
    },
    geometry: {
        type: "Point",
        coordinates: [91.8, 24.9, 10]
    },
    id: "mock1"
};
