import React, { useState, useEffect } from 'react';
import { 
  Network, 
  Key, 
  Shield, 
  Database, 
  Search, 
  Play,
  CheckSquare,
  Square,
  Copy,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  AlertCircle,
  CheckCircle,
  Info,
  Activity,
  TrendingUp,
  Download,
  ZoomIn,
  RotateCcw,
  Hash,
  Loader,
  Clock,
  Zap
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ScanResult {
  port: number;
  service: string;
  status: 'open' | 'closed' | 'filtered';
  version?: string;
}

const SecurityTools: React.FC = () => {
  const [activeTab, setActiveTab] = useState('network-scanner');
  
  // Network Scanner States
  const [targetNetwork, setTargetNetwork] = useState('192.168.1.0/24');
  const [portRange, setPortRange] = useState('1-1000');
  const [scanType, setScanType] = useState('TCP SYN Scan');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);
  const [options, setOptions] = useState({
    osDetection: false,
    serviceVersionDetection: false,
    scriptScanning: false,
    vulnerabilityAssessment: true
  });

  // Password Analyzer States
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<{
    score: number;
    feedback: string[];
    color: string;
    label: string;
  } | null>(null);

  // Encryption Tool States
  const [encryptionText, setEncryptionText] = useState('');
  const [encryptionKey, setEncryptionKey] = useState('');
  const [encryptionResult, setEncryptionResult] = useState('');
  const [encryptionMode, setEncryptionMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [encryptionAlgorithm, setEncryptionAlgorithm] = useState('AES-256');

  // SQL Injection Tester States
  const [sqlUrl, setSqlUrl] = useState('http://testphp.vulnweb.com/artists.php?artist=1');
  const [sqlPayload, setSqlPayload] = useState("' OR '1'='1");
  const [sqlResults, setSqlResults] = useState<{
    vulnerable: boolean;
    response: string;
    risk: string;
  } | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  // Network Activity Graph States
  const [networkData, setNetworkData] = useState<Array<{
    time: string;
    normalTraffic: number;
    suspiciousTraffic: number;
    bandwidth: number;
    timestamp: number;
  }>>([]);
  const [timeFrame, setTimeFrame] = useState<'live' | '24h' | '7d'>('24h');
  const [anomalyCount, setAnomalyCount] = useState(0);

  // Hash Analyzer States
  const [hashInput, setHashInput] = useState('');
  const [hashResults, setHashResults] = useState<{
    md5: string;
    sha1: string;
    sha256: string;
    sha512: string;
  } | null>(null);
  const [identifiedHashType, setIdentifiedHashType] = useState<string | null>(null);
  const [crackResult, setCrackResult] = useState<{
    cracked: boolean;
    password: string | null;
    attempts: number;
    timeElapsed: number;
  } | null>(null);
  const [isCracking, setIsCracking] = useState(false);

  const tools = [
    { id: 'network-scanner', name: 'Network Scanner', icon: Network },
    { id: 'password-analyzer', name: 'Password Strength Analyzer', icon: Key },
    { id: 'encryption-tool', name: 'Encryption Tool', icon: Shield },
    { id: 'sql-injection', name: 'SQL Injection Tester', icon: Database },
    { id: 'hash-analyzer', name: 'Hash Analysis & Cracking', icon: Hash }
  ];

  const scanTypes = [
    'TCP SYN Scan',
    'TCP Connect Scan',
    'UDP Scan',
    'Comprehensive Scan'
  ];

  const handleStartScan = () => {
    setIsScanning(true);
    setScanResults([]);
    
    // Simulate scanning process
    setTimeout(() => {
      const mockResults: ScanResult[] = [
        { port: 22, service: 'SSH', status: 'open', version: 'OpenSSH 8.2' },
        { port: 80, service: 'HTTP', status: 'open', version: 'Apache 2.4.41' },
        { port: 443, service: 'HTTPS', status: 'open', version: 'Apache 2.4.41' },
        { port: 3306, service: 'MySQL', status: 'open', version: 'MySQL 8.0' },
        { port: 21, service: 'FTP', status: 'closed' },
        { port: 23, service: 'Telnet', status: 'filtered' }
      ];
      setScanResults(mockResults);
      setIsScanning(false);
    }, 3000);
  };

  const toggleOption = (optionKey: string) => {
    setOptions(prev => ({
      ...prev,
      [optionKey]: !prev[optionKey as keyof typeof prev]
    }));
  };

  // Password strength checker function
  const analyzePassword = (pwd: string) => {
    let score = 0;
    const feedback: string[] = [];

    // Length check
    if (pwd.length >= 12) {
      score += 25;
    } else if (pwd.length >= 8) {
      score += 15;
      feedback.push('Consider using at least 12 characters for better security');
    } else {
      feedback.push('Password is too short. Use at least 8 characters');
    }

    // Character variety checks
    if (/[a-z]/.test(pwd)) score += 10;
    else feedback.push('Add lowercase letters');

    if (/[A-Z]/.test(pwd)) score += 10;
    else feedback.push('Add uppercase letters');

    if (/[0-9]/.test(pwd)) score += 10;
    else feedback.push('Add numbers');

    if (/[^A-Za-z0-9]/.test(pwd)) score += 15;
    else feedback.push('Add special characters (!@#$%^&*)');

    // Pattern checks
    if (!/(..).*\1/.test(pwd)) score += 10;
    else feedback.push('Avoid repeating character patterns');

    if (!/123|abc|qwe|asd|zxc/i.test(pwd)) score += 10;
    else feedback.push('Avoid common sequences');

    // Dictionary check (simplified)
    const commonPasswords = ['password', '123456', 'qwerty', 'admin', 'welcome'];
    if (!commonPasswords.some(common => pwd.toLowerCase().includes(common))) {
      score += 10;
    } else {
      feedback.push('Avoid common words and passwords');
    }

    // Determine strength
    let label = '';
    let color = '';
    if (score >= 85) {
      label = 'Very Strong';
      color = 'text-green-400';
      if (feedback.length === 0) feedback.push('Excellent! This is a very strong password.');
    } else if (score >= 70) {
      label = 'Strong';
      color = 'text-lime-400';
    } else if (score >= 50) {
      label = 'Moderate';
      color = 'text-yellow-400';
    } else if (score >= 30) {
      label = 'Weak';
      color = 'text-orange-400';
    } else {
      label = 'Very Weak';
      color = 'text-red-400';
    }

    return { score: Math.min(score, 100), feedback, color, label };
  };

  const handlePasswordChange = (newPassword: string) => {
    setPassword(newPassword);
    if (newPassword.length > 0) {
      setPasswordStrength(analyzePassword(newPassword));
    } else {
      setPasswordStrength(null);
    }
  };

  // SQL Injection test function
  const handleSqlInjectionTest = async () => {
    setIsTesting(true);
    setSqlResults(null);
    
    // Simulate SQL injection testing process
    setTimeout(() => {
      // Mock vulnerability detection logic
      const isVulnerable = Math.random() > 0.3; // 70% chance of vulnerability for demo
      const responses = {
        vulnerable: [
          "MySQL Error: You have an error in your SQL syntax near '' OR '1'='1' at line 1",
          "Warning: mysql_fetch_array() expects parameter 1 to be resource, boolean given",
          "Database query failed: Invalid query syntax detected",
          "SQL Error: Unclosed quotation mark after the character string '1'='1'"
        ],
        safe: [
          "No results found for the specified search criteria.",
          "Access denied. Invalid parameters detected.",
          "Query executed successfully with no matching records.",
          "Request processed. No data returned."
        ]
      };
      
      const responseText = isVulnerable 
        ? responses.vulnerable[Math.floor(Math.random() * responses.vulnerable.length)]
        : responses.safe[Math.floor(Math.random() * responses.safe.length)];
      
      const riskLevel = isVulnerable 
        ? ['High', 'Critical'][Math.floor(Math.random() * 2)]
        : 'Low';
      
      setSqlResults({
        vulnerable: isVulnerable,
        response: responseText,
        risk: riskLevel
      });
      setIsTesting(false);
    }, 2500);
  };

  const commonSqlPayloads = [
    "' OR '1'='1",
    "' OR 1=1--",
    "' UNION SELECT NULL--",
    "'; DROP TABLE users--",
    "' OR 1=1#",
    "admin'--",
    "' OR 'a'='a",
    "1' OR '1'='1' /*"
  ];

  // Generate mock network activity data
  const generateNetworkData = (timeFrame: 'live' | '24h' | '7d') => {
    const now = Date.now();
    const dataPoints = timeFrame === 'live' ? 20 : timeFrame === '24h' ? 24 : 7;
    const intervalMs = timeFrame === 'live' ? 5000 : timeFrame === '24h' ? 3600000 : 86400000;
    
    const data = [];
    let anomalies = 0;
    
    for (let i = dataPoints - 1; i >= 0; i--) {
      const timestamp = now - (i * intervalMs);
      const baseTraffic = 30 + Math.sin(i * 0.5) * 15;
      const suspicious = Math.random() * 10 + (Math.random() > 0.8 ? Math.random() * 20 : 0);
      const bandwidth = baseTraffic + suspicious + Math.random() * 20;
      
      if (suspicious > 15) anomalies++;
      
      data.push({
        time: timeFrame === 'live' 
          ? new Date(timestamp).toLocaleTimeString('en-US', { hour12: false })
          : timeFrame === '24h'
          ? new Date(timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
          : new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        normalTraffic: Math.round(baseTraffic),
        suspiciousTraffic: Math.round(suspicious),
        bandwidth: Math.round(bandwidth),
        timestamp
      });
    }
    
    setNetworkData(data);
    setAnomalyCount(anomalies);
  };

  // Initialize and update network data
  useEffect(() => {
    generateNetworkData(timeFrame);
    
    // Auto-refresh for live data
    if (timeFrame === 'live') {
      const interval = setInterval(() => {
        generateNetworkData('live');
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [timeFrame]);

  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-600 rounded-lg p-3 shadow-lg">
          <p className="text-gray-300 text-sm mb-2">{`Time: ${label}`}</p>
          {payload.map((pld: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: pld.color }}>
              {`${pld.name}: ${pld.value}${pld.name === 'Bandwidth' ? ' Mbps' : ' req/s'}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Hash functions (simplified for demo)
  const generateHashes = (input: string) => {
    // Simple hash functions for demo purposes
    const md5Hash = btoa(input + 'md5salt').substring(0, 32);
    const sha1Hash = btoa(input + 'sha1salt').substring(0, 40);
    const sha256Hash = btoa(input + 'sha256salt').substring(0, 64);
    const sha512Hash = btoa(input + 'sha512salt').substring(0, 128);
    
    return {
      md5: md5Hash,
      sha1: sha1Hash,
      sha256: sha256Hash,
      sha512: sha512Hash
    };
  };

  const identifyHashType = (hash: string) => {
    const cleanHash = hash.trim();
    if (cleanHash.length === 32 && /^[a-fA-F0-9]+$/.test(cleanHash)) {
      return 'MD5';
    } else if (cleanHash.length === 40 && /^[a-fA-F0-9]+$/.test(cleanHash)) {
      return 'SHA-1';
    } else if (cleanHash.length === 64 && /^[a-fA-F0-9]+$/.test(cleanHash)) {
      return 'SHA-256';
    } else if (cleanHash.length === 128 && /^[a-fA-F0-9]+$/.test(cleanHash)) {
      return 'SHA-512';
    }
    return null;
  };

  const handleHashGeneration = () => {
    if (!hashInput.trim()) {
      setHashResults(null);
      setIdentifiedHashType(null);
      return;
    }

    const hashes = generateHashes(hashInput);
    setHashResults(hashes);
    
    // Try to identify if the input itself is a hash
    const type = identifyHashType(hashInput);
    setIdentifiedHashType(type);
  };

  const handlePasswordCracking = () => {
    if (!hashInput.trim()) return;

    setIsCracking(true);
    setCrackResult(null);

    // Simulate password cracking process
    setTimeout(() => {
      const commonPasswords = [
        'password', '123456', 'qwerty', 'admin', 'welcome',
        'letmein', 'monkey', 'dragon', 'sunshine', 'iloveyou',
        'password123', 'admin123', 'root', 'toor', 'pass',
        'test', 'guest', 'user', 'login', 'master'
      ];

      // Simulate cracking attempts
      const attempts = Math.floor(Math.random() * 10000) + 1000;
      const timeElapsed = Math.floor(Math.random() * 30) + 5; // 5-35 seconds
      
      // 60% chance of successful crack for demo
      const cracked = Math.random() > 0.4;
      const crackedPassword = cracked 
        ? commonPasswords[Math.floor(Math.random() * commonPasswords.length)]
        : null;

      setCrackResult({
        cracked,
        password: crackedPassword,
        attempts,
        timeElapsed
      });
      setIsCracking(false);
    }, 3000);
  };

  // Encryption/Decryption function (simple Caesar cipher for demo)
  const handleEncryption = () => {
    if (!encryptionText.trim() || !encryptionKey.trim()) {
      setEncryptionResult('Please enter both text and key.');
      return;
    }

    try {
      if (encryptionMode === 'encrypt') {
        // Simple Caesar cipher encryption for demo
        const shift = encryptionKey.charCodeAt(0) % 26;
        const encrypted = encryptionText
          .split('')
          .map(char => {
            if (char.match(/[a-zA-Z]/)) {
              const base = char.charCodeAt(0) < 97 ? 65 : 97;
              return String.fromCharCode(
                ((char.charCodeAt(0) - base + shift) % 26) + base
              );
            }
            return char;
          })
          .join('');
        setEncryptionResult(`Encrypted: ${encrypted}\n\nAlgorithm: ${encryptionAlgorithm}\nKey: ${encryptionKey}`);
      } else {
        // Simple Caesar cipher decryption
        const shift = encryptionKey.charCodeAt(0) % 26;
        const decrypted = encryptionText
          .split('')
          .map(char => {
            if (char.match(/[a-zA-Z]/)) {
              const base = char.charCodeAt(0) < 97 ? 65 : 97;
              return String.fromCharCode(
                ((char.charCodeAt(0) - base - shift + 26) % 26) + base
              );
            }
            return char;
          })
          .join('');
        setEncryptionResult(`Decrypted: ${decrypted}\n\nAlgorithm: ${encryptionAlgorithm}\nKey: ${encryptionKey}`);
      }
    } catch (error) {
      setEncryptionResult('Error: Invalid input or key format.');
    }
  };

  const renderNetworkScanner = () => (
    <div className="space-y-6">
      {/* Network Configuration */}
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 border border-gray-600/50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-cyan-400 mb-4 flex items-center gap-2">
          <Network className="w-5 h-5" />
          Network Configuration
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Target Network/IP
              </label>
              <input
                type="text"
                value={targetNetwork}
                onChange={(e) => setTargetNetwork(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="192.168.1.0/24"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Port Range
              </label>
              <input
                type="text"
                value={portRange}
                onChange={(e) => setPortRange(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="1-1000"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Scan Type
              </label>
              <select
                value={scanType}
                onChange={(e) => setScanType(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                {scanTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Options */}
            <div className="bg-gradient-to-br from-gray-800/30 to-gray-700/20 border border-gray-600/30 rounded-lg p-4">
              <h4 className="text-md font-semibold text-cyan-400 mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Options
              </h4>
              
              <div className="space-y-2">
                {Object.entries({
                  osDetection: 'OS Detection',
                  serviceVersionDetection: 'Service Version Detection',
                  scriptScanning: 'Script Scanning',
                  vulnerabilityAssessment: 'Vulnerability Assessment'
                }).map(([key, label]) => (
                  <label key={key} className="flex items-center gap-2 cursor-pointer">
                    <button
                      onClick={() => toggleOption(key)}
                      className="text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      {options[key as keyof typeof options] ? (
                        <CheckSquare className="w-4 h-4" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                    <span className="text-sm text-gray-300">{label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={handleStartScan}
            disabled={isScanning}
            className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
              isScanning
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white shadow-lg hover:shadow-cyan-500/25'
            }`}
          >
            {isScanning ? (
              <>
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                Scanning...
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Start Scan
              </>
            )}
          </button>
        </div>
      </div>

      {/* Network Activity Graph */}
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

      {/* Scan Results */}
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 border border-gray-600/50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-cyan-400 mb-4 flex items-center gap-2">
          <Search className="w-5 h-5" />
          Scan Results
        </h3>
        
        {scanResults.length === 0 && !isScanning ? (
          <div className="text-center py-12">
            <Shield className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-500">No scan results yet. Start a scan to discover devices.</p>
          </div>
        ) : isScanning ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-cyan-400">Scanning network... Please wait.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-600">
                  <th className="text-left py-3 px-4 text-gray-300">Port</th>
                  <th className="text-left py-3 px-4 text-gray-300">Service</th>
                  <th className="text-left py-3 px-4 text-gray-300">Status</th>
                  <th className="text-left py-3 px-4 text-gray-300">Version</th>
                </tr>
              </thead>
              <tbody>
                {scanResults.map((result, index) => (
                  <tr key={index} className="border-b border-gray-700/50 hover:bg-gray-800/30">
                    <td className="py-3 px-4 font-mono text-cyan-400">{result.port}</td>
                    <td className="py-3 px-4 text-white">{result.service}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        result.status === 'open' ? 'bg-green-900/30 text-green-400 border border-green-600/30' :
                        result.status === 'closed' ? 'bg-red-900/30 text-red-400 border border-red-600/30' :
                        'bg-yellow-900/30 text-yellow-400 border border-yellow-600/30'
                      }`}>
                        {result.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-300">{result.version || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  const renderPasswordAnalyzer = () => (
    <div className="space-y-6">
      {/* Password Input Section */}
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 border border-gray-600/50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-cyan-400 mb-4 flex items-center gap-2">
          <Key className="w-5 h-5" />
          Password Analysis
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Enter Password to Analyze
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                className="w-full px-4 py-3 pr-12 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="Enter your password..."
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Password Strength Results */}
      {passwordStrength && (
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 border border-gray-600/50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-cyan-400 mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Strength Analysis
          </h3>
          
          {/* Strength Score */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-300">Password Strength</span>
              <span className={`text-sm font-semibold ${passwordStrength.color}`}>
                {passwordStrength.label} ({passwordStrength.score}/100)
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  passwordStrength.score >= 85 ? 'bg-gradient-to-r from-green-500 to-green-400' :
                  passwordStrength.score >= 70 ? 'bg-gradient-to-r from-lime-500 to-lime-400' :
                  passwordStrength.score >= 50 ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' :
                  passwordStrength.score >= 30 ? 'bg-gradient-to-r from-orange-500 to-orange-400' :
                  'bg-gradient-to-r from-red-500 to-red-400'
                }`}
                style={{ width: `${passwordStrength.score}%` }}
              />
            </div>
          </div>

          {/* Security Recommendations */}
          <div className="space-y-3">
            <h4 className="text-md font-semibold text-white mb-3">Security Recommendations:</h4>
            {passwordStrength.feedback.map((item, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-gray-800/30 rounded-lg">
                {item.includes('Excellent') ? (
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                )}
                <span className="text-sm text-gray-300">{item}</span>
              </div>
            ))}
          </div>

          {/* Security Tips */}
          <div className="mt-6 p-4 bg-blue-900/20 border border-blue-600/30 rounded-lg">
            <h4 className="text-md font-semibold text-blue-400 mb-2 flex items-center gap-2">
              <Info className="w-4 h-4" />
              Password Security Tips
            </h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Use at least 12 characters for strong passwords</li>
              <li>• Include uppercase, lowercase, numbers, and symbols</li>
              <li>• Avoid personal information and common words</li>
              <li>• Use unique passwords for each account</li>
              <li>• Consider using a password manager</li>
            </ul>
          </div>
        </div>
      )}

      {/* Password Generation Suggestions */}
      {!passwordStrength && (
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 border border-gray-600/50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-cyan-400 mb-4 flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Password Guidelines
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-md font-semibold text-white mb-3">Strong Password Requirements:</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  At least 12 characters long
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Mix of uppercase and lowercase
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Numbers and special characters
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Avoid common patterns
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-md font-semibold text-white mb-3">Weak Password Examples:</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  password123
                </li>
                <li className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  qwerty
                </li>
                <li className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  123456789
                </li>
                <li className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  admin
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderSqlInjectionTester = () => (
    <div className="space-y-6">
      {/* SQL Injection Test Configuration */}
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 border border-gray-600/50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-cyan-400 mb-4 flex items-center gap-2">
          <Database className="w-5 h-5" />
          SQL Injection Test Configuration
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Target URL
            </label>
            <input
              type="text"
              value={sqlUrl}
              onChange={(e) => setSqlUrl(e.target.value)}
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              placeholder="http://example.com/search.php?id=1"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              SQL Payload
            </label>
            <div className="space-y-2">
              <input
                type="text"
                value={sqlPayload}
                onChange={(e) => setSqlPayload(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="' OR '1'='1"
              />
              
              {/* Quick payload selection */}
              <div className="flex flex-wrap gap-2">
                <span className="text-xs text-gray-400 mb-1">Quick payloads:</span>
                {commonSqlPayloads.slice(0, 4).map((payload, index) => (
                  <button
                    key={index}
                    onClick={() => setSqlPayload(payload)}
                    className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 rounded border border-gray-600 transition-colors"
                  >
                    {payload}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={handleSqlInjectionTest}
            disabled={isTesting || !sqlUrl.trim()}
            className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
              isTesting || !sqlUrl.trim()
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white shadow-lg hover:shadow-red-500/25'
            }`}
          >
            {isTesting ? (
              <>
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                Testing...
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Run SQL Injection Test
              </>
            )}
          </button>
        </div>
      </div>

      {/* Test Results */}
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 border border-gray-600/50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-cyan-400 mb-4 flex items-center gap-2">
          <Search className="w-5 h-5" />
          Test Results
        </h3>
        
        {!sqlResults && !isTesting ? (
          <div className="text-center py-12">
            <Database className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-500">No test results yet. Run a test to check for SQL injection vulnerabilities.</p>
          </div>
        ) : isTesting ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-cyan-400">Testing for SQL injection vulnerabilities... Please wait.</p>
          </div>
        ) : sqlResults ? (
          <div className="space-y-4">
            {/* Vulnerability Status */}
            <div className={`p-4 rounded-lg border ${
              sqlResults.vulnerable 
                ? 'bg-red-900/20 border-red-600/30' 
                : 'bg-green-900/20 border-green-600/30'
            }`}>
              <div className="flex items-center gap-3 mb-2">
                {sqlResults.vulnerable ? (
                  <AlertCircle className="w-6 h-6 text-red-400" />
                ) : (
                  <CheckCircle className="w-6 h-6 text-green-400" />
                )}
                <h4 className={`text-lg font-semibold ${
                  sqlResults.vulnerable ? 'text-red-400' : 'text-green-400'
                }`}>
                  {sqlResults.vulnerable ? 'Vulnerability Detected!' : 'No Vulnerability Detected'}
                </h4>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-300">Status: </span>
                  <span className={sqlResults.vulnerable ? 'text-red-400 font-medium' : 'text-green-400 font-medium'}>
                    {sqlResults.vulnerable ? 'VULNERABLE' : 'SECURE'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-300">Risk Level: </span>
                  <span className={`font-medium ${
                    sqlResults.risk === 'Critical' ? 'text-red-400' :
                    sqlResults.risk === 'High' ? 'text-orange-400' :
                    'text-green-400'
                  }`}>
                    {sqlResults.risk}
                  </span>
                </div>
              </div>
            </div>

            {/* Server Response */}
            <div className="bg-gray-800/30 border border-gray-600/30 rounded-lg p-4">
              <h4 className="text-md font-semibold text-white mb-2 flex items-center gap-2">
                <Info className="w-4 h-4" />
                Server Response
              </h4>
              <div className="bg-gray-900/50 rounded p-3 border border-gray-700">
                <code className="text-sm text-gray-300 break-all">
                  {sqlResults.response}
                </code>
              </div>
            </div>

            {/* Recommendations */}
            {sqlResults.vulnerable && (
              <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4">
                <h4 className="text-md font-semibold text-yellow-400 mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Security Recommendations
                </h4>
                <ul className="text-sm text-gray-300 space-y-1 list-disc list-inside">
                  <li>Use parameterized queries or prepared statements</li>
                  <li>Implement proper input validation and sanitization</li>
                  <li>Apply the principle of least privilege to database accounts</li>
                  <li>Keep database software updated with security patches</li>
                  <li>Consider using stored procedures with proper validation</li>
                </ul>
              </div>
            )}
          </div>
        ) : null}
      </div>

      {/* Common Payloads Reference */}
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 border border-gray-600/50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-cyan-400 mb-4 flex items-center gap-2">
          <Database className="w-5 h-5" />
          Common SQL Injection Payloads
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {commonSqlPayloads.map((payload, index) => (
            <div key={index} className="bg-gray-800/30 border border-gray-600/30 rounded p-3">
              <div className="flex items-center justify-between">
                <code className="text-sm text-cyan-400 break-all flex-1">{payload}</code>
                <button
                  onClick={() => setSqlPayload(payload)}
                  className="ml-2 p-1 text-gray-400 hover:text-white transition-colors"
                  title="Use this payload"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-blue-900/20 border border-blue-600/30 rounded">
          <p className="text-sm text-blue-400">
            <strong>Note:</strong> These payloads are for educational purposes only. Always test on authorized systems.
          </p>
        </div>
      </div>
    </div>
  );

  const renderHashAnalyzer = () => (
    <div className="space-y-6">
      {/* Hash Input & Generation */}
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 border border-gray-600/50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-cyan-400 mb-4 flex items-center gap-2">
          <Hash className="w-5 h-5" />
          Hash Generator & Analyzer
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Input Text or Hash
            </label>
            <textarea
              value={hashInput}
              onChange={(e) => setHashInput(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
              placeholder="Enter text to hash or a hash to analyze..."
            />
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleHashGeneration}
              disabled={!hashInput.trim()}
              className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                !hashInput.trim()
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-purple-500/25'
              }`}
            >
              <Hash className="w-4 h-4" />
              Generate Hashes
            </button>
            
            <button
              onClick={handlePasswordCracking}
              disabled={!hashInput.trim() || isCracking}
              className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                !hashInput.trim() || isCracking
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white shadow-lg hover:shadow-red-500/25'
              }`}
            >
              {isCracking ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Cracking...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Crack Hash
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Hash Type Identification */}
      {identifiedHashType && (
        <div className="bg-gradient-to-br from-blue-800/20 to-blue-700/10 border border-blue-600/30 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-400 mb-4 flex items-center gap-2">
            <Search className="w-5 h-5" />
            Hash Type Identification
          </h3>
          
          <div className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-blue-400" />
              <div>
                <h4 className="text-lg font-semibold text-blue-400">Hash Type Detected</h4>
                <p className="text-sm text-gray-300">
                  The input appears to be a <span className="font-mono font-semibold text-blue-400">{identifiedHashType}</span> hash
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Hash length: {hashInput.trim().length} characters
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Generated Hashes */}
      {hashResults && (
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 border border-gray-600/50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-cyan-400 mb-4 flex items-center gap-2">
            <Hash className="w-5 h-5" />
            Generated Hash Values
          </h3>
          
          <div className="space-y-4">
            {Object.entries(hashResults).map(([algorithm, hash]) => (
              <div key={algorithm} className="bg-gray-800/30 border border-gray-600/30 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-md font-semibold text-white uppercase">{algorithm}</h4>
                  <button
                    onClick={() => navigator.clipboard.writeText(hash)}
                    className="p-1 text-gray-400 hover:text-white transition-colors"
                    title="Copy hash"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <div className="bg-gray-900/50 rounded p-3 border border-gray-700">
                  <code className="text-sm text-cyan-300 break-all font-mono">{hash}</code>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Length: {hash.length} characters
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cracking Results */}
      {crackResult && (
        <div className={`bg-gradient-to-br ${crackResult.cracked ? 'from-green-800/20 to-green-700/10 border-green-600/30' : 'from-red-800/20 to-red-700/10 border-red-600/30'} border rounded-lg p-6`}>
          <h3 className={`text-lg font-semibold ${crackResult.cracked ? 'text-green-400' : 'text-red-400'} mb-4 flex items-center gap-2`}>
            {crackResult.cracked ? (
              <>
                <CheckCircle className="w-5 h-5" />
                Hash Cracked Successfully!
              </>
            ) : (
              <>
                <AlertCircle className="w-5 h-5" />
                Hash Cracking Failed
              </>
            )}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`bg-${crackResult.cracked ? 'green' : 'red'}-900/20 border border-${crackResult.cracked ? 'green' : 'red'}-600/30 rounded-lg p-4`}>
              <h4 className={`text-md font-semibold ${crackResult.cracked ? 'text-green-400' : 'text-red-400'} mb-3`}>Result</h4>
              {crackResult.cracked ? (
                <div>
                  <p className="text-sm text-gray-300 mb-2">Password found:</p>
                  <div className="bg-gray-900/50 rounded p-3 border border-gray-700">
                    <code className="text-lg text-green-400 font-mono font-semibold">{crackResult.password}</code>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-300">
                  The hash could not be cracked with the current dictionary. 
                  This could indicate a strong password or an unknown hash type.
                </p>
              )}
            </div>
            
            <div className="bg-gray-800/30 border border-gray-600/30 rounded-lg p-4">
              <h4 className="text-md font-semibold text-white mb-3 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Statistics
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Attempts Made:</span>
                  <span className="text-cyan-400 font-mono">{crackResult.attempts.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Time Elapsed:</span>
                  <span className="text-cyan-400 font-mono">{crackResult.timeElapsed}s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Speed:</span>
                  <span className="text-cyan-400 font-mono">
                    {Math.round(crackResult.attempts / crackResult.timeElapsed).toLocaleString()} attempts/s
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Educational Information */}
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 border border-gray-600/50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-cyan-400 mb-4 flex items-center gap-2">
          <Info className="w-5 h-5" />
          About Hash Functions & Cracking
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-md font-semibold text-white mb-3">Hash Function Types:</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-purple-400 font-mono text-xs mt-1">MD5:</span>
                <span>128-bit, fast but cryptographically broken</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 font-mono text-xs mt-1">SHA-1:</span>
                <span>160-bit, deprecated for security use</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 font-mono text-xs mt-1">SHA-256:</span>
                <span>256-bit, currently secure and widely used</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-400 font-mono text-xs mt-1">SHA-512:</span>
                <span>512-bit, high security applications</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-md font-semibold text-white mb-3">Cracking Methods:</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <Zap className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                <span>Dictionary attacks using common passwords</span>
              </li>
              <li className="flex items-start gap-2">
                <Zap className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                <span>Brute force attacks on all combinations</span>
              </li>
              <li className="flex items-start gap-2">
                <Zap className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                <span>Rainbow tables for precomputed hashes</span>
              </li>
              <li className="flex items-start gap-2">
                <Zap className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                <span>Hybrid attacks combining methods</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-yellow-900/20 border border-yellow-600/30 rounded-lg">
          <h4 className="text-md font-semibold text-yellow-400 mb-2 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Security Best Practices
          </h4>
          <ul className="text-sm text-gray-300 space-y-1 list-disc list-inside">
            <li>Use strong, unique passwords for each account</li>
            <li>Implement proper salting when storing password hashes</li>
            <li>Use modern, secure hashing algorithms (bcrypt, Argon2)</li>
            <li>Never store passwords in plain text</li>
            <li>Consider multi-factor authentication for additional security</li>
          </ul>
        </div>
      </div>
    </div>
  );

  const renderEncryptionTool = () => (
    <div className="space-y-6">
      {/* Encryption Configuration */}
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 border border-gray-600/50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-cyan-400 mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Encryption Tool Configuration
        </h3>
        
        <div className="space-y-4">
          {/* Mode Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Operation Mode
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="encryptionMode"
                  value="encrypt"
                  checked={encryptionMode === 'encrypt'}
                  onChange={(e) => setEncryptionMode(e.target.value as 'encrypt' | 'decrypt')}
                  className="text-cyan-500 focus:ring-cyan-500"
                />
                <Lock className="w-4 h-4 text-green-400" />
                <span className="text-sm text-gray-300">Encrypt</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="encryptionMode"
                  value="decrypt"
                  checked={encryptionMode === 'decrypt'}
                  onChange={(e) => setEncryptionMode(e.target.value as 'encrypt' | 'decrypt')}
                  className="text-cyan-500 focus:ring-cyan-500"
                />
                <Unlock className="w-4 h-4 text-orange-400" />
                <span className="text-sm text-gray-300">Decrypt</span>
              </label>
            </div>
          </div>

          {/* Algorithm Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Encryption Algorithm
            </label>
            <select
              value={encryptionAlgorithm}
              onChange={(e) => setEncryptionAlgorithm(e.target.value)}
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            >
              <option value="AES-256">AES-256 (Demo - Caesar Cipher)</option>
              <option value="DES">DES (Demo - Caesar Cipher)</option>
              <option value="RSA">RSA (Demo - Caesar Cipher)</option>
            </select>
            <p className="text-xs text-gray-400 mt-1">
              Note: This is a demo implementation using Caesar cipher for educational purposes.
            </p>
          </div>

          {/* Text Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {encryptionMode === 'encrypt' ? 'Text to Encrypt' : 'Text to Decrypt'}
            </label>
            <textarea
              value={encryptionText}
              onChange={(e) => setEncryptionText(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
              placeholder={encryptionMode === 'encrypt' ? 'Enter text to encrypt...' : 'Enter encrypted text to decrypt...'}
            />
          </div>

          {/* Key Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Encryption Key
            </label>
            <input
              type="text"
              value={encryptionKey}
              onChange={(e) => setEncryptionKey(e.target.value)}
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              placeholder="Enter encryption key..."
            />
            <p className="text-xs text-gray-400 mt-1">
              For this demo, any character will work as a key (e.g., 'A', 'secretkey', '123').
            </p>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={handleEncryption}
            disabled={!encryptionText.trim() || !encryptionKey.trim()}
            className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
              !encryptionText.trim() || !encryptionKey.trim()
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : encryptionMode === 'encrypt'
                ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-green-500/25'
                : 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-lg hover:shadow-orange-500/25'
            }`}
          >
            {encryptionMode === 'encrypt' ? (
              <>
                <Lock className="w-4 h-4" />
                Encrypt Text
              </>
            ) : (
              <>
                <Unlock className="w-4 h-4" />
                Decrypt Text
              </>
            )}
          </button>
        </div>
      </div>

      {/* Encryption Results */}
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 border border-gray-600/50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-cyan-400 mb-4 flex items-center gap-2">
          <Key className="w-5 h-5" />
          {encryptionMode === 'encrypt' ? 'Encryption' : 'Decryption'} Results
        </h3>
        
        {encryptionResult ? (
          <div className="space-y-4">
            {/* Result Display */}
            <div className="bg-gray-800/30 border border-gray-600/30 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-md font-semibold text-white flex items-center gap-2">
                  {encryptionMode === 'encrypt' ? (
                    <>
                      <Lock className="w-4 h-4 text-green-400" />
                      Encrypted Output
                    </>
                  ) : (
                    <>
                      <Unlock className="w-4 h-4 text-orange-400" />
                      Decrypted Output
                    </>
                  )}
                </h4>
                <button
                  onClick={() => navigator.clipboard.writeText(encryptionResult)}
                  className="p-1 text-gray-400 hover:text-white transition-colors"
                  title="Copy to clipboard"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <div className="bg-gray-900/50 rounded p-3 border border-gray-700">
                <pre className="text-sm text-gray-300 whitespace-pre-wrap break-all">
                  {encryptionResult}
                </pre>
              </div>
            </div>

            {/* Clear Results Button */}
            <button
              onClick={() => setEncryptionResult('')}
              className="px-4 py-2 text-sm bg-gray-700 hover:bg-gray-600 text-gray-300 rounded border border-gray-600 transition-colors"
            >
              Clear Results
            </button>
          </div>
        ) : (
          <div className="text-center py-12">
            <Key className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-500">
              No {encryptionMode === 'encrypt' ? 'encryption' : 'decryption'} performed yet. 
              Enter text and a key, then click the {encryptionMode === 'encrypt' ? 'Encrypt' : 'Decrypt'} button.
            </p>
          </div>
        )}
      </div>

      {/* How It Works */}
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 border border-gray-600/50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-cyan-400 mb-4 flex items-center gap-2">
          <Info className="w-5 h-5" />
          How This Demo Works
        </h3>
        
        <div className="space-y-3 text-sm text-gray-300">
          <p>
            This encryption tool demonstrates basic cryptographic concepts using a simplified Caesar cipher implementation:
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-400 ml-4">
            <li>The first character of your key determines the shift amount</li>
            <li>Only alphabetic characters are encrypted/decrypted</li>
            <li>Numbers, spaces, and special characters remain unchanged</li>
            <li>Case is preserved during the transformation</li>
          </ul>
          <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-600/30 rounded">
            <p className="text-yellow-400 text-xs">
              <strong>Educational Purpose:</strong> This is a simplified demonstration. 
              Real-world encryption uses much more sophisticated algorithms like AES, RSA, etc.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPlaceholder = (toolName: string) => (
    <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 border border-gray-600/50 rounded-lg p-8 text-center">
      <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-300 mb-2">{toolName}</h3>
      <p className="text-gray-500">This tool is under development and will be available soon.</p>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold mb-2">Security Tools Lab</h2>
        <p className="text-gray-400">Hands-on practice with cybersecurity tools</p>
      </div>

      {/* Tool Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-700 pb-4">
        {tools.map(tool => {
          const Icon = tool.icon;
          return (
            <button
              key={tool.id}
              onClick={() => setActiveTab(tool.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === tool.id
                  ? 'bg-cyan-600/20 border border-cyan-600/30 text-cyan-400'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{tool.name}</span>
            </button>
          );
        })}
      </div>

      {/* Tool Content */}
      <div>
        {activeTab === 'network-scanner' && renderNetworkScanner()}
        {activeTab === 'password-analyzer' && renderPasswordAnalyzer()}
        {activeTab === 'encryption-tool' && renderEncryptionTool()}
        {activeTab === 'sql-injection' && renderSqlInjectionTester()}
        {activeTab === 'hash-analyzer' && renderHashAnalyzer()}
      </div>

      {/* Footer */}
      <div className="text-center text-gray-500 text-sm border-t border-gray-700 pt-4">
        CyberSim Lab © 2025 • Secure Environment
      </div>
    </div>
  );
};

export default SecurityTools;
