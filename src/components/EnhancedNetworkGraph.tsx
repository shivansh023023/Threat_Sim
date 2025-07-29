import React, { useState, useEffect } from 'react';
import { Activity, Wifi, Server, AlertTriangle, Monitor } from 'lucide-react';

interface NetworkNode {
  id: string;
  name: string;
  type: 'server' | 'client' | 'router' | 'firewall';
  status: 'normal' | 'warning' | 'danger';
  connections: string[];
  x: number;
  y: number;
}

const EnhancedNetworkGraph: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [animationStep, setAnimationStep] = useState(0);

  const nodes: NetworkNode[] = [
    {
      id: 'fw1',
      name: 'Firewall',
      type: 'firewall',
      status: 'normal',
      connections: ['router1', 'server1'],
      x: 150,
      y: 100
    },
    {
      id: 'router1',
      name: 'Core Router',
      type: 'router',
      status: 'warning',
      connections: ['fw1', 'server1', 'server2', 'client1'],
      x: 300,
      y: 200
    },
    {
      id: 'server1',
      name: 'Web Server',
      type: 'server',
      status: 'normal',
      connections: ['router1', 'fw1'],
      x: 150,
      y: 300
    },
    {
      id: 'server2',
      name: 'Database Server',
      type: 'server',
      status: 'danger',
      connections: ['router1'],
      x: 450,
      y: 300
    },
    {
      id: 'client1',
      name: 'Client Machine',
      type: 'client',
      status: 'normal',
      connections: ['router1'],
      x: 300,
      y: 350
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationStep(prev => (prev + 1) % 360);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'server': return Server;
      case 'client': return Monitor;
      case 'router': return Wifi;
      case 'firewall': return AlertTriangle;
      default: return Activity;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'text-green-400 border-green-400';
      case 'warning': return 'text-yellow-400 border-yellow-400';
      case 'danger': return 'text-red-400 border-red-400';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 border border-gray-600/50 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-cyan-400">Network Topology</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-400">Live Monitoring</span>
          </div>
          <div className="text-sm text-gray-400">5 Nodes Active</div>
        </div>
      </div>

      <div className="relative bg-gray-900/50 rounded-lg p-8 h-96 overflow-hidden">
        {/* Network connections */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {nodes.map(node => 
            node.connections.map(connectionId => {
              const targetNode = nodes.find(n => n.id === connectionId);
              if (!targetNode) return null;
              
              return (
                <line
                  key={`${node.id}-${connectionId}`}
                  x1={node.x}
                  y1={node.y}
                  x2={targetNode.x}
                  y2={targetNode.y}
                  stroke="rgba(56, 189, 248, 0.3)"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  className="animate-pulse"
                />
              );
            })
          )}
        </svg>

        {/* Network nodes */}
        {nodes.map(node => {
          const Icon = getNodeIcon(node.type);
          const isSelected = selectedNode === node.id;
          
          return (
            <div
              key={node.id}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 ${
                isSelected ? 'scale-110' : 'hover:scale-105'
              }`}
              style={{ left: node.x, top: node.y }}
              onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
            >
              <div className={`relative p-3 rounded-full border-2 bg-gray-800/80 backdrop-blur-sm ${getStatusColor(node.status)} ${
                isSelected ? 'ring-2 ring-cyan-400' : ''
              }`}>
                <Icon className="w-6 h-6" />
                {node.status !== 'normal' && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
                )}
              </div>
              <div className="text-xs text-center mt-2 text-gray-300 max-w-20 truncate">
                {node.name}
              </div>
            </div>
          );
        })}

        {/* Traffic animation */}
        <div 
          className="absolute w-2 h-2 bg-cyan-400 rounded-full opacity-60"
          style={{
            left: 150 + Math.sin(animationStep * 0.1) * 100,
            top: 200 + Math.cos(animationStep * 0.1) * 50,
            transition: 'all 0.1s ease-out'
          }}
        ></div>
      </div>

      {/* Node details panel */}
      {selectedNode && (
        <div className="mt-6 p-4 bg-gray-800/30 border border-gray-700/50 rounded-lg">
          {(() => {
            const node = nodes.find(n => n.id === selectedNode);
            if (!node) return null;
            
            return (
              <div>
                <h4 className="text-lg font-medium text-cyan-400 mb-2">{node.name}</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Type:</span>
                    <span className="ml-2 text-white capitalize">{node.type}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Status:</span>
                    <span className={`ml-2 capitalize ${
                      node.status === 'normal' ? 'text-green-400' :
                      node.status === 'warning' ? 'text-yellow-400' : 'text-red-400'
                    }`}>{node.status}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Connections:</span>
                    <span className="ml-2 text-white">{node.connections.length}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Last Check:</span>
                    <span className="ml-2 text-white">2s ago</span>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default EnhancedNetworkGraph;
