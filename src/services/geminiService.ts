import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = 'AIzaSyC7hOpnmO5nQ8Pbg8WCmUNNUKv_2hU7vRY';
const genAI = new GoogleGenerativeAI(API_KEY);

export interface QuizQuestion {
  id: string;
  type: 'multiple-choice' | 'fill-in-blank' | 'scenario';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  points: number;
}

export interface QuizResponse {
  questions: QuizQuestion[];
  success: boolean;
  error?: string;
}

class GeminiQuizService {
  private model = genAI.getGenerativeModel({ 
    model: 'gemini-1.5-flash',
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 8192,
    }
  });

  async generateQuiz(
    category: string,
    difficulty: 'easy' | 'medium' | 'hard',
    questionCount: number = 5
  ): Promise<QuizResponse> {
    console.log(`Generating quiz: ${questionCount} questions for ${category} at ${difficulty} level`);
    
    try {
      const prompt = this.createPrompt(category, difficulty, questionCount);
      console.log('Sending prompt to Gemini API...');
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      console.log('Received response from Gemini API:', text.substring(0, 200) + '...');
      
      const questions = this.parseQuizResponse(text, category, difficulty, questionCount);
      
      if (questions.length < questionCount) {
        console.warn(`Expected ${questionCount} questions, but got ${questions.length}. Adding fallback questions.`);
        const additionalQuestions = this.getFallbackQuestions(category, difficulty, questionCount - questions.length);
        questions.push(...additionalQuestions);
      }
      
      console.log(`Successfully generated ${questions.length} questions`);
      
      return {
        questions: questions.slice(0, questionCount), // Ensure exact count
        success: true
      };
    } catch (error) {
      console.error('Error generating quiz:', error);
      const fallbackQuestions = this.getFallbackQuestions(category, difficulty, questionCount);
      console.log(`Using ${fallbackQuestions.length} fallback questions`);
      
      return {
        questions: fallbackQuestions,
        success: false,
        error: 'Failed to generate quiz from API, using fallback questions'
      };
    }
  }

  private createPrompt(category: string, difficulty: string, questionCount: number): string {
    return `You are a cybersecurity expert creating quiz questions. Generate exactly ${questionCount} unique cybersecurity quiz questions about "${category}" at ${difficulty} difficulty level.

IMPORTANT REQUIREMENTS:
- Generate EXACTLY ${questionCount} different questions
- Each question must be unique and different from the others
- Mix question types: multiple-choice (most), fill-in-blank, scenario-based
- Focus on practical cybersecurity knowledge for ${category}
- ${difficulty} difficulty means: ${this.getDifficultyDescription(difficulty)}
- Provide detailed, educational explanations

RESPOND ONLY WITH VALID JSON ARRAY IN THIS EXACT FORMAT:
[
  {
    "type": "multiple-choice",
    "question": "What protocol is primarily used for secure web browsing?",
    "options": ["HTTP", "HTTPS", "FTP", "SMTP"],
    "correctAnswer": "HTTPS",
    "explanation": "HTTPS (HTTP Secure) uses TLS/SSL encryption to protect data in transit, making it the standard for secure web browsing."
  },
  {
    "type": "fill-in-blank",
    "question": "A _____ attack floods a network with traffic to make services unavailable.",
    "correctAnswer": "DDoS",
    "explanation": "Distributed Denial of Service (DDoS) attacks overwhelm systems with traffic from multiple sources to disrupt normal operations."
  }
]

Generate exactly ${questionCount} questions for ${category} at ${difficulty} difficulty. Return only the JSON array, no other text.`;
  }

  private parseQuizResponse(text: string, category: string, difficulty: 'easy' | 'medium' | 'hard', questionCount: number): QuizQuestion[] {
    try {
      // Clean the response text
      const jsonStart = text.indexOf('[');
      const jsonEnd = text.lastIndexOf(']') + 1;
      const jsonText = text.slice(jsonStart, jsonEnd);
      
      console.log('Parsing JSON:', jsonText.substring(0, 300) + '...');
      
      const parsedQuestions = JSON.parse(jsonText);
      
      if (!Array.isArray(parsedQuestions)) {
        throw new Error('Response is not an array');
      }
      
      const questions = parsedQuestions.map((q: any, index: number) => ({
        id: `${category}-${Date.now()}-${index}`,
        type: q.type || 'multiple-choice',
        question: q.question,
        options: q.options || [],
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        difficulty,
        category,
        points: this.getPointsForDifficulty(difficulty)
      }));
      
      console.log(`Parsed ${questions.length} questions from API response`);
      return questions;
      
    } catch (error) {
      console.error('Error parsing quiz response:', error);
      console.log('Raw response text:', text);
      return this.getFallbackQuestions(category, difficulty, questionCount);
    }
  }

  private getPointsForDifficulty(difficulty: 'easy' | 'medium' | 'hard'): number {
    switch (difficulty) {
      case 'easy': return 10;
      case 'medium': return 20;
      case 'hard': return 30;
      default: return 10;
    }
  }

  private getDifficultyDescription(difficulty: string): string {
    switch (difficulty) {
      case 'easy': return 'Basic concepts, definitions, and fundamental principles';
      case 'medium': return 'Practical applications, analysis, and intermediate concepts';
      case 'hard': return 'Advanced scenarios, complex problem-solving, and expert-level knowledge';
      default: return 'Intermediate level questions';
    }
  }

  private getFallbackQuestions(category: string, difficulty: 'easy' | 'medium' | 'hard', questionCount: number): QuizQuestion[] {
    const allFallbackQuestions: Record<string, QuizQuestion[]> = {
      'networking': [
        {
          id: 'fallback-1',
          type: 'multiple-choice',
          question: 'What does TCP stand for in networking?',
          options: ['Transfer Control Protocol', 'Transmission Control Protocol', 'Transport Control Protocol', 'Terminal Control Protocol'],
          correctAnswer: 'Transmission Control Protocol',
          explanation: 'TCP (Transmission Control Protocol) is a connection-oriented protocol that ensures reliable data transmission.',
          difficulty,
          category,
          points: this.getPointsForDifficulty(difficulty)
        },
        {
          id: 'fallback-2',
          type: 'fill-in-blank',
          question: 'A _____ is a network security device that monitors and filters incoming and outgoing network traffic.',
          correctAnswer: 'firewall',
          explanation: 'A firewall acts as a barrier between trusted internal networks and untrusted external networks.',
          difficulty,
          category,
          points: this.getPointsForDifficulty(difficulty)
        },
        {
          id: 'fallback-5',
          type: 'scenario',
          question: 'What is the primary reason to perform regular network security scans?',
          correctAnswer: 'To detect vulnerabilities',
          explanation: 'Regular scans help identify vulnerabilities that can be addressed before being exploited.',
          difficulty,
          category,
          points: this.getPointsForDifficulty(difficulty)
        }
      ],
      'threat-detection': [
        {
          id: 'fallback-3',
          type: 'multiple-choice',
          question: 'What is a common indicator of a malware infection?',
          options: ['Faster computer performance', 'Unusual network activity', 'Improved battery life', 'Better graphics quality'],
          correctAnswer: 'Unusual network activity',
          explanation: 'Malware often generates unusual network traffic as it communicates with command and control servers.',
          difficulty,
          category,
          points: this.getPointsForDifficulty(difficulty)
        },
        {
          id: 'fallback-6',
          type: 'fill-in-blank',
          question: '_____ analysis is used to detect threats in network traffic.',
          correctAnswer: 'Anomaly',
          explanation: 'Anomaly analysis involves identifying patterns that do not conform to expected behavior.',
          difficulty,
          category,
          points: this.getPointsForDifficulty(difficulty)
        }
      ],
      'forensics': [
        {
          id: 'fallback-4',
          type: 'scenario',
          question: 'You discover a suspicious file on a system. What should be your first step in digital forensics?',
          correctAnswer: 'Create a forensic image of the system',
          explanation: 'The first step is to preserve evidence by creating a bit-for-bit copy of the storage media to avoid contamination.',
          difficulty,
          category,
          points: this.getPointsForDifficulty(difficulty)
        },
        {
          id: 'fallback-7',
          type: 'multiple-choice',
          question: 'Which tool is commonly used for disk imaging in forensics?',
          options: ['Wireshark', 'Sleuth Kit', 'FTK Imager', 'Metasploit'],
          correctAnswer: 'FTK Imager',
          explanation: 'FTK Imager is a widely-used tool for creating forensic disk images.',
          difficulty,
          category,
          points: this.getPointsForDifficulty(difficulty)
        }
      ]
    };

    const categoryFallbackQuestions = allFallbackQuestions[category] || allFallbackQuestions['networking'];
    const repeatedQuestions = Math.ceil(questionCount / categoryFallbackQuestions.length);
    const completeFallback: QuizQuestion[] = [];

    for (let i = 0; i < repeatedQuestions; i++) {
      completeFallback.push(...categoryFallbackQuestions);
    }

    return completeFallback.slice(0, questionCount);
  }

  async validateAnswer(question: QuizQuestion, userAnswer: string): Promise<{
    isCorrect: boolean;
    explanation: string;
    feedback: string;
  }> {
    try {
      if (question.type === 'fill-in-blank' || question.type === 'scenario') {
        // Use AI to validate open-ended answers
        const prompt = `Evaluate if this answer is correct for the cybersecurity question:

Question: ${question.question}
Correct Answer: ${question.correctAnswer}
User Answer: ${userAnswer}

Provide a JSON response with:
{
  "isCorrect": true/false,
  "feedback": "Brief feedback explaining why the answer is correct or incorrect"
}`;

        const result = await this.model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        const jsonStart = text.indexOf('{');
        const jsonEnd = text.lastIndexOf('}') + 1;
        const jsonText = text.slice(jsonStart, jsonEnd);
        const validation = JSON.parse(jsonText);

        return {
          isCorrect: validation.isCorrect,
          explanation: question.explanation,
          feedback: validation.feedback
        };
      } else {
        // Simple comparison for multiple choice
        const isCorrect = userAnswer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim();
        return {
          isCorrect,
          explanation: question.explanation,
          feedback: isCorrect ? 'Correct! Well done.' : 'Incorrect. Please review the explanation.'
        };
      }
    } catch (error) {
      console.error('Error validating answer:', error);
      // Fallback to simple comparison
      const isCorrect = userAnswer.toLowerCase().includes(question.correctAnswer.toLowerCase());
      return {
        isCorrect,
        explanation: question.explanation,
        feedback: isCorrect ? 'Correct!' : 'Incorrect. Please try again.'
      };
    }
  }
}

export const geminiQuizService = new GeminiQuizService();
