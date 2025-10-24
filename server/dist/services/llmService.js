import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';
dotenv.config();
let openai = null;
let anthropic = null;
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
async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function sendRequestToOpenAI(model, message) {
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
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            const errorStack = error instanceof Error ? error.stack : 'No stack trace';
            console.error(`Error sending request to OpenAI (attempt ${i + 1}):`, errorMessage, errorStack);
            if (i === MAX_RETRIES - 1)
                throw error;
            await sleep(RETRY_DELAY);
        }
    }
    return '';
}
async function sendRequestToAnthropic(model, message) {
    if (!anthropic) {
        throw new Error('Anthropic is not initialized. Please provide ANTHROPIC_API_KEY in environment variables.');
    }
    for (let i = 0; i < MAX_RETRIES; i++) {
        try {
            console.log(`Sending request to Anthropic with model: ${model} and message: ${message}`);
            const response = await anthropic.messages.create({
                model: model,
                messages: [{ role: 'user', content: message }],
                max_tokens: 1024,
            });
            console.log(`Received response from Anthropic: ${JSON.stringify(response.content)}`);
            return response.content[0].type === 'text' ? response.content[0].text : '';
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            const errorStack = error instanceof Error ? error.stack : 'No stack trace';
            console.error(`Error sending request to Anthropic (attempt ${i + 1}):`, errorMessage, errorStack);
            if (i === MAX_RETRIES - 1)
                throw error;
            await sleep(RETRY_DELAY);
        }
    }
    return '';
}
async function sendLLMRequest(provider, model, message) {
    switch (provider.toLowerCase()) {
        case 'openai':
            return sendRequestToOpenAI(model, message);
        case 'anthropic':
            return sendRequestToAnthropic(model, message);
        default:
            throw new Error(`Unsupported LLM provider: ${provider}`);
    }
}
async function generateGameFeedback(params) {
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
        let response;
        const provider = process.env.OPENAI_API_KEY ? 'openai' : 'anthropic';
        const model = provider === 'openai' ? 'gpt-3.5-turbo' : 'claude-3-haiku-20240307';
        console.log(`[LLMService] Using ${provider} to generate feedback`);
        response = await sendLLMRequest(provider, model, prompt);
        // Parse the JSON response
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('Failed to extract JSON from LLM response');
        }
        const feedback = JSON.parse(jsonMatch[0]);
        console.log('[LLMService] Successfully generated feedback');
        // Validate feedback structure
        if (!feedback.strengths || !feedback.improvements || !feedback.tips ||
            !feedback.nextRecommendations || !feedback.personalizedMessage) {
            throw new Error('Invalid feedback structure from LLM');
        }
        return feedback;
    }
    catch (error) {
        console.error('[LLMService] Error generating feedback:', error);
        // Fallback to rule-based feedback if AI fails
        console.log('[LLMService] Using fallback rule-based feedback');
        return generateFallbackFeedback(params, scorePercentage, correctAnswers, totalQuestions);
    }
}
function generateFallbackFeedback(params, scorePercentage, correctAnswers, totalQuestions) {
    const strengths = [];
    const improvements = [];
    const tips = [];
    // Generate strengths based on performance
    if (scorePercentage >= 80) {
        strengths.push('Excellent comprehension of the material');
        strengths.push('Strong performance across most questions');
    }
    else if (scorePercentage >= 60) {
        strengths.push('Good understanding of core concepts');
        strengths.push('Consistent effort throughout the game');
    }
    else {
        strengths.push('Completed the challenge with determination');
        strengths.push('Gained exposure to new concepts');
    }
    // Generate improvements
    if (scorePercentage < 80) {
        improvements.push('Review the questions you found challenging');
        improvements.push('Practice similar exercises to reinforce learning');
    }
    else {
        improvements.push('Try a higher difficulty level for more challenge');
    }
    // Generate tips based on category
    if (params.gameCategory === 'language') {
        tips.push('Practice daily to build vocabulary retention');
        tips.push('Try speaking the words aloud for better memorization');
    }
    else if (params.gameCategory === 'culture') {
        tips.push('Explore local cultural events to enhance understanding');
        tips.push('Connect with community members to learn more');
    }
    else {
        tips.push('Practice these skills in real-world situations');
        tips.push('Reflect on scenarios from your daily life');
    }
    // Generate recommendations
    const nextRecommendations = [];
    if (scorePercentage >= 80) {
        nextRecommendations.push(`Advanced ${params.gameCategory} challenge`);
        nextRecommendations.push(`Explore another category to broaden skills`);
    }
    else {
        nextRecommendations.push(`Review this game for mastery`);
        nextRecommendations.push(`Try similar ${params.gameCategory} games at this level`);
    }
    // Generate personalized message
    let personalizedMessage = '';
    if (scorePercentage >= 80) {
        personalizedMessage = `Excellent work on ${params.gameTitle}! You scored ${scorePercentage}% and showed great mastery of the concepts. Keep up this fantastic momentum!`;
    }
    else if (scorePercentage >= 60) {
        personalizedMessage = `Good effort on ${params.gameTitle}! You got ${correctAnswers} out of ${totalQuestions} questions correct. With a bit more practice, you'll master this topic!`;
    }
    else {
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
export { sendLLMRequest, generateGameFeedback, };
//# sourceMappingURL=llmService.js.map