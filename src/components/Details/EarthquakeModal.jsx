import React from 'react';
import { getMagnitudeColor } from '../../services/earthquakeService';
import './EarthquakeModal.css';

const EarthquakeModal = ({ quake, onClose }) => {
    if (!quake) return null;

    const { mag, place, time, url, detail, depth } = quake.properties;
    const [lng, lat, coordsDepth] = quake.geometry.coordinates;
    const date = new Date(time);

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content glass-panel" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>&times;</button>

                <div className="modal-header">
                    <h2 className="glow-text">EVENT DETAILS</h2>
                </div>

                <div className="modal-body">
                    <div className="modal-stat-row">
                        <div className="modal-stat large">
                            <span className="label">MAGNITUDE</span>
                            <span className="value" style={{ color: getMagnitudeColor(mag), fontSize: '2.5rem' }}>
                                {mag.toFixed(1)}
                            </span>
                        </div>
                        <div className="modal-stat">
                            <span className="label">DEPTH</span>
                            <span className="value">{coordsDepth ? coordsDepth.toFixed(1) + ' km' : 'N/A'}</span>
                        </div>
                    </div>

                    <div className="modal-info-grid">
                        <div className="info-item">
                            <span className="label">LOCATION</span>
                            <span className="value">{place}</span>
                        </div>
                        <div className="info-item">
                            <span className="label">COORDINATES</span>
                            <span className="value">{lat.toFixed(4)}°N, {lng.toFixed(4)}°E</span>
                        </div>
                        <div className="info-item">
                            <span className="label">TIME</span>
                            <span className="value">{date.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="modal-actions">
                        <a href={url} target="_blank" rel="noopener noreferrer" className="usgs-link">
                            VIEW ON USGS &rarr;
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EarthquakeModal;
