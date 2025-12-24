import React, { useState } from 'react';
import { Search, Loader2, Github, FolderOpen } from 'lucide-react';
import axios from 'axios';

const ScanForm = ({ onScanComplete }) => {
    const [mode, setMode] = useState('LOCAL'); // LOCAL or GITHUB
    const [path, setPath] = useState('');
    const [url, setUrl] = useState('');
    const [projectName, setProjectName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleScan = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            let response;
            if (mode === 'LOCAL') {
                response = await axios.post('http://localhost:8081/api/scan/local', {
                    path,
                    name: projectName || 'Untitled Project'
                });
            } else {
                response = await axios.post('http://localhost:8081/api/scan/github', {
                    url,
                    name: projectName || 'GitHub Project'
                });
            }

            onScanComplete(response.data);
            if (mode === 'LOCAL') setPath(''); else setUrl('');
            setProjectName('');
        } catch (err) {
            setError('Scan failed. Please check the backend connection and path/URL.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleBrowse = async () => {
        try {
            const response = await axios.get('http://localhost:8081/api/scan/browse');
            if (response.status === 200 && response.data.path) {
                setPath(response.data.path);
            }
        } catch (err) {
            console.error("Failed to open directory picker", err);
        }
    };

    return (
        <div className="glass-panel p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4 text-white">Start New Scan</h2>

            {/* Tabs */}
            <div className="flex gap-4 mb-6 border-b border-slate-700">
                <button
                    onClick={() => setMode('LOCAL')}
                    className={`pb-2 px-1 flex items-center gap-2 text-sm font-medium transition-colors border-b-2 ${mode === 'LOCAL' ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-gray-200'
                        }`}
                >
                    <FolderOpen size={16} /> Local Directory
                </button>
                <button
                    onClick={() => setMode('GITHUB')}
                    className={`pb-2 px-1 flex items-center gap-2 text-sm font-medium transition-colors border-b-2 ${mode === 'GITHUB' ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-gray-200'
                        }`}
                >
                    <Github size={16} /> GitHub Repository
                </button>
            </div>

            <form onSubmit={handleScan} className="flex flex-col gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Project Name</label>
                    <input
                        type="text"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        placeholder="e.g. My Project"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>

                {mode === 'LOCAL' ? (
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Local Directory Path</label>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    value={path}
                                    onChange={(e) => setPath(e.target.value)}
                                    placeholder="e.g. C:/Users/Projects/MyApp"
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-4 pr-24 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={handleBrowse}
                                    className="absolute right-1 top-1 bottom-1 px-3 bg-slate-700 hover:bg-slate-600 text-gray-200 text-xs rounded transition-colors"
                                >
                                    Browse...
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">GitHub Repository URL</label>
                        <input
                            type="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="e.g. https://github.com/username/repository"
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                        />
                    </div>
                )}

                <div className="flex justify-end mt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <Search size={18} />}
                        {loading ? 'Scanning...' : 'Scan Now'}
                    </button>
                </div>

                {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
            </form>
        </div>
    );
};

export default ScanForm;
