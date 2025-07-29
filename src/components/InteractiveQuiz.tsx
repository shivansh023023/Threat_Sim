import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Clock, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  Trophy, 
  Brain,
  Target,
  Lightbulb,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { geminiQuizService, QuizQuestion } from '../services/geminiService';

interface QuizConfig {
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questionCount: number;
}

interface QuizResult {
  questionId: string;
  userAnswer: string;
  isCorrect: boolean;
  points: number;
  feedback: string;
}

const InteractiveQuiz: React.FC = () => {
  const [quizState, setQuizState] = useState<'setup' | 'loading' | 'active' | 'results'>('setup');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [timerActive, setTimerActive] = useState(false);
  const [loading, setLoading] = useState(false);

  const [quizConfig, setQuizConfig] = useState<QuizConfig>({
    category: 'networking',
    difficulty: 'medium',
    questionCount: 5
  });

  const categories = [
    { id: 'networking', name: 'Network Security', icon: '🌐' },
    { id: 'threat-detection', name: 'Threat Detection', icon: '🎯' },
    { id: 'forensics', name: 'Digital Forensics', icon: '🔍' },
    { id: 'incident-response', name: 'Incident Response', icon: '🚨' },
    { id: 'malware-analysis', name: 'Malware Analysis', icon: '🦠' },
    { id: 'cryptography', name: 'Cryptography', icon: '🔐' }
  ];

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive && timeRemaining > 0 && quizState === 'active') {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeRemaining, quizState]);

  const startQuiz = async () => {
    setQuizState('loading');
    setLoading(true);
    
    try {
      const response = await geminiQuizService.generateQuiz(
        quizConfig.category,
        quizConfig.difficulty,
        quizConfig.questionCount
      );
      
      if (response.success && response.questions.length > 0) {
        setQuestions(response.questions);
        setQuizState('active');
        setCurrentQuestionIndex(0);
        setResults([]);
        setTimeRemaining(30);
        setTimerActive(true);
      } else {
        console.error('Failed to generate quiz:', response.error);
        // Still proceed with fallback questions
        setQuestions(response.questions);
        setQuizState('active');
        setCurrentQuestionIndex(0);
        setResults([]);
        setTimeRemaining(30);
        setTimerActive(true);
      }
    } catch (error) {
      console.error('Error starting quiz:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = async () => {
    if (!userAnswer.trim()) return;

    setTimerActive(false);
    setLoading(true);

    const currentQuestion = questions[currentQuestionIndex];
    
    try {
      const validation = await geminiQuizService.validateAnswer(currentQuestion, userAnswer);
      
      const result: QuizResult = {
        questionId: currentQuestion.id,
        userAnswer,
        isCorrect: validation.isCorrect,
        points: validation.isCorrect ? currentQuestion.points : 0,
        feedback: validation.feedback
      };

      setResults(prev => [...prev, result]);
      setShowFeedback(true);
      
    } catch (error) {
      console.error('Error validating answer:', error);
      // Fallback validation
      const isCorrect = userAnswer.toLowerCase().includes(currentQuestion.correctAnswer.toLowerCase());
      const result: QuizResult = {
        questionId: currentQuestion.id,
        userAnswer,
        isCorrect,
        points: isCorrect ? currentQuestion.points : 0,
        feedback: isCorrect ? 'Correct!' : 'Incorrect. Please review the explanation.'
      };
      
      setResults(prev => [...prev, result]);
      setShowFeedback(true);
    } finally {
      setLoading(false);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setUserAnswer('');
      setShowFeedback(false);
      setTimeRemaining(30);
      setTimerActive(true);
    } else {
      setQuizState('results');
      setTimerActive(false);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setUserAnswer('');
      setShowFeedback(false);
      setTimeRemaining(30);
      setTimerActive(true);
    }
  };

  const handleTimeUp = () => {
    setTimerActive(false);
    const currentQuestion = questions[currentQuestionIndex];
    const result: QuizResult = {
      questionId: currentQuestion.id,
      userAnswer: 'Time up - No answer provided',
      isCorrect: false,
      points: 0,
      feedback: 'Time expired. The correct answer was: ' + currentQuestion.correctAnswer
    };
    
    setResults(prev => [...prev, result]);
    setShowFeedback(true);
  };

  const resetQuiz = () => {
    setQuizState('setup');
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setUserAnswer('');
    setShowFeedback(false);
    setResults([]);
    setTimeRemaining(30);
    setTimerActive(false);
  };

  const currentQuestion = questions[currentQuestionIndex];
  const currentResult = results.find(r => r.questionId === currentQuestion?.id);
  const totalScore = results.reduce((sum, result) => sum + result.points, 0);
  const maxPossibleScore = questions.reduce((sum, question) => sum + question.points, 0);

  // Quiz Setup Screen
  if (quizState === 'setup') {
    return (
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 border border-gray-600/50 rounded-lg p-8">
        <div className="text-center mb-8">
          <Brain className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-2">AI-Powered Security Quiz</h2>
          <p className="text-gray-400">Test your cybersecurity knowledge with dynamically generated questions</p>
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">Choose Category</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setQuizConfig(prev => ({ ...prev, category: category.id }))}
                  className={`p-4 rounded-lg border text-left transition-all ${
                    quizConfig.category === category.id
                      ? 'bg-cyan-600/20 border-cyan-600/50 text-cyan-400'
                      : 'bg-gray-700/30 border-gray-600/50 text-gray-400 hover:bg-gray-700/50'
                  }`}
                >
                  <div className="text-2xl mb-2">{category.icon}</div>
                  <div className="text-sm font-medium">{category.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">Select Difficulty</label>
            <div className="flex gap-3">
              {(['easy', 'medium', 'hard'] as const).map(difficulty => (
                <button
                  key={difficulty}
                  onClick={() => setQuizConfig(prev => ({ ...prev, difficulty }))}
                  className={`flex-1 p-3 rounded-lg border text-center transition-all capitalize ${
                    quizConfig.difficulty === difficulty
                      ? 'bg-cyan-600/20 border-cyan-600/50 text-cyan-400'
                      : 'bg-gray-700/30 border-gray-600/50 text-gray-400 hover:bg-gray-700/50'
                  }`}
                >
                  {difficulty}
                  <div className="text-xs mt-1">
                    {difficulty === 'easy' && '10 pts per question'}
                    {difficulty === 'medium' && '20 pts per question'}
                    {difficulty === 'hard' && '30 pts per question'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Question Count */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">Number of Questions</label>
            <div className="flex gap-3">
              {[3, 5, 10].map(count => (
                <button
                  key={count}
                  onClick={() => setQuizConfig(prev => ({ ...prev, questionCount: count }))}
                  className={`flex-1 p-3 rounded-lg border text-center transition-all ${
                    quizConfig.questionCount === count
                      ? 'bg-cyan-600/20 border-cyan-600/50 text-cyan-400'
                      : 'bg-gray-700/30 border-gray-600/50 text-gray-400 hover:bg-gray-700/50'
                  }`}
                >
                  {count} Questions
                </button>
              ))}
            </div>
          </div>

          {/* Start Button */}
          <button
            onClick={startQuiz}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold py-4 px-6 rounded-lg transition-all disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Generating Quiz...
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                Start Quiz
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  // Loading Screen
  if (quizState === 'loading') {
    return (
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 border border-gray-600/50 rounded-lg p-8">
        <div className="text-center">
          <RefreshCw className="w-16 h-16 text-cyan-400 mx-auto mb-4 animate-spin" />
          <h2 className="text-2xl font-bold text-white mb-2">Generating Your Quiz</h2>
          <p className="text-gray-400">AI is creating personalized questions for you...</p>
        </div>
      </div>
    );
  }

  // Quiz Active Screen
  if (quizState === 'active' && currentQuestion) {
    return (
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 border border-gray-600/50 rounded-lg p-8">
        {/* Quiz Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-400">
              Question {currentQuestionIndex + 1} of {questions.length}
            </div>
            <div className="w-48 bg-gray-700 rounded-full h-2">
              <div 
                className="bg-cyan-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className={`font-mono text-lg ${timeRemaining <= 10 ? 'text-red-400' : 'text-gray-300'}`}>
              {timeRemaining}s
            </span>
          </div>
        </div>

        {/* Question */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-cyan-400" />
            <span className="text-sm text-cyan-400 font-medium capitalize">
              {currentQuestion.type.replace('-', ' ')} • {currentQuestion.difficulty} • {currentQuestion.points} pts
            </span>
          </div>
          
          <h3 className="text-xl font-semibold text-white mb-6 leading-relaxed">
            {currentQuestion.question}
          </h3>

          {/* Answer Input Based on Question Type */}
          {currentQuestion.type === 'multiple-choice' && (
            <div className="space-y-3">
              {currentQuestion.options?.map((option, index) => (
                <button
                  key={index}
                  onClick={() => setUserAnswer(option)}
                  disabled={showFeedback}
                  className={`w-full text-left p-4 rounded-lg border transition-all ${
                    userAnswer === option
                      ? 'bg-cyan-600/20 border-cyan-600/50 text-cyan-400'
                      : 'bg-gray-700/30 border-gray-600/50 text-gray-300 hover:bg-gray-700/50'
                  } ${showFeedback ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <span className="font-mono text-cyan-400 mr-3">{String.fromCharCode(65 + index)}.</span>
                  {option}
                </button>
              ))}
            </div>
          )}

          {(currentQuestion.type === 'fill-in-blank' || currentQuestion.type === 'scenario') && (
            <div>
              <textarea
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                disabled={showFeedback}
                placeholder="Enter your answer here..."
                className="w-full p-4 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:border-cyan-500 focus:outline-none resize-none"
                rows={currentQuestion.type === 'scenario' ? 4 : 2}
              />
            </div>
          )}
        </div>

        {/* Feedback */}
        {showFeedback && currentResult && (
          <div className={`mb-6 p-5 rounded-lg border ${
            currentResult.isCorrect
              ? 'bg-green-900/20 border-green-600/30'
              : 'bg-red-900/20 border-red-600/30'
          }`}>
            <div className="flex items-center gap-2 mb-3">
              {currentResult.isCorrect ? (
                <CheckCircle className="w-6 h-6 text-green-400" />
              ) : (
                <XCircle className="w-6 h-6 text-red-400" />
              )}
              <span className={`text-lg font-semibold ${
                currentResult.isCorrect ? 'text-green-400' : 'text-red-400'
              }`}>
                {currentResult.isCorrect ? 'Correct!' : 'Incorrect'}
              </span>
              <span className="text-gray-400 text-sm">
                +{currentResult.points} points
              </span>
            </div>
            
            <div className="space-y-3">
              <div className="text-sm text-gray-300">
                <strong>Your Answer:</strong> {currentResult.userAnswer}
              </div>
              
              {!currentResult.isCorrect && (
                <div className="p-3 rounded-lg bg-green-900/20 border border-green-600/20">
                  <div className="text-sm">
                    <strong className="text-green-300">Correct Answer:</strong>
                    <p className="mt-1 text-green-200">{currentQuestion.correctAnswer}</p>
                  </div>
                </div>
              )}
              
              <div className="text-sm text-gray-300">
                <strong>AI Feedback:</strong> {currentResult.feedback}
              </div>
              
              <div className="p-3 rounded-lg bg-blue-900/20 border border-blue-600/20">
                <div className="text-sm">
                  <strong className="text-blue-300">Explanation:</strong>
                  <p className="mt-1 text-blue-200">{currentQuestion.explanation}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <button
            onClick={previousQuestion}
            disabled={currentQuestionIndex === 0 || showFeedback}
            className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </button>

          {!showFeedback && (
            <button
              onClick={handleAnswer}
              disabled={!userAnswer.trim() || loading}
              className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-2 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Checking...
                </>
              ) : (
                <>
                  Submit Answer
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          )}

          {showFeedback && currentQuestionIndex < questions.length - 1 && (
            <button
              onClick={nextQuestion}
              className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-2 px-6 rounded-lg transition-all"
            >
              Next Question
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {showFeedback && currentQuestionIndex === questions.length - 1 && (
            <button
              onClick={() => setQuizState('results')}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-6 rounded-lg transition-all"
            >
              View Results
              <Trophy className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // Results Screen
  if (quizState === 'results') {
    const correctAnswers = results.filter(r => r.isCorrect).length;
    const accuracy = Math.round((correctAnswers / results.length) * 100);
    
    return (
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 border border-gray-600/50 rounded-lg p-8">
        <div className="text-center mb-8">
          <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-2">Quiz Complete!</h2>
          <p className="text-gray-400">Here's how you performed</p>
        </div>

        {/* Score Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="text-center p-6 bg-cyan-900/20 border border-cyan-600/30 rounded-lg">
            <div className="text-3xl font-bold text-cyan-400 mb-2">{totalScore}</div>
            <div className="text-sm text-gray-400">Total Points</div>
            <div className="text-xs text-gray-500">out of {maxPossibleScore}</div>
          </div>
          
          <div className="text-center p-6 bg-green-900/20 border border-green-600/30 rounded-lg">
            <div className="text-3xl font-bold text-green-400 mb-2">{correctAnswers}</div>
            <div className="text-sm text-gray-400">Correct Answers</div>
            <div className="text-xs text-gray-500">out of {results.length}</div>
          </div>
          
          <div className="text-center p-6 bg-purple-900/20 border border-purple-600/30 rounded-lg">
            <div className="text-3xl font-bold text-purple-400 mb-2">{accuracy}%</div>
            <div className="text-sm text-gray-400">Accuracy</div>
            <div className="text-xs text-gray-500">overall performance</div>
          </div>
        </div>

        {/* Detailed Results */}
        <div className="space-y-4 mb-8">
          <h3 className="text-lg font-semibold text-white">Question Review & Learning</h3>
          <p className="text-gray-400 text-sm mb-4">Review all questions to learn from your answers</p>
          
          {questions.map((question, index) => {
            const result = results[index];
            return (
              <div
                key={question.id}
                className={`p-5 rounded-lg border transition-all ${
                  result?.isCorrect
                    ? 'bg-green-900/10 border-green-600/20 hover:bg-green-900/15'
                    : 'bg-red-900/10 border-red-600/20 hover:bg-red-900/15'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-300">Question {index + 1}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      question.difficulty === 'easy' ? 'bg-green-700/30 text-green-400' :
                      question.difficulty === 'medium' ? 'bg-yellow-700/30 text-yellow-400' :
                      'bg-red-700/30 text-red-400'
                    }`}>
                      {question.difficulty}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {result?.isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400" />
                    )}
                    <span className={`text-sm font-medium ${
                      result?.isCorrect ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {result?.isCorrect ? 'Correct' : 'Incorrect'} • {result?.points || 0} pts
                    </span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-white text-sm font-medium mb-2">{question.question}</p>
                  <div className="text-sm text-gray-300 mb-2">
                    <span className="text-gray-400">Question Type:</span> {question.type.replace('-', ' ')}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className={`p-3 rounded-lg ${
                    result?.isCorrect ? 'bg-green-900/20' : 'bg-red-900/20'
                  }`}>
                    <div className="text-sm">
                      <span className="font-medium text-gray-300">Your Answer:</span>
                      <p className={`mt-1 ${
                        result?.isCorrect ? 'text-green-300' : 'text-red-300'
                      }`}>
                        {result?.userAnswer || 'No answer provided'}
                      </p>
                    </div>
                  </div>
                  
                  {!result?.isCorrect && (
                    <div className="p-3 rounded-lg bg-green-900/20">
                      <div className="text-sm">
                        <span className="font-medium text-green-300">Correct Answer:</span>
                        <p className="mt-1 text-green-300">
                          {question.correctAnswer}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <div className="p-3 rounded-lg bg-blue-900/20">
                    <div className="text-sm">
                      <span className="font-medium text-blue-300">Explanation:</span>
                      <p className="mt-1 text-blue-200">
                        {question.explanation}
                      </p>
                    </div>
                  </div>
                  
                  {result?.feedback && result.feedback !== 'Correct!' && result.feedback !== 'Incorrect. Please review the explanation.' && (
                    <div className="p-3 rounded-lg bg-purple-900/20">
                      <div className="text-sm">
                        <span className="font-medium text-purple-300">AI Feedback:</span>
                        <p className="mt-1 text-purple-200">
                          {result.feedback}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={resetQuiz}
            className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-3 px-6 rounded-lg transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            Take Another Quiz
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default InteractiveQuiz;
