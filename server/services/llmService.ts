import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

dotenv.config();

let openai: OpenAI | null = null;
let anthropic: Anthropic | null = null;

// Initialize OpenAI only if API key is provided
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  console.log('[LLMService] OpenAI initialized');
}

// Initialize Anthropic only if API key is provided
if (process.env.ANTHROPIC_API_KEY) {
  anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });
  console.log('[LLMService] Anthropic initialized');
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function sendRequestToOpenAI(model: string, message: string): Promise<string> {
  if (!openai) {
    throw new Error('OpenAI is not initialized. Please provide OPENAI_API_KEY in environment variables.');
  }

  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      const response = await openai.chat.completions.create({
        model: model,
        messages: [{ role: 'user', content: message }],
        max_tokens: 1024,
      });
      return response.choices[0].message.content || '';
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`Error sending request to OpenAI (attempt ${i + 1}):`, errorMessage);
      if (i === MAX_RETRIES - 1) throw error;
      await sleep(RETRY_DELAY);
    }
  }
  return '';
}

async function sendRequestToAnthropic(model: string, message: string): Promise<string> {
  if (!anthropic) {
    throw new Error('Anthropic is not initialized. Please provide ANTHROPIC_API_KEY in environment variables.');
  }

  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      console.log(`Sending request to Anthropic with model: ${model}`);
      const response = await anthropic.messages.create({
        model: model,
        messages: [{ role: 'user', content: message }],
        max_tokens: 1024,
      });
      console.log(`Received response from Anthropic successfully`);
      return response.content[0].type === 'text' ? response.content[0].text : '';
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`Error sending request to Anthropic (attempt ${i + 1}):`, errorMessage);
      if (i === MAX_RETRIES - 1) throw error;
      await sleep(RETRY_DELAY);
    }
  }
  return '';
}

async function sendLLMRequest(provider: string, model: string, message: string): Promise<string> {
  switch (provider.toLowerCase()) {
    case 'openai':
      return sendRequestToOpenAI(model, message);
    case 'anthropic':
      return sendRequestToAnthropic(model, message);
    default:
      throw new Error(`Unsupported LLM provider: ${provider}`);
  }
}

interface GameFeedbackParams {
  gameTitle: string;
  gameCategory: string;
  gameDifficulty: number;
  score: number;
  maxScore: number;
  timeSpent: number;
  answers: Array<{
    question: string;
    selectedAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
  }>;
  userLevel: number;
  userTargetLanguage?: string;
}

interface GameFeedback {
  strengths: string[];
  improvements: string[];
  tips: string[];
  nextRecommendations: string[];
  personalizedMessage: string;
}

async function generateGameFeedback(params: GameFeedbackParams): Promise<GameFeedback> {
  console.log('[LLMService] Generating game feedback for:', params.gameTitle);

  const scorePercentage = Math.round((params.score / params.maxScore) * 100);
  const correctAnswers = params.answers.filter(a => a.isCorrect).length;
  const totalQuestions = params.answers.length;

  // Construct detailed prompt for AI
  const prompt = `You are an encouraging educational AI assistant for a gamified learning platform called EduGame4All, designed for refugees and immigrants learning a new language and culture.

Game Details:
- Title: ${params.gameTitle}
- Category: ${params.gameCategory}
- Difficulty: ${params.gameDifficulty}/5
- User Level: ${params.userLevel}
${params.userTargetLanguage ? `- Target Language: ${params.userTargetLanguage}` : ''}

Performance:
- Score: ${params.score}/${params.maxScore} (${scorePercentage}%)
- Correct Answers: ${correctAnswers}/${totalQuestions}
- Time Spent: ${Math.round(params.timeSpent / 60)} minutes

Answer Details:
${params.answers.map((a, i) => `
Question ${i + 1}: ${a.question}
- Selected: ${a.selectedAnswer}
- Correct: ${a.correctAnswer}
- Result: ${a.isCorrect ? '✓ Correct' : '✗ Incorrect'}
`).join('\n')}

Please provide personalized feedback in JSON format with the following structure:
{
  "strengths": [2-3 specific strengths based on correct answers and performance],
  "improvements": [2-3 specific areas where the learner can improve based on incorrect answers],
  "tips": [2-3 actionable study tips relevant to the mistakes made],
  "nextRecommendations": [2-3 game titles they should try next to reinforce learning],
  "personalizedMessage": "A warm, encouraging 2-3 sentence message that celebrates their effort and motivates continued learning. Reference specific performance details."
}

Important guidelines:
- Be encouraging and culturally sensitive
- Use simple, clear language appropriate for language learners
- Focus on growth mindset and progress
- Make recommendations specific to the ${params.gameCategory} category
- Keep all arrays to exactly 2-3 items each
- Ensure the personalizedMessage is warm and specific to their performance

Return ONLY the JSON object, no additional text.`;

  try {
    // Try OpenAI first, fall back to Anthropic
    let response: string;
    const provider = process.env.OPENAI_API_KEY ? 'openai' : 'anthropic';
    const model = provider === 'openai' ? 'gpt-3.5-turbo' : 'claude-3-haiku-20240307';

    console.log(`[LLMService] Using ${provider} to generate feedback`);
    response = await sendLLMRequest(provider, model, prompt);

    // Parse the JSON response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to extract JSON from LLM response');
    }

    const feedback: GameFeedback = JSON.parse(jsonMatch[0]);
    console.log('[LLMService] Successfully generated feedback');

    // Validate feedback structure
    if (!feedback.strengths || !feedback.improvements || !feedback.tips ||
        !feedback.nextRecommendations || !feedback.personalizedMessage) {
      throw new Error('Invalid feedback structure from LLM');
    }

    return feedback;
  } catch (error) {
    console.error('[LLMService] Error generating feedback:', error);

    // Fallback to rule-based feedback if AI fails
    console.log('[LLMService] Using fallback rule-based feedback');
    return generateFallbackFeedback(params, scorePercentage, correctAnswers, totalQuestions);
  }
}

function generateFallbackFeedback(
  params: GameFeedbackParams,
  scorePercentage: number,
  correctAnswers: number,
  totalQuestions: number
): GameFeedback {
  const strengths: string[] = [];
  const improvements: string[] = [];
  const tips: string[] = [];

  // Generate strengths based on performance
  if (scorePercentage >= 80) {
    strengths.push('Excellent comprehension of the material');
    strengths.push('Strong performance across most questions');
  } else if (scorePercentage >= 60) {
    strengths.push('Good understanding of core concepts');
    strengths.push('Consistent effort throughout the game');
  } else {
    strengths.push('Completed the challenge with determination');
    strengths.push('Gained exposure to new concepts');
  }

  // Generate improvements
  if (scorePercentage < 80) {
    improvements.push('Review the questions you found challenging');
    improvements.push('Practice similar exercises to reinforce learning');
  } else {
    improvements.push('Try a higher difficulty level for more challenge');
  }

  // Generate tips based on category
  if (params.gameCategory === 'language') {
    tips.push('Practice daily to build vocabulary retention');
    tips.push('Try speaking the words aloud for better memorization');
  } else if (params.gameCategory === 'culture') {
    tips.push('Explore local cultural events to enhance understanding');
    tips.push('Connect with community members to learn more');
  } else {
    tips.push('Practice these skills in real-world situations');
    tips.push('Reflect on scenarios from your daily life');
  }

  // Generate recommendations
  const nextRecommendations: string[] = [];
  if (scorePercentage >= 80) {
    nextRecommendations.push(`Advanced ${params.gameCategory} challenge`);
    nextRecommendations.push(`Explore another category to broaden skills`);
  } else {
    nextRecommendations.push(`Review this game for mastery`);
    nextRecommendations.push(`Try similar ${params.gameCategory} games at this level`);
  }

  // Generate personalized message
  let personalizedMessage = '';
  if (scorePercentage >= 80) {
    personalizedMessage = `Excellent work on ${params.gameTitle}! You scored ${scorePercentage}% and showed great mastery of the concepts. Keep up this fantastic momentum!`;
  } else if (scorePercentage >= 60) {
    personalizedMessage = `Good effort on ${params.gameTitle}! You got ${correctAnswers} out of ${totalQuestions} questions correct. With a bit more practice, you'll master this topic!`;
  } else {
    personalizedMessage = `Great job completing ${params.gameTitle}! Every attempt helps you learn. Review the material and try again - you're building important skills!`;
  }

  return {
    strengths: strengths.slice(0, 3),
    improvements: improvements.slice(0, 3),
    tips: tips.slice(0, 3),
    nextRecommendations: nextRecommendations.slice(0, 3),
    personalizedMessage,
  };
}

interface WeeklyInsightsParams {
  totalGames: number;
  totalXP: number;
  totalTime: number;
  avgAccuracy: number;
  categoryStats: {
    language: { games: number; xp: number };
    culture: { games: number; xp: number };
    'soft-skills': { games: number; xp: number };
  };
  userLevel: number;
  dailyActivity: Array<{ date: string; games: number; xp: number }>;
}

interface WeeklyInsights {
  strengths: string[];
  improvements: string[];
  insights: string[];
  aiGeneratedSummary: string;
}

async function generateWeeklyInsights(params: WeeklyInsightsParams): Promise<WeeklyInsights> {
  console.log('[LLMService] Generating weekly insights for user');

  // Check if any LLM provider is available
  if (!openai && !anthropic) {
    console.log('[LLMService] No LLM provider available, using fallback insights');
    return generateFallbackInsights(params);
  }

  const activeDays = params.dailyActivity.filter(d => d.games > 0).length;
  const bestDay = params.dailyActivity.reduce((max, day) => day.xp > max.xp ? day : max, params.dailyActivity[0]);

  // Find most active category
  const categoryEntries = Object.entries(params.categoryStats);
  const mostActiveCategory = categoryEntries.reduce((max, [cat, stats]) =>
    stats.games > (max.stats?.games || 0) ? { category: cat, stats } : max,
    { category: '', stats: { games: 0, xp: 0 } }
  );

  const prompt = `You are an encouraging educational AI assistant analyzing weekly learning progress for a refugee/immigrant learner on the EduGame4All platform.

Weekly Performance Summary:
- Total Games: ${params.totalGames}
- Total XP Earned: ${params.totalXP}
- Total Time: ${params.totalTime} minutes
- Average Accuracy: ${params.avgAccuracy}%
- User Level: ${params.userLevel}
- Active Days: ${activeDays}/7
- Best Day: ${bestDay.date} with ${bestDay.xp} XP

Category Breakdown:
- Language: ${params.categoryStats.language.games} games, ${params.categoryStats.language.xp} XP
- Culture: ${params.categoryStats.culture.games} games, ${params.categoryStats.culture.xp} XP
- Soft Skills: ${params.categoryStats['soft-skills'].games} games, ${params.categoryStats['soft-skills'].xp} XP

Daily Activity Pattern:
${params.dailyActivity.map(d => `${d.date}: ${d.games} games, ${d.xp} XP`).join('\n')}

Please provide personalized weekly insights in JSON format with the following structure:
{
  "strengths": [3-4 specific strengths based on their performance patterns],
  "improvements": [2-3 specific, actionable improvement suggestions],
  "insights": [3-4 data-driven insights about their learning patterns, habits, or recommendations],
  "aiGeneratedSummary": "A warm, comprehensive 3-4 sentence summary that celebrates their progress, acknowledges challenges, and motivates continued learning. Be specific about their achievements this week."
}

Important guidelines:
- Be encouraging and culturally sensitive
- Use simple, clear language appropriate for language learners
- Focus on growth mindset and celebrate all progress
- Make recommendations specific and actionable
- Identify patterns in their learning behavior (time of day, consistency, category preferences)
- If performance is low, be extra encouraging and focus on small wins
- Keep all arrays to exactly 3-4 items for strengths and insights, 2-3 for improvements
- Ensure the aiGeneratedSummary is warm, specific, and motivating

Return ONLY the JSON object, no additional text.`;

  try {
    const provider = process.env.OPENAI_API_KEY ? 'openai' : 'anthropic';
    const model = provider === 'openai' ? 'gpt-3.5-turbo' : 'claude-3-haiku-20240307';

    console.log(`[LLMService] Using ${provider} to generate weekly insights`);
    const response = await sendLLMRequest(provider, model, prompt);

    // Parse the JSON response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to extract JSON from LLM response');
    }

    const insights: WeeklyInsights = JSON.parse(jsonMatch[0]);
    console.log('[LLMService] Successfully generated weekly insights');

    // Validate insights structure
    if (!insights.strengths || !insights.improvements || !insights.insights || !insights.aiGeneratedSummary) {
      throw new Error('Invalid insights structure from LLM');
    }

    return insights;
  } catch (error) {
    console.error('[LLMService] Error generating weekly insights:', error);
    console.log('[LLMService] Using fallback rule-based insights');
    return generateFallbackInsights(params);
  }
}

function generateFallbackInsights(params: WeeklyInsightsParams): WeeklyInsights {
  const strengths: string[] = [];
  const improvements: string[] = [];
  const insights: string[] = [];

  const activeDays = params.dailyActivity.filter(d => d.games > 0).length;

  // Generate strengths
  if (params.totalGames > 10) {
    strengths.push('Excellent dedication with high game completion rate');
  } else if (params.totalGames > 5) {
    strengths.push('Consistent engagement throughout the week');
  } else if (params.totalGames > 0) {
    strengths.push('Taking important first steps in your learning journey');
  }

  if (params.avgAccuracy >= 80) {
    strengths.push('Strong comprehension with high accuracy scores');
  } else if (params.avgAccuracy >= 60) {
    strengths.push('Good understanding of core concepts');
  }

  if (activeDays >= 5) {
    strengths.push('Maintained excellent learning consistency');
  } else if (activeDays >= 3) {
    strengths.push('Building a good learning routine');
  }

  // Find most active category
  const categoryEntries = Object.entries(params.categoryStats);
  const mostActive = categoryEntries.reduce((max, [cat, stats]) =>
    stats.games > (max.stats?.games || 0) ? { category: cat, stats } : max,
    { category: '', stats: { games: 0, xp: 0 } }
  );

  if (mostActive.stats.games > 0) {
    const categoryName = mostActive.category === 'soft-skills' ? 'soft skills' : mostActive.category;
    strengths.push(`Strong focus on ${categoryName} development`);
  }

  // Generate improvements
  if (activeDays < 5) {
    improvements.push('Try to maintain daily consistency for better retention');
  }

  const leastActive = categoryEntries.reduce((min, [cat, stats]) =>
    stats.games < (min.stats?.games || Infinity) ? { category: cat, stats } : min,
    { category: '', stats: { games: 100, xp: 0 } }
  );

  if (leastActive.stats.games === 0) {
    const categoryName = leastActive.category === 'soft-skills' ? 'soft skills' : leastActive.category;
    improvements.push(`Explore ${categoryName} games to broaden your skills`);
  }

  if (params.avgAccuracy < 70) {
    improvements.push('Review challenging topics before moving to harder levels');
  }

  // Generate insights
  const bestDay = params.dailyActivity.reduce((max, day) => day.xp > max.xp ? day : max, params.dailyActivity[0]);
  if (bestDay.xp > 0) {
    insights.push(`Your most productive day was ${bestDay.date} with ${bestDay.xp} XP earned`);
  }

  if (activeDays >= 3) {
    insights.push(`You were active ${activeDays} days this week - consistency builds mastery`);
  }

  const avgTimePerGame = params.totalGames > 0 ? Math.round(params.totalTime / params.totalGames) : 0;
  if (avgTimePerGame > 0) {
    insights.push(`You average ${avgTimePerGame} minutes per game - showing good focus`);
  }

  if (params.totalXP >= 400) {
    insights.push("You're making excellent XP progress and ready to advance to higher levels");
  } else if (params.totalXP >= 200) {
    insights.push('Solid XP gains this week - keep up the momentum');
  } else if (params.totalXP > 0) {
    insights.push('Every XP point is progress - stay committed to your goals');
  }

  // Generate summary
  let aiGeneratedSummary = '';
  if (params.totalGames === 0) {
    aiGeneratedSummary = "This week you haven't played any games yet. Remember, every learning journey starts with a single step. We're here to support you whenever you're ready to begin!";
  } else if (params.avgAccuracy >= 80 && params.totalGames >= 10) {
    aiGeneratedSummary = `Outstanding week! You completed ${params.totalGames} games with ${params.avgAccuracy}% accuracy and earned ${params.totalXP} XP. Your dedication and strong performance show real mastery. Keep challenging yourself!`;
  } else if (params.totalGames >= 7) {
    aiGeneratedSummary = `Great effort this week! You completed ${params.totalGames} games and earned ${params.totalXP} XP over ${activeDays} active days. You're building strong learning habits. Continue this momentum!`;
  } else {
    aiGeneratedSummary = `You completed ${params.totalGames} games this week and earned ${params.totalXP} XP. Every game you play builds your skills and confidence. Keep learning at your own pace - you're making progress!`;
  }

  return {
    strengths: strengths.slice(0, 4),
    improvements: improvements.slice(0, 3),
    insights: insights.slice(0, 4),
    aiGeneratedSummary,
  };
}

export {
  sendLLMRequest,
  generateGameFeedback,
  GameFeedbackParams,
  GameFeedback,
  generateWeeklyInsights,
  WeeklyInsightsParams,
  WeeklyInsights,
};