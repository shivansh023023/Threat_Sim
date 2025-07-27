import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Activity, AlertTriangle, Server, Wifi, Target } from 'lucide-react';
import EnhancedNetworkGraph from '../components/EnhancedNetworkGraph';
import KnowledgeCards from '../components/KnowledgeCards';
import ThreatHuntingChallenges from '../components/ThreatHuntingChallenges';
import VirtualSOC from '../components/VirtualSOC';

const SimulationLab: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'dashboard' | 'network' | 'challenges' | 'tools' | 'soc'>('dashboard');
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-white">
      {/* Header */}
      <div className="border-b border-gray-700 bg-gray-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link
                to="/"
                className="inline-flex items-center text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Journey
              </Link>
              
              <div className="flex items-center gap-3">
                <Shield className="w-8 h-8 text-cyan-400" />
                <div>
                  <h1 className="text-2xl font-bold">CyberSim Lab</h1>
                  <p className="text-gray-400 text-sm">Enhanced Network Analysis</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-cyan-400 text-sm font-mono">07:01:27</div>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-900/30 border border-green-600/30">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-sm">Analyst</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="flex">
        <div className="w-64 bg-gray-800/30 border-r border-gray-700 min-h-screen">
          <div className="p-6">
            {/* Threat Level */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                <span className="text-sm font-medium">Threat Level</span>
              </div>
              <div className="text-lg font-semibold text-yellow-500">Moderate</div>
              <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
              <div className="text-xs text-gray-400 mt-1">3 active alerts</div>
            </div>

            {/* Navigation */}
            <nav className="space-y-2">
              <div 
                onClick={() => setActiveSection('dashboard')}
                className={`flex items-center gap-3 px-3 py-2 rounded transition-colors cursor-pointer ${
                  activeSection === 'dashboard' 
                    ? 'bg-cyan-600/20 border border-cyan-600/30 text-cyan-400' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                <Activity className="w-5 h-5" />
                <span>Dashboard</span>
              </div>
              <div 
                onClick={() => setActiveSection('network')}
                className={`flex items-center gap-3 px-3 py-2 rounded transition-colors cursor-pointer ${
                  activeSection === 'network' 
                    ? 'bg-cyan-600/20 border border-cyan-600/30 text-cyan-400' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                <Wifi className="w-5 h-5" />
                <span>Network Simulation</span>
              </div>
              <div 
                onClick={() => setActiveSection('challenges')}
                className={`flex items-center gap-3 px-3 py-2 rounded transition-colors cursor-pointer ${
                  activeSection === 'challenges' 
                    ? 'bg-cyan-600/20 border border-cyan-600/30 text-cyan-400' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                <Target className="w-5 h-5" />
                <span>Challenges</span>
              </div>
              <div 
                onClick={() => setActiveSection('tools')}
                className={`flex items-center gap-3 px-3 py-2 rounded transition-colors cursor-pointer ${
                  activeSection === 'tools' 
                    ? 'bg-cyan-600/20 border border-cyan-600/30 text-cyan-400' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                <Server className="w-5 h-5" />
                <span>Security Tools</span>
              </div>
              <div 
                onClick={() => setActiveSection('soc')}
                className={`flex items-center gap-3 px-3 py-2 rounded transition-colors cursor-pointer ${
                  activeSection === 'soc' 
                    ? 'bg-cyan-600/20 border border-cyan-600/30 text-cyan-400' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                <Shield className="w-5 h-5" />
                <span>Virtual SOC</span>
              </div>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {activeSection === 'dashboard' && (
              <>
                {/* Page Header */}
                <div className="mb-8">
                  <h2 className="text-3xl font-bold mb-2">Security Operations Dashboard</h2>
                  <p className="text-gray-400">Monitor system status and respond to security incidents</p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 border border-blue-700/50 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-3xl font-bold text-blue-400">78</div>
                        <div className="text-sm text-gray-400">Security Score</div>
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-green-400 text-xs">↑ +5</span>
                        </div>
                      </div>
                      <Shield className="w-8 h-8 text-blue-400" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-yellow-900/50 to-yellow-800/30 border border-yellow-700/50 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-3xl font-bold text-yellow-400">3</div>
                        <div className="text-sm text-gray-400">Active Threats</div>
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-red-400 text-xs">↗ +1</span>
                        </div>
                      </div>
                      <AlertTriangle className="w-8 h-8 text-yellow-400" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-900/50 to-green-800/30 border border-green-700/50 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-3xl font-bold text-green-400">99.8%</div>
                        <div className="text-sm text-gray-400">System Uptime</div>
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-red-400 text-xs">↘ -0.1</span>
                        </div>
                      </div>
                      <Server className="w-8 h-8 text-green-400" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 border border-purple-700/50 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-purple-400">Secure</div>
                        <div className="text-sm text-gray-400">Network Status</div>
                        <div className="text-xs text-green-400 mt-1">Stable</div>
                      </div>
                      <Wifi className="w-8 h-8 text-purple-400" />
                    </div>
                  </div>
                </div>

                {/* Knowledge Cards Section */}
                <div className="mb-8">
                  <KnowledgeCards contextualMode={true} triggerKeywords={['dashboard', 'security', 'operations']} />
                </div>

                {/* Additional Info */}
                <div className="text-center text-gray-500 text-sm">
                  CyberSim Lab © 2025 • Secure Environment
                </div>
              </>
            )}

            {activeSection === 'network' && (
              <>
                {/* Page Header */}
                <div className="mb-8">
                  <h2 className="text-3xl font-bold mb-2">Network Simulation</h2>
                  <p className="text-gray-400">Real-time network traffic analysis and monitoring</p>
                </div>

                {/* Enhanced Network Graph */}
                <div className="mb-8">
                  <EnhancedNetworkGraph />
                </div>

                {/* Knowledge Cards Section */}
                <div className="mb-8">
                  <KnowledgeCards contextualMode={true} triggerKeywords={['network', 'traffic', 'anomaly']} />
                </div>
              </>
            )}

            {activeSection === 'challenges' && (
              <>
                {/* Page Header */}
                <div className="mb-8">
                  <h2 className="text-3xl font-bold mb-2">Threat Hunting Challenges</h2>
                  <p className="text-gray-400">Interactive cybersecurity challenges to sharpen your threat detection skills</p>
                </div>

                {/* Threat Hunting Challenges Component */}
                <ThreatHuntingChallenges />
              </>
            )}

            {activeSection === 'tools' && (
              <>
                {/* Page Header */}
                <div className="mb-8">
                  <h2 className="text-3xl font-bold mb-2">Security Tools</h2>
                  <p className="text-gray-400">Advanced security analysis and forensic tools</p>
                </div>

                {/* Placeholder for Security Tools */}
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 border border-gray-600/50 rounded-lg p-8 text-center">
                  <Server className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-300 mb-2">Security Tools Coming Soon</h3>
                  <p className="text-gray-500">Advanced security analysis tools and forensic capabilities will be available in this section.</p>
                </div>
              </>
            )}

            {activeSection === 'soc' && (
              <>
                {/* Page Header */}
                <div className="mb-8">
                  <h2 className="text-3xl font-bold mb-2">Virtual SOC Environment</h2>
                  <p className="text-gray-400">Simulated security operations center activities and exercises</p>
                </div>

                {/* Virtual SOC Component */}
                <VirtualSOC />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimulationLab;
