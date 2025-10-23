import api from './api';
import { Game, GameSession } from '@/types';

// Description: Get all games
// Endpoint: GET /api/games
// Request: { category?: string, difficulty?: number }
// Response: { games: Game[] }
export const getGames = async (filters?: { category?: string; difficulty?: number }) => {
  // Mocking the response
  return new Promise<{ games: Game[] }>((resolve) => {
    setTimeout(() => {
      const allGames: Game[] = [
        {
          _id: '1',
          title: 'Market Vocabulary Match',
          description: 'Match words with images from a local market scene',
          category: 'language',
          difficulty: 2,
          duration: 10,
          xpReward: 75,
          thumbnail: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400',
          isLocked: false,
          progress: 60,
        },
        {
          _id: '2',
          title: 'Conversation Simulator',
          description: 'Practice real-life conversations with AI characters',
          category: 'language',
          difficulty: 3,
          duration: 15,
          xpReward: 100,
          thumbnail: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
          isLocked: false,
        },
        {
          _id: '3',
          title: 'Pronunciation Challenge',
          description: 'Practice speaking with voice recognition',
          category: 'language',
          difficulty: 3,
          duration: 12,
          xpReward: 90,
          thumbnail: 'https://images.unsplash.com/photo-1589903308904-1010c2294adc?w=400',
          isLocked: false,
        },
        {
          _id: '4',
          title: 'Social Situations Quiz',
          description: 'Learn appropriate behavior in local contexts',
          category: 'culture',
          difficulty: 2,
          duration: 10,
          xpReward: 80,
          thumbnail: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400',
          isLocked: false,
        },
        {
          _id: '5',
          title: 'City Explorer',
          description: 'Virtual tour learning about local landmarks',
          category: 'culture',
          difficulty: 2,
          duration: 20,
          xpReward: 120,
          thumbnail: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400',
          isLocked: false,
        },
        {
          _id: '6',
          title: 'Customs & Traditions Timeline',
          description: 'Learn about holidays and important dates',
          category: 'culture',
          difficulty: 1,
          duration: 8,
          xpReward: 60,
          thumbnail: 'https://images.unsplash.com/photo-1464047736614-af63643285bf?w=400',
          isLocked: false,
        },
        {
          _id: '7',
          title: 'Team Challenge Simulator',
          description: 'Practice collaboration in virtual scenarios',
          category: 'softSkills',
          difficulty: 3,
          duration: 15,
          xpReward: 110,
          thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400',
          isLocked: false,
        },
        {
          _id: '8',
          title: 'Conflict Resolution Theater',
          description: 'Navigate disagreements constructively',
          category: 'softSkills',
          difficulty: 4,
          duration: 18,
          xpReward: 130,
          thumbnail: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400',
          isLocked: true,
        },
        {
          _id: '9',
          title: 'Communication Styles Workshop',
          description: 'Understand and adapt to different communication preferences',
          category: 'softSkills',
          difficulty: 3,
          duration: 12,
          xpReward: 95,
          thumbnail: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400',
          isLocked: false,
        },
      ];

      let filteredGames = allGames;
      if (filters?.category) {
        filteredGames = filteredGames.filter((g) => g.category === filters.category);
      }
      if (filters?.difficulty) {
        filteredGames = filteredGames.filter((g) => g.difficulty === filters.difficulty);
      }

      resolve({ games: filteredGames });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.get('/api/games', { params: filters });
  // } catch (error: any) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};

// Description: Get game by ID
// Endpoint: GET /api/games/:id
// Request: {}
// Response: { game: Game }
export const getGameById = async (id: string) => {
  // Mocking the response
  return new Promise<{ game: Game }>((resolve) => {
    setTimeout(() => {
      resolve({
        game: {
          _id: id,
          title: 'Market Vocabulary Match',
          description: 'Match words with images from a local market scene',
          category: 'language',
          difficulty: 2,
          duration: 10,
          xpReward: 75,
          thumbnail: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400',
          isLocked: false,
        },
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.get(`/api/games/${id}`);
  // } catch (error: any) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};

// Description: Submit game session
// Endpoint: POST /api/games/:id/session
// Request: { score: number, timeSpent: number }
// Response: { session: GameSession }
export const submitGameSession = async (gameId: string, data: { score: number; timeSpent: number }) => {
  // Mocking the response
  return new Promise<{ session: GameSession }>((resolve) => {
    setTimeout(() => {
      resolve({
        session: {
          _id: '1',
          gameId,
          score: data.score,
          timeSpent: data.timeSpent,
          xpEarned: 75,
          completedAt: new Date().toISOString(),
          feedback: {
            strengths: ['Excellent vocabulary retention', 'Quick response time'],
            improvements: ['Focus on verb conjugations', 'Practice pronunciation'],
            tips: ['Try using flashcards for difficult words', 'Practice speaking aloud'],
            nextRecommendations: ['Conversation Simulator', 'Pronunciation Challenge'],
            personalizedMessage:
              "Great work on Market Vocabulary! You're mastering food-related terms. I noticed you hesitated on fruit names - let's practice those next.",
          },
        },
      });
    }, 1000);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.post(`/api/games/${gameId}/session`, data);
  // } catch (error: any) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};