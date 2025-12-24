import React from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const DashboardCharts = ({ findings }) => {
    if (!findings || findings.issues.length === 0) return null;

    // Data for Doughnut Chart (Issue Types)
    const secretsCount = findings.issues.filter(i => i.type === 'SECRET').length;
    const misconfigCount = findings.issues.filter(i => i.type === 'SECURITY_MISCONFIG').length;
    const weakCredsCount = findings.issues.filter(i => i.type === 'WEAK_CREDENTIALS').length;
    const missingCount = findings.issues.filter(i => i.type === 'MISSING_CONFIG').length;
    const sensitiveFileCount = findings.issues.filter(i => i.type === 'SENSITIVE_FILE').length;
    const configErrorCount = findings.issues.filter(i => i.type === 'CONFIG_ERROR').length;

    // Data for Bar Chart (Severity Levels)
    const critical = findings.issues.filter(i => i.severity === 'CRITICAL').length;
    const high = findings.issues.filter(i => i.severity === 'HIGH').length;
    const medium = findings.issues.filter(i => i.severity === 'MEDIUM').length;
    const low = findings.issues.filter(i => i.severity === 'LOW').length;

    const doughnutData = {
        labels: ['Secrets', 'Security Misconfig', 'Weak Check', 'Missing Config', 'Sensitive Files', 'Format Errors'],
        datasets: [
            {
                data: [secretsCount, misconfigCount, weakCredsCount, missingCount, sensitiveFileCount, configErrorCount],
                backgroundColor: [
                    'rgba(239, 68, 68, 0.8)',   // Red (Secrets)
                    'rgba(249, 115, 22, 0.8)',  // Orange (Misconfig)
                    'rgba(234, 179, 8, 0.8)',   // Yellow (Weak Creds)
                    'rgba(59, 130, 246, 0.8)',  // Blue (Missing)
                    'rgba(168, 85, 247, 0.8)',  // Purple (Sensitive)
                    'rgba(148, 163, 184, 0.8)', // Slate (Format)
                ],
                borderColor: [
                    'rgba(239, 68, 68, 1)',
                    'rgba(249, 115, 22, 1)',
                    'rgba(234, 179, 8, 1)',
                    'rgba(59, 130, 246, 1)',
                    'rgba(168, 85, 247, 1)',
                    'rgba(148, 163, 184, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const barData = {
        labels: ['Critical', 'High', 'Medium', 'Low'],
        datasets: [
            {
                label: 'Issues by Severity',
                data: [critical, high, medium, low],
                backgroundColor: [
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(249, 115, 22, 0.8)',
                    'rgba(234, 179, 8, 0.8)',
                    'rgba(59, 130, 246, 0.8)',
                ],
                borderRadius: 5,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
                labels: { color: '#94a3b8' }
            },
            title: {
                display: false,
            }
        },
        scales: {
            y: {
                ticks: { color: '#94a3b8' },
                grid: { color: '#334155' } // slate-700
            },
            x: {
                ticks: { color: '#94a3b8' },
                grid: { display: false }
            }
        }
    };

    const doughnutOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
                labels: { color: '#94a3b8' }
            }
        },
        cutout: '70%',
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 animate-fade-in">
            <div className="glass-panel p-6 flex flex-col items-center justify-center">
                <h3 className="text-lg font-semibold text-white mb-4 self-start">Issue Distribution</h3>
                <div className="w-64 h-64">
                    <Doughnut data={doughnutData} options={doughnutOptions} />
                </div>
            </div>

            <div className="glass-panel p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Severity Breakdown</h3>
                <div className="h-64 flex items-end justify-center">
                    <Bar data={barData} options={options} />
                </div>
            </div>
        </div>
    );
};

export default DashboardCharts;
