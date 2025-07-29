import React, { useState } from 'react';
import { Activity, Globe, User, Shield, Monitor, Target, Brain, Play, CheckCircle, Clock, AlertTriangle, Search, FileText, Network, Eye, ArrowRight, ArrowLeft, Download, Trash2, Home, Folder, File } from 'lucide-react';
import InteractiveQuiz from './InteractiveQuiz';

interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'networking' | 'forensics' | 'threat-detection' | 'incident-response';
  points: number;
  completed: boolean;
}

const ThreatHuntingChallenges: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'challenges' | 'quiz'>('challenges');
  const [activeChallengeId, setActiveChallengeId] = useState<string | null>(null);
  const [challenges, setChallenges] = useState<Challenge[]>([
    {
      id: 'network-analysis',
      title: 'Network Traffic Analysis',
      description: 'Analyze captured network packets to identify anomalies.',
      difficulty: 'medium',
      category: 'networking',
      points: 50,
      completed: false
    },
    {
      id: 'threat-detection',
      title: 'Suspicious Activity Detection',
      description: 'Use given logs to detect and report suspicious activities.',
      difficulty: 'hard',
      category: 'threat-detection',
      points: 100,
      completed: false
    },
    {
      id: 'incident-response-sim',
      title: 'Incident Response Simulation',
      description: 'Participate in a simulated incident to practice response strategies.',
      difficulty: 'hard',
      category: 'incident-response',
      points: 150,
      completed: false
    },
    {
      id: 'forensic-analysis',
      title: 'Digital Forensics Challenge',
      description: 'Perform forensic analysis on provided virtual machine images.',
      difficulty: 'easy',
      category: 'forensics',
      points: 30,
      completed: false
    }
  ]);

  const handleToggleCompletion = (id: string) => {
    setChallenges(prev => prev.map(challenge =>
      challenge.id === id ? { ...challenge, completed: !challenge.completed } : challenge
    ));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-700/30 text-green-400';
      case 'medium': return 'bg-yellow-700/30 text-yellow-400';
      case 'hard': return 'bg-red-700/30 text-red-400';
      default: return 'bg-gray-700/30 text-gray-400';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'networking': return Globe;
      case 'forensics': return Monitor;
      case 'threat-detection': return Target;
      case 'incident-response': return Shield;
      default: return Activity;
    }
  };

  // Network Traffic Analysis Challenge
  const NetworkAnalysisChallenge = () => {
    const [selectedPacket, setSelectedPacket] = useState<number | null>(null);
    const [findings, setFindings] = useState<string[]>([]);
    
    const packets = [
      { id: 1, time: '10:24:15', src: '192.168.1.105', dst: '192.168.1.1', protocol: 'HTTP', length: 1024, suspicious: false, info: 'Normal web traffic' },
      { id: 2, time: '10:24:18', src: '192.168.1.105', dst: '8.8.8.8', protocol: 'DNS', length: 64, suspicious: false, info: 'DNS query for google.com' },
      { id: 3, time: '10:24:22', src: '10.0.0.15', dst: '192.168.1.105', protocol: 'TCP', length: 0, suspicious: true, info: 'Port scan attempt - SYN flood' },
      { id: 4, time: '10:24:25', src: '192.168.1.105', dst: '203.0.113.5', protocol: 'HTTP', length: 2048, suspicious: false, info: 'File download' },
      { id: 5, time: '10:24:30', src: '198.51.100.10', dst: '192.168.1.105', protocol: 'ICMP', length: 32, suspicious: true, info: 'ICMP flood attack detected' },
      { id: 6, time: '10:24:35', src: '192.168.1.105', dst: '192.168.1.254', protocol: 'SSH', length: 128, suspicious: true, info: 'Multiple failed SSH login attempts' }
    ];

    const analyzePacket = (packet: any) => {
      setSelectedPacket(packet.id);
      if (packet.suspicious && !findings.includes(packet.info)) {
        setFindings(prev => [...prev, packet.info]);
      }
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold text-white flex items-center gap-2">
            <Network className="w-5 h-5" />
            Network Traffic Analysis
          </h4>
          <button 
            onClick={() => setActiveChallengeId(null)}
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-gray-800/50 rounded-lg p-4">
          <h5 className="text-white font-medium mb-3">Captured Network Packets</h5>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {packets.map(packet => (
              <div 
                key={packet.id}
                className={`p-3 rounded-lg cursor-pointer transition-all ${
                  packet.suspicious 
                    ? 'bg-red-900/20 border border-red-600/30 hover:bg-red-900/30' 
                    : 'bg-gray-700/30 border border-gray-600/30 hover:bg-gray-700/50'
                } ${selectedPacket === packet.id ? 'ring-2 ring-cyan-500/50' : ''}`}
                onClick={() => analyzePacket(packet)}
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-300">{packet.time}</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    packet.suspicious ? 'bg-red-600/20 text-red-400' : 'bg-gray-600/20 text-gray-400'
                  }`}>
                    {packet.protocol}
                  </span>
                </div>
                <div className="text-sm text-gray-400 mt-1">
                  {packet.src} → {packet.dst} ({packet.length} bytes)
                </div>
                <div className="text-xs text-gray-500 mt-1">{packet.info}</div>
              </div>
            ))}
          </div>
        </div>

        {findings.length > 0 && (
          <div className="bg-red-900/20 border border-red-600/30 rounded-lg p-4">
            <h5 className="text-red-400 font-medium mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Security Findings
            </h5>
            <ul className="space-y-1">
              {findings.map((finding, index) => (
                <li key={index} className="text-red-300 text-sm">• {finding}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="text-center">
          <button 
            onClick={() => {
              handleToggleCompletion('network-analysis');
              setActiveChallengeId(null);
            }}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors"
          >
            Complete Challenge
          </button>
        </div>
      </div>
    );
  };

  // Suspicious Activity Detection Challenge
  const ThreatDetectionChallenge = () => {
    const [selectedLogs, setSelectedLogs] = useState<number[]>([]);
    const [analysis, setAnalysis] = useState<string>('');
    
    const logs = [
      { id: 1, timestamp: '2024-01-15 14:23:41', level: 'INFO', source: 'web-server', message: 'User login successful: admin@company.com', suspicious: false },
      { id: 2, timestamp: '2024-01-15 14:24:12', level: 'WARN', source: 'firewall', message: 'Multiple connection attempts from 203.0.113.15', suspicious: true },
      { id: 3, timestamp: '2024-01-15 14:24:15', level: 'ERROR', source: 'database', message: 'SQL injection attempt detected: UNION SELECT * FROM users', suspicious: true },
      { id: 4, timestamp: '2024-01-15 14:24:20', level: 'INFO', source: 'web-server', message: 'File upload completed: document.pdf', suspicious: false },
      { id: 5, timestamp: '2024-01-15 14:24:35', level: 'CRITICAL', source: 'antivirus', message: 'Malware detected: Trojan.Win32.Generic in C:\\temp\\file.exe', suspicious: true },
      { id: 6, timestamp: '2024-01-15 14:25:01', level: 'WARN', source: 'auth-service', message: 'Failed login attempts: 15 consecutive failures for user: admin', suspicious: true }
    ];

    const toggleLogSelection = (id: number) => {
      setSelectedLogs(prev => 
        prev.includes(id) ? prev.filter(logId => logId !== id) : [...prev, id]
      );
    };

    const generateAnalysis = () => {
      const selectedSuspicious = logs.filter(log => selectedLogs.includes(log.id) && log.suspicious);
      const missedSuspicious = logs.filter(log => !selectedLogs.includes(log.id) && log.suspicious);
      
      let analysisText = `Analysis Results:\n\n`;
      analysisText += `✅ Correctly identified: ${selectedSuspicious.length} suspicious activities\n`;
      analysisText += `❌ Missed: ${missedSuspicious.length} suspicious activities\n\n`;
      
      if (selectedSuspicious.length > 0) {
        analysisText += "Threats identified:\n";
        selectedSuspicious.forEach(log => {
          analysisText += `• ${log.source}: ${log.message}\n`;
        });
      }
      
      setAnalysis(analysisText);
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold text-white flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Suspicious Activity Detection
          </h4>
          <button 
            onClick={() => setActiveChallengeId(null)}
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-gray-800/50 rounded-lg p-4">
          <h5 className="text-white font-medium mb-3">Security Logs - Select Suspicious Activities</h5>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {logs.map(log => (
              <div 
                key={log.id}
                className={`p-3 rounded-lg cursor-pointer transition-all border ${
                  selectedLogs.includes(log.id) 
                    ? 'bg-cyan-900/30 border-cyan-500/50' 
                    : 'bg-gray-700/30 border-gray-600/30 hover:bg-gray-700/50'
                }`}
                onClick={() => toggleLogSelection(log.id)}
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-300">{log.timestamp}</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    log.level === 'CRITICAL' ? 'bg-red-600/20 text-red-400' :
                    log.level === 'ERROR' ? 'bg-orange-600/20 text-orange-400' :
                    log.level === 'WARN' ? 'bg-yellow-600/20 text-yellow-400' :
                    'bg-gray-600/20 text-gray-400'
                  }`}>
                    {log.level}
                  </span>
                </div>
                <div className="text-sm text-gray-400 mt-1">[{log.source}] {log.message}</div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 flex gap-2">
            <button 
              onClick={generateAnalysis}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors"
            >
              Analyze Selected Logs
            </button>
            <button 
              onClick={() => setSelectedLogs([])}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              Clear Selection
            </button>
          </div>
        </div>

        {analysis && (
          <div className="bg-gray-800/50 rounded-lg p-4">
            <h5 className="text-cyan-400 font-medium mb-2">Analysis Report</h5>
            <pre className="text-gray-300 text-sm whitespace-pre-wrap">{analysis}</pre>
          </div>
        )}

        <div className="text-center">
          <button 
            onClick={() => {
              handleToggleCompletion('threat-detection');
              setActiveChallengeId(null);
            }}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors"
          >
            Complete Challenge
          </button>
        </div>
      </div>
    );
  };

  // Incident Response Simulation Challenge
  const IncidentResponseChallenge = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [completedSteps, setCompletedSteps] = useState<number[]>([]);
    const [responses, setResponses] = useState<{[key: number]: string}>({});
    
    const incident = {
      title: "Suspected Data Breach",
      description: "Multiple failed login attempts detected, followed by successful access to sensitive database.",
      severity: "HIGH",
      timeline: "2024-01-15 14:30:00 - Present"
    };

    const steps = [
      {
        id: 0,
        title: "Initial Assessment",
        description: "Evaluate the scope and severity of the incident",
        action: "What is your immediate priority?",
        options: ["Contain the threat", "Notify stakeholders", "Collect evidence", "Restore services"]
      },
      {
        id: 1,
        title: "Containment",
        description: "Implement measures to prevent further damage",
        action: "How do you contain this incident?",
        options: ["Disable affected accounts", "Isolate network segments", "Block suspicious IPs", "All of the above"]
      },
      {
        id: 2,
        title: "Investigation",
        description: "Gather evidence and analyze the attack vector",
        action: "What evidence should you collect first?",
        options: ["System logs", "Network traffic captures", "Memory dumps", "All of the above"]
      },
      {
        id: 3,
        title: "Communication",
        description: "Notify relevant parties about the incident",
        action: "Who should be notified immediately?",
        options: ["IT Security team", "Management", "Legal department", "All stakeholders"]
      },
      {
        id: 4,
        title: "Recovery",
        description: "Restore systems and implement additional security measures",
        action: "What is the priority for system recovery?",
        options: ["Patch vulnerabilities", "Restore from clean backups", "Update security policies", "All of the above"]
      }
    ];

    const handleStepResponse = (stepId: number, response: string) => {
      setResponses(prev => ({ ...prev, [stepId]: response }));
      setCompletedSteps(prev => [...prev, stepId]);
      if (stepId < steps.length - 1) {
        setCurrentStep(stepId + 1);
      }
    };

    const resetSimulation = () => {
      setCurrentStep(0);
      setCompletedSteps([]);
      setResponses({});
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold text-white flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Incident Response Simulation
          </h4>
          <button 
            onClick={() => setActiveChallengeId(null)}
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Incident Overview */}
        <div className="bg-red-900/20 border border-red-600/30 rounded-lg p-4">
          <h5 className="text-red-400 font-medium mb-2 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            {incident.title}
          </h5>
          <p className="text-red-300 text-sm mb-2">{incident.description}</p>
          <div className="flex gap-4 text-xs">
            <span className="text-red-400">Severity: {incident.severity}</span>
            <span className="text-red-400">Timeline: {incident.timeline}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-gray-800/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-300 text-sm">Progress</span>
            <span className="text-gray-300 text-sm">{completedSteps.length}/{steps.length}</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-cyan-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(completedSteps.length / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Current Step */}
        {currentStep < steps.length && (
          <div className="bg-gray-800/50 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                {currentStep + 1}
              </div>
              <h5 className="text-white font-medium">{steps[currentStep].title}</h5>
            </div>
            <p className="text-gray-400 text-sm mb-4">{steps[currentStep].description}</p>
            <p className="text-white mb-4">{steps[currentStep].action}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {steps[currentStep].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleStepResponse(currentStep, option)}
                  className="p-3 text-left bg-gray-700/50 hover:bg-gray-700 border border-gray-600/50 rounded-lg text-gray-300 transition-colors"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Completed Steps Summary */}
        {completedSteps.length > 0 && (
          <div className="bg-gray-800/50 rounded-lg p-4">
            <h5 className="text-cyan-400 font-medium mb-3">Response Summary</h5>
            <div className="space-y-2">
              {completedSteps.map(stepId => (
                <div key={stepId} className="flex items-center justify-between p-2 bg-gray-700/30 rounded">
                  <span className="text-gray-300 text-sm">{steps[stepId].title}</span>
                  <span className="text-cyan-400 text-sm">{responses[stepId]}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Completion */}
        {completedSteps.length === steps.length && (
          <div className="bg-green-900/20 border border-green-600/30 rounded-lg p-4 text-center">
            <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-2" />
            <h5 className="text-green-400 font-medium mb-2">Incident Response Complete!</h5>
            <p className="text-green-300 text-sm mb-4">You have successfully completed all response phases.</p>
            <div className="flex gap-2 justify-center">
              <button 
                onClick={resetSimulation}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Reset Simulation
              </button>
              <button 
                onClick={() => {
                  handleToggleCompletion('incident-response-sim');
                  setActiveChallengeId(null);
                }}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors"
              >
                Complete Challenge
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Digital Forensics Challenge
  const ForensicsChallenge = () => {
    const [currentPath, setCurrentPath] = useState('/home/user');
    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const [evidence, setEvidence] = useState<string[]>([]);
    const [fileContent, setFileContent] = useState<string>('');
    
    const fileSystem: {[key: string]: any} = {
      '/': {
        type: 'directory',
        children: ['home', 'var', 'tmp']
      },
      '/home': {
        type: 'directory',
        children: ['user']
      },
      '/home/user': {
        type: 'directory',
        children: ['Documents', 'Downloads', '.hidden_folder', 'suspicious.txt']
      },
      '/home/user/Documents': {
        type: 'directory',
        children: ['notes.txt', 'passwords.xlsx']
      },
      '/home/user/Downloads': {
        type: 'directory',
        children: ['malware.exe', 'invoice.pdf']
      },
      '/home/user/.hidden_folder': {
        type: 'directory',
        children: ['secret_data.db', 'keylogger.log']
      },
      '/var': {
        type: 'directory',
        children: ['log']
      },
      '/var/log': {
        type: 'directory',
        children: ['system.log', 'security.log']
      },
      '/tmp': {
        type: 'directory',
        children: ['temp_files.zip']
      }
    };

    const fileContents: {[key: string]: string} = {
      '/home/user/suspicious.txt': 'Meeting at warehouse tonight. Bring the USB drive.',
      '/home/user/Documents/passwords.xlsx': 'admin:p@ssw0rd123\nroot:toor\ndatabase:secret123',
      '/home/user/.hidden_folder/secret_data.db': 'SENSITIVE DATA: Customer credit card numbers\n4532 1234 5678 9012\n4111 1111 1111 1111',
      '/home/user/.hidden_folder/keylogger.log': 'Keystroke log:\n[14:23] facebook.com login\n[14:24] Password: mypassword123\n[14:25] Banking site accessed',
      '/var/log/security.log': 'Failed login attempt from 192.168.1.100\nSuccessful privilege escalation detected\nUnauthorized file access: /etc/passwd',
      '/home/user/Downloads/malware.exe': 'BINARY FILE - Trojan detected by antivirus',
      '/tmp/temp_files.zip': 'Archive contains: stolen_documents.pdf, credentials.txt'
    };

    const suspiciousFiles = [
      '/home/user/suspicious.txt',
      '/home/user/Documents/passwords.xlsx', 
      '/home/user/.hidden_folder/secret_data.db',
      '/home/user/.hidden_folder/keylogger.log',
      '/var/log/security.log',
      '/home/user/Downloads/malware.exe',
      '/tmp/temp_files.zip'
    ];

    const navigateToPath = (path: string) => {
      setCurrentPath(path);
      setSelectedFile(null);
      setFileContent('');
    };

    const selectFile = (fileName: string) => {
      const fullPath = currentPath === '/' ? `/${fileName}` : `${currentPath}/${fileName}`;
      setSelectedFile(fullPath);
      
      if (fileContents[fullPath]) {
        setFileContent(fileContents[fullPath]);
        if (suspiciousFiles.includes(fullPath) && !evidence.includes(fullPath)) {
          setEvidence(prev => [...prev, fullPath]);
        }
      } else {
        setFileContent('File content not available or binary file.');
      }
    };

    const getCurrentFiles = () => {
      const current = fileSystem[currentPath];
      if (current && current.type === 'directory') {
        return current.children || [];
      }
      return [];
    };

    const getParentPath = () => {
      if (currentPath === '/') return '/';
      const parts = currentPath.split('/').filter(p => p);
      parts.pop();
      return parts.length === 0 ? '/' : '/' + parts.join('/');
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold text-white flex items-center gap-2">
            <Monitor className="w-5 h-5" />
            Digital Forensics Challenge
          </h4>
          <button 
            onClick={() => setActiveChallengeId(null)}
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4">
          <h5 className="text-yellow-400 font-medium mb-2">Investigation Brief</h5>
          <p className="text-yellow-300 text-sm">
            A company laptop has been seized during a security incident. Your task is to examine the file system 
            and identify any suspicious files that could be evidence of malicious activity.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* File Explorer */}
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h5 className="text-white font-medium flex items-center gap-2">
                <Folder className="w-4 h-4" />
                File System Explorer
              </h5>
              <span className="text-gray-400 text-sm">{currentPath}</span>
            </div>
            
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {currentPath !== '/' && (
                <div 
                  className="flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-gray-700/50"
                  onClick={() => navigateToPath(getParentPath())}
                >
                  <ArrowLeft className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-400">..</span>
                </div>
              )}
              
              {getCurrentFiles().map((item, index) => {
                const fullPath = currentPath === '/' ? `/${item}` : `${currentPath}/${item}`;
                const isDirectory = fileSystem[fullPath]?.type === 'directory';
                const isSuspicious = suspiciousFiles.includes(fullPath);
                
                return (
                  <div 
                    key={index}
                    className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${
                      isSuspicious ? 'bg-red-900/20 hover:bg-red-900/30' : 'hover:bg-gray-700/50'
                    } ${selectedFile === fullPath ? 'bg-cyan-900/30 border border-cyan-500/50' : ''}`}
                    onClick={() => isDirectory ? navigateToPath(fullPath) : selectFile(item)}
                  >
                    {isDirectory ? 
                      <Folder className="w-4 h-4 text-blue-400" /> : 
                      <File className="w-4 h-4 text-gray-400" />
                    }
                    <span className={`${isSuspicious ? 'text-red-400' : 'text-gray-300'}`}>
                      {item}
                    </span>
                    {isSuspicious && <AlertTriangle className="w-3 h-3 text-red-400" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* File Content Viewer */}
          <div className="bg-gray-800/50 rounded-lg p-4">
            <h5 className="text-white font-medium mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              File Content Viewer
            </h5>
            
            {selectedFile ? (
              <div className="space-y-3">
                <div className="text-sm text-gray-400 border-b border-gray-600 pb-2">
                  {selectedFile}
                </div>
                <div className="bg-gray-900/50 rounded p-3 max-h-64 overflow-y-auto">
                  <pre className="text-gray-300 text-sm whitespace-pre-wrap">{fileContent}</pre>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Select a file to view its contents</p>
              </div>
            )}
          </div>
        </div>

        {/* Evidence Collection */}
        {evidence.length > 0 && (
          <div className="bg-green-900/20 border border-green-600/30 rounded-lg p-4">
            <h5 className="text-green-400 font-medium mb-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Evidence Collected ({evidence.length}/{suspiciousFiles.length})
            </h5>
            <div className="space-y-1">
              {evidence.map((file, index) => (
                <div key={index} className="text-green-300 text-sm">• {file}</div>
              ))}
            </div>
          </div>
        )}

        <div className="text-center">
          <button 
            onClick={() => {
              handleToggleCompletion('forensic-analysis');
              setActiveChallengeId(null);
            }}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors"
          >
            Complete Challenge
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-cyan-400 flex items-center gap-2">
          <User className="w-5 h-5" />
          Learning Center
        </h3>
        <div className="text-sm text-gray-400">
          Interactive challenges and AI-powered quizzes
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 bg-gray-800/50 rounded-lg p-1 w-fit">
        <button
          onClick={() => setActiveTab('challenges')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            activeTab === 'challenges'
              ? 'bg-cyan-600/20 border border-cyan-600/30 text-cyan-400'
              : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
          }`}
        >
          <Target className="w-4 h-4" />
          Practice Challenges
        </button>
        <button
          onClick={() => setActiveTab('quiz')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            activeTab === 'quiz'
              ? 'bg-cyan-600/20 border border-cyan-600/30 text-cyan-400'
              : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
          }`}
        >
          <Brain className="w-4 h-4" />
          AI Knowledge Quiz
        </button>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'challenges' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-white">Practice Challenges</h4>
            <div className="text-sm text-gray-400">
              Complete hands-on security challenges
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.map(challenge => {
              const CategoryIcon = getCategoryIcon(challenge.category);
              return (
                <div
                  key={challenge.id}
                  className={`bg-gradient-to-br from-gray-800/50 to-gray-700/30 border border-gray-600/50 rounded-lg p-6 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10 hover:border-cyan-500/30 ${
                    challenge.completed ? 'opacity-50' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <CategoryIcon className={`w-6 h-6 ${getDifficultyColor(challenge.difficulty)}`} />
                    <div className={`px-2 py-1 rounded-full text-xs border ${getDifficultyColor(challenge.difficulty)}`}>
                      {challenge.difficulty}
                    </div>
                  </div>

                  <h4 className="text-lg font-semibold text-white mb-2">
                    {challenge.title}
                  </h4>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {challenge.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">
                      {challenge.points} Points
                    </span>
                    <button
                      onClick={() => handleToggleCompletion(challenge.id)}
                      className="px-3 py-1 bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-600/30 rounded text-cyan-400 text-xs transition-colors"
                    >
                      {challenge.completed ? 'Redo' : 'Complete'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {challenges.length === 0 && (
            <div className="text-center py-12">
              <Activity className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-500">
                No challenges available.
              </p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'quiz' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-white">AI Knowledge Quiz</h4>
            <div className="text-sm text-gray-400">
              Test yourself with dynamically generated questions
            </div>
          </div>
          
          <InteractiveQuiz />
        </div>
      )}
    </div>
  );
};

export default ThreatHuntingChallenges;
