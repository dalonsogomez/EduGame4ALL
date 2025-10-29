"""
Educational LLM Agent Service
Uses Llama-3.1-8B-Instruct or OpenAI GPT for personalized educational feedback
"""

import os
import logging
from typing import Dict, List, Optional, Any
from dataclasses import dataclass
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM, BitsAndBytesConfig
from langchain.agents import AgentExecutor, create_react_agent
from langchain.tools import Tool
from langchain.memory import ConversationBufferMemory
from langchain_community.llms import HuggingFacePipeline
from langchain.prompts import PromptTemplate

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@dataclass
class UserContext:
    """User context for personalized responses"""
    user_id: str
    language: str = "es"
    age_group: str = "adult"  # child, teen, adult
    current_level: str = "beginner"  # beginner, intermediate, advanced
    interests: List[str] = None
    learning_goals: List[str] = None


class EducationalAgent:
    """
    LLM-powered educational agent that provides personalized feedback,
    generates adaptive questions, and recommends learning paths.
    """
    
    def __init__(self, model_name: str = None, use_quantization: bool = True):
        """
        Initialize the educational agent
        
        Args:
            model_name: HuggingFace model name or "openai" for GPT
            use_quantization: Use 8-bit quantization to save memory
        """
        self.model_name = model_name or os.getenv("LLM_MODEL", "meta-llama/Llama-3.1-8B-Instruct")
        self.use_openai = self.model_name.lower() == "openai"
        self.model = None
        self.tokenizer = None
        self.llm = None
        self.agent = None
        self.memory = ConversationBufferMemory(memory_key="chat_history")
        
        logger.info(f"Initializing Educational Agent with model: {self.model_name}")
        self._load_model(use_quantization)
        self._setup_agent()
    
    def _load_model(self, use_quantization: bool):
        """Load the LLM model"""
        try:
            if self.use_openai:
                from langchain_openai import ChatOpenAI
                self.llm = ChatOpenAI(
                    model="gpt-4o-mini",
                    temperature=0.7,
                    max_tokens=512
                )
                logger.info("OpenAI GPT model loaded successfully")
            else:
                # Load HuggingFace model with quantization
                quantization_config = None
                if use_quantization and torch.cuda.is_available():
                    quantization_config = BitsAndBytesConfig(
                        load_in_8bit=True,
                        llm_int8_threshold=6.0
                    )
                
                self.tokenizer = AutoTokenizer.from_pretrained(
                    self.model_name,
                    cache_dir=os.getenv("CACHE_DIR", "./models")
                )
                
                self.model = AutoModelForCausalLM.from_pretrained(
                    self.model_name,
                    quantization_config=quantization_config,
                    device_map="auto" if torch.cuda.is_available() else None,
                    cache_dir=os.getenv("CACHE_DIR", "./models"),
                    torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32
                )
                
                # Create LangChain pipeline
                from transformers import pipeline
                pipe = pipeline(
                    "text-generation",
                    model=self.model,
                    tokenizer=self.tokenizer,
                    max_new_tokens=512,
                    temperature=0.7,
                    top_p=0.95,
                    repetition_penalty=1.15
                )
                
                self.llm = HuggingFacePipeline(pipeline=pipe)
                logger.info(f"HuggingFace model {self.model_name} loaded successfully")
                
        except Exception as e:
            logger.error(f"Error loading model: {e}")
            raise
    
    def _setup_agent(self):
        """Setup LangChain agent with educational tools"""
        tools = [
            Tool(
                name="generate_adaptive_question",
                func=self._generate_adaptive_question,
                description="Generate a personalized question based on user level and subject. Input: subject, difficulty"
            ),
            Tool(
                name="provide_educational_feedback",
                func=self._provide_educational_feedback,
                description="Provide pedagogical feedback on user's answer. Input: user_answer, correct_answer, context"
            ),
            Tool(
                name="recommend_learning_path",
                func=self._recommend_learning_path,
                description="Recommend next learning topics based on user progress. Input: user_id, current_topic"
            ),
            Tool(
                name="calculate_adaptive_difficulty",
                func=self._calculate_adaptive_difficulty,
                description="Calculate next difficulty level based on performance. Input: accuracy, time_spent"
            )
        ]
        
        # Create agent prompt
        template = """You are an empathetic educational AI assistant helping refugees and migrants learn new languages and integrate into their new communities. 
        
You have access to the following tools:
{tools}

Tool Names: {tool_names}

Always respond in the user's preferred language. Be encouraging, patient, and culturally sensitive.

User Context: {user_context}

Question: {input}

Thought: {agent_scratchpad}"""
        
        prompt = PromptTemplate(
            template=template,
            input_variables=["tools", "tool_names", "user_context", "input", "agent_scratchpad"]
        )
        
        # Create agent
        self.agent = create_react_agent(self.llm, tools, prompt)
        self.agent_executor = AgentExecutor(
            agent=self.agent,
            tools=tools,
            memory=self.memory,
            verbose=True,
            max_iterations=3
        )
    
    def _generate_adaptive_question(self, params: str) -> str:
        """Generate adaptive question based on user level"""
        # This would integrate with the database to get user progress
        return f"Generated adaptive question for: {params}"
    
    def _provide_educational_feedback(self, params: str) -> str:
        """Provide pedagogical feedback"""
        return f"Educational feedback for: {params}"
    
    def _recommend_learning_path(self, params: str) -> str:
        """Recommend learning path"""
        return f"Learning path recommendation for: {params}"
    
    def _calculate_adaptive_difficulty(self, params: str) -> str:
        """Calculate adaptive difficulty"""
        return f"Difficulty calculation for: {params}"
    
    def chat(self, message: str, user_context: UserContext) -> Dict[str, Any]:
        """
        Main chat interface for the educational agent
        
        Args:
            message: User's message
            user_context: User context information
            
        Returns:
            Dict with response and metadata
        """
        try:
            context_str = f"Language: {user_context.language}, Level: {user_context.current_level}, Age: {user_context.age_group}"
            
            response = self.agent_executor.invoke({
                "input": message,
                "user_context": context_str
            })
            
            return {
                "response": response.get("output", ""),
                "confidence": 0.85,  # Placeholder
                "suggested_actions": [],
                "next_difficulty": user_context.current_level
            }
        except Exception as e:
            logger.error(f"Error in chat: {e}")
            return {
                "response": "Lo siento, tuve un problema procesando tu mensaje. ¿Puedes intentarlo de nuevo?",
                "confidence": 0.0,
                "error": str(e)
            }
    
    def generate_feedback(self, game_session: Dict[str, Any], user_context: UserContext) -> Dict[str, Any]:
        """
        Generate personalized feedback for a game session
        
        Args:
            game_session: Game session data with scores, mistakes, etc.
            user_context: User context
            
        Returns:
            Dict with feedback, strengths, improvements, and insights
        """
        try:
            accuracy = (game_session.get("correctAnswers", 0) / game_session.get("totalQuestions", 1)) * 100
            
            prompt = f"""Analyze this learning session and provide encouraging feedback in {user_context.language}:
            
Game Type: {game_session.get('gameType', 'unknown')}
Difficulty: {game_session.get('difficulty', 'beginner')}
Score: {game_session.get('correctAnswers', 0)}/{game_session.get('totalQuestions', 0)} ({accuracy:.1f}%)
Time Spent: {game_session.get('timeSpent', 0)} seconds
Common Mistakes: {', '.join(game_session.get('mistakesPattern', []))}

Provide:
1. One encouraging strength the user demonstrated
2. One specific area for improvement
3. One actionable tip for next session
4. A warm, motivational summary (2-3 sentences)

Keep it concise, positive, and culturally sensitive."""

            if self.use_openai:
                response = self.llm.invoke(prompt)
                feedback_text = response.content
            else:
                response = self.llm.invoke(prompt)
                feedback_text = response
            
            # Parse response (simplified - in production, use structured output)
            return {
                "strengths": ["Great effort and persistence!"],
                "improvements": ["Focus on grammar patterns"],
                "insights": [f"You completed the session with {accuracy:.0f}% accuracy"],
                "aiSummary": feedback_text[:200] if isinstance(feedback_text, str) else "Keep up the great work!",
                "nextDifficulty": self._suggest_next_difficulty(accuracy)
            }
            
        except Exception as e:
            logger.error(f"Error generating feedback: {e}")
            return self._generate_fallback_feedback(game_session)
    
    def _suggest_next_difficulty(self, accuracy: float) -> str:
        """Suggest next difficulty based on accuracy"""
        if accuracy >= 90:
            return "intermediate"
        elif accuracy >= 75:
            return "beginner"
        else:
            return "beginner"
    
    def _generate_fallback_feedback(self, game_session: Dict[str, Any]) -> Dict[str, Any]:
        """Generate rule-based feedback when AI fails"""
        accuracy = (game_session.get("correctAnswers", 0) / game_session.get("totalQuestions", 1)) * 100
        
        if accuracy >= 80:
            summary = "¡Excelente trabajo! Estás progresando muy bien."
        elif accuracy >= 60:
            summary = "Buen esfuerzo. Con un poco más de práctica, mejorarás aún más."
        else:
            summary = "Sigue intentándolo. Cada error es una oportunidad para aprender."
        
        return {
            "strengths": ["Completaste la actividad con dedicación"],
            "improvements": ["Practica más para mejorar tu precisión"],
            "insights": [f"Precisión: {accuracy:.0f}%"],
            "aiSummary": summary,
            "nextDifficulty": self._suggest_next_difficulty(accuracy)
        }


# Singleton instance
_agent_instance = None

def get_agent() -> EducationalAgent:
    """Get or create singleton agent instance"""
    global _agent_instance
    if _agent_instance is None:
        _agent_instance = EducationalAgent()
    return _agent_instance
