import React from 'react';
import { getMagnitudeColor } from '../../services/earthquakeService';
import './HistoryList.css';

const HistoryList = ({ historyData, onSelectQuake }) => {
    return (
        <div className="glass-panel history-list-panel">
            <h3 className="panel-title">Last 30 Days (BD)</h3>
            <div className="history-list-content">
                {historyData.length === 0 ? (
                    <div className="no-history">No Data / Loading...</div>
                ) : (
                    historyData.map((quake) => (
                        <div
                            key={quake.id}
                            className="history-item"
                            onClick={() => onSelectQuake(quake)}
                            role="button"
                            tabIndex={0}
                        >
                            <div
                                className="history-mag"
                                style={{ color: getMagnitudeColor(quake.properties.mag) }}
                            >
                                {quake.properties.mag.toFixed(1)}
                            </div>
                            <div className="history-details">
                                <div className="history-place">{quake.properties.place}</div>
                                <div className="history-date">
                                    {new Date(quake.properties.time).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default HistoryList;
