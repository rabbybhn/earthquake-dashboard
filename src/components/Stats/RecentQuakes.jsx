import React from 'react';
import './RecentQuakes.css';
import './RecentQuakesExtra.css';

const RecentQuakes = ({ earthquakes, isGlobal, onToggleGlobal }) => {
    return (
        <div className="glass-panel recent-quakes">
            <div className="panel-header">
                <h3 className="panel-title">LIVE FEED</h3>
                <button
                    className={`toggle-btn ${isGlobal ? 'active' : ''}`}
                    onClick={onToggleGlobal}
                    title={isGlobal ? "Showing Global Quakes" : "Showing Bangladesh Region"}
                >
                    {isGlobal ? 'GLOBAL' : 'LOCAL'}
                </button>
            </div>
            <div className="quakes-list">
                {earthquakes.length === 0 ? (
                    <div className="no-data">Scanning for seismic activity...</div>
                ) : (
                    earthquakes.map((quake) => (
                        <QuakeItem key={quake.id} quake={quake} />
                    ))
                )}
            </div>
        </div>
    );
};

const QuakeItem = ({ quake }) => {
    const { mag, place, time } = quake.properties;
    const date = new Date(time);

    let magClass = 'mag-low';
    if (mag >= 4.5) magClass = 'mag-med';
    if (mag >= 6.0) magClass = 'mag-high';

    return (
        <div className="quake-item">
            <div className={`quake-mag ${magClass}`}>
                {mag.toFixed(1)}
            </div>
            <div className="quake-info">
                <div className="quake-place">{place}</div>
                <div className="quake-time">{date.toLocaleTimeString()}</div>
            </div>
        </div>
    );
};

export default RecentQuakes;
