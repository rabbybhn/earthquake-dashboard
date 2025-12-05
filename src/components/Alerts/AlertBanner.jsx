import React from 'react';
import { getMagnitudeColor } from '../../services/earthquakeService';
import './AlertBanner.css'; // We'll assume component-specific CSS or use global utilities

const AlertBanner = ({ earthquake }) => {
    if (!earthquake) return null;

    const { mag, place, time } = earthquake.properties;

    // Alert threshold: Mag >= 4.5
    if (mag < 4.5) return null;

    const date = new Date(time).toLocaleString();

    return (
        <div className="alert-banner" role="alert">
            <div className="alert-icon">⚠️</div>
            <div className="alert-content">
                <h2 className="alert-title glow-text">EARTHQUAKE DETECTED</h2>
                <div className="alert-details">
                    <span className="alert-mag">MAGNITUDE {mag.toFixed(1)}</span>
                    <span className="alert-loc">{place}</span>
                </div>
                <div className="alert-time">{date}</div>
            </div>
        </div>
    );
};

export default AlertBanner;
