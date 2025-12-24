import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, AlertTriangle, FileWarning, Search } from 'lucide-react';
import ScanResults from './ScanResults';

const ScanHistory = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedScan, setSelectedScan] = useState(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await axios.get('http://localhost:8081/api/scan/history');
                const sortedHistory = response.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                setHistory(sortedHistory);
            } catch (error) {
                console.error("Failed to fetch history", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    if (loading) {
        return <div className="text-white text-center py-20">Loading history...</div>;
    }

    if (selectedScan) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
                <button
                    onClick={() => setSelectedScan(null)}
                    className="mb-6 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                >
                    ← Back to History
                </button>
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-white mb-2">{selectedScan.projectName}</h2>
                    <p className="text-gray-400 text-sm">
                        Scanned on {new Date(selectedScan.timestamp).toLocaleString()} • {selectedScan.scanType}
                    </p>
                </div>
                <ScanResults result={selectedScan} />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
            <h1 className="text-3xl font-bold text-white mb-8">Scan History</h1>

            <div className="grid gap-4">
                {history.map((scan) => (
                    <div key={scan.id} className="glass-panel p-6 flex flex-col md:flex-row justify-between items-center gap-4 hover:bg-slate-800/80 transition-colors">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-xl font-semibold text-white">{scan.projectName}</h3>
                                <span className="text-xs px-2 py-1 bg-slate-700 rounded text-gray-300">{scan.scanType}</span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-400">
                                <span className="flex items-center gap-1">
                                    <Calendar size={14} />
                                    {new Date(scan.timestamp).toLocaleString()}
                                </span>
                                <span className="flex items-center gap-1 text-red-400">
                                    <AlertTriangle size={14} />
                                    {scan.issues.filter(i => i.type === 'SECRET').length} Secrets
                                </span>
                                <span className="flex items-center gap-1 text-yellow-400">
                                    <FileWarning size={14} />
                                    {scan.issues.filter(i => i.type === 'CONFIG_ERROR').length} Config Errors
                                </span>
                            </div>
                        </div>
                        <div>
                            <button
                                onClick={() => setSelectedScan(scan)}
                                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors"
                            >
                                View Details
                            </button>
                        </div>
                    </div>
                ))}

                {history.length === 0 && (
                    <div className="text-center py-20 bg-slate-800/30 rounded-xl border border-dashed border-slate-700">
                        <Search className="mx-auto h-12 w-12 text-gray-500 mb-4" />
                        <p className="text-gray-400">No scan history found. Run a scan to see it here.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ScanHistory;
