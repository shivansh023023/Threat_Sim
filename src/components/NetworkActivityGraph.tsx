import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Activity, RotateCcw, Download, AlertCircle } from 'lucide-react';

// Network data interface
interface NetworkDataPoint {
  time: string;
  normalTraffic: number;
  suspiciousTraffic: number;
  bandwidth: number;
}

type TimeFrame = 'live' | '24h' | '7d';

export const NetworkActivityGraph: React.FC = () => {
  const [networkData, setNetworkData] = useState<NetworkDataPoint[]>([]);
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('live');
  const [anomalyCount, setAnomalyCount] = useState(3);

  // Generate network data based on time frame
  const generateNetworkData = (frame: TimeFrame) => {
    const now = new Date();
    const data: NetworkDataPoint[] = [];
    let points = 20;
    let interval = 30000; // 30 seconds for live
    
    if (frame === '24h') {
      points = 24;
      interval = 3600000; // 1 hour
    } else if (frame === '7d') {
      points = 7;
      interval = 86400000; // 1 day
    }

    for (let i = points - 1; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - (i * interval));
      const timeStr = frame === 'live' 
        ? timestamp.toLocaleTimeString() 
        : frame === '24h' 
          ? timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : timestamp.toLocaleDateString([], { month: 'short', day: 'numeric' });

      const baseTraffic = Math.random() * 100 + 50;
      const suspiciousSpike = Math.random() > 0.8 ? Math.random() * 40 : Math.random() * 10;
      
      data.push({
        time: timeStr,
        normalTraffic: Math.round(baseTraffic),
        suspiciousTraffic: Math.round(suspiciousSpike),
        bandwidth: Math.round((baseTraffic + suspiciousSpike) * 0.8 + Math.random() * 20)
      });
    }

    setNetworkData(data);
    // Update anomaly count based on suspicious traffic
    const anomalies = data.filter(d => d.suspiciousTraffic > 15).length;
    setAnomalyCount(anomalies);
  };

  // Initialize and refresh data
  useEffect(() => {
    generateNetworkData(timeFrame);
    
    if (timeFrame === 'live') {
      const interval = setInterval(() => {
        generateNetworkData('live');
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [timeFrame]);

  // Custom tooltip for the chart
  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-600 rounded-lg p-3 shadow-xl">
          <p className="text-gray-300 text-sm mb-2">{`Time: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value} ${entry.dataKey === 'bandwidth' ? 'Mbps' : 'req/s'}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 border border-gray-600/50 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-cyan-400 flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Network Activity Monitor
        </h3>
        <div className="flex items-center gap-4">
          {/* Anomaly Counter */}
          <div className="flex items-center gap-2 px-3 py-1 bg-red-900/20 border border-red-600/30 rounded-lg">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <span className="text-sm text-red-400 font-medium">{anomalyCount} Anomalies</span>
          </div>
          
          {/* Time Frame Selector */}
          <div className="flex gap-1 bg-gray-700/50 rounded-lg p-1">
            {(['live', '24h', '7d'] as const).map((frame) => (
              <button
                key={frame}
                onClick={() => setTimeFrame(frame)}
                className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                  timeFrame === frame
                    ? 'bg-cyan-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-600'
                }`}
              >
                {frame === 'live' ? 'Live' : frame}
              </button>
            ))}
          </div>
          
          {/* Graph Controls */}
          <div className="flex gap-2">
            <button
              onClick={() => generateNetworkData(timeFrame)}
              className="p-2 text-gray-400 hover:text-white transition-colors border border-gray-600 rounded-lg hover:bg-gray-700/50"
              title="Refresh Data"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              className="p-2 text-gray-400 hover:text-white transition-colors border border-gray-600 rounded-lg hover:bg-gray-700/50"
              title="Download Graph"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Graph Area */}
      <div className="h-80 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={networkData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="time" 
              stroke="#9CA3AF" 
              fontSize={12}
              tick={{ fill: '#9CA3AF' }}
            />
            <YAxis 
              stroke="#9CA3AF" 
              fontSize={12}
              tick={{ fill: '#9CA3AF' }}
              label={{ value: 'Traffic (req/s)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#9CA3AF' } }}
            />
            <Tooltip content={customTooltip} />
            <Legend 
              wrapperStyle={{ color: '#9CA3AF' }}
              iconType="line"
            />
            <Line 
              type="monotone" 
              dataKey="normalTraffic" 
              stroke="#10B981" 
              strokeWidth={2}
              dot={{ fill: '#10B981', strokeWidth: 2, r: 3 }}
              activeDot={{ r: 5, stroke: '#10B981', strokeWidth: 2 }}
              name="Normal Traffic"
            />
            <Line 
              type="monotone" 
              dataKey="suspiciousTraffic" 
              stroke="#EF4444" 
              strokeWidth={2}
              dot={{ fill: '#EF4444', strokeWidth: 2, r: 3 }}
              activeDot={{ r: 5, stroke: '#EF4444', strokeWidth: 2 }}
              name="Suspicious Traffic"
            />
            <Line 
              type="monotone" 
              dataKey="bandwidth" 
              stroke="#3B82F6" 
              strokeWidth={2}
              dot={{ fill: '#3B82F6', strokeWidth: 2, r: 3 }}
              activeDot={{ r: 5, stroke: '#3B82F6', strokeWidth: 2 }}
              name="Bandwidth"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {/* Graph Legend & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div className="bg-gray-800/30 border border-gray-600/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium text-gray-300">Normal Traffic</span>
          </div>
          <p className="text-lg font-semibold text-green-400">
            {networkData.length > 0 ? `${networkData[networkData.length - 1]?.normalTraffic || 0} req/s` : '0 req/s'}
          </p>
          <p className="text-xs text-gray-500">Average network activity</p>
        </div>
        
        <div className="bg-gray-800/30 border border-gray-600/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-sm font-medium text-gray-300">Suspicious Traffic</span>
          </div>
          <p className="text-lg font-semibold text-red-400">
            {networkData.length > 0 ? `${networkData[networkData.length - 1]?.suspiciousTraffic || 0} req/s` : '0 req/s'}
          </p>
          <p className="text-xs text-gray-500">Potential threats detected</p>
        </div>
        
        <div className="bg-gray-800/30 border border-gray-600/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm font-medium text-gray-300">Total Bandwidth</span>
          </div>
          <p className="text-lg font-semibold text-blue-400">
            {networkData.length > 0 ? `${networkData[networkData.length - 1]?.bandwidth || 0} Mbps` : '0 Mbps'}
          </p>
          <p className="text-xs text-gray-500">Current usage</p>
        </div>
      </div>
    </div>
  );
};

export default NetworkActivityGraph;
