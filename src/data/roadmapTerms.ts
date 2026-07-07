export interface Term {
  title: string;
  definition: string;
}

export interface Section {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  termsCount: number;
  buildsOn?: string;
  terms: Term[];
  testYourself?: {
    question: string;
    answer: string;
  };
}

export const roadmapSections: Section[] = [
  {
    id: "section-1",
    number: "01",
    title: "Core Concepts",
    subtitle: "These four nest inside each other like Russian dolls. Get these right and everything else clicks faster.",
    termsCount: 4,
    buildsOn: "Start here",
    terms: [
      {
        title: "Artificial Intelligence (AI)",
        definition: "Systems that do things that normally need a human brain: reasoning, learning, deciding."
      },
      {
        title: "Machine Learning (ML)",
        definition: "A type of AI that learns patterns from data instead of following step-by-step rules."
      },
      {
        title: "Deep Learning (DL)",
        definition: "ML that uses many layers of neural networks to learn complex things from huge datasets."
      },
      {
        title: "Neural Network",
        definition: "Connected nodes (like brain cells) organised in layers that process information."
      }
    ],
    testYourself: {
      question: "Is every ML system also AI, or is every AI system also ML?",
      answer: "Every ML system is AI, but not every AI system is ML. Classic AI can include simple rule-based expert systems that don't learn from data, whereas ML explicitly extracts patterns from historical records."
    }
  },
  {
    id: "section-2",
    number: "02",
    title: "How Models Learn",
    subtitle: "The method depends on what kind of data you have.",
    termsCount: 9,
    buildsOn: "Core Concepts",
    terms: [
      {
        title: "Supervised Learning",
        definition: "You give it labelled examples (\"this is a cat, this is a dog\") and it learns the pattern."
      },
      {
        title: "Unsupervised Learning",
        definition: "No labels. The model finds hidden patterns on its own."
      },
      {
        title: "Reinforcement Learning (RL)",
        definition: "Trial and error. Rewards for good moves, penalties for bad ones."
      },
      {
        title: "Self-Supervised Learning",
        definition: "The model makes its own labels from the data (like hiding a word and predicting it)."
      },
      {
        title: "Transfer Learning",
        definition: "Take what a model learned on one task and apply it to a different one."
      },
      {
        title: "Fine-Tuning",
        definition: "Take a pre-trained model and train it a bit more on your specific task."
      },
      {
        title: "Zero-Shot Learning",
        definition: "The model does a task it was never trained on. No examples needed."
      },
      {
        title: "Few-Shot Learning",
        definition: "You give it 1 to 10 examples and it figures out the pattern."
      },
      {
        title: "RLHF",
        definition: "Reinforcement Learning from Human Feedback. Humans rate outputs, model learns what people prefer."
      }
    ],
    testYourself: {
      question: "ChatGPT summarises a legal contract it was never trained on. Zero-shot or few-shot?",
      answer: "Zero-shot. If you did not provide any examples of summary formats or text in the prompt itself, the model is executing the task solely based on its broad pre-training."
    }
  },
  {
    id: "section-3",
    number: "03",
    title: "Architecture & Training",
    subtitle: "What models are made of and how training actually works under the hood.",
    termsCount: 13,
    buildsOn: "How Models Learn",
    terms: [
      {
        title: "Transformer",
        definition: "The architecture behind ChatGPT, Claude, Gemini. Uses attention to understand context."
      },
      {
        title: "Large Language Model (LLM)",
        definition: "A neural network trained on massive text to understand and generate language."
      },
      {
        title: "Foundation Model",
        definition: "A big base model trained on broad data, adaptable to specific jobs."
      },
      {
        title: "Parameters",
        definition: "The adjustable weights inside a model. More = more capable (and expensive)."
      },
      {
        title: "Hyperparameters",
        definition: "Settings you choose before training: learning rate, batch size, number of layers."
      },
      {
        title: "Training Data",
        definition: "The dataset used to teach the model. Quality in, quality out."
      },
      {
        title: "Epoch",
        definition: "One full pass through the entire training dataset."
      },
      {
        title: "Batch Size",
        definition: "How many examples the model sees before updating its weights."
      },
      {
        title: "Loss Function",
        definition: "The scorecard. Measures how wrong the model's guess was."
      },
      {
        title: "Gradient Descent",
        definition: "Adjust weights in the direction that reduces the loss. How models get better."
      },
      {
        title: "Backpropagation",
        definition: "Errors flow backward through the network so every layer learns from its mistakes."
      },
      {
        title: "Attention",
        definition: "Lets the model focus on the most relevant parts of the input. The key idea behind transformers."
      },
      {
        title: "Tokenisation",
        definition: "Chopping text into small pieces the model can process. \"Don't\" becomes [\"Don\", \"'t\"]."
      }
    ],
    testYourself: {
      question: "Parameters vs hyperparameters: which ones does the model learn on its own?",
      answer: "The model learns parameters (weights) on its own during the training loop. Hyperparameters (like learning rate or batch size) are configuration choices set manually by human engineers before training begins."
    }
  },
  {
    id: "section-4",
    number: "04",
    title: "Generative AI",
    subtitle: "The category most people interact with today. AI that creates, not just classifies.",
    termsCount: 8,
    buildsOn: "Architecture",
    terms: [
      {
        title: "Generative AI",
        definition: "AI that creates new content: text, images, audio, video, code."
      },
      {
        title: "Prompt",
        definition: "The instruction you type to tell the model what to do."
      },
      {
        title: "Token",
        definition: "A small chunk of text. One word is roughly 1-2 tokens."
      },
      {
        title: "Context Window",
        definition: "How many tokens the model sees at once. Bigger = more conversation fits."
      },
      {
        title: "Temperature",
        definition: "The creativity dial. High = random, creative. Low = predictable, safe."
      },
      {
        title: "Inference",
        definition: "When the model runs and gives you an answer. Training teaches, inference performs."
      },
      {
        title: "Diffusion Model",
        definition: "Turns noise into images. How DALL-E and Midjourney work."
      },
      {
        title: "Autoregressive Model",
        definition: "Generates one token at a time, each based on all before it. How ChatGPT writes."
      }
    ],
    testYourself: {
      question: "You want Claude to write a creative story. Temperature high or low?",
      answer: "High. Higher temperatures increase randomness and creativity, allowing the model to make non-obvious, imaginative word connections. Low temperature is preferred for code or factual lookups."
    }
  },
  {
    id: "section-5",
    number: "05",
    title: "AI Agents & Systems",
    subtitle: "When AI stops answering and starts doing.",
    termsCount: 6,
    buildsOn: "Generative AI",
    terms: [
      {
        title: "AI Agent",
        definition: "A system that sees, thinks, and acts on its own toward a goal."
      },
      {
        title: "Agentic AI",
        definition: "AI that plans multi-step tasks, picks tools, executes independently."
      },
      {
        title: "Tool Use",
        definition: "AI calling external tools (search, calculator, APIs) to get the job done."
      },
      {
        title: "Chain-of-Thought (CoT)",
        definition: "Prompting the model to think step by step instead of jumping to the answer."
      },
      {
        title: "RAG",
        definition: "Retrieval-Augmented Generation. Searches real documents before answering to stay grounded."
      },
      {
        title: "MCP",
        definition: "Model Context Protocol. Open standard letting AI plug into external tools and data."
      }
    ],
    testYourself: {
      question: "What separates an AI agent from a chatbot?",
      answer: "A chatbot only reads input and generates text responses. An AI agent is equipped with memory and tools (e.g. searching the web, calling APIs, writing files) and executes multi-step plans autonomously to solve complex tasks."
    }
  },
  {
    id: "section-6",
    number: "06",
    title: "NLP & Language",
    subtitle: "Teaching machines to understand human language.",
    termsCount: 5,
    buildsOn: "NLP",
    terms: [
      {
        title: "NLP",
        definition: "Natural Language Processing. Teaching machines to understand human language."
      },
      {
        title: "Embedding",
        definition: "Turning text into numbers so the model can do maths on meaning."
      },
      {
        title: "Semantic Search",
        definition: "Search by meaning, not exact words. \"Affordable car\" finds \"budget vehicles\"."
      },
      {
        title: "Tokenization",
        definition: "Splitting text into tokens the model can process."
      },
      {
        title: "Attention Mechanism",
        definition: "How the model decides which parts of the input matter most."
      }
    ]
  },
  {
    id: "section-7",
    number: "07",
    title: "Vision & Multimodal",
    subtitle: "Text, images, and audio all at once.",
    termsCount: 5,
    buildsOn: "NLP",
    terms: [
      {
        title: "Computer Vision",
        definition: "Teaching AI to see and understand images."
      },
      {
        title: "Multimodal AI",
        definition: "Text, images, and audio all at once. Claude reading a screenshot is multimodal."
      },
      {
        title: "OCR",
        definition: "Optical Character Recognition. Photo of text becomes editable text."
      },
      {
        title: "Image Segmentation",
        definition: "Splitting an image into separate objects or regions."
      },
      {
        title: "Object Detection",
        definition: "Finding and labelling things inside an image."
      }
    ]
  },
  {
    id: "section-8",
    number: "08",
    title: "What Can Go Wrong",
    subtitle: "The failure modes. Knowing these makes you a sharper user.",
    termsCount: 8,
    buildsOn: "Generative AI",
    terms: [
      {
        title: "Hallucination",
        definition: "Makes something up and presents it as fact. Sounds confident, completely wrong."
      },
      {
        title: "Overfitting",
        definition: "Memorised training data so well it cannot handle anything new."
      },
      {
        title: "Underfitting",
        definition: "Too simple to learn the patterns."
      },
      {
        title: "Bias",
        definition: "Systematic unfairness from training data or design choices."
      },
      {
        title: "Alignment",
        definition: "Making sure AI does what humans actually want."
      },
      {
        title: "Jailbreaking",
        definition: "Tricking a model into ignoring its safety rules."
      },
      {
        title: "Prompt Injection",
        definition: "Sneaking instructions into input data to hijack the model."
      },
      {
        title: "Ground Truth",
        definition: "The verified correct answer you compare the model against."
      }
    ],
    testYourself: {
      question: "Claude cites a paper that does not exist. Hallucination, bias, or prompt injection?",
      answer: "Hallucination. Since the model operates on statistical likelihoods of the next word rather than checking a database of verified citations, it can easily synthesize real-sounding but fictitious titles."
    }
  },
  {
    id: "section-9",
    number: "09",
    title: "Evaluation & Metrics",
    subtitle: "How you score a model. Is it actually good or just looks good?",
    termsCount: 7,
    buildsOn: "What Can Go Wrong",
    terms: [
      {
        title: "Benchmark",
        definition: "A standardised test to compare models. Like an exam everyone sits."
      },
      {
        title: "Accuracy",
        definition: "How many answers the model got right out of all answers."
      },
      {
        title: "Precision",
        definition: "When the model says \"yes\", how often is it actually right?"
      },
      {
        title: "Recall",
        definition: "Of all actual positives, how many did the model catch?"
      },
      {
        title: "F1 Score",
        definition: "Precision and recall balanced into one number."
      },
      {
        title: "Perplexity",
        definition: "How surprised the model is by the next word. Lower = understands language better."
      },
      {
        title: "BLEU Score",
        definition: "Scores generated text against a human-written reference."
      }
    ]
  },
  {
    id: "section-10",
    number: "10",
    title: "Safety & Ethics",
    subtitle: "Guarding against bias, privacy invasion, and security threats.",
    termsCount: 7,
    buildsOn: "What Can Go Wrong",
    terms: [
      {
        title: "Explainable AI (XAI)",
        definition: "Understanding why the model made a decision."
      },
      {
        title: "Red Teaming",
        definition: "Deliberately breaking the model to find weaknesses before users do."
      },
      {
        title: "Constitutional AI",
        definition: "Training with a set of principles the model must follow."
      },
      {
        title: "Guardrails",
        definition: "Hard limits on what the model can and cannot output."
      },
      {
        title: "Data Privacy",
        definition: "Protecting personal information in training and inference."
      },
      {
        title: "Model Card",
        definition: "A fact sheet: what it can do, what it cannot, how it was trained."
      },
      {
        title: "Watermarking",
        definition: "Hidden markers so you can tell if something was AI-generated."
      }
    ]
  },
  {
    id: "section-11",
    number: "11",
    title: "Infrastructure & Deployment",
    subtitle: "The plumbing. How models run, get faster, and what hardware powers them.",
    termsCount: 9,
    buildsOn: "Architecture",
    terms: [
      {
        title: "API",
        definition: "A way for your code to talk to an AI model. Question in, answer back."
      },
      {
        title: "Latency",
        definition: "Time between pressing enter and getting a response."
      },
      {
        title: "Throughput",
        definition: "How many requests the system handles at once."
      },
      {
        title: "GPU",
        definition: "The chip behind AI training. Originally for graphics, now the engine behind every major model."
      },
      {
        title: "TPU",
        definition: "Google's custom chip for AI workloads."
      },
      {
        title: "Quantization",
        definition: "Shrink the model by reducing number precision. Faster, cheaper, slightly less accurate."
      },
      {
        title: "Distillation",
        definition: "A big model teaches a small model. Student keeps most ability at a fraction of the cost."
      },
      {
        title: "Edge AI",
        definition: "Running AI on your device instead of in the cloud."
      },
      {
        title: "Synthetic Data",
        definition: "Fake data generated by AI to train other AI."
      }
    ]
  },
  {
    id: "section-12",
    number: "12",
    title: "Advanced Concepts",
    subtitle: "The frontier. Research papers, product launches, and debates about where AI is heading.",
    termsCount: 7,
    buildsOn: "Everything above",
    terms: [
      {
        title: "Latent Space",
        definition: "A compressed map where the model stores meaning. Similar things sit close together."
      },
      {
        title: "Emergent Abilities",
        definition: "Skills that appear when a model gets big enough. Nobody programmed them in."
      },
      {
        title: "Scaling Laws",
        definition: "More data + more compute + bigger model = better results. Predictably."
      },
      {
        title: "In-Context Learning",
        definition: "Model learns from examples in the prompt. No retraining needed."
      },
      {
        title: "Mixture of Experts (MoE)",
        definition: "One big model, many specialists inside. Only relevant experts activate per query."
      },
      {
        title: "AGI",
        definition: "Artificial General Intelligence. Hypothetical AI as smart as a human across every domain. Does not exist yet."
      },
      {
        title: "ASI",
        definition: "Artificial Superintelligence. AI smarter than all humans combined. Theoretical."
      }
    ],
    testYourself: {
      question: "GPT-4 does maths, writes poetry, debugs code. Nobody trained it for each one. What is that?",
      answer: "Emergent Abilities. These are complex, novel abilities that naturally manifest in massive models as a side effect of scale, without any explicit programmed training for those specific tasks."
    }
  }
];
