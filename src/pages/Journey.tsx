import React from 'react';
import {
  BookOpen,
  GamepadIcon,
  FlaskRound as Flask,
  Shield,
  Mailbox as Toolbox,
  Users,
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';

const cards = [
  {
    title: 'Cybersecurity Documentation',
    description: 'Access comprehensive guides and resources to master cybersecurity fundamentals.',
    icon: BookOpen,
    action: 'Browse Docs',
    link: 'https://cyberdocs.netlify.app/'
  },
  {
    title: 'Gamified Learning',
    description: 'Learn cybersecurity concepts through interactive challenges and quizzes.',
    icon: GamepadIcon,
    action: 'Start Playing',
    link: 'https://hack-os.onrender.com/'
  },
  {
    title: 'Simulation Lab',
    description: 'Practice in real-world scenarios with our enhanced virtual lab environment.',
    icon: Flask,
    action: 'Enter Lab',
    link: '/simulation-lab'
  },
  {
    title: 'Threat Map',
    description: 'Monitor global cyber threats in real-time with our interactive dashboard.',
    icon: Shield,
    action: 'View Dashboard',
    link: 'https://threatmap.checkpoint.com/'
  },
  {
    title: 'Security Intelligence',
    description: 'Essential tools and resources for security testing and analysis.',
    icon: Toolbox,
    action: 'Explore Tools',
    link: 'https://threat-bot.vercel.app/'
  },
  {
    title: 'Community',
    description: 'Join our vibrant community of cybersecurity enthusiasts and experts.',
    icon: Users,
    action: 'Join Now',
    link: 'https://join.slack.com/t/threatsimworkspace/shared_invite/zt-343rmoydf-wh8qJnLu96ETbkZ9ehEk_Q'
  }
];

function Journey() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900 text-white p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        {/* Login Button */}
        <div className="flex justify-end mb-8">
          <Link
            to="https://threat-sim-auth.vercel.app/"
            className="px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition-colors text-white font-medium"
          >
            Login
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
            ThreatSim
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Begin your cybersecurity adventure with our comprehensive learning platform.
            Choose your path and develop the skills needed to protect digital assets.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, index) => {
            const isInternalLink = card.link.startsWith('/');
            const CardComponent = isInternalLink ? Link : 'a';
            const linkProps = isInternalLink 
              ? { to: card.link }
              : { href: card.link, target: '_blank', rel: 'noopener noreferrer' };
            const Icon = card.icon;

            return (
              <CardComponent
                key={index}
                {...linkProps}
                className="group block p-6 rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 hover:bg-gray-700/50 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-500/50"
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-center mb-4">
                    <Icon className="w-8 h-8 text-indigo-400" />
                    <h3 className="text-xl font-semibold ml-3">{card.title}</h3>
                  </div>
                  <p className="text-gray-400 mb-6 flex-grow">
                    {card.description}
                  </p>
                  <div className="flex items-center text-indigo-400 group-hover:text-indigo-300 transition-colors">
                    <span className="font-medium">{card.action}</span>
                    <ExternalLink className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </CardComponent>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Journey;
