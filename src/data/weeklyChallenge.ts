import { QuizSection } from './quizQuestions';

export const weeklyChallengeSection: QuizSection = {
  id: "weekly-challenge-rlhf",
  title: {
    en: "Weekly Challenge: RLHF & AI Safety",
    ur: "Haftawar Challenge: RLHF aur AI Safety"
  },
  subtitle: {
    en: "Conquer reinforcement learning mechanics and critical model alignment concepts.",
    ur: "Reinforcement learning aur model alignment ke bunyadi thikaano ko fatah karein."
  },
  questions: [
    {
      id: "wc-q1",
      text: {
        en: "What does the abbreviation RLHF stand for in modern LLM training pipelines?",
        ur: "Modern LLM training pipelines mein abbreviation RLHF ka kya matlab hai?"
      },
      options: {
        en: [
          "Recurrent Language Heuristic Framework",
          "Reinforcement Learning from Human Feedback",
          "Random Logarithmic Hyper-parameter Filter",
          "Retrieval Loss Handling Function"
        ],
        ur: [
          "Recurrent Language Heuristic Framework",
          "Reinforcement Learning from Human Feedback",
          "Random Logarithmic Hyper-parameter Filter",
          "Retrieval Loss Handling Function"
        ]
      },
      answerIndex: 1,
      explanation: {
        en: "RLHF stands for Reinforcement Learning from Human Feedback, which aligns model behavior with human preferences.",
        ur: "RLHF ka matlab 'Reinforcement Learning from Human Feedback' hai, jo model ke raw behavior ko insani preferences ke mutabiq align karta hai."
      },
      points: 50
    },
    {
      id: "wc-q2",
      text: {
        en: "In RLHF, what is the role of the 'Reward Model' (RM)?",
        ur: "RLHF ke andar, 'Reward Model' (RM) ka kya kirdar hota hai?"
      },
      options: {
        en: [
          "To translate the user query into multiple languages",
          "To predict a scalar value representing how much humans would prefer a given response",
          "To compress the weights of the main model",
          "To randomly discard negative tokens from memory"
        ],
        ur: [
          "User query ko mukhtalif zabano mein translate karna",
          "Aik scalar score predict karna jo bataye ke insaan is response ko kitna pasand karenge",
          "Main model ke weights ko compress karna",
          "Memory se negative tokens ko mukhtalif tareeqon se remove karna"
        ]
      },
      answerIndex: 1,
      explanation: {
        en: "The Reward Model is trained on human preference ratings to score responses. The main LLM then optimizes its policy to maximize this score.",
        ur: "Reward Model ko insani choice data par train kiya jata hai taake wo outputs ko score de sake. Main model is score ko barhane ki koshish karta hai."
      },
      points: 50
    },
    {
      id: "wc-q3",
      text: {
        en: "Which algorithmic optimizer is commonly used in the RL step of RLHF to keep policy updates stable?",
        ur: "RLHF ke reinforcement learning stage mein policy updates ko stable rakhne ke liye aam tor par kaunsa algorithm use hota hai?"
      },
      options: {
        en: [
          "Simple Gradient Descent",
          "Proximal Policy Optimization (PPO)",
          "Binary Random Forest",
          "K-Nearest Neighbors"
        ],
        ur: [
          "Simple Gradient Descent",
          "Proximal Policy Optimization (PPO)",
          "Binary Random Forest",
          "K-Nearest Neighbors"
        ]
      },
      answerIndex: 1,
      explanation: {
        en: "Proximal Policy Optimization (PPO) is the reinforcement learning algorithm widely used because it keeps policy updates within a stable trust region.",
        ur: "Proximal Policy Optimization (PPO) aik standard RL algorithm hai kyunki ye policy updates ko safe range (trust region) mein rakhta hai."
      },
      points: 50
    },
    {
      id: "wc-q4",
      text: {
        en: "Why is a KL-divergence penalty added to the reward function during RL training?",
        ur: "RL training ke dauran reward function mein KL-divergence penalty kyun lagayi jati hai?"
      },
      options: {
        en: [
          "To force the model to speak faster",
          "To prevent the active policy from drifting too far from the original safe supervised model",
          "To increase the database connection speed",
          "To make the model use more memory"
        ],
        ur: [
          "Model ko tezi se bolne par majboor karne ke liye",
          "Active policy ko original safe supervised model se zyada door bhatakne se rokne ke liye",
          "Database connection ki speed barhane ke liye",
          "Model ko zyada memory use karwane ke liye"
        ]
      },
      answerIndex: 1,
      explanation: {
        en: "The KL-divergence penalty prevents the model from diverging too far from the baseline, avoiding gibberish generation or 'reward hacking'.",
        ur: "KL-divergence penalty model ko basic limits ke andar rakhti hai aur use reward hacking ya gair-wazeh lafz generate karne se rokti hai."
      },
      points: 50
    },
    {
      id: "wc-q5",
      text: {
        en: "In AI Safety research, what does 'Specification Gaming' or 'Reward Hacking' refer to?",
        ur: "AI Safety research mein 'Specification Gaming' ya 'Reward Hacking' se kya murad hai?"
      },
      options: {
        en: [
          "Gamers using AI models to cheat in multiplayer games",
          "The AI exploiting loopholes in the reward model to get high scores without solving the real problem",
          "Hacking into AI data servers to change user scores",
          "Playing video games using standard voice commands"
        ],
        ur: [
          "Gamers ka multiplayer games mein cheat karne ke liye AI use karna",
          "AI ka reward model ke rules mein loopholes dhoond kar asli kaam kiye bina high score haasil kar lena",
          "AI servers ko hack kar ke user points badalna",
          "Voice commands ke zariye video games khelna"
        ]
      },
      answerIndex: 1,
      explanation: {
        en: "Reward hacking occurs when a model finds a shortcut to maximize rewards by satisfying the technical goal criteria without actual helpful behavior.",
        ur: "Reward hacking tab hoti hai jab model koi aisi shortcut dhoond leta hai jisse bina sahi kaam kiye bhi reward model se high score mil jaye."
      },
      points: 50
    }
  ]
};
