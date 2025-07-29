import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, BookOpen, Target, Shield, Zap, CheckCircle, XCircle, Brain, Trophy } from 'lucide-react';

interface FlashCard {
  id: string;
  category: string;
  question: string;
  answer: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  hints?: string[];
  relatedConcepts?: string[];
}

const NetworkFlashCards: React.FC = () => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [studyMode, setStudyMode] = useState<'learn' | 'quiz'>('learn');
  const [quizScore, setQuizScore] = useState({ correct: 0, total: 0 });
  const [showHints, setShowHints] = useState(false);
  const [masteredCards, setMasteredCards] = useState<Set<string>>(new Set());

  const flashCards: FlashCard[] = [
    {
      id: '1',
      category: 'Network Protocols',
      question: 'What is the difference between TCP and UDP protocols?',
      answer: 'TCP (Transmission Control Protocol) is connection-oriented, reliable, and ensures data delivery with error checking and flow control. UDP (User Datagram Protocol) is connectionless, faster, but unreliable with no guaranteed delivery.',
      difficulty: 'beginner',
      hints: ['Think about reliability vs speed', 'One establishes connections, the other doesn\'t'],
      relatedConcepts: ['OSI Model', 'Port Numbers', 'Network Security']
    },
    {
      id: '2',
      category: 'Network Attacks',
      question: 'What is a DDoS attack and how does it work?',
      answer: 'A Distributed Denial of Service (DDoS) attack overwhelms a target server or network with traffic from multiple sources, making it unavailable to legitimate users. Attackers use botnets to coordinate the attack from thousands of compromised devices.',
      difficulty: 'intermediate',
      hints: ['Think about overwhelming resources', 'Multiple sources are involved'],
      relatedConcepts: ['Botnet', 'Traffic Analysis', 'Load Balancing']
    },
    {
      id: '3',
      category: 'Network Security',
      question: 'What is the purpose of a firewall in network security?',
      answer: 'A firewall acts as a barrier between trusted and untrusted networks, controlling incoming and outgoing traffic based on predetermined security rules. It can be hardware-based, software-based, or both.',
      difficulty: 'beginner',
      hints: ['Think of it as a security guard', 'It controls traffic flow'],
      relatedConcepts: ['Access Control Lists', 'Network Segmentation', 'Intrusion Detection']
    },
    {
      id: '4',
      category: 'Network Attacks',
      question: 'How does a Man-in-the-Middle (MITM) attack work?',
      answer: 'In a MITM attack, an attacker intercepts communication between two parties, potentially reading, modifying, or injecting malicious content. Common methods include ARP spoofing, DNS spoofing, and rogue Wi-Fi access points.',
      difficulty: 'intermediate',
      hints: ['The attacker positions themselves between communicating parties', 'They can intercept and modify data'],
      relatedConcepts: ['Encryption', 'Certificate Validation', 'Network Monitoring']
    },
    {
      id: '5',
      category: 'Network Protocols',
      question: 'What is the role of DNS in network communication?',
      answer: 'DNS (Domain Name System) translates human-readable domain names (like google.com) into IP addresses that computers use to identify each other on the network. It acts as the internet\'s phone book.',
      difficulty: 'beginner',
      hints: ['It translates something human-readable', 'Think about how you access websites'],
      relatedConcepts: ['DNS Cache Poisoning', 'Recursive Queries', 'Authoritative Servers']
    },
    {
      id: '6',
      category: 'Network Analysis',
      question: 'What information can you gather from network packet analysis?',
      answer: 'Packet analysis reveals source/destination IPs, protocols used, payload data, timing information, connection patterns, potential anomalies, and security threats. Tools like Wireshark help analyze this data.',
      difficulty: 'advanced',
      hints: ['Think about all the metadata in network communications', 'Consider what attackers might look for'],
      relatedConcepts: ['Wireshark', 'Network Forensics', 'Traffic Patterns']
    },
    {
      id: '7',
      category: 'Network Security',
      question: 'What is network segmentation and why is it important?',
      answer: 'Network segmentation divides a network into smaller, isolated segments to limit attack spread, improve performance, and apply specific security policies. It follows the principle of least privilege and contains potential breaches.',
      difficulty: 'intermediate',
      hints: ['Think about dividing and isolating', 'It limits damage from security breaches'],
      relatedConcepts: ['VLANs', 'Zero Trust', 'Micro-segmentation']
    },
    {
      id: '8',
      category: 'Network Attacks',
      question: 'What is ARP spoofing and how can it be detected?',
      answer: 'ARP spoofing involves sending fake ARP messages to associate an attacker\'s MAC address with a legitimate IP address. Detection methods include monitoring ARP tables for inconsistencies, using static ARP entries, and employing network monitoring tools.',
      difficulty: 'advanced',
      hints: ['It involves MAC and IP address associations', 'Think about the Address Resolution Protocol'],
      relatedConcepts: ['MAC Address Tables', 'Network Monitoring', 'Layer 2 Security']
    },
    {
      id: '9',
      category: 'Network Protocols',
      question: 'What are the key differences between HTTP and HTTPS?',
      answer: 'HTTP transmits data in plain text, while HTTPS encrypts data using SSL/TLS. HTTPS provides confidentiality, integrity, and authentication. HTTPS uses port 443 by default, while HTTP uses port 80.',
      difficulty: 'beginner',
      hints: ['One is secure, the other isn\'t', 'Think about encryption'],
      relatedConcepts: ['SSL/TLS', 'Digital Certificates', 'Public Key Infrastructure']
    },
    {
      id: '10',
      category: 'Network Analysis',
      question: 'What are network anomalies and how do you identify them?',
      answer: 'Network anomalies are unusual patterns in network traffic that deviate from normal behavior. They can be identified through baseline comparison, statistical analysis, machine learning algorithms, and monitoring metrics like bandwidth usage, connection patterns, and protocol distributions.',
      difficulty: 'advanced',
      hints: ['Think about what\'s normal vs abnormal', 'You need to establish baselines first'],
      relatedConcepts: ['Baseline Monitoring', 'Machine Learning', 'SIEM Systems']
    }
  ];

  const categories = ['all', ...Array.from(new Set(flashCards.map(card => card.category)))];

  const filteredCards = selectedCategory === 'all' 
    ? flashCards 
    : flashCards.filter(card => card.category === selectedCategory);

  const currentCard = filteredCards[currentCardIndex];

  const nextCard = () => {
    setCurrentCardIndex((prev) => (prev + 1) % filteredCards.length);
    setIsFlipped(false);
    setShowHints(false);
  };

  const prevCard = () => {
    setCurrentCardIndex((prev) => (prev - 1 + filteredCards.length) % filteredCards.length);
    setIsFlipped(false);
    setShowHints(false);
  };

  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };

  const markAsKnown = (known: boolean) => {
    if (known) {
      setMasteredCards(prev => new Set([...prev, currentCard.id]));
      setQuizScore(prev => ({ correct: prev.correct + 1, total: prev.total + 1 }));
    } else {
      setQuizScore(prev => ({ correct: prev.correct, total: prev.total + 1 }));
    }
    setTimeout(nextCard, 1000);
  };

  const resetProgress = () => {
    setMasteredCards(new Set());
    setQuizScore({ correct: 0, total: 0 });
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setShowHints(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-400 bg-green-900/30 border-green-600/30';
      case 'intermediate': return 'text-yellow-400 bg-yellow-900/30 border-yellow-600/30';
      case 'advanced': return 'text-red-400 bg-red-900/30 border-red-600/30';
      default: return 'text-gray-400 bg-gray-900/30 border-gray-600/30';
    }
  };

  useEffect(() => {
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setShowHints(false);
  }, [selectedCategory]);

  if (!currentCard) return null;

  return (
    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-cyan-400" />
          <h3 className="text-xl font-semibold text-white">Network Security Flash Cards</h3>
        </div>
        <div className="flex items-center gap-4">
          {/* Study Mode Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setStudyMode('learn')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                studyMode === 'learn'
                  ? 'bg-cyan-600/20 border border-cyan-600/30 text-cyan-400'
                  : 'text-gray-400 hover:text-white border border-gray-600/30'
              }`}
            >
              Learn
            </button>
            <button
              onClick={() => setStudyMode('quiz')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                studyMode === 'quiz'
                  ? 'bg-purple-600/20 border border-purple-600/30 text-purple-400'
                  : 'text-gray-400 hover:text-white border border-gray-600/30'
              }`}
            >
              Quiz
            </button>
          </div>
          
          {/* Reset Button */}
          <button
            onClick={resetProgress}
            className="flex items-center gap-2 px-3 py-1 rounded border border-gray-600/30 text-gray-400 hover:text-white hover:border-gray-500/50 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-gray-800 border border-gray-600 rounded px-3 py-1 text-sm text-white focus:border-cyan-500 focus:outline-none"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
        </div>

        {/* Progress & Score */}
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-400">
            Card {currentCardIndex + 1} of {filteredCards.length}
          </div>
          {studyMode === 'quiz' && quizScore.total > 0 && (
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-yellow-500" />
              <span className="text-sm text-white">
                {Math.round((quizScore.correct / quizScore.total) * 100)}% ({quizScore.correct}/{quizScore.total})
              </span>
            </div>
          )}
          <div className="text-sm text-gray-400">
            Mastered: {masteredCards.size}/{flashCards.length}
          </div>
        </div>
      </div>

      {/* Flash Card */}
      <div className="relative mb-6">
        <div 
          className={`bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-600/50 rounded-lg p-8 min-h-[300px] cursor-pointer transition-transform duration-300 ${
            isFlipped ? 'transform rotateY-180' : ''
          }`}
          onClick={flipCard}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded text-xs font-medium border ${getDifficultyColor(currentCard.difficulty)}`}>
                {currentCard.difficulty.toUpperCase()}
              </span>
              <span className="px-2 py-1 rounded text-xs font-medium bg-blue-900/30 border border-blue-600/30 text-blue-400">
                {currentCard.category}
              </span>
            </div>
            {masteredCards.has(currentCard.id) && (
              <CheckCircle className="w-5 h-5 text-green-400" />
            )}
          </div>

          {!isFlipped ? (
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Target className="w-5 h-5 text-cyan-400 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="text-lg font-medium text-white mb-2">Question:</h4>
                  <p className="text-gray-300 leading-relaxed">{currentCard.question}</p>
                </div>
              </div>
              
              <div className="text-center text-gray-500 text-sm mt-8">
                Click to reveal answer
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="text-lg font-medium text-white mb-2">Answer:</h4>
                  <p className="text-gray-300 leading-relaxed">{currentCard.answer}</p>
                </div>
              </div>

              {currentCard.relatedConcepts && (
                <div className="border-t border-gray-700 pt-4">
                  <h5 className="text-sm font-medium text-gray-400 mb-2">Related Concepts:</h5>
                  <div className="flex flex-wrap gap-2">
                    {currentCard.relatedConcepts.map((concept, index) => (
                      <span key={index} className="px-2 py-1 bg-purple-900/30 border border-purple-600/30 text-purple-400 text-xs rounded">
                        {concept}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Hints Section */}
      {currentCard.hints && !isFlipped && (
        <div className="mb-6">
          <button
            onClick={() => setShowHints(!showHints)}
            className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 text-sm transition-colors"
          >
            <Brain className="w-4 h-4" />
            {showHints ? 'Hide Hints' : 'Show Hints'}
          </button>
          
          {showHints && (
            <div className="mt-3 p-4 bg-yellow-900/20 border border-yellow-600/30 rounded">
              <h5 className="text-sm font-medium text-yellow-400 mb-2">Hints:</h5>
              <ul className="space-y-1">
                {currentCard.hints.map((hint, index) => (
                  <li key={index} className="text-sm text-yellow-300">• {hint}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Quiz Mode Actions */}
      {studyMode === 'quiz' && isFlipped && (
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="text-center text-gray-400 text-sm mb-4">
            Did you know this answer?
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => markAsKnown(false)}
              className="flex items-center gap-2 px-4 py-2 bg-red-900/30 border border-red-600/30 text-red-400 rounded hover:bg-red-900/50 transition-colors"
            >
              <XCircle className="w-4 h-4" />
              Need Review
            </button>
            <button
              onClick={() => markAsKnown(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-900/30 border border-green-600/30 text-green-400 rounded hover:bg-green-900/50 transition-colors"
            >
              <CheckCircle className="w-4 h-4" />
              Got It!
            </button>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={prevCard}
          disabled={filteredCards.length <= 1}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-600 text-gray-400 rounded hover:text-white hover:border-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>

        <div className="flex items-center gap-2">
          {filteredCards.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentCardIndex(index);
                setIsFlipped(false);
                setShowHints(false);
              }}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentCardIndex
                  ? 'bg-cyan-400'
                  : masteredCards.has(filteredCards[index].id)
                  ? 'bg-green-400'
                  : 'bg-gray-600 hover:bg-gray-500'
              }`}
            />
          ))}
        </div>

        <button
          onClick={nextCard}
          disabled={filteredCards.length <= 1}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-600 text-gray-400 rounded hover:text-white hover:border-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Study Tips */}
      <div className="mt-6 p-4 bg-blue-900/20 border border-blue-600/30 rounded">
        <div className="flex items-start gap-3">
          <Zap className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
          <div>
            <h5 className="text-sm font-medium text-blue-400 mb-1">Study Tip:</h5>
            <p className="text-sm text-blue-300">
              {studyMode === 'learn' 
                ? "Take your time to understand each concept. Use hints when needed and review related concepts."
                : "Be honest about your knowledge. Cards you mark as 'Need Review' will help identify areas for focused study."
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkFlashCards;
