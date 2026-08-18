# Curriculum & Learning Roadmap — Simple AI

This document outlines the detailed pedagogical curriculum, the 12 roadmap sections, and the 85+ core artificial intelligence concepts explained on the Simple AI platform.

---

## 1. The Pedagogy: Layered Learning Structure

Simple AI is designed as a **cumulative vertical path**, not a flat glossary. Concepts build on top of each other, ensuring the user is never introduced to a term without having the prerequisite context explained first.

```
+-----------------------------------------------------------+
|  Layer 1: The Basics (What is AI, Daily Applications)     |
+-----------------------------------------------------------+
                             |
                             v
+-----------------------------------------------------------+
|  Layer 2: Core Concepts (Family Tree, ML, Deep, GenAI)   |
+-----------------------------------------------------------+
                             |
                             v
+-----------------------------------------------------------+
|  Layer 3: Practical Tools (Prompting, RAG, 40+ Tool Index) |
+-----------------------------------------------------------+
                             |
                             v
+-----------------------------------------------------------+
|  Layer 4: Deep Dive Glossary (12 Progressive Sections)   |
+-----------------------------------------------------------+
```

---

## 2. The 12 Progressive Sections (85+ Terms)

The glossary portion is structured into 12 carefully organized sections. Below is the curricular structure:

### Section 01: The Absolute Basics
- **Prerequisite**: None.
- **Goal**: Establish what AI is.
- **Key Concepts**: Artificial Intelligence, Algorithm, Data, Pattern Matching, Automation.

### Section 02: Traditional vs. AI Programming
- **Prerequisite**: Section 01.
- **Goal**: Distinguish between hard-coded instructions and modern learned pathways.
- **Key Concepts**: Hard-coded Rules, Traditional Programming, Machine Learning, Training Examples, Dynamic Logic.

### Section 03: The AI Family Tree
- **Prerequisite**: Section 02.
- **Goal**: Understand the containment relationship of concepts.
- **Key Concepts**: Nested Systems, Umbrella Term, Sub-fields, Machine Learning, Deep Learning, Generative AI.

### Section 04: Machine Learning (How Computers Learn)
- **Prerequisite**: Section 03.
- **Goal**: Dive into parameters, weights, and mathematical training loops.
- **Key Concepts**: Model, Training Data, Parameters, Features, Loss Function, Epoch.

### Section 05: Deep Learning & Neural Networks
- **Prerequisite**: Section 04.
- **Goal**: Map connections between artificial synapses and brains.
- **Key Concepts**: Neural Network, Node (Neuron), Layers (Input, Hidden, Output), Activation Function, Synapse, Weights.

### Section 06: Generative AI (The Creators)
- **Prerequisite**: Section 05.
- **Goal**: Focus on creation vs. analysis.
- **Key Concepts**: Generative Models, Synthesis, Large Language Models (LLMs), Tokens, Probability Distribution.

### Section 07: Large Language Models (LLMs)
- **Prerequisite**: Section 06.
- **Goal**: Explain how models predict words.
- **Key Concepts**: Transformer, Attention Mechanism, Context Window, Hallucination, Training Corpus.

### Section 08: Chatbots vs. Models
- **Prerequisite**: Section 07.
- **Goal**: Separate user interface from computational models.
- **Key Concepts**: UI Wrapper, API, Model Engine, System Prompt, Temperature.

### Section 09: Prompt Engineering
- **Prerequisite**: Section 08.
- **Goal**: Learn how to write effective queries.
- **Key Concepts**: Prompt, Zero-shot, Few-shot, Chain of Thought, Guardrails.

### Section 10: RAG (Retrieval-Augmented Generation)
- **Prerequisite**: Section 09.
- **Goal**: Understand database-backed, accurate generation.
- **Key Concepts**: RAG, Knowledge Base, Vector Database, Embeddings, Prompt Injection.

### Section 11: Real-World Use Cases
- **Prerequisite**: Section 10.
- **Goal**: Look at commercial, industrial, and daily deployments.
- **Key Concepts**: Recommendation Engine, Voice Assistant, Computer Vision, Speech-to-Text, Predictive Typing.

### Section 12: Advanced Frontiers & Ethics
- **Prerequisite**: Section 11.
- **Goal**: Look forward to autonomy and guard ethical issues.
- **Key Concepts**: Autonomous Agents, Fine-tuning, Bias, AI Safety, Explainability.

---

## 3. Sandboxes & Simulators

To enforce active learning, the curriculum features interactive, mathematical simulators:

### 3.1. Word Token Predictor Sandbox
Demonstrates how an LLM evaluates words:
1. User clicks a starter phrase (e.g., *"The best thing about AI is..."*).
2. The UI lists candidate next-words with calculated probability percentages:
   - `learning` (45%)
   - `speed` (25%)
   - `fun` (15%)
   - `creativity` (15%)
3. User steps forward, selecting words to build a custom sentence while witnessing live math calculation curves.

### 3.2. RAG Simulator Sandbox
Simulates how document indexing prevents lying (hallucination):
1. User asks a specific question: *"What is Clay's favorite color?"*
2. **Without RAG**: The model guesses (e.g., *"I think it is green"*).
3. **With RAG**:
   - Step 1: Dispatches document search to simulated database.
   - Step 2: Retrieves factual file: *"Clay's favorite color is Amber, representing tactile warmth."*
   - Step 3: Automatically binds the context: `[Context: Clay's favorite color is Amber] + Question`.
   - Step 4: The model drafts a perfect, safe, 100% correct response.
