import React, { useState, useEffect } from 'react';
import { 
  User, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Activity, 
  Eye, 
  Play,
  Pause,
  RotateCcw,
  TrendingUp,
  Server,
  Wifi,
  Mail,
  Lock,
  BookOpen,
  HelpCircle,
  Lightbulb,
  Target,
  Award,
  ChevronRight,
  Info
} from 'lucide-react';

interface SecurityAlert {
  id: string;
  timestamp: Date;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  category: 'Malware' | 'Network' | 'Phishing' | 'Unauthorized Access' | 'Data Breach' | 'System';
  title: string;
  description: string;
  source: string;
  status: 'Active' | 'Acknowledged' | 'Investigating' | 'Resolved';
  responseTime?: number;
}

interface SOCMetrics {
  totalAlerts: number;
  activeAlerts: number;
  resolvedAlerts: number;
  averageResponseTime: number;
  securityScore: number;
  uptime: number;
}

const VirtualSOC: React.FC = () => {
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);
  const [metrics, setMetrics] = useState<SOCMetrics>({
    totalAlerts: 0,
    activeAlerts: 0,
    resolvedAlerts: 0,
    averageResponseTime: 0,
    securityScore: 85,
    uptime: 99.7
  });
  const [userScore, setUserScore] = useState(0);
  const [selectedAlert, setSelectedAlert] = useState<SecurityAlert | null>(null);
  const [showGuide, setShowGuide] = useState(false);
  const [currentTutorialStep, setCurrentTutorialStep] = useState(0);
  const [showTutorial, setShowTutorial] = useState(false);

  const tutorialSteps = [
    {
      title: "Welcome to the Virtual SOC",
      content: "This simulation helps you understand the operations within a Security Operations Center. You'll learn to manage security alerts and improve your cybersecurity skills."
    },
    {
      title: "Dashboard Overview",
      content: "The SOC Dashboard displays real-time metrics including total alerts, active alerts, resolved alerts, and your security score."
    },
    {
      title: "Managing Alerts",
      content: "Alerts indicate potential security threats. You can view details and take actions like acknowledging, investigating, or resolving them."
    },
    {
      title: "Improving Security Score",
      content: "Resolve alerts promptly to boost your security score and response efficiency. Your goal is to maintain a high score for optimal security operations."
    },
    {
      title: "More Resources",
      content: "Explore our resource section for more in-depth learning materials and cybersecurity best practices."
    }
  ];

  const alertTemplates = [
    {
      category: 'Malware' as const,
      severity: 'Critical' as const,
      title: 'Malware Detection',
      descriptions: [
        'Trojan detected on workstation WS-001',
        'Ransomware activity detected in network share',
        'Suspicious executable identified in email attachment',
        'Backdoor communication detected from server SRV-003'
      ],
      sources: ['Endpoint Protection', 'Network Scanner', 'Email Gateway']
    },
    {
      category: 'Network' as const,
      severity: 'High' as const,
      title: 'Network Anomaly',
      descriptions: [
        'Unusual outbound traffic detected from internal network',
        'Port scanning activity detected from external IP',
        'DNS tunneling attempt identified',
        'Suspicious network connections to known C&C servers'
      ],
      sources: ['Firewall', 'IDS/IPS', 'Network Monitor']
    },
    {
      category: 'Phishing' as const,
      severity: 'Medium' as const,
      title: 'Phishing Attempt',
      descriptions: [
        'Suspicious email with credential harvesting link detected',
        'Phishing campaign targeting finance department',
        'Fake login page detected in employee browser',
        'Social engineering attempt via phone identified'
      ],
      sources: ['Email Security', 'Web Filter', 'User Report']
    },
    {
      category: 'Unauthorized Access' as const,
      severity: 'High' as const,
      title: 'Access Violation',
      descriptions: [
        'Multiple failed login attempts from external IP',
        'Privilege escalation attempt detected',
        'After-hours access to sensitive data',
        'Brute force attack on admin accounts'
      ],
      sources: ['Active Directory', 'Access Control', 'SIEM']
    },
    {
      category: 'Data Breach' as const,
      severity: 'Critical' as const,
      title: 'Data Exfiltration',
      descriptions: [
        'Large data transfer to external location detected',
        'Sensitive files accessed by unauthorized user',
        'Database query anomaly - mass data extraction',
        'Cloud storage breach attempt identified'
      ],
      sources: ['DLP System', 'Database Monitor', 'Cloud Security']
    },
    {
      category: 'System' as const,
      severity: 'Low' as const,
      title: 'System Alert',
      descriptions: [
        'Server performance degradation detected',
        'Unusual system behavior on critical server',
        'Service disruption in authentication system',
        'Memory usage spike on database server'
      ],
      sources: ['System Monitor', 'Performance Tools', 'Health Check']
    }
  ];

  const generateAlert = (): SecurityAlert => {
    const template = alertTemplates[Math.floor(Math.random() * alertTemplates.length)];
    const description = template.descriptions[Math.floor(Math.random() * template.descriptions.length)];
    const source = template.sources[Math.floor(Math.random() * template.sources.length)];
    
    return {
      id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      severity: template.severity,
      category: template.category,
      title: template.title,
      description,
      source,
      status: 'Active'
    };
  };

  const updateMetrics = () => {
    const totalAlerts = alerts.length;
    const activeAlerts = alerts.filter(a => a.status === 'Active' || a.status === 'Acknowledged' || a.status === 'Investigating').length;
    const resolvedAlerts = alerts.filter(a => a.status === 'Resolved').length;
    const responseTimes = alerts.filter(a => a.responseTime).map(a => a.responseTime!);
    const averageResponseTime = responseTimes.length > 0 ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length : 0;
    
    // Calculate security score based on response efficiency
    const baseScore = 85;
    const responseBonus = Math.max(0, (30 - averageResponseTime) * 2); // Faster response = higher score
    const alertPenalty = activeAlerts * 2; // More active alerts = lower score
    const securityScore = Math.min(100, Math.max(0, baseScore + responseBonus - alertPenalty));
    
    setMetrics({
      totalAlerts,
      activeAlerts,
      resolvedAlerts,
      averageResponseTime: Math.round(averageResponseTime),
      securityScore: Math.round(securityScore),
      uptime: 99.7 - (activeAlerts * 0.1)
    });
  };

  useEffect(() => {
    updateMetrics();
  }, [alerts]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSimulationRunning) {
      interval = setInterval(() => {
        if (Math.random() < 0.7) { // 70% chance to generate an alert
          const newAlert = generateAlert();
          setAlerts(prev => [newAlert, ...prev].slice(0, 50)); // Keep only last 50 alerts
        }
      }, Math.random() * 8000 + 5000); // Random interval between 5-13 seconds
    }
    return () => clearInterval(interval);
  }, [isSimulationRunning]);

  const handleAlertAction = (alertId: string, action: 'acknowledge' | 'investigate' | 'resolve') => {
    const startTime = alerts.find(a => a.id === alertId)?.timestamp.getTime() || Date.now();
    const responseTime = Math.round((Date.now() - startTime) / 1000);
    
    setAlerts(prev => prev.map(alert => {
      if (alert.id === alertId) {
        let newStatus: SecurityAlert['status'];
        let scoreIncrease = 0;
        
        switch (action) {
          case 'acknowledge':
            newStatus = 'Acknowledged';
            scoreIncrease = 5;
            break;
          case 'investigate':
            newStatus = 'Investigating';
            scoreIncrease = 10;
            break;
          case 'resolve':
            newStatus = 'Resolved';
            scoreIncrease = alert.severity === 'Critical' ? 25 : alert.severity === 'High' ? 20 : alert.severity === 'Medium' ? 15 : 10;
            // Bonus for fast response
            if (responseTime < 30) scoreIncrease *= 1.5;
            break;
        }
        
        setUserScore(prev => prev + Math.round(scoreIncrease));
        
        return {
          ...alert,
          status: newStatus,
          responseTime: action === 'resolve' ? responseTime : alert.responseTime
        };
      }
      return alert;
    }));
    
    if (action === 'resolve') {
      setSelectedAlert(null);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'text-red-400 bg-red-900/20 border-red-600/30';
      case 'High': return 'text-orange-400 bg-orange-900/20 border-orange-600/30';
      case 'Medium': return 'text-yellow-400 bg-yellow-900/20 border-yellow-600/30';
      case 'Low': return 'text-blue-400 bg-blue-900/20 border-blue-600/30';
      default: return 'text-gray-400 bg-gray-900/20 border-gray-600/30';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Malware': return <Shield className="w-4 h-4" />;
      case 'Network': return <Wifi className="w-4 h-4" />;
      case 'Phishing': return <Mail className="w-4 h-4" />;
      case 'Unauthorized Access': return <Lock className="w-4 h-4" />;
      case 'Data Breach': return <AlertTriangle className="w-4 h-4" />;
      case 'System': return <Server className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'text-red-400';
      case 'Acknowledged': return 'text-yellow-400';
      case 'Investigating': return 'text-blue-400';
      case 'Resolved': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const resetSimulation = () => {
    setAlerts([]);
    setUserScore(0);
    setSelectedAlert(null);
    setIsSimulationRunning(false);
  };

  return (
    <div className="space-y-6">
      {/* Beginner's Guide Panel */}
      <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 border border-blue-600/30 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-blue-400 flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            SOC Learning Guide
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => setShowTutorial(true)}
              className="flex items-center gap-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-all"
            >
              <Play className="w-3 h-3" />
              Start Tutorial
            </button>
            <button
              onClick={() => setShowGuide(!showGuide)}
              className="flex items-center gap-2 px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm transition-all"
            >
              <HelpCircle className="w-3 h-3" />
              {showGuide ? 'Hide' : 'Show'} Guide
            </button>
          </div>
        </div>
        
        {showGuide && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-green-400" />
                  <h4 className="text-sm font-medium text-white">Getting Started</h4>
                </div>
                <p className="text-xs text-gray-400">Click 'Start Simulation' to begin receiving security alerts. Your goal is to manage and resolve them efficiently.</p>
              </div>
              
              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-400" />
                  <h4 className="text-sm font-medium text-white">Understanding Alerts</h4>
                </div>
                <p className="text-xs text-gray-400">Each alert has a severity level (Low, Medium, High, Critical) and category (Malware, Network, etc.). Higher severity alerts need faster responses.</p>
              </div>
              
              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-cyan-400" />
                  <h4 className="text-sm font-medium text-white">Response Actions</h4>
                </div>
                <p className="text-xs text-gray-400">Click on alerts to view details. Use 'Acknowledge' to show you've seen it, 'Investigate' to analyze further, and 'Resolve' to close it.</p>
              </div>
              
              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-4 h-4 text-purple-400" />
                  <h4 className="text-sm font-medium text-white">Scoring System</h4>
                </div>
                <p className="text-xs text-gray-400">Earn points by resolving alerts. Faster responses to critical alerts give bonus points. Maintain a high security score!</p>
              </div>
            </div>
            
            <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-4 h-4 text-yellow-400" />
                <h4 className="text-sm font-medium text-yellow-400">Pro Tips</h4>
              </div>
              <ul className="text-xs text-yellow-300 space-y-1">
                <li>• Prioritize Critical and High severity alerts first</li>
                <li>• Respond to alerts within 30 seconds for bonus points</li>
                <li>• Keep your active alerts count low to maintain security score</li>
                <li>• Learn about different threat categories to improve response time</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Tutorial Modal */}
      {showTutorial && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 border border-gray-600 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">SOC Tutorial</h3>
              <button
                onClick={() => setShowTutorial(false)}
                className="text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 bg-cyan-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {currentTutorialStep + 1}
                </div>
                <h4 className="text-white font-medium">{tutorialSteps[currentTutorialStep].title}</h4>
              </div>
              
              <p className="text-gray-300 text-sm">{tutorialSteps[currentTutorialStep].content}</p>
              
              <div className="flex items-center justify-between pt-4">
                <button
                  onClick={() => setCurrentTutorialStep(Math.max(0, currentTutorialStep - 1))}
                  disabled={currentTutorialStep === 0}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-600 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm transition-all"
                >
                  Previous
                </button>
                
                <div className="flex gap-1">
                  {tutorialSteps.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        index === currentTutorialStep ? 'bg-cyan-400' : 'bg-gray-600'
                      }`}
                    />
                  ))}
                </div>
                
                {currentTutorialStep < tutorialSteps.length - 1 ? (
                  <button
                    onClick={() => setCurrentTutorialStep(currentTutorialStep + 1)}
                    className="flex items-center gap-2 px-3 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm transition-all"
                  >
                    Next
                    <ChevronRight className="w-3 h-3" />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setShowTutorial(false);
                      setCurrentTutorialStep(0);
                    }}
                    className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-all"
                  >
                    Get Started!
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 border border-gray-600/50 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-cyan-400" />
            <div>
              <h2 className="text-2xl font-bold text-white">Virtual SOC Dashboard</h2>
              <p className="text-gray-400 text-sm">Real-time Security Operations Center Simulation</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-2xl font-bold text-cyan-400">{userScore}</div>
              <div className="text-xs text-gray-400">SOC Score</div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsSimulationRunning(!isSimulationRunning)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  isSimulationRunning
                    ? 'bg-red-600 hover:bg-red-500 text-white'
                    : 'bg-green-600 hover:bg-green-500 text-white'
                }`}
              >
                {isSimulationRunning ? (
                  <>
                    <Pause className="w-4 h-4" />
                    Stop Simulation
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Start Simulation
                  </>
                )}
              </button>
              <button
                onClick={resetSimulation}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg font-medium transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
            </div>
          </div>
        </div>
        
        {/* Status Indicator */}
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${isSimulationRunning ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
          <span className="text-sm text-gray-300">
            Simulation Status: {isSimulationRunning ? 'Running' : 'Stopped'}
          </span>
        </div>
      </div>

      {/* Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 border border-blue-700/50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-blue-400">{metrics.totalAlerts}</div>
              <div className="text-sm text-gray-400">Total Alerts</div>
            </div>
            <Activity className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-red-900/50 to-red-800/30 border border-red-700/50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-red-400">{metrics.activeAlerts}</div>
              <div className="text-sm text-gray-400">Active Alerts</div>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-900/50 to-green-800/30 border border-green-700/50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-green-400">{metrics.resolvedAlerts}</div>
              <div className="text-sm text-gray-400">Resolved</div>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 border border-purple-700/50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-purple-400">{metrics.securityScore}%</div>
              <div className="text-sm text-gray-400">Security Score</div>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-400" />
          </div>
        </div>
      </div>

      {/* Alert Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alert List */}
        <div className="lg:col-span-2">
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 border border-gray-600/50 rounded-lg">
            <div className="p-4 border-b border-gray-600/50">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                Security Alerts Feed
              </h3>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {alerts.length === 0 ? (
                <div className="p-8 text-center text-gray-400">
                  <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No alerts yet. Start the simulation to see security alerts.</p>
                </div>
              ) : (
                alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-4 border-b border-gray-700/50 hover:bg-gray-700/30 transition-all cursor-pointer ${
                      selectedAlert?.id === alert.id ? 'bg-gray-700/50 border-l-4 border-l-cyan-400' : ''
                    }`}
                    onClick={() => setSelectedAlert(alert)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className={`p-2 rounded-lg ${getSeverityColor(alert.severity)}`}>
                          {getCategoryIcon(alert.category)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-white">{alert.title}</h4>
                            <span className={`px-2 py-1 text-xs rounded-full border ${getSeverityColor(alert.severity)}`}>
                              {alert.severity}
                            </span>
                          </div>
                          <p className="text-sm text-gray-300 mb-2">{alert.description}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-400">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {alert.timestamp.toLocaleTimeString()}
                            </span>
                            <span>{alert.source}</span>
                            <span className={`font-medium ${getStatusColor(alert.status)}`}>
                              {alert.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Alert Details & Actions */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 border border-gray-600/50 rounded-lg">
            <div className="p-4 border-b border-gray-600/50">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Eye className="w-5 h-5 text-cyan-400" />
                Alert Details
              </h3>
            </div>
            <div className="p-4">
              {selectedAlert ? (
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`p-2 rounded-lg ${getSeverityColor(selectedAlert.severity)}`}>
                        {getCategoryIcon(selectedAlert.category)}
                      </div>
                      <div>
                        <h4 className="font-medium text-white">{selectedAlert.title}</h4>
                        <span className={`text-xs ${getStatusColor(selectedAlert.status)}`}>
                          {selectedAlert.status}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-300 mb-3">{selectedAlert.description}</p>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Severity:</span>
                      <span className={getSeverityColor(selectedAlert.severity).split(' ')[0]}>
                        {selectedAlert.severity}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Category:</span>
                      <span className="text-white">{selectedAlert.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Source:</span>
                      <span className="text-white">{selectedAlert.source}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Time:</span>
                      <span className="text-white">{selectedAlert.timestamp.toLocaleString()}</span>
                    </div>
                    {selectedAlert.responseTime && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Response Time:</span>
                        <span className="text-white">{selectedAlert.responseTime}s</span>
                      </div>
                    )}
                  </div>
                  
                  {selectedAlert.status !== 'Resolved' && (
                    <div className="space-y-2 pt-4 border-t border-gray-600/50">
                      <h5 className="text-sm font-medium text-white mb-2">Response Actions</h5>
                      {selectedAlert.status === 'Active' && (
                        <button
                          onClick={() => handleAlertAction(selectedAlert.id, 'acknowledge')}
                          className="w-full px-3 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg text-sm font-medium transition-all"
                        >
                          Acknowledge Alert
                        </button>
                      )}
                      {(selectedAlert.status === 'Active' || selectedAlert.status === 'Acknowledged') && (
                        <button
                          onClick={() => handleAlertAction(selectedAlert.id, 'investigate')}
                          className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-all"
                        >
                          Start Investigation
                        </button>
                      )}
                      <button
                        onClick={() => handleAlertAction(selectedAlert.id, 'resolve')}
                        className="w-full px-3 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg text-sm font-medium transition-all"
                      >
                        Resolve Alert
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-gray-400 py-8">
                  <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Select an alert to view details and take action.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualSOC;

