import React, { useState, useEffect } from 'react';
import { BookOpen, Lightbulb, Shield, AlertTriangle, TrendingUp, Eye } from 'lucide-react';

interface KnowledgeCard {
  id: string;
  title: string;
  description: string;
  category: 'security' | 'networking' | 'incident' | 'best-practice';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  content: string;
}

interface KnowledgeCardsProps {
  contextualMode?: boolean;
  triggerKeywords?: string[];
}

const KnowledgeCards: React.FC<KnowledgeCardsProps> = ({ 
  contextualMode = false, 
  triggerKeywords = [] 
}) => {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [visibleCards, setVisibleCards] = useState<KnowledgeCard[]>([]);

  const allCards: KnowledgeCard[] = [
    {
      id: 'firewall-basics',
      title: 'Firewall Fundamentals',
      description: 'Understanding how firewalls protect your network perimeter',
      category: 'security',
      difficulty: 'beginner',
      tags: ['firewall', 'network', 'security', 'perimeter'],
      content: 'Firewalls act as a barrier between trusted and untrusted networks. They examine incoming and outgoing traffic based on predetermined security rules.'
    },
    {
      id: 'network-monitoring',
      title: 'Network Traffic Analysis',
      description: 'Learn to identify suspicious network behavior and anomalies',
      category: 'networking',
      difficulty: 'intermediate',
      tags: ['network', 'traffic', 'monitoring', 'anomaly', 'analysis'],
      content: 'Network monitoring involves capturing and analyzing network packets to detect unusual patterns, unauthorized access attempts, and potential security threats.'
    },
    {
      id: 'incident-response',
      title: 'Incident Response Procedures',
      description: 'Step-by-step guide to handling security incidents effectively',
      category: 'incident',
      difficulty: 'advanced',
      tags: ['incident', 'response', 'security', 'procedures', 'forensics'],
      content: 'Proper incident response involves preparation, identification, containment, eradication, recovery, and lessons learned phases.'
    },
    {
      id: 'dashboard-security',
      title: 'Security Dashboard Best Practices',
      description: 'How to effectively use security dashboards for operations',
      category: 'best-practice',
      difficulty: 'intermediate',
      tags: ['dashboard', 'security', 'operations', 'monitoring', 'SOC'],
      content: 'Security dashboards should provide real-time visibility into security posture, alert prioritization, and actionable intelligence for security teams.'
    },
    {
      id: 'threat-hunting',
      title: 'Proactive Threat Hunting',
      description: 'Techniques for actively searching for threats in your environment',
      category: 'security',
      difficulty: 'advanced',
      tags: ['threat', 'hunting', 'proactive', 'detection', 'analysis'],
      content: 'Threat hunting involves proactively searching through networks and datasets to detect and isolate advanced threats that evade existing security solutions.'
    },
    {
      id: 'log-analysis',
      title: 'Security Log Analysis',
      description: 'Understanding and analyzing security logs for threat detection',
      category: 'security',
      difficulty: 'intermediate',
      tags: ['logs', 'analysis', 'SIEM', 'detection', 'forensics'],
      content: 'Log analysis is crucial for identifying security incidents, understanding attack patterns, and maintaining compliance with security policies.'
    }
  ];

  useEffect(() => {
    if (contextualMode && triggerKeywords.length > 0) {
      const relevantCards = allCards.filter(card =>
        triggerKeywords.some(keyword =>
          card.tags.some(tag => tag.toLowerCase().includes(keyword.toLowerCase())) ||
          card.title.toLowerCase().includes(keyword.toLowerCase()) ||
          card.description.toLowerCase().includes(keyword.toLowerCase())
        )
      );
      setVisibleCards(relevantCards.slice(0, 3)); // Show top 3 relevant cards
    } else {
      setVisibleCards(allCards.slice(0, 4)); // Show first 4 cards by default
    }
  }, [contextualMode, triggerKeywords]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'security': return Shield;
      case 'networking': return TrendingUp;
      case 'incident': return AlertTriangle;
      case 'best-practice': return Lightbulb;
      default: return BookOpen;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-900/30 text-green-400 border-green-600/30';
      case 'intermediate': return 'bg-yellow-900/30 text-yellow-400 border-yellow-600/30';
      case 'advanced': return 'bg-red-900/30 text-red-400 border-red-600/30';
      default: return 'bg-gray-900/30 text-gray-400 border-gray-600/30';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'security': return 'text-blue-400';
      case 'networking': return 'text-purple-400';
      case 'incident': return 'text-red-400';
      case 'best-practice': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-cyan-400 flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          Knowledge Base
        </h3>
        {contextualMode && (
          <div className="text-sm text-gray-400">
            Contextual recommendations based on current activity
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleCards.map(card => {
          const CategoryIcon = getCategoryIcon(card.category);
          const isSelected = selectedCard === card.id;
          
          return (
            <div
              key={card.id}
              className={`bg-gradient-to-br from-gray-800/50 to-gray-700/30 border border-gray-600/50 rounded-lg p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10 hover:border-cyan-500/30 ${
                isSelected ? 'ring-2 ring-cyan-400 border-cyan-400/50' : ''
              }`}
              onClick={() => setSelectedCard(isSelected ? null : card.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <CategoryIcon className={`w-6 h-6 ${getCategoryColor(card.category)}`} />
                <div className={`px-2 py-1 rounded-full text-xs border ${getDifficultyColor(card.difficulty)}`}>
                  {card.difficulty}
                </div>
              </div>

              <h4 className="text-lg font-semibold text-white mb-2">{card.title}</h4>
              <p className="text-gray-400 text-sm mb-4 line-clamp-2">{card.description}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {card.tags.slice(0, 3).map(tag => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
                {card.tags.length > 3 && (
                  <span className="text-gray-500 text-xs">+{card.tags.length - 3} more</span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className={`text-sm capitalize ${getCategoryColor(card.category)}`}>
                  {card.category.replace('-', ' ')}
                </span>
                <div className="flex items-center gap-1 text-cyan-400 text-sm">
                  <Eye className="w-4 h-4" />
                  <span>{isSelected ? 'Hide' : 'View'}</span>
                </div>
              </div>

              {isSelected && (
                <div className="mt-4 pt-4 border-t border-gray-600/50">
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {card.content}
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <button className="px-3 py-1 bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-600/30 rounded text-cyan-400 text-xs transition-colors">
                      Learn More
                    </button>
                    <button className="px-3 py-1 bg-gray-600/20 hover:bg-gray-600/30 border border-gray-600/30 rounded text-gray-400 text-xs transition-colors">
                      Related Topics
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {visibleCards.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-500">No knowledge cards available for the current context.</p>
        </div>
      )}
    </div>
  );
};

export default KnowledgeCards;
