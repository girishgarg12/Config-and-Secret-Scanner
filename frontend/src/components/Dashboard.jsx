import React, { useState } from 'react';
import ScanForm from './ScanForm';
import ScanResults from './ScanResults';

const Dashboard = () => {
    const [scanResult, setScanResult] = useState(null);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white">Security Dashboard</h1>
                <p className="text-gray-400 mt-2">Scan your projects for secrets and configuration errors.</p>
            </div>

            <ScanForm onScanComplete={setScanResult} />

            {scanResult && <ScanResults result={scanResult} />}
        </div>
    );
};

export default Dashboard;
