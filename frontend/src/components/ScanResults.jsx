import React from 'react';
import { AlertTriangle, CheckCircle, FileWarning } from 'lucide-react';
import DashboardCharts from './DashboardCharts';

const ScanResults = ({ result }) => {
    if (!result) return null;

    const secretCount = result.issues.filter(i => i.type === 'SECRET').length;
    const securityCount = result.issues.filter(i => ['SECURITY_MISCONFIG', 'WEAK_CREDENTIALS', 'SENSITIVE_FILE'].includes(i.type)).length;
    const configCount = result.issues.filter(i => ['CONFIG_ERROR', 'MISSING_CONFIG'].includes(i.type)).length;

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Visual Charts */}
            <DashboardCharts findings={result} />

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`p-4 rounded-xl border ${result.status === 'SUCCESS' ? 'bg-green-500/10 border-green-500/50' : 'bg-red-500/10 border-red-500/50'}`}>
                    <div className="flex items-center gap-3">
                        <CheckCircle className={result.status === 'SUCCESS' ? 'text-green-400' : 'text-red-400'} />
                        <div>
                            <p className="text-sm text-gray-400">Status</p>
                            <p className="text-lg font-bold text-white">{result.status}</p>
                        </div>
                    </div>
                </div>
                <div className="p-4 rounded-xl border bg-red-500/10 border-red-500/50">
                    <div className="flex items-center gap-3">
                        <AlertTriangle className="text-red-400" />
                        <div>
                            <p className="text-sm text-gray-400">Security Issues</p>
                            <p className="text-lg font-bold text-white">{secretCount + securityCount}</p>
                        </div>
                    </div>
                </div>
                <div className="p-4 rounded-xl border bg-yellow-500/10 border-yellow-500/50">
                    <div className="flex items-center gap-3">
                        <FileWarning className="text-yellow-400" />
                        <div>
                            <p className="text-sm text-gray-400">Misconfigurations</p>
                            <p className="text-lg font-bold text-white">{configCount}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Issues List */}
            <div className="glass-panel overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-700">
                    <h3 className="text-lg font-semibold text-white">Detailed Findings</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-900/50 text-gray-400 uppercase text-xs">
                            <tr>
                                <th className="px-6 py-3">Severity</th>
                                <th className="px-6 py-3">Type</th>
                                <th className="px-6 py-3">File</th>
                                <th className="px-6 py-3">Line</th>
                                <th className="px-6 py-3">Description</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {result.issues.map((issue, idx) => (
                                <tr key={idx} className="hover:bg-slate-700/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${issue.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400' :
                                            issue.severity === 'HIGH' ? 'bg-orange-500/20 text-orange-400' :
                                                'bg-yellow-500/20 text-yellow-400'
                                            }`}>
                                            {issue.severity}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-white font-medium">{issue.type}</td>
                                    <td className="px-6 py-4 text-gray-300 font-mono text-sm max-w-xs truncate" title={issue.filePath}>
                                        {issue.filePath.split(/[/\\]/).pop()}
                                    </td>
                                    <td className="px-6 py-4 text-gray-400">{issue.lineNumber}</td>
                                    <td className="px-6 py-4 text-gray-300">{issue.description}</td>
                                </tr>
                            ))}
                            {result.issues.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                        No issues found. Great job!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ScanResults;
