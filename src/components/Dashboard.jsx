import React, { useState, useEffect } from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';
import EarthquakeMap from './Map/EarthquakeMap';
import RecentQuakes from './Stats/RecentQuakes';
import HistoryList from './Stats/HistoryList';
import EarthquakeModal from './Details/EarthquakeModal';
import AlertBanner from './Alerts/AlertBanner';
import { fetchEarthquakeData, filterForBangladesh, fetchHistoricalData } from '../services/earthquakeService';
import { MOCK_QUAKE } from '../services/mockData';
import './Dashboard.css';
import './DashboardExtra.css';

// Try to get key from env, but provide a fallback or helpful error if missing.
const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

const Dashboard = () => {
    const [earthquakes, setEarthquakes] = useState([]);
    const [filteredQuakes, setFilteredQuakes] = useState([]); // Focused on Bangladesh
    const [displayedQuakes, setDisplayedQuakes] = useState([]); // What is shown in list
    const [historyQuakes, setHistoryQuakes] = useState([]); // 30-day history // New state
    const [isGlobal, setIsGlobal] = useState(false); // Toggle state
    const [userLocation, setUserLocation] = useState(null); // { lat, lng }
    const [selectedQuake, setSelectedQuake] = useState(null); // For Modal // New state

    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState(null);

    const fetchData = async () => {
        setLoading(true);

        // Fetch live data
        const data = await fetchEarthquakeData();
        if (data && data.features) {
            const allQuakes = data.features;
            const bdQuakes = filterForBangladesh(allQuakes);

            // Inject Mock Data if list is empty, for demonstration purposes as per plan
            if (bdQuakes.length === 0) {
                // Add a recent one and an old one just to show UI if empty
                bdQuakes.push(MOCK_QUAKE);
            }

            setEarthquakes(allQuakes);
            setFilteredQuakes(bdQuakes);
            setDisplayedQuakes(isGlobal ? allQuakes : bdQuakes);
            setLastUpdated(new Date());
        }

        // Fetch historical data (only once or less frequent, but fine here)
        const history = await fetchHistoricalData();
        if (history) {
            setHistoryQuakes(history);
        }

        setLoading(false);
    };

    const handleLocateMe = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                (error) => {
                    console.error("Error getting location:", error);
                    alert("Could not access your location.");
                }
            );
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    };

    const toggleGlobal = () => {
        setIsGlobal(!isGlobal);
    };

    useEffect(() => {
        setDisplayedQuakes(isGlobal ? earthquakes : filteredQuakes);
    }, [isGlobal, earthquakes, filteredQuakes]);

    useEffect(() => {
        fetchData();
        // Poll every 5 minutes
        const interval = setInterval(fetchData, 300000);
        return () => clearInterval(interval);
    }, []);

    const latestSignificant = filteredQuakes.find(q => q.properties.mag >= 4.5);

    return (
        <APIProvider apiKey={API_KEY}>
            <div className="dashboard-container">
                {/* Header Section */}
                <header className="dashboard-header glass-panel">
                    <div className="header-brand">
                        <h1 className="glow-text">SEISMIC <span style={{ color: 'var(--primary-color)' }}>WATCH</span> BD</h1>
                    </div>
                    <div className="header-status">
                        <button className="status-item btn-icon" onClick={handleLocateMe} title="Find My Location">
                            <span className="label">LOCATE ME</span>
                            <span className="value">📍</span>
                        </button>
                        <div className="status-item">
                            <span className="label">STATUS</span>
                            <span className="value active">LIVE MONITORING</span>
                        </div>
                        <div className="status-item">
                            <span className="label">LAST UPDATE</span>
                            <span className="value">{lastUpdated ? lastUpdated.toLocaleTimeString() : '...'}</span>
                        </div>
                    </div>
                </header>

                {/* Alert Section */}
                {latestSignificant && (
                    <div className="dashboard-alert">
                        <AlertBanner earthquake={latestSignificant} />
                    </div>
                )}

                {/* Main Content Grid */}
                <div className="dashboard-content">
                    <div className="map-section glass-panel">
                        <EarthquakeMap earthquakes={displayedQuakes} userLocation={userLocation} />
                        {/* Overlay stats or controls could go here */}
                    </div>

                    <aside className="stats-section">
                        <RecentQuakes
                            earthquakes={displayedQuakes}
                            isGlobal={isGlobal}
                            onToggleGlobal={toggleGlobal}
                        />

                        {/* History Section */}
                        <HistoryList
                            historyData={historyQuakes}
                            onSelectQuake={setSelectedQuake}
                        />
                    </aside>
                </div>

                {/* Modal */}
                {selectedQuake && (
                    <EarthquakeModal
                        quake={selectedQuake}
                        onClose={() => setSelectedQuake(null)}
                    />
                )}
            </div>
        </APIProvider>
    );
};

export default Dashboard;
