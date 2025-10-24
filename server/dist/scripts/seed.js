import dotenv from 'dotenv';
import { connectDB } from '../config/database';
import { Game } from '../models/Game';
import { Badge } from '../models/Badge';
import { Reward } from '../models/Reward';
import { Resource } from '../models/Resource';
import User from '../models/User';
import { UserProgress } from '../models/UserProgress';
import { generatePasswordHash } from '../utils/password';
dotenv.config();
const seedData = async () => {
    try {
        console.log('🌱 Starting database seed...');
        // Connect to database
        await connectDB();
        // Clear existing data
        console.log('🗑️  Clearing existing data...');
        await Promise.all([
            Game.deleteMany({}),
            Badge.deleteMany({}),
            Reward.deleteMany({}),
            Resource.deleteMany({}),
        ]);
        // 1. Create Admin User
        console.log('👤 Creating admin user...');
        const adminExists = await User.findOne({ email: 'admin@edugame4all.com' });
        if (!adminExists) {
            const hashedPassword = await generatePasswordHash('Admin@123');
            const adminUser = await User.create({
                email: 'admin@edugame4all.com',
                password: hashedPassword,
                role: 'admin',
                name: 'Admin User',
                userType: 'educator',
                location: 'System',
                nativeLanguage: 'English',
                targetLanguage: 'Spanish',
            });
            // Create default progress for admin user
            await UserProgress.create({
                userId: adminUser._id,
                totalXP: 0,
                level: 1,
                streak: 0,
                lastActivityDate: new Date(),
                weeklyGoal: 5,
                weeklyProgress: 0,
                skills: {
                    language: { xp: 0, level: 1 },
                    culture: { xp: 0, level: 1 },
                    softSkills: { xp: 0, level: 1 },
                },
            });
            console.log('✅ Admin user created: admin@edugame4all.com / Admin@123');
        }
        else {
            console.log('ℹ️  Admin user already exists');
        }
        // 2. Create Sample Games
        console.log('🎮 Creating sample games...');
        const games = [
            // Language Games
            {
                title: 'English Basics',
                description: 'Master fundamental English vocabulary and grammar through interactive exercises.',
                category: 'language',
                difficulty: 1,
                duration: 10,
                xpReward: 50,
                thumbnailUrl: '',
                isActive: true,
                questions: [
                    {
                        question: 'What is the plural form of "child"?',
                        options: ['childs', 'children', 'childes', 'child'],
                        correctAnswer: 1,
                        explanation: 'The correct plural form of "child" is "children".',
                        points: 10,
                    },
                    {
                        question: 'Which word is a verb?',
                        options: ['quickly', 'run', 'happy', 'table'],
                        correctAnswer: 1,
                        explanation: '"Run" is an action word, making it a verb.',
                        points: 10,
                    },
                    {
                        question: 'What is the opposite of "hot"?',
                        options: ['warm', 'cool', 'cold', 'freezing'],
                        correctAnswer: 2,
                        explanation: '"Cold" is the most common opposite of "hot".',
                        points: 10,
                    },
                    {
                        question: 'Which sentence is grammatically correct?',
                        options: [
                            'She go to school',
                            'She goes to school',
                            'She going to school',
                            'She gone to school',
                        ],
                        correctAnswer: 1,
                        explanation: 'With third person singular, we add "s" to the verb: "goes".',
                        points: 10,
                    },
                    {
                        question: 'What is a synonym for "happy"?',
                        options: ['sad', 'angry', 'joyful', 'tired'],
                        correctAnswer: 2,
                        explanation: '"Joyful" means the same as "happy".',
                        points: 10,
                    },
                ],
            },
            {
                title: 'Conversational English',
                description: 'Learn practical English phrases for everyday conversations.',
                category: 'language',
                difficulty: 2,
                duration: 15,
                xpReward: 75,
                thumbnailUrl: '',
                isActive: true,
                questions: [
                    {
                        question: 'How do you greet someone in the morning?',
                        options: ['Good night', 'Good evening', 'Good morning', 'Good afternoon'],
                        correctAnswer: 2,
                        explanation: '"Good morning" is the appropriate greeting before noon.',
                        points: 15,
                    },
                    {
                        question: 'What is a polite way to ask for help?',
                        options: [
                            'Give me help',
                            'Help me now',
                            'Could you please help me?',
                            'You must help me',
                        ],
                        correctAnswer: 2,
                        explanation: 'Using "Could you please..." is a polite way to ask for help.',
                        points: 15,
                    },
                    {
                        question: 'How do you respond to "Thank you"?',
                        options: ["You're welcome", 'Yes', 'No problem both', 'Okay'],
                        correctAnswer: 0,
                        explanation: '"You\'re welcome" is the standard polite response.',
                        points: 15,
                    },
                ],
            },
            {
                title: 'Business English',
                description: 'Professional English vocabulary and phrases for workplace communication.',
                category: 'language',
                difficulty: 3,
                duration: 20,
                xpReward: 100,
                thumbnailUrl: '',
                isActive: true,
                questions: [
                    {
                        question: 'What does "deadline" mean?',
                        options: [
                            'A line that is dead',
                            'The final date for completing something',
                            'A straight line',
                            'A phone line',
                        ],
                        correctAnswer: 1,
                        explanation: 'A deadline is the latest time or date by which something must be completed.',
                        points: 20,
                    },
                    {
                        question: 'Which is a professional email greeting?',
                        options: ['Hey!', 'Yo!', 'Dear Sir/Madam,', 'What\'s up?'],
                        correctAnswer: 2,
                        explanation: '"Dear Sir/Madam" is a formal and professional greeting.',
                        points: 20,
                    },
                ],
            },
            // Culture Games
            {
                title: 'American Culture 101',
                description: 'Discover American customs, traditions, and cultural practices.',
                category: 'culture',
                difficulty: 1,
                duration: 12,
                xpReward: 60,
                thumbnailUrl: '',
                isActive: true,
                questions: [
                    {
                        question: 'What is a popular American holiday in November?',
                        options: ['Christmas', 'Thanksgiving', 'Halloween', 'Easter'],
                        correctAnswer: 1,
                        explanation: 'Thanksgiving is celebrated in November in the United States.',
                        points: 12,
                    },
                    {
                        question: 'What is tipping culture in America?',
                        options: [
                            'Not customary',
                            'Only for excellent service',
                            'Expected in restaurants (15-20%)',
                            'Offensive',
                        ],
                        correctAnswer: 2,
                        explanation: 'Tipping 15-20% is customary in American restaurants.',
                        points: 12,
                    },
                    {
                        question: 'What is the most popular American sport?',
                        options: ['Soccer', 'Cricket', 'American Football', 'Rugby'],
                        correctAnswer: 2,
                        explanation: 'American Football is the most popular sport in the US.',
                        points: 12,
                    },
                ],
            },
            {
                title: 'Workplace Culture',
                description: 'Navigate American workplace norms and professional etiquette.',
                category: 'culture',
                difficulty: 2,
                duration: 15,
                xpReward: 80,
                thumbnailUrl: '',
                isActive: true,
                questions: [
                    {
                        question: 'What is considered professional attire in most US offices?',
                        options: ['Casual wear', 'Business casual', 'Formal wear always', 'Athletic wear'],
                        correctAnswer: 1,
                        explanation: 'Business casual is the standard in most American offices.',
                        points: 15,
                    },
                    {
                        question: 'Is it appropriate to discuss salary with coworkers?',
                        options: [
                            'Yes, always',
                            'It depends on company culture',
                            'Never',
                            'Only with your boss',
                        ],
                        correctAnswer: 1,
                        explanation: 'This varies by company culture, though it\'s becoming more accepted.',
                        points: 15,
                    },
                ],
            },
            // Soft Skills Games
            {
                title: 'Communication Skills',
                description: 'Develop effective communication techniques for personal and professional success.',
                category: 'soft-skills',
                difficulty: 2,
                duration: 15,
                xpReward: 75,
                thumbnailUrl: '',
                isActive: true,
                questions: [
                    {
                        question: 'What is active listening?',
                        options: [
                            'Listening while exercising',
                            'Fully concentrating and understanding the speaker',
                            'Listening to music',
                            'Hearing without paying attention',
                        ],
                        correctAnswer: 1,
                        explanation: 'Active listening means fully focusing on and understanding the speaker.',
                        points: 15,
                    },
                    {
                        question: 'What is appropriate body language during a conversation?',
                        options: [
                            'Crossing arms',
                            'Looking away',
                            'Eye contact and open posture',
                            'Checking phone',
                        ],
                        correctAnswer: 2,
                        explanation: 'Eye contact and open posture show engagement and respect.',
                        points: 15,
                    },
                    {
                        question: 'How should you give constructive feedback?',
                        options: [
                            'Criticize publicly',
                            'Focus only on negatives',
                            'Be specific and solution-focused',
                            'Avoid the topic',
                        ],
                        correctAnswer: 2,
                        explanation: 'Constructive feedback should be specific and include solutions.',
                        points: 15,
                    },
                ],
            },
            {
                title: 'Time Management',
                description: 'Master productivity techniques and time management strategies.',
                category: 'soft-skills',
                difficulty: 2,
                duration: 12,
                xpReward: 70,
                thumbnailUrl: '',
                isActive: true,
                questions: [
                    {
                        question: 'What is the Pomodoro Technique?',
                        options: [
                            'A cooking method',
                            'Working in 25-minute focused intervals',
                            'A type of tomato',
                            'A scheduling app',
                        ],
                        correctAnswer: 1,
                        explanation: 'The Pomodoro Technique uses 25-minute focused work intervals.',
                        points: 14,
                    },
                    {
                        question: 'How should you prioritize tasks?',
                        options: [
                            'Do easiest tasks first',
                            'Random order',
                            'Urgent and important first',
                            'Start with longest tasks',
                        ],
                        correctAnswer: 2,
                        explanation: 'Prioritize based on urgency and importance (Eisenhower Matrix).',
                        points: 14,
                    },
                ],
            },
            {
                title: 'Problem Solving',
                description: 'Build critical thinking and problem-solving abilities.',
                category: 'soft-skills',
                difficulty: 3,
                duration: 18,
                xpReward: 90,
                thumbnailUrl: '',
                isActive: true,
                questions: [
                    {
                        question: 'What is the first step in problem solving?',
                        options: [
                            'Implement a solution',
                            'Identify and define the problem',
                            'Blame someone',
                            'Give up',
                        ],
                        correctAnswer: 1,
                        explanation: 'You must clearly identify and define the problem first.',
                        points: 18,
                    },
                    {
                        question: 'What is brainstorming?',
                        options: [
                            'A weather phenomenon',
                            'Generating multiple ideas without judgment',
                            'A headache',
                            'Critical analysis',
                        ],
                        correctAnswer: 1,
                        explanation: 'Brainstorming involves generating many ideas freely without immediate judgment.',
                        points: 18,
                    },
                ],
            },
        ];
        const createdGames = await Game.insertMany(games);
        console.log(`✅ Created ${createdGames.length} games`);
        // 3. Create Badges
        console.log('🏅 Creating badges...');
        const badges = [
            // Language Badges
            {
                name: 'Language Learner',
                description: 'Complete your first language game',
                category: 'language',
                xpRequired: 50,
                level: 1,
                isActive: true,
            },
            {
                name: 'Wordsmith',
                description: 'Earn 500 XP in language games',
                category: 'language',
                xpRequired: 500,
                level: 2,
                isActive: true,
            },
            {
                name: 'Language Master',
                description: 'Earn 1000 XP in language games',
                category: 'language',
                xpRequired: 1000,
                level: 3,
                isActive: true,
            },
            // Culture Badges
            {
                name: 'Culture Explorer',
                description: 'Complete your first culture game',
                category: 'culture',
                xpRequired: 60,
                level: 1,
                isActive: true,
            },
            {
                name: 'Cultural Ambassador',
                description: 'Earn 500 XP in culture games',
                category: 'culture',
                xpRequired: 500,
                level: 2,
                isActive: true,
            },
            {
                name: 'Culture Expert',
                description: 'Earn 1000 XP in culture games',
                category: 'culture',
                xpRequired: 1000,
                level: 3,
                isActive: true,
            },
            // Soft Skills Badges
            {
                name: 'Skill Builder',
                description: 'Complete your first soft skills game',
                category: 'soft-skills',
                xpRequired: 70,
                level: 1,
                isActive: true,
            },
            {
                name: 'Professional',
                description: 'Earn 500 XP in soft skills games',
                category: 'soft-skills',
                xpRequired: 500,
                level: 2,
                isActive: true,
            },
            {
                name: 'Leadership Pro',
                description: 'Earn 1000 XP in soft skills games',
                category: 'soft-skills',
                xpRequired: 1000,
                level: 3,
                isActive: true,
            },
            // Achievement Badges
            {
                name: 'First Steps',
                description: 'Complete your first game',
                category: 'achievement',
                xpRequired: 50,
                level: 1,
                isActive: true,
            },
            {
                name: 'Rising Star',
                description: 'Reach level 5',
                category: 'achievement',
                xpRequired: 500,
                level: 2,
                isActive: true,
            },
            {
                name: 'Dedicated Learner',
                description: 'Maintain a 7-day streak',
                category: 'achievement',
                xpRequired: 350,
                level: 2,
                isActive: true,
            },
            {
                name: 'Champion',
                description: 'Reach level 10',
                category: 'achievement',
                xpRequired: 1000,
                level: 3,
                isActive: true,
            },
            {
                name: 'Elite',
                description: 'Earn 2000 total XP',
                category: 'achievement',
                xpRequired: 2000,
                level: 4,
                isActive: true,
            },
        ];
        const createdBadges = await Badge.insertMany(badges);
        console.log(`✅ Created ${createdBadges.length} badges`);
        // 4. Create Rewards
        console.log('🎁 Creating rewards...');
        const rewards = [
            // Gift Cards
            {
                title: '$10 Amazon Gift Card',
                description: 'Redeem for a $10 Amazon gift card',
                category: 'gift-cards',
                xpCost: 500,
                availableQuantity: 50,
                totalQuantity: 50,
                isActive: true,
            },
            {
                title: '$25 Target Gift Card',
                description: 'Redeem for a $25 Target gift card',
                category: 'gift-cards',
                xpCost: 1200,
                availableQuantity: 30,
                totalQuantity: 30,
                isActive: true,
            },
            {
                title: '$50 Visa Gift Card',
                description: 'Redeem for a $50 Visa prepaid card',
                category: 'gift-cards',
                xpCost: 2500,
                availableQuantity: 20,
                totalQuantity: 20,
                isActive: true,
            },
            // Courses
            {
                title: 'Free Online Course Access',
                description: '1-month access to premium online courses',
                category: 'courses',
                xpCost: 800,
                availableQuantity: 100,
                totalQuantity: 100,
                isActive: true,
            },
            {
                title: 'Professional Development Workshop',
                description: 'Attend a free professional development workshop',
                category: 'courses',
                xpCost: 1500,
                availableQuantity: 25,
                totalQuantity: 25,
                isActive: true,
            },
            // Discounts
            {
                title: '20% Off Local Restaurant',
                description: 'Get 20% off at participating restaurants',
                category: 'discounts',
                xpCost: 300,
                availableQuantity: 200,
                totalQuantity: 200,
                isActive: true,
            },
            {
                title: 'Gym Membership Discount',
                description: '50% off first month gym membership',
                category: 'discounts',
                xpCost: 600,
                availableQuantity: 50,
                totalQuantity: 50,
                isActive: true,
            },
            {
                title: 'Transportation Pass',
                description: 'Free monthly public transportation pass',
                category: 'discounts',
                xpCost: 1000,
                availableQuantity: 30,
                totalQuantity: 30,
                isActive: true,
            },
            // Events
            {
                title: 'Community Networking Event',
                description: 'Free entry to monthly networking event',
                category: 'events',
                xpCost: 400,
                availableQuantity: 100,
                totalQuantity: 100,
                isActive: true,
            },
            {
                title: 'Career Fair Access',
                description: 'VIP access to immigrant career fair',
                category: 'events',
                xpCost: 700,
                availableQuantity: 75,
                totalQuantity: 75,
                isActive: true,
            },
        ];
        const createdRewards = await Reward.insertMany(rewards);
        console.log(`✅ Created ${createdRewards.length} rewards`);
        // 5. Create Community Resources
        console.log('📚 Creating community resources...');
        const resources = [
            // Jobs
            {
                type: 'job',
                title: 'Customer Service Representative',
                description: 'Join our team as a customer service representative. Bilingual candidates encouraged to apply.',
                company: 'ABC Corporation',
                location: 'New York, NY',
                salary: '$35,000 - $45,000',
                jobType: 'Full-time',
                requirements: ['High school diploma', 'Good communication skills', 'Customer service experience'],
                matchScore: 85,
                url: 'https://example.com/jobs/1',
                isActive: true,
            },
            {
                type: 'job',
                title: 'Warehouse Associate',
                description: 'Entry-level warehouse position with growth opportunities.',
                company: 'XYZ Logistics',
                location: 'Los Angeles, CA',
                salary: '$16 - $20/hour',
                jobType: 'Full-time',
                requirements: ['Physical stamina', 'Team player', 'No experience required'],
                matchScore: 75,
                url: 'https://example.com/jobs/2',
                isActive: true,
            },
            {
                type: 'job',
                title: 'Restaurant Server',
                description: 'Busy restaurant seeking friendly servers. Flexible hours.',
                company: 'Downtown Bistro',
                location: 'Chicago, IL',
                salary: '$12/hour + tips',
                jobType: 'Part-time',
                requirements: ['Weekend availability', 'Friendly personality'],
                matchScore: 70,
                url: 'https://example.com/jobs/3',
                isActive: true,
            },
            {
                type: 'job',
                title: 'Junior Software Developer',
                description: 'Tech company hiring junior developers. Training provided.',
                company: 'Tech Innovators Inc',
                location: 'Austin, TX',
                salary: '$55,000 - $70,000',
                jobType: 'Full-time',
                requirements: ['Basic programming knowledge', 'Bachelor\'s degree or equivalent', 'Problem-solving skills'],
                matchScore: 80,
                url: 'https://example.com/jobs/4',
                isActive: true,
            },
            // Grants
            {
                type: 'grant',
                title: 'New Americans Grant',
                description: 'Financial assistance for immigrants pursuing education or starting businesses.',
                amount: 'Up to $5,000',
                deadline: new Date('2024-12-31'),
                eligibility: ['Immigrant status', 'Proof of income', 'Business plan or enrollment letter'],
                url: 'https://example.com/grants/1',
                isActive: true,
            },
            {
                type: 'grant',
                title: 'English Language Learning Grant',
                description: 'Funding for ESL courses and educational materials.',
                amount: 'Up to $1,500',
                deadline: new Date('2024-11-30'),
                eligibility: ['Enrolled in ESL program', 'Income requirements'],
                url: 'https://example.com/grants/2',
                isActive: true,
            },
            {
                type: 'grant',
                title: 'Small Business Startup Grant',
                description: 'Support for immigrant entrepreneurs starting new businesses.',
                amount: '$2,500 - $10,000',
                deadline: new Date('2025-03-31'),
                eligibility: ['Business plan', 'US work authorization', 'Financial projections'],
                url: 'https://example.com/grants/3',
                isActive: true,
            },
            // Services
            {
                type: 'service',
                title: 'Free Legal Consultation',
                description: 'Immigration legal services and consultation.',
                provider: 'Immigrant Legal Aid Society',
                serviceType: 'Legal',
                contact: '(555) 123-4567',
                url: 'https://example.com/services/legal',
                isActive: true,
            },
            {
                type: 'service',
                title: 'ESL Classes',
                description: 'Free English as a Second Language classes for all levels.',
                provider: 'Community Learning Center',
                serviceType: 'Education',
                contact: '(555) 234-5678',
                url: 'https://example.com/services/esl',
                isActive: true,
            },
            {
                type: 'service',
                title: 'Job Placement Services',
                description: 'Career counseling and job placement assistance.',
                provider: 'New Horizons Career Center',
                serviceType: 'Employment',
                contact: '(555) 345-6789',
                url: 'https://example.com/services/jobs',
                isActive: true,
            },
            {
                type: 'service',
                title: 'Healthcare Navigation',
                description: 'Help navigating the US healthcare system and finding affordable care.',
                provider: 'Health Access Network',
                serviceType: 'Healthcare',
                contact: '(555) 456-7890',
                url: 'https://example.com/services/health',
                isActive: true,
            },
            {
                type: 'service',
                title: 'Housing Assistance',
                description: 'Support finding affordable housing and understanding tenant rights.',
                provider: 'Community Housing Alliance',
                serviceType: 'Housing',
                contact: '(555) 567-8901',
                url: 'https://example.com/services/housing',
                isActive: true,
            },
            // News
            {
                type: 'news',
                title: 'New Immigrant Support Program Launches',
                description: 'City announces comprehensive support program for new immigrants including job training and language classes.',
                source: 'Local News Network',
                publishedDate: new Date('2024-01-15'),
                imageUrl: '',
                url: 'https://example.com/news/1',
                isActive: true,
            },
            {
                type: 'news',
                title: 'Immigration Policy Updates: What You Need to Know',
                description: 'Recent changes to immigration policies and how they may affect you.',
                source: 'Immigration Today',
                publishedDate: new Date('2024-01-10'),
                imageUrl: '',
                url: 'https://example.com/news/2',
                isActive: true,
            },
            {
                type: 'news',
                title: 'Success Story: From Refugee to Business Owner',
                description: 'Inspiring story of an immigrant who built a successful business in their new community.',
                source: 'Community Voice',
                publishedDate: new Date('2024-01-08'),
                imageUrl: '',
                url: 'https://example.com/news/3',
                isActive: true,
            },
            {
                type: 'news',
                title: 'Free Citizenship Classes Starting Next Month',
                description: 'Local organization offering free citizenship test preparation classes.',
                source: 'Education Weekly',
                publishedDate: new Date('2024-01-05'),
                imageUrl: '',
                url: 'https://example.com/news/4',
                isActive: true,
            },
        ];
        const createdResources = await Resource.insertMany(resources);
        console.log(`✅ Created ${createdResources.length} community resources`);
        console.log('\n✨ Database seed completed successfully!\n');
        console.log('📊 Summary:');
        console.log(`   - Games: ${createdGames.length}`);
        console.log(`   - Badges: ${createdBadges.length}`);
        console.log(`   - Rewards: ${createdRewards.length}`);
        console.log(`   - Resources: ${createdResources.length}`);
        console.log(`   - Admin User: admin@edugame4all.com / Admin@123\n`);
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};
// Run seed
seedData();
//# sourceMappingURL=seed.js.map