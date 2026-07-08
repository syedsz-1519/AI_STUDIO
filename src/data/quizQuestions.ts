export interface Question {
  id: string;
  text: { en: string; ur: string };
  options: { en: string[]; ur: string[] };
  answerIndex: number;
  explanation: { en: string; ur: string };
  points: number;
}

export interface QuizSection {
  id: string;
  title: { en: string; ur: string };
  subtitle: { en: string; ur: string };
  questions: Question[];
}

export interface QuizModule {
  id: string;
  number: number;
  title: { en: string; ur: string };
  difficulty: 'Simple' | 'Medium-Easy' | 'Medium' | 'Medium-Hard' | 'Hard';
  sections: QuizSection[];
}

export const quizModules: QuizModule[] = [
  {
    id: "module-1",
    number: 1,
    title: { en: "AI Foundations", ur: "AI ke Bunyaadi Usool" },
    difficulty: "Simple",
    sections: [
      {
        id: "m1-s1",
        title: { en: "AI Basics & History", ur: "AI ka Shuruaat aur Tareekh" },
        subtitle: { en: "The early days of computing and the vision of thinking machines.", ur: "Computing ke shuruati din aur sochne wali machines ka khwaab." },
        questions: [
          {
            id: "m1-s1-q1",
            text: { en: "Who is widely considered the father of theoretical computer science and AI?", ur: "Kise theoretical computer science aur AI ka baap (father) mana jata hai?" },
            options: {
              en: ["Alan Turing", "Ada Lovelace", "Bill Gates", "Steve Jobs"],
              ur: ["Alan Turing", "Ada Lovelace", "Bill Gates", "Steve Jobs"]
            },
            answerIndex: 0,
            explanation: {
              en: "Alan Turing proposed the 'Turing Test' in 1950 to evaluate a machine's ability to exhibit intelligent behavior.",
              ur: "Alan Turing ne 1950 mein mashhoor 'Turing Test' paish kiya tha taake computer ki aqal ka andaza lagaya ja sake."
            },
            points: 10
          },
          {
            id: "m1-s1-q2",
            text: { en: "In which year was the term 'Artificial Intelligence' officially coined at the Dartmouth Conference?", ur: "Kis saal Dartmouth Conference mein 'Artificial Intelligence' ka naam pehli baar rakha gaya?" },
            options: {
              en: ["1945", "1956", "1969", "1984"],
              ur: ["1945", "1956", "1969", "1984"]
            },
            answerIndex: 1,
            explanation: {
              en: "The Dartmouth workshop of 1956 is widely accepted as the founding event of AI as an academic discipline.",
              ur: "1956 ki Dartmouth workshop ko AI ki shuruaat ka sabse pehla aur bada milestone mana jata hai."
            },
            points: 10
          },
          {
            id: "m1-s1-q3",
            text: { en: "What does the 'Turing Test' measure?", ur: "Turing Test kis cheez ki jaanch (measure) karta hai?" },
            options: {
              en: [
                "A machine's mathematical calculation speed",
                "A machine's capability to behave indistinguishably from a human",
                "The storage capacity of neural processors",
                "The speed of internet connectivity"
              ],
              ur: [
                "Machine ki mathematical calculation karne ki speed",
                "Machine ki aisi salahiyat jo insaan se bilkul milti julti ho",
                "Neural processors ki storage capacity",
                "Internet connection ki speed"
              ]
            },
            answerIndex: 1,
            explanation: {
              en: "If a human evaluator cannot reliably tell the machine apart from a human, the machine passes the test.",
              ur: "Agar ek insaan sawal-jawab ke dauran ye na pehchan sake ke samne computer hai ya insaan, to computer test pass kar leta hai."
            },
            points: 10
          },
          {
            id: "m1-s1-q4",
            text: { en: "What are the periods of reduced funding and interest in AI history called?", ur: "AI ki tareekh mein jab funding aur research bilkul ruk gayi thi, use kya kehte hain?" },
            options: {
              en: ["AI Winters", "AI Ice Age", "Silicon Valley Depression", "Binary Sleep"],
              ur: ["AI Winters", "AI Ice Age", "Silicon Valley Depression", "Binary Sleep"]
            },
            answerIndex: 0,
            explanation: {
              en: "Several 'AI Winters' occurred, notably in the 1970s and late 1980s, due to over-inflated expectations and lack of computational power.",
              ur: "Inhe 'AI Winters' kaha jata hai, jab technology ke adhure waadon ki wajah se research funds band ho gaye thay."
            },
            points: 10
          },
          {
            id: "m1-s1-q5",
            text: { en: "Which of the following is an example of 'Narrow AI' (Weak AI)?", ur: "In mein se kaunsi 'Narrow AI' (Weak AI) ki ek behtareen misal hai?" },
            options: {
              en: ["A robot that feels human emotions", "A chess-playing computer program", "A sci-fi supercomputer with general consciousness", "A software that can learn any human profession in one minute"],
              ur: ["Ek robot jo insaani jazbaat mehsoos kare", "Chess khelne wala computer program", "Saanis-fiksi supercomputer jiski apni jaan ho", "Aisa software jo ek minute mein koi bhi insaani peisha seekh le"]
            },
            answerIndex: 1,
            explanation: {
              en: "Narrow AI is designed and trained for a specific task, like playing chess, translating text, or identifying objects.",
              ur: "Narrow AI kisi ek makhsoos kaam (jaise chess khelna) ke liye banayi jati hai. Ye aam insaan ki tarah sab kaam nahi kar sakti."
            },
            points: 10
          }
        ]
      },
      {
        id: "m1-s2",
        title: { en: "Machine Learning Introductory", ur: "Machine Learning ka Taaruf" },
        subtitle: { en: "How algorithms learn from raw data without explicit programming instructions.", ur: "Bina explicit coding ke algorithms kaise data se khud seekhte hain." },
        questions: [
          {
            id: "m1-s2-q1",
            text: { en: "What is the core difference between traditional programming and Machine Learning?", ur: "Traditional programming aur Machine Learning mein sabse bada farq kya hai?" },
            options: {
              en: [
                "Traditional programming requires data and rules to output answers; ML takes data and answers to discover rules.",
                "Traditional programming is only done in binary; ML is written in human languages.",
                "ML does not run on ordinary silicon computer chips.",
                "There is no difference; they are exact synonyms."
              ],
              ur: [
                "Traditional programming ko rules chahiye hote hain; ML data aur answers dekh kar khud rules dhoondta hai.",
                "Traditional programming sirf binary me hoti hai; ML aam insaani zubaan me likha jata hai.",
                "ML aam computer processor par nahi chal sakta.",
                "Dono mein koi farq nahi hai; dono bilkul aik hain."
              ]
            },
            answerIndex: 0,
            explanation: {
              en: "In ML, we feed input data and the corresponding targets to the machine, and the model learns the mapping rules automatically.",
              ur: "Traditional programming me hum code me rules likhte hain. ML me model khud patterns aur rules ko data ke andar se dhoond nikalta hai."
            },
            points: 10
          },
          {
            id: "m1-s2-q2",
            text: { en: "What is 'Feature' in the context of Machine Learning data?", ur: "Machine Learning data ke silsile mein 'Feature' ka kya matlab hai?" },
            options: {
              en: ["A bug in the software", "An individual measurable property or characteristic of a data sample", "The final prediction score", "The coding framework used"],
              ur: ["Software me aane wala ek bug (galti)", "Data sample ki koi makhsoos nishani, khusosiyat ya variable", "Aakhri prediction score", "Jo programming framework istemal kiya gaya ho"]
            },
            answerIndex: 1,
            explanation: {
              en: "Features are the inputs or columns in your dataset (e.g., house size, number of rooms) used by the model to make predictions.",
              ur: "Features data ke variables hote hain jinhe dekh kar ML model seekhta hai, jaise ghar ki keemat nikalne ke liye ghar ka size aur kamre."
            },
            points: 10
          },
          {
            id: "m1-s2-q3",
            text: { en: "Which of these is the main goal of training a Machine Learning model?", ur: "Machine Learning model ko train karne ka sabse bada maqsad kya hota hai?" },
            options: {
              en: ["To memorize the training dataset perfectly", "To generalize well to new, unseen data", "To increase the size of the computer hard disk", "To write code faster than a human"],
              ur: ["Training data ko poori tarah se ratta lagana", "Naye aur unseen data par behtareen predictions dena", "Computer hard disk ki space barhana", "Insaan se tez code likhna"]
            },
            answerIndex: 1,
            explanation: {
              en: "Generalization is the model's ability to perform accurately on fresh data it has never seen during training.",
              ur: "Model ka ratta lagana (memorize karna) bura hota hai jise overfitting kehte hain. Asli maqsad naye data par sahi chalna (Generalization) hai."
            },
            points: 10
          },
          {
            id: "m1-s2-q4",
            text: { en: "When a model performs extremely well on training data but fails on validation/new data, this is called:", ur: "Agar ek model training data par boht accha chale lekin naye data par fail ho jaye, to use kya kehte hain?" },
            options: {
              en: ["Underfitting", "Overfitting", "Perfect Alignment", "Gradient Descent"],
              ur: ["Underfitting", "Overfitting", "Perfect Alignment", "Gradient Descent"]
            },
            answerIndex: 1,
            explanation: {
              en: "Overfitting happens when the model learns noise and details in the training data so much that it hurts performance on new datasets.",
              ur: "Overfitting tab hoti hai jab model training data ka ratta maar leta hai aur naye data par sahi prediction nahi de pata."
            },
            points: 10
          },
          {
            id: "m1-s2-q5",
            text: { en: "What is the name of the mathematical function used to measure how far off a model's prediction is from the real target?", ur: "Model ki prediction aur asli target ke darmiyan galti (error) ko naapne wale math function ko kya kehte hain?" },
            options: {
              en: ["Success Function", "Loss Function (or Cost Function)", "Logarithmic Horizon", "Turing Wave"],
              ur: ["Success Function", "Loss Function (ya Cost Function)", "Logarithmic Horizon", "Turing Wave"]
            },
            answerIndex: 1,
            explanation: {
              en: "The Loss Function outputs a high score if predictions are bad, guiding the optimization algorithm to adjust model parameters.",
              ur: "Loss Function hume batata hai ke model ki prediction kitni kharab hai. Hmara maqsad is loss ko kam se kam karna hota hai."
            },
            points: 10
          }
        ]
      },
      {
        id: "m1-s3",
        title: { en: "Supervised vs. Unsupervised", ur: "Supervised vs. Unsupervised Learning" },
        subtitle: { en: "Understanding labeled vs. unlabeled training data structures.", ur: "Labeled aur unlabeled training data ke farq ko samajhna." },
        questions: [
          {
            id: "m1-s3-q1",
            text: { en: "Supervised learning relies on which type of data?", ur: "Supervised learning kis qisam ke data par bharosa karti hai?" },
            options: {
              en: ["Unlabeled raw text", "Labeled data with clear input-output pairs", "Encrypted data structures", "Random noise data"],
              ur: ["Bina label ke aam text", "Labeled data jisme inputs aur unke sahi answers pehle se hon", "Encrypted data structures", "Random noise data"]
            },
            answerIndex: 1,
            explanation: {
              en: "Supervised learning uses a supervisor (the labels) to teach the model what the correct output should look like.",
              ur: "Supervised learning me har input ke sath uska sahi label (answer) hota hai, jaise billi ki tasveer ke sath 'billi' ka tag."
            },
            points: 10
          },
          {
            id: "m1-s3-q2",
            text: { en: "Predicting a house price based on its size and rooms is an example of:", ur: "Ghar ka size dekh kar uski keemat (house price) predict karna kiski misal hai?" },
            options: {
              en: ["Classification", "Regression", "Clustering", "Dimension Reduction"],
              ur: ["Classification", "Regression", "Clustering", "Dimension Reduction"]
            },
            answerIndex: 1,
            explanation: {
              en: "Regression is a supervised learning task where the target output is a continuous numerical value (e.g., price, weight, temperature).",
              ur: "Regression aisi supervised task hai jahan output koi number (price, height, temperature) hota hai, na ke koi category."
            },
            points: 10
          },
          {
            id: "m1-s3-q3",
            text: { en: "Categorizing incoming emails into 'Spam' or 'Inbox' is an example of:", ur: "Aane wali emails ko 'Spam' ya 'Inbox' categories me daalna kiski misal hai?" },
            options: {
              en: ["Clustering", "Regression", "Classification", "Unsupervised Filtering"],
              ur: ["Clustering", "Regression", "Classification", "Unsupervised Filtering"]
            },
            answerIndex: 2,
            explanation: {
              en: "Classification involves predicting a discrete label or class category (e.g., Spam vs. Not Spam, Cat vs. Dog).",
              ur: "Classification ka matlab hai data ko alag alag categories ya groups me banna (jaise Spam ya Inbox, Billi ya Kutta)."
            },
            points: 10
          },
          {
            id: "m1-s3-q4",
            text: { en: "What is the main task in Unsupervised Learning?", ur: "Unsupervised Learning ka sabse bada kaam kya hota hai?" },
            options: {
              en: [
                "Predicting house prices",
                "Grouping unlabeled data based on hidden patterns (Clustering)",
                "Translating English to French",
                "Finding syntax bugs in python code"
              ],
              ur: [
                "Gharon ki keemat batana",
                "Bina labels wale data me se patterns dhoond kar unhe groups me banna (Clustering)",
                "English se French translation karna",
                "Python code me syntax ki galtiyan dhoondna"
              ]
            },
            answerIndex: 1,
            explanation: {
              en: "Since unsupervised data has no pre-defined labels, algorithms like K-Means group similar samples together based on feature similarity.",
              ur: "Unsupervised learning me hamare paas answers nahi hote. Algorithm khud similarities dekh kar data ke clusters/groups banata hai."
            },
            points: 10
          },
          {
            id: "m1-s3-q5",
            text: { en: "Which learning type uses 'Rewards' and 'Punishments' to train agents by trial and error?", ur: "Trial and error ke zariye agents ko 'Inaam' (Rewards) aur 'Saza' (Punishments) dekar sikhane wali learning ko kya kehte hain?" },
            options: {
              en: ["Supervised Learning", "Semi-Supervised Learning", "Reinforcement Learning", "Manual Feature Extraction"],
              ur: ["Supervised Learning", "Semi-Supervised Learning", "Reinforcement Learning", "Manual Feature Extraction"]
            },
            answerIndex: 2,
            explanation: {
              en: "Reinforcement Learning trains an agent to make a sequence of decisions in an environment to maximize cumulative reward (like video games or self-driving cars).",
              ur: "Reinforcement Learning me software agent kisi mahaul (environment) me kaam karta hai aur sahi qadam par reward pa kar seekhta hai."
            },
            points: 10
          }
        ]
      }
    ]
  },
  {
    id: "module-2",
    number: 2,
    title: { en: "Neural Networks & Deep Learning", ur: "Neural Networks aur Deep Learning" },
    difficulty: "Medium-Easy",
    sections: [
      {
        id: "m2-s1",
        title: { en: "Artificial Neurons", ur: "Insaani Dimag Jaisa Neuron" },
        subtitle: { en: "The building blocks of deep artificial networks and perceptrons.", ur: "Artificial networks ke bunyaadi hisse aur perceptrons." },
        questions: [
          {
            id: "m2-s1-q1",
            text: { en: "What biological structure is an Artificial Neural Network (ANN) inspired by?", ur: "Artificial Neural Network kis biological structure se inspire hokar banaya gaya hai?" },
            options: {
              en: ["The human brain's network of neurons", "The circulatory system of mammals", "The double helix of DNA", "Plant cell structures"],
              ur: ["Insaani dimag ke cells aur neurons", "Mammals ka blood system", "DNA ka double helix structure", "Paudhon ke cell ka structure"]
            },
            answerIndex: 0,
            explanation: {
              en: "ANNs are inspired by the biological neural networks of animal brains, although they differ significantly in actual mechanics.",
              ur: "Neural networks ko insaani dimag ke neurons ke aapsi connection ki tarah copy karne ki koshish ki gayi hai."
            },
            points: 15
          },
          {
            id: "m2-s1-q2",
            text: { en: "What was the earliest model of an artificial neuron introduced in 1957 called?", ur: "1957 mein banaya gaya artificial neuron ka sabse pehla aur buniyaadi model kya kahlata hai?" },
            options: {
              en: ["Transformer", "Perceptron", "LSTM", "ResNet"],
              ur: ["Transformer", "Perceptron", "LSTM", "ResNet"]
            },
            answerIndex: 1,
            explanation: {
              en: "The Perceptron, invented by Frank Rosenblatt, is a simple single-layer binary classifier that takes weighted inputs and applies a threshold.",
              ur: "Perceptron sabse pehla basic neuron model tha jo inputs ko weights se multiply kar ke result deta tha."
            },
            points: 15
          },
          {
            id: "m2-s1-q3",
            text: { en: "What do the 'Weights' in a neural network layer represent?", ur: "Neural network layer mein 'Weights' kis cheez ko zahir karte hain?" },
            options: {
              en: [
                "The physical weight of the GPU processor",
                "The strength or importance of the connection between neurons",
                "The number of lines of code in the algorithm",
                "The speed of electrical signals"
              ],
              ur: [
                "Graphics Card (GPU) ka asli wazan",
                "Do neurons ke darmiyan connection ki mazbooti ya ehmiyat",
                "Algorithm me code ki kul lines",
                "Electrical signals ki radd-e-amal ki tezi"
              ]
            },
            answerIndex: 1,
            explanation: {
              en: "Weights are adjustable parameters that scale the input signals. Higher weights mean that input has a stronger influence on the output.",
              ur: "Weights aam parameters hote hain jo ye batate hain ke kis input ki baat ko kitni ziada ehmiyat deni hai."
            },
            points: 15
          },
          {
            id: "m2-s1-q4",
            text: { en: "Why does a neuron need a 'Bias' term?", ur: "Ek neuron ko weight ke sath 'Bias' ki zaroorat kyun hoti hai?" },
            options: {
              en: [
                "To speed up the internet download speed of weights",
                "To shift the activation function trigger point independently of inputs",
                "To make the network behave randomly",
                "To translate code to other programming platforms"
              ],
              ur: [
                "Weights ko jaldi download karne ke liye",
                "Activation function ke trigger point ko inputs se hat kar aage-peeche adjust karne ke liye",
                "Network ke kaam ko bilkul random banane ke liye",
                "Code ko doosre systems me translate karne ke liye"
              ]
            },
            answerIndex: 1,
            explanation: {
              en: "Bias allows the model to shift the activation function output left or right, representing a baseline trigger threshold.",
              ur: "Bias neuron ko baseline capability deta hai taake agar saare inputs zero bhi hon tab bhi output ko adjust kiya ja sake."
            },
            points: 15
          },
          {
            id: "m2-s1-q5",
            text: { en: "A neural network with multiple hidden layers between the input and output layers is called:", ur: "Aisa neural network jisme input aur output ke beech boht sari hidden layers hon use kya kehte hain?" },
            options: {
              en: ["Shallow Network", "Deep Neural Network", "Single-Threaded Array", "Trivial Perceptron"],
              ur: ["Shallow Network", "Deep Neural Network", "Single-Threaded Array", "Trivial Perceptron"]
            },
            answerIndex: 1,
            explanation: {
              en: "The term 'Deep' in Deep Learning specifically refers to having many hidden layers stacked together in the network hierarchy.",
              ur: "Isi liye ise 'Deep Learning' kehte hain kyun ke isme hidden layers ki gehrai (depth) boht zyada hoti hai."
            },
            points: 15
          }
        ]
      },
      {
        id: "m2-s2",
        title: { en: "Activation Functions", ur: "Activation Functions" },
        subtitle: { en: "How mathematical functions introduce non-linearity to neural models.", ur: "Kaise math functions neural models me non-linearity daalte hain." },
        questions: [
          {
            id: "m2-s2-q1",
            text: { en: "What is the primary reason neural networks use non-linear Activation Functions?", ur: "Neural networks mein non-linear Activation Functions istemal karne ki sabse badi wajah kya hai?" },
            options: {
              en: [
                "To limit the model's memory usage",
                "To enable the network to learn complex non-linear boundary patterns",
                "To convert floating point numbers to integers",
                "To secure the weights from hackers"
              ],
              ur: [
                "Model ke memory usage ko kam rakhne ke liye",
                "Network ko mushkil aur deidhay-medhay patterns seekhne ke qabil banana",
                "Floating numbers ko poore integers me badalna",
                "Weights ko hackers se mehfooz rakhna"
              ]
            },
            answerIndex: 1,
            explanation: {
              en: "Without non-linear activation functions, stacking layers would just collapse into a single linear transformation, unable to learn complex patterns.",
              ur: "Agar hum activation functions istemal na karein, to pura neural network sirf ek boring linear equation ban jayega jo mushkil patterns nahi samajh payega."
            },
            points: 15
          },
          {
            id: "m2-s2-q2",
            text: { en: "Which activation function outputs values strictly between 0 and 1, representing probabilities?", ur: "Kaunsa activation function output ko strictly 0 aur 1 ke beech rakhta hai jo probability ke liye use hota hai?" },
            options: {
              en: ["ReLU", "Sigmoid", "Tanh", "Linear"],
              ur: ["ReLU", "Sigmoid", "Tanh", "Linear"]
            },
            answerIndex: 1,
            explanation: {
              en: "The Sigmoid function forms an 'S' shape and squashes any real value into the range (0, 1), perfect for binary probability classification.",
              ur: "Sigmoid function output ko 0 aur 1 ke darmiyan nichor (squash) deta hai, jo binary yes/no prediction ke liye behtareen hai."
            },
            points: 15
          },
          {
            id: "m2-s2-q3",
            text: { en: "What does 'ReLU' stand for?", ur: "ReLU ka full form kya hai?" },
            options: {
              en: [
                "Rectified Linear Unit",
                "Recurrent Linear Output",
                "Residual Loop Unit",
                "Rotational Layer Vector"
              ],
              ur: [
                "Rectified Linear Unit",
                "Recurrent Linear Output",
                "Residual Loop Unit",
                "Rotational Layer Vector"
              ]
            },
            answerIndex: 0,
            explanation: {
              en: "ReLU is f(x) = max(0, x). It replaces negative values with zero, and passes positive values unchanged.",
              ur: "ReLU ka matlab Rectified Linear Unit hai. Agar input zero se chota ho to ye zero deta hai, aur agar positive ho to wahi number wapas deta hai."
            },
            points: 15
          },
          {
            id: "m2-s2-q4",
            text: { en: "What is a common problem associated with sigmoid or tanh functions during deep network backpropagation?", ur: "Deep networks mein sigmoid ya tanh use karne se backpropagation ke dauran kaunsa bara masla pesh aata hai?" },
            options: {
              en: ["Over-fitting explosion", "Vanishing Gradient Problem", "Bit-rate collapse", "Linear overflow"],
              ur: ["Over-fitting explosion", "Vanishing Gradient Problem", "Bit-rate collapse", "Linear overflow"]
            },
            answerIndex: 1,
            explanation: {
              en: "When inputs are very high or low, the gradient of sigmoid becomes extremely small. This 'vanishing gradient' stops the model weights from updating.",
              ur: "Vanishing Gradient me network ke gradients itne chote ho jate hain ke shuruati layers ke weights change hona ruk jate hain aur learning band ho jati hai."
            },
            points: 15
          },
          {
            id: "m2-s2-q5",
            text: { en: "Which activation function is commonly used at the very last layer of a multi-class classifier to output a probability distribution?", ur: "Multi-class classification model ki aakhri layer me kaunsa function har category ki probability distribution nikalne ke liye lagaya jata hai?" },
            options: {
              en: ["Softmax", "Sigmoid", "ReLU", "Leaky ReLU"],
              ur: ["Softmax", "Sigmoid", "ReLU", "Leaky ReLU"]
            },
            answerIndex: 0,
            explanation: {
              en: "Softmax generalises sigmoid to multiple classes. It forces outputs across all target classes to sum up to exactly 1.0.",
              ur: "Softmax sabhi predictions ko aapas me compare kar ke aisi probabilities deta hai jinka kul sum 1.0 (yaani 100%) hota hai."
            },
            points: 15
          }
        ]
      },
      {
        id: "m2-s3",
        title: { en: "Neural Training & Backpropagation", ur: "Backpropagation aur Optimization" },
        subtitle: { en: "How a network updates its weights using derivatives and descent.", ur: "Kaise derivative aur optimization algorithms ke zariye model seekhta hai." },
        questions: [
          {
            id: "m2-s3-q1",
            text: { en: "What is the primary algorithm used to calculate gradients of the loss function in a neural network?", ur: "Neural network mein loss function ke gradients nikalne ke liye buniyaadi algorithm kaunsa hai?" },
            options: {
              en: ["Binary Search", "Backpropagation", "Heuristic Grid Mapping", "Turing Sort"],
              ur: ["Binary Search", "Backpropagation", "Heuristic Grid Mapping", "Turing Sort"]
            },
            answerIndex: 1,
            explanation: {
              en: "Backpropagation uses the calculus Chain Rule to work backward from the output layer to compute gradients of weights in previous layers.",
              ur: "Backpropagation Chain Rule ke tehat aakhri loss se shuru ho kar peche ki taraf har layer ke weights ke gradients nikalta hai."
            },
            points: 15
          },
          {
            id: "m2-s3-q2",
            text: { en: "What is 'Gradient Descent'?", ur: "Gradient Descent kya hai?" },
            options: {
              en: [
                "An optimization algorithm used to minimize the loss by adjusting weights in the direction of steepest descent.",
                "A hardware cooling system for graphics processors.",
                "The process of deleting inactive neuron paths.",
                "A method to encrypt model parameters."
              ],
              ur: [
                "Loss ko kam karne ke liye weights ko gradients ki ulti direction me thora thora adjust karne wala algorithm.",
                "Graphics cards ko thanda rakhne wala mechanical cooling system.",
                "Faltu neuron paths ko permanently delete karne ka tariqa.",
                "Model ke parameters ko hack hone se bachane ka encryption method."
              ]
            },
            answerIndex: 0,
            explanation: {
              en: "Gradient Descent takes steps proportional to the negative of the gradient to find the local minimum of the loss function.",
              ur: "Gradient descent pahar se niche utarne ki tarah hai, jahan hum har qadam par dhalwan (gradient) ko dekh kar loss ki sabse nichli satah par pohanchte hain."
            },
            points: 15
          },
          {
            id: "m2-s3-q3",
            text: { en: "What does the 'Learning Rate' parameter control?", ur: "Learning Rate parameter kis cheez ko control karta hai?" },
            options: {
              en: [
                "The speed of downloading the training dataset",
                "The step size taken towards the minimum during weight optimization updates",
                "The physical temperature limit of the machine",
                "The maximum length of the input tokens"
              ],
              ur: [
                "Training dataset download karne ki speed",
                "Weight update ke dauran optimization algorithm ke qadam (step) ka size",
                "Computer hardware ke chalne ka maximum temperature",
                "Input tokens ki maximum lambai"
              ]
            },
            answerIndex: 1,
            explanation: {
              en: "Learning rate determines how large a step we take during gradient updates. Too large can cause divergence; too small makes training extremely slow.",
              ur: "Learning rate ye taye karta hai ke weights ko har step me kitna badalna hai. Boht bara rate model ko kharab kar sakta hai; boht chota rate boht waqt lega."
            },
            points: 15
          },
          {
            id: "m2-s3-q4",
            text: { en: "What is one complete pass of the entire training dataset through the neural network called?", ur: "Neural network ke andar se poore training data ko ek martaba guzarne ko kya kehte hain?" },
            options: {
              en: ["Batch", "Iteration", "Epoch", "Step"],
              ur: ["Batch", "Iteration", "Epoch", "Step"]
            },
            answerIndex: 2,
            explanation: {
              en: "An Epoch represents one full cycle where every single training example has had an opportunity to update the weights.",
              ur: "Ek Epoch ka matlab hai ke poore dataset ke saare samples ne ek dafa forward aur backward pass mukammal kar liya hai."
            },
            points: 15
          },
          {
            id: "m2-s3-q5",
            text: { en: "Which of these is a popular optimization algorithm used in training modern neural networks that automatically adapts the learning rate?", ur: "Modern neural networks me sabse zyada use hone wala optimizer kaunsa hai jo automatically learning rate ko adjust karta hai?" },
            options: {
              en: ["Classic SGD", "Adam", "Newton-Raphson", "Turing Gradient"],
              ur: ["Classic SGD", "Adam", "Newton-Raphson", "Turing Gradient"]
            },
            answerIndex: 1,
            explanation: {
              en: "Adam (Adaptive Moment Estimation) computes adaptive learning rates for each parameter, combining advantages of RMSprop and AdaGrad.",
              ur: "Adam optimizer modern AI me sabse zyada popular hai kyun ke ye har parameter ke hisab se khud hi learning rate adjust karta rehta hai."
            },
            points: 15
          }
        ]
      }
    ]
  },
  {
    id: "module-3",
    number: 3,
    title: { en: "Generative Models & LLMs", ur: "Generative Models aur LLMs" },
    difficulty: "Medium",
    sections: [
      {
        id: "m3-s1",
        title: { en: "Language Modeling & RNNs", ur: "Language Modeling aur Recurrent Networks" },
        subtitle: { en: "How computers started predicting sequential text and symbols.", ur: "Computers ne text ko sequence me predict karna kaise shuru kiya." },
        questions: [
          {
            id: "m3-s1-q1",
            text: { en: "What is the primary mathematical objective of a standard autoregressive Language Model?", ur: "Standard autoregressive Language Model ka buniyaadi mathematical maqsad kya hota hai?" },
            options: {
              en: [
                "To predict the next word in a sequence given the previous context",
                "To compress text files to occupy less hardware storage",
                "To convert human spoken language directly into binary commands",
                "To check python code files for semantic bugs"
              ],
              ur: [
                "Pehle ke words ko dekh kar aane wale agle word (next word) ki probability batana",
                "Text files ko compress kar ke memory bachana",
                "Insaani boli ko direct machine binary commands me badalna",
                "Python code files me galtiyan dhoondna"
              ]
            },
            answerIndex: 0,
            explanation: {
              en: "Autoregressive language models learn to predict the probability distribution of the next token given all prior tokens.",
              ur: "Language models ka asal kaam agle lafz ki peshangoi (next-word prediction) karna hota hai, jaise phone me auto-suggest."
            },
            points: 20
          },
          {
            id: "m3-s1-q2",
            text: { en: "Why are standard feed-forward networks poor at processing sequence data like audio or paragraph text?", ur: "Standard feed-forward neural networks audio ya text sequences ko handle karne me kamzor kyun hote hain?" },
            options: {
              en: [
                "They are too slow to compile",
                "They assume inputs are independent of each other and lack memory of prior sequence steps",
                "They only accept binary data formats",
                "They cannot run on standard GPUs"
              ],
              ur: [
                "Unka compile hona boht slow hota hai",
                "Wo saare inputs ko aapas me independent samajhte hain aur unme pehle ki baaton ko yaad rakhne ki memory nahi hoti",
                "Wo sirf binary files par chal sakte hain",
                "Wo aam GPUs par kaam nahi kar sakte"
              ]
            },
            answerIndex: 1,
            explanation: {
              en: "Feed-forward networks map fixed inputs to fixed outputs without temporal memory. Words in a sentence heavily depend on preceding words.",
              ur: "Feed-forward networks me guzashta inputs ki koi yaadash (memory) nahi hoti. Text me har lafz ka matlab pehle aaye lafzon par nirbhar hota hai."
            },
            points: 20
          },
          {
            id: "m3-s1-q3",
            text: { en: "What does 'RNN' stand for in neural networks?", ur: "RNN ka matlab kya hai?" },
            options: {
              en: [
                "Recurrent Neural Network",
                "Randomized Rational Node",
                "Recursive Regulation Network",
                "Rotational Ratio Network"
              ],
              ur: [
                "Recurrent Neural Network",
                "Randomized Rational Node",
                "Recursive Regulation Network",
                "Rotational Ratio Network"
              ]
            },
            answerIndex: 0,
            explanation: {
              en: "RNN stands for Recurrent Neural Network. They contain loops that allow information to persist across sequential processing steps.",
              ur: "RNN ka matlab Recurrent Neural Network hai. Inme loops hote hain taake purani maloomat aage wale sequence me sath chal sakein."
            },
            points: 20
          },
          {
            id: "m3-s1-q4",
            text: { en: "Which RNN variant introduced a dedicated gate-controlled 'cell state' memory to combat vanishing gradients in long sequences?", ur: "Kis mashhoor RNN variant ne 'gates' aur 'cell state' memory ka concept laya taake lambe sequences me purani baaton ko yaad rakha ja sake?" },
            options: {
              en: ["Perceptron Layer", "LSTM (Long Short-Term Memory)", "Simple Markov Chain", "Linear Perceptron Network"],
              ur: ["Perceptron Layer", "LSTM (Long Short-Term Memory)", "Simple Markov Chain", "Linear Perceptron Network"]
            },
            answerIndex: 1,
            explanation: {
              en: "LSTM networks, designed by Hochreiter and Schmidhuber, use input, output, and forget gates to regulate information flow in the memory cell state.",
              ur: "LSTM (Long Short-Term Memory) boht kargar variant hai jo special gates ke zariye zaroori maloomat ko lambe waqt tak yaad rakhta hai."
            },
            points: 20
          },
          {
            id: "m3-s1-q5",
            text: { en: "What is a major limitation of LSTMs and RNNs that led to the development of Transformers?", ur: "LSTMs aur RNNs ki aisi kaunsi bari khami thi jiski wajah se modern Transformers ko banana para?" },
            options: {
              en: [
                "They can only process numbers under 100",
                "They must process words step-by-step sequentially, which prevents highly parallel GPU computation",
                "They cannot represent non-linear datasets",
                "They do not support loss functions"
              ],
              ur: [
                "Wo sirf 100 se chote numbers ko process kar sakte hain",
                "Unhe ek ek lafz sequence me line se bar-bari process karna parta hai, jiski wajah se GPUs par parallel speed nahi milti",
                "Wo non-linear datasets ko represent nahi kar sakte",
                "Wo loss functions ko support nahi karte"
              ]
            },
            answerIndex: 1,
            explanation: {
              en: "Because RNNs process inputs step-by-step sequentially, they cannot be easily parallelized on modern GPU hardware during training.",
              ur: "RNNs step-by-step chalti hain (ek lafz ke baad dusra), is liye unhe train karne me GPUs ka full fayedah (parallelization) nahi uthaya ja sakta."
            },
            points: 20
          }
        ]
      },
      {
        id: "m3-s2",
        title: { en: "Transformer Architecture", ur: "Transformer ki Dunya" },
        subtitle: { en: "The 2017 revolution that enabled modern large-scale AI.", ur: "2017 ka wo inquilab jisne modern large-scale AI ko janam diya." },
        questions: [
          {
            id: "m3-s2-q1",
            text: { en: "Which landmark research paper introduced the Transformer architecture in 2017?", ur: "Kis mashhoor research paper ne 2017 mein Transformer architecture ko paish kiya?" },
            options: {
              en: [
                "Attention Is All You Need",
                "Deep Residual Learning for Image Recognition",
                "Computing Machinery and Intelligence",
                "Backpropagation of Error Signals"
              ],
              ur: [
                "Attention Is All You Need",
                "Deep Residual Learning for Image Recognition",
                "Computing Machinery and Intelligence",
                "Backpropagation of Error Signals"
              ]
            },
            answerIndex: 0,
            explanation: {
              en: "Google researchers published 'Attention Is All You Need' in 2017, introducing self-attention and replacing recurrence entirely.",
              ur: "Google ke researchers ne 2017 mein 'Attention Is All You Need' naam ka paper likha, jisne poori AI industry ko badal kar rakh diya."
            },
            points: 20
          },
          {
            id: "m3-s2-q2",
            text: { en: "Unlike RNNs, how do Transformers process words in a sentence?", ur: "RNNs ke bar-aks, Transformers jumlay ke saare alfaaz ko kaise process karte hain?" },
            options: {
              en: [
                "They ignore word order completely and treat it as random text",
                "They process all words simultaneously in parallel, using Positional Encodings to preserve order information",
                "They translate words into audio before reading",
                "They require a human to manually tag word positions"
              ],
              ur: [
                "Wo alfaaz ki tarkeeb ko bilkul bhool jate hain aur unhe random samajhte hain",
                "Wo saare alfaaz ko ek sath parallel me process karte hain, aur 'Positional Encodings' ke zariye unki jagah yaad rakhte hain",
                "Wo parhne se pehle har lafz ko audio me badalte hain",
                "Unhe chalane ke liye ek insaan ko har lafz ka number khud likhna parta hai"
              ]
            },
            answerIndex: 1,
            explanation: {
              en: "Transformers process entire sequences at once (parallelization). Positional encodings are added to input vectors to preserve word order context.",
              ur: "Transformers saare lafzon ko ek sath process karte hain, is liye ye boht tez hote hain. Alfaaz ki line-wise sequence ko 'Positional Encoding' se sanbhala jata hai."
            },
            points: 20
          },
          {
            id: "m3-s2-q3",
            text: { en: "What does 'GPT' stand for in OpenAI's model naming?", ur: "OpenAI ke GPT model me 'GPT' ka full form kya hai?" },
            options: {
              en: [
                "Generative Pre-trained Transformer",
                "Global Processor of Text",
                "Generalized Python Translator",
                "Guided Path Terminal"
              ],
              ur: [
                "Generative Pre-trained Transformer",
                "Global Processor of Text",
                "Generalized Python Translator",
                "Guided Path Terminal"
              ]
            },
            answerIndex: 0,
            explanation: {
              en: "GPT stands for Generative Pre-trained Transformer. It is trained on large internet corpuses to generate coherent continuation text.",
              ur: "GPT ka matlab Generative Pre-trained Transformer hai. Ye pehle se boht bare data par train hote hain aur naya text likh sakte hain."
            },
            points: 20
          },
          {
            id: "m3-s2-q4",
            text: { en: "What are the two major halves of the original Transformer architecture?", ur: "Original Transformer architecture ke do sabse bare hisse kaunse hain?" },
            options: {
              en: [
                "Forward propagation and Backward descent",
                "Encoder and Decoder",
                "Random forest and Perceptron",
                "Local cache and Cloud storage"
              ],
              ur: [
                "Forward propagation aur Backward descent",
                "Encoder aur Decoder",
                "Random forest aur Perceptron",
                "Local cache aur Cloud storage"
              ]
            },
            answerIndex: 1,
            explanation: {
              en: "The original Transformer is an Encoder-Decoder model. Encoder processes input text, and Decoder generates target translations or text.",
              ur: "Transformer me do bare parts hote hain: 'Encoder' jo input ko samajhta hai, aur 'Decoder' jo output text ko generate karta hai."
            },
            points: 20
          },
          {
            id: "m3-s2-q5",
            text: { en: "Which GPT model variant is decoder-only, generating words one-by-one?", ur: "Kaunsa model architecture sirf 'decoder-only' hota hai aur ek-ek kar ke alfaaz generate karta hai?" },
            options: {
              en: ["BERT", "Autoregressive LLMs (like GPT series)", "T5", "ResNet-50"],
              ur: ["BERT", "Autoregressive LLMs (jaise GPT series)", "T5", "ResNet-50"]
            },
            answerIndex: 1,
            explanation: {
              en: "GPT is a decoder-only architecture designed for generative text. In contrast, Google's BERT is an encoder-only model designed for understanding.",
              ur: "GPT series decoder-only models hain jo naye alfaaz likhne ke kaam aate hain, jabki BERT encoder-only hai jo samajhne ke liye banaya gaya tha."
            },
            points: 20
          }
        ]
      },
      {
        id: "m3-s3",
        title: { en: "Self-Attention Magic", ur: "Self-Attention ka Kamaal" },
        subtitle: { en: "Deep dive into how queries, keys, and values route context.", ur: "Query, Key, aur Value ke zariye context nikalne ki gehri samajh." },
        questions: [
          {
            id: "m3-s3-q1",
            text: { en: "In Self-Attention, how does a model calculate the relationship between different words in a sentence?", ur: "Self-Attention mein neural network jumlay ke alag-alag lafzon ke aapsi rishte ko kaise naapta hai?" },
            options: {
              en: [
                "By sorting them in alphabetical order",
                "By calculating the dot product of mathematical Query and Key vectors for each word",
                "By randomly assigning connection values",
                "By counting the total character lengths of words"
              ],
              ur: [
                "Unhe alphabetical tarkeeb me arrange kar ke",
                "Har lafz ke mathematical 'Query' aur 'Key' vectors ka dot-product nikal kar",
                "Apni marzi se random connection rates de kar",
                "Har lafz ke andar aane wale characters ki tadaad gin kar"
              ]
            },
            answerIndex: 1,
            explanation: {
              en: "Self-attention computes a dot-product attention score using Query (Q) and Key (K) vectors, then scales and applies softmax to weight Value (V) vectors.",
              ur: "Self-Attention me har word Query, Key aur Value vectors me badal jata hai. Q aur K ke dot product se attention score milta hai."
            },
            points: 20
          },
          {
            id: "m3-s3-q2",
            text: { en: "In the sentence: 'The animal didn't cross the street because it was too tired', what does self-attention resolve the word 'it' to?", ur: "Is jumlay mein: 'The animal didn't cross the street because it was too tired', self-attention ke zariye word 'it' kis lafz se connect hota hai?" },
            options: {
              en: ["street", "animal", "tired", "cross"],
              ur: ["street (sadak)", "animal (janwar)", "tired (thaka hua)", "cross (paar karna)"]
            },
            answerIndex: 1,
            explanation: {
              en: "Self-attention allows the word 'it' to heavily associate with 'animal', resolving pronouns dynamically based on context.",
              ur: "Self-attention computer ko ye samajhne me madad deta hai ke yahan 'it' ka matlab 'animal' hai, na ke 'street'."
            },
            points: 20
          },
          {
            id: "m3-s3-q3",
            text: { en: "What are the three core vectors generated for each token in self-attention calculation?", ur: "Self-attention calculate karte waqt har token ke liye kaunse teen vectors banaye jate hain?" },
            options: {
              en: [
                "Query, Key, Value",
                "Input, Weight, Bias",
                "Alpha, Beta, Gamma",
                "Start, Middle, End"
              ],
              ur: [
                "Query, Key, Value",
                "Input, Weight, Bias",
                "Alpha, Beta, Gamma",
                "Start, Middle, End"
              ]
            },
            answerIndex: 0,
            explanation: {
              en: "Query (Q), Key (K), and Value (V) are linear projections of input embeddings that form the backbone of attention routing.",
              ur: "Self-attention ke calculation me Query (Q), Key (K), aur Value (V) vectors sabse zaroori elements hote hain."
            },
            points: 20
          },
          {
            id: "m3-s3-q4",
            text: { en: "What does 'Multi-Head Attention' mean?", ur: "Multi-Head Attention ka kya matlab hai?" },
            options: {
              en: [
                "Running the attention layer across multiple physical supercomputer racks",
                "Using multiple independent attention calculation heads in parallel to focus on different aspects of relationships",
                "Running the model on multiple GPUs",
                "Combining text and image inputs at the same time"
              ],
              ur: [
                "Attention layer ko boht sare physical supercomputers par chalana",
                "Boht sare azaad (independent) attention calculation heads ko ek sath parallel chalana taake wo context ki mukhtalif khubiyan seekhein",
                "Model ko ek se zyada graphics cards par divide karna",
                "Aik hi waqt me text aur images ko aapas me milana"
              ]
            },
            answerIndex: 1,
            explanation: {
              en: "Multi-Head Attention splits queries, keys, and values into multiple subspaces, allowing the model to focus on grammar, pronouns, and semantics all at once.",
              ur: "Multi-Head attention me boht saare heads hote hain jo aik sath alag-alag cheezon par dhyan dete hain (jaise ek head grammar par aur dusra noun par)."
            },
            points: 20
          },
          {
            id: "m3-s3-q5",
            text: { en: "What is the computational complexity of standard global self-attention with respect to sequence length (N)?", ur: "Sequence length (N) ke hisab se standard self-attention ki computational space/time complexity kya hoti hai?" },
            options: {
              en: ["O(N) - Linear", "O(N log N)", "O(N^2) - Quadratic", "O(1) - Constant"],
              ur: ["O(N) - Linear", "O(N log N)", "O(N^2) - Quadratic", "O(1) - Constant"]
            },
            answerIndex: 2,
            explanation: {
              en: "Self-attention compares every word with every other word in the sequence, resulting in O(N^2) quadratic scaling complexity, which makes processing very long texts difficult.",
              ur: "Kyunki har word ko baki sab se compare kiya jata hai, is liye computational complexity O(N^2) (Quadratic) hoti hai, jo bare sentences me zyada power leti hai."
            },
            points: 20
          }
        ]
      }
    ]
  },
  {
    id: "module-4",
    number: 4,
    title: { en: "Advanced Prompting & RAG", ur: "Prompting aur RAG" },
    difficulty: "Medium-Hard",
    sections: [
      {
        id: "m4-s1",
        title: { en: "Prompt Engineering Styles", ur: "Prompting ke Jadeed Tariqe" },
        subtitle: { en: "How to guide model reasoning through structural text patterns.", ur: "Structural text patterns ke zariye model ko sochne par kaise majboor karein." },
        questions: [
          {
            id: "m4-s1-q1",
            text: { en: "What is 'Few-Shot Prompting'?", ur: "Few-Shot Prompting kya hoti hai?" },
            options: {
              en: [
                "Asking the model to answer in under 5 words",
                "Providing a few input-output examples in the prompt to show the model how to format its response",
                "Running a model using very few GPU cores",
                "Giving the model a strict timeout limit"
              ],
              ur: [
                "Model ko sirf 5 lafzon se chota answer dene ko kehna",
                "Prompt mein kuch examples (inputs aur outputs) shamil karna taake model formatting seekh sake",
                "Model ko boht kam GPU cores par run karna",
                "Model ke reply dene ka waqt boht kam rakhna"
              ]
            },
            answerIndex: 1,
            explanation: {
              en: "Few-shot prompting provides high-quality exemplars inside the prompt body, guiding the in-context learning of the LLM without model fine-tuning.",
              ur: "Few-Shot prompting me hum model ko shuru me 2-3 sahi examples dikhate hain, jisse model bina fine-tune hue sahi pattern par kaam karta hai."
            },
            points: 25
          },
          {
            id: "m4-s1-q2",
            text: { en: "What is 'Chain-of-Thought' (CoT) prompting?", ur: "Chain-of-Thought (CoT) prompting kya hai?" },
            options: {
              en: [
                "Linking multiple models together in a cloud chain",
                "Guiding the model to break down complex problems step-by-step before outputting the final answer",
                "Repeating the same prompt multiple times to get different outputs",
                "Using blockchain to store prompts securely"
              ],
              ur: [
                "Boht sare models ko cloud network me ek zanjeer ki tarah joorna",
                "Model ko is baat par raazi karna ke wo aakhri answer se pehle poore maslay ko step-by-step likh kar samjhaye",
                "Ek hi prompt ko bar-bar repeat karna taake naye replies mil sakein",
                "Prompts ko blockchain par save karna"
              ]
            },
            answerIndex: 1,
            explanation: {
              en: "Chain-of-Thought prompting directs the model to output its intermediate reasoning steps, which heavily improves accuracy on math and logic tasks.",
              ur: "Chain-of-Thought me model ko 'Let's think step by step' keh kar uske sochne ke tariqe ko output me nikalwaya jata hai jo answers ko durust banata hai."
            },
            points: 25
          },
          {
            id: "m4-s1-q3",
            text: { en: "What does the 'Temperature' parameter control in LLM inference?", ur: "LLM chalate waqt 'Temperature' parameter kis cheez ko control karta hai?" },
            options: {
              en: [
                "The physical temperature of the server chips",
                "The randomness, creativity, and predictability of the generated words",
                "The brightness of the chat interface screens",
                "The database reading speed"
              ],
              ur: [
                "Server chips ka asli physical bukhar (temperature)",
                "Model ki creativity, randomness, aur agle alfaaz chunte waqt unka anokha-pan",
                "Chat interface ki screen ki roshni",
                "Database parhne ki speed"
              ]
            },
            answerIndex: 1,
            explanation: {
              en: "Temperature adjusts the probability distribution of tokens. High temperature (e.g. 1.0) leads to highly creative outputs, whereas low (e.g. 0.0) yields deterministic answers.",
              ur: "Temperature jitna zyada hoga (jaise 1.0), model utna hi random aur creative hoga. Agar temperature 0.0 ho, to answers bilkul dry aur same honge."
            },
            points: 25
          },
          {
            id: "m4-s1-q4",
            text: { en: "Which prompting technique involves the model critiquing its own response and refining it?", ur: "Kis prompting technique me model apne hi likhe hue answer ko khud check karta hai aur behtar banata hai?" },
            options: {
              en: ["Zero-Shot prompting", "Self-Reflection (or Self-Correction)", "In-Context Compression", "Static Template Extraction"],
              ur: ["Zero-Shot prompting", "Self-Reflection (ya Self-Correction)", "In-Context Compression", "Static Template Extraction"]
            },
            answerIndex: 1,
            explanation: {
              en: "Self-correction prompts instruct the model to review its generated output for errors, logical fallacies, or alignment issues and output a corrected draft.",
              ur: "Self-Reflection me model khud apni galtiyon ko analyze kar ke unhe correct karta hai."
            },
            points: 25
          },
          {
            id: "m4-s1-q5",
            text: { en: "What does the 'System Prompt' (System Instruction) do?", ur: "System Prompt (System Instruction) ka kya maqsad hota hai?" },
            options: {
              en: [
                "It reboots the computer operating system",
                "It sets the baseline persona, behavior, constraints, and instructions for the entire chat session",
                "It converts python code to node.js",
                "It deletes malicious prompt files"
              ],
              ur: [
                "Ye computer ke operating system ko restart kar deta hai",
                "Ye poori conversation ke liye model ki buniyaadi shakhsiyat (persona), hudood aur instructions taye karta hai",
                "Ye python code ko node.js me convert karta hai",
                "Ye faltu prompts ko system se permanently delete karta hai"
              ]
            },
            answerIndex: 1,
            explanation: {
              en: "A System Prompt establishes permanent ground rules and behavioral guardrails that the AI model must respect during a conversation.",
              ur: "System Prompt backend se lagaya jata hai jo model ko ye batata hai ke use kis tarah ka kirdar (jaise: 'Tum ek professional teacher ho') ada karna hai."
            },
            points: 25
          }
        ]
      },
      {
        id: "m4-s2",
        title: { en: "Vector Search & Embeddings", ur: "Vector Search aur Embeddings" },
        subtitle: { en: "How text is converted into mathematical spaces for semantic lookup.", ur: "Lafzon ko math vectors me badal kar unke maani kaise dhoonde jate hain." },
        questions: [
          {
            id: "m4-s2-q1",
            text: { en: "What is a 'Vector Embedding'?", ur: "Vector Embedding ka kya matlab hai?" },
            options: {
              en: [
                "A hardware chip that processes vectors",
                "A list of decimal numbers representing the semantic meaning of a word or sentence in a multi-dimensional space",
                "An encryption key to hide dataset columns",
                "A digital logo format used in web design"
              ],
              ur: [
                "Ek aisi computer chip jo vectors ko chalati hai",
                "Boht saare decimals (numbers) ki list jo lafzon ya sentences ke asli maani (semantics) ko high-dimensional math space me store karti hai",
                "Data ke columns ko chupati hui encryption key",
                "Ek vector design format jo website logo me use hota hai"
              ]
            },
            answerIndex: 1,
            explanation: {
              en: "Vector embeddings capture the semantic relationships of text. Similar concepts (e.g. 'King' and 'Queen') end up geometrically close in vector space.",
              ur: "Embeddings lafzon ke maani ko numbers me badal deti hain. Ek jaise maani wale lafz (jaise 'aam' aur 'seb') math space me kareeb hote hain."
            },
            points: 25
          },
          {
            id: "m4-s2-q2",
            text: { en: "Which mathematical formula is most commonly used to measure similarity between two vector embeddings?", ur: "Do vector embeddings ke darmiyan similarity (milta-julta pan) naapne ke liye sabse aam math formula kaunsa hai?" },
            options: {
              en: ["Cosine Similarity", "Pythagorean Theorem", "Quadratic Equation", "Fibonacci Ratio"],
              ur: ["Cosine Similarity", "Pythagorean Theorem", "Quadratic Equation", "Fibonacci Ratio"]
            },
            answerIndex: 0,
            explanation: {
              en: "Cosine Similarity measures the cosine of the angle between two multi-dimensional vectors, evaluating directional alignment regardless of vector magnitude.",
              ur: "Cosine Similarity do vectors ke darmiyan angle ka cosine nikaal kar batati hai ke dono kitne miltay-jultay hain."
            },
            points: 25
          },
          {
            id: "m4-s2-q3",
            text: { en: "What is the purpose of a 'Vector Database' (e.g., Pinecone, Chroma)?", ur: "Vector Database (jaise Pinecone, Chroma) ka kya kaam hota hai?" },
            options: {
              en: [
                "To store video game graphic models",
                "To efficiently index, store, and perform nearest-neighbor searches on millions of high-dimensional embedding vectors",
                "To host standard SQL relational tables",
                "To compile javascript code"
              ],
              ur: [
                "Video games ke graphic maps ko store karna",
                "Lakhon high-dimensional embedding vectors ko save karna aur unme se jaldi se semantic matching search (nearest neighbors) nikalna",
                "Relational SQL tables ko manage karna",
                "Javascript code ko compile karna"
              ]
            },
            answerIndex: 1,
            explanation: {
              en: "Vector databases allow models to query millions of indexed documents instantly for context matching, returning relevant text snippets within milliseconds.",
              ur: "Vector Databases ko special design kiya jata hai taake wo numbers ke vectors par semantic search miliseconds me kar sakein."
            },
            points: 25
          },
          {
            id: "m4-s2-q4",
            text: { en: "What is 'Semantic Search' compared to traditional keyword search?", ur: "Traditional keyword search ke muqable me 'Semantic Search' ka kya farq hai?" },
            options: {
              en: [
                "Semantic search is slower because it queries SQL databases",
                "Semantic search understands the intent and meaning behind queries, even if exact keywords aren't present",
                "Semantic search requires human administrators to manually check answers",
                "Semantic search only works on spoken voice notes"
              ],
              ur: [
                "Semantic search aam databases se chalne ki wajah se slow hoti hai",
                "Semantic search query ke piche chupe maani aur maqsad ko samajhti hai, chahe exact matching words data me na hon",
                "Isme aam admins ko manually answers verify karne parte hain",
                "Ye sirf bolnay wali voice notes par chal sakti hai"
              ]
            },
            answerIndex: 1,
            explanation: {
              en: "Keyword search checks for exact character matches. Semantic search uses vector space proximity to retrieve documents with synonymous meaning (e.g., matching 'puppy' to 'young dog').",
              ur: "Keyword search exact lafz dhoondti hai. Semantic search maani dhoondti hai (jaise agar aap 'bimar' likhein to wo 'tandurust na hona' ke documents bhi dikhaye)."
            },
            points: 25
          },
          {
            id: "m4-s2-q5",
            text: { en: "How many dimensions do typical commercial embedding models (like OpenAI text-embedding-3-small) have?", ur: "Commercial embedding models me aam tor par kitne dimensions hote hain?" },
            options: {
              en: ["3 dimensions (X, Y, Z)", "Between 256 and 1536 dimensions", "Over one billion dimensions", "Exactly 8 dimensions"],
              ur: ["Sirf 3 dimensions (X, Y, Z)", "Takreeban 256 se 1536 dimensions tak", "Ek arab se zyada dimensions", "Theek 8 dimensions"]
            },
            answerIndex: 1,
            explanation: {
              en: "Modern text embeddings represent semantic dimensions in 256, 1024, or 1536 dimension coordinate floats, capturing deep conceptual nuances.",
              ur: "Aam models decimals ke 1536 numbers ki list banate hain, yaani us space me 1536 coordinates ya dimensions hote hain."
            },
            points: 25
          }
        ]
      },
      {
        id: "m4-s3",
        title: { en: "RAG Architecture", ur: "RAG Architecture" },
        subtitle: { en: "Giving models real-time knowledge bases and avoiding hallucination.", ur: "Models ko real-time documents dena aur galat baaton se bachana." },
        questions: [
          {
            id: "m4-s3-q1",
            text: { en: "What does 'RAG' stand for in Generative AI?", ur: "Generative AI mein 'RAG' ka kya matlab hai?" },
            options: {
              en: [
                "Retrieval-Augmented Generation",
                "Randomized Algorithmic Grid",
                "Recurrent Activation Gateway",
                "Redundant Analytical Graph"
              ],
              ur: [
                "Retrieval-Augmented Generation",
                "Randomized Algorithmic Grid",
                "Recurrent Activation Gateway",
                "Redundant Analytical Graph"
              ]
            },
            answerIndex: 0,
            explanation: {
              en: "RAG stands for Retrieval-Augmented Generation. It retrieves external document facts and feeds them to the LLM to get accurate answers.",
              ur: "RAG ka full form Retrieval-Augmented Generation hai, jo bahar se sahi maloomat la kar model ko deta hai."
            },
            points: 25
          },
          {
            id: "m4-s3-q2",
            text: { en: "What is the primary benefit of RAG over model fine-tuning?", ur: "RAG ka model fine-tuning ke muqable me sabse bara fayedah kya hai?" },
            options: {
              en: [
                "RAG updates model weights permanently",
                "RAG is cheap, does not require retraining weights, and allows instant updates to the knowledge base by changing files",
                "RAG makes the model run without internet connection",
                "RAG can run on standard mobile phones without servers"
              ],
              ur: [
                "RAG model ke weights ko hamesha ke liye badal deta hai",
                "RAG sasta hai, isme weights badalne ki zaroorat nahi parti, aur folder ke files ko badal kar knowledge base ko instantly update kiya ja sakta hai",
                "RAG ke bad model bina internet ke bhi chal jata hai",
                "RAG bina kisi server ke direct mobile phones par chal jata hai"
              ]
            },
            answerIndex: 1,
            explanation: {
              en: "Fine-tuning updates model parameters (expensive and slow). RAG acts like an open-book exam, supplying the latest facts dynamically inside the prompt context.",
              ur: "Fine-tuning me weights train karne parte hain jo boht mehnga kaam hai. RAG ek 'Open Book Exam' ki tarah hai jahan latest data direct prompt me pesh kiya jata hai."
            },
            points: 25
          },
          {
            id: "m4-s3-q3",
            text: { en: "Which component in a RAG pipeline cuts large PDFs/text documents into small, manageable pieces before embedding?", ur: "RAG system mein bare documents ko chote chote tukron me katne wale process ko kya kehte hain?" },
            options: {
              en: ["The Optimizer", "The Chunker (Text Splitter)", "The Softmax layer", "The Decryptor"],
              ur: ["Optimizer", "Chunker (ya Text Splitter)", "Softmax layer", "Decryptor"]
            },
            answerIndex: 1,
            explanation: {
              en: "Text chunking splits documents into smaller passages (e.g. 500 characters with some overlap), ensuring retrieved context stays relevant and within token limits.",
              ur: "Chunking bare documents ko chote portions me split karti hai taake relevance barqarar rahe aur model ki token limit exceed na ho."
            },
            points: 25
          },
          {
            id: "m4-s3-q4",
            text: { en: "In RAG, what is 'Hallucination'?", ur: "RAG aur LLMs ke silsile mein 'Hallucination' ka kya matlab hai?" },
            options: {
              en: [
                "The model going offline due to overheating",
                "The model confidently generating false, fabricated facts or non-existent citations",
                "The user forgetting their account password",
                "Converting image vectors back to raw text"
              ],
              ur: [
                "Model ka boht garm hone ki wajah se shut-down hona",
                "Model ka poore aitmad ke sath aisi galat, man-gharat baatein likhna jiska haqeeqat se koi taluq na ho",
                "User ka apna account password bhool jana",
                "Image vectors ko dobara raw text me badalna"
              ]
            },
            answerIndex: 1,
            explanation: {
              en: "Hallucination is when an AI generates plausible-sounding but completely incorrect information. RAG reduces hallucinations by grounding responses in retrieved source documents.",
              ur: "Hallucination ka matlab hai ke model aisi batein bolna shuru kar de jo lagti sahi hain par asal me bilkul galat aur fabricated hoti hain."
            },
            points: 25
          },
          {
            id: "m4-s3-q5",
            text: { en: "What does 'Grounding' mean in RAG pipelines?", ur: "RAG pipeline mein 'Grounding' se kya murad hai?" },
            options: {
              en: [
                "Connecting servers to physical ground wires for safety",
                "Ensuring the model's generated text is strictly tied to and verifiable by the retrieved facts/documents provided",
                "Blocking the user from asking questions",
                "Compressing vector space models"
              ],
              ur: [
                "Servers ko safety ke liye earthing wire se connect karna",
                "AI ke generated jawab ko di gayi asli maloomat/documents ke sath mazbooti se joorna taake har cheez ka saboot ho",
                "User ko sawalat puchne se ban karna",
                "Vector space models ko chota karna"
              ]
            },
            answerIndex: 1,
            explanation: {
              en: "Grounding ensures that the generation is anchored to factual data retrieved from the vector index, minimizing unverified assumptions or guesses.",
              ur: "Grounding ka matlab hai ke model jo kuch bole, uske peeche folder me mojood files ka verification link aur saboot shamil ho."
            },
            points: 25
          }
        ]
      }
    ]
  },
  {
    id: "module-5",
    number: 5,
    title: { en: "Cutting-Edge AI & Future Horizons", ur: "Cutting-Edge AI aur Mustaqbil" },
    difficulty: "Hard",
    sections: [
      {
        id: "m5-s1",
        title: { en: "Multi-Modal Systems", ur: "Multi-Modal Systems" },
        subtitle: { en: "How models process images, audio, and video concurrently.", ur: "Models kaise image, audio aur video ko aik sath process karte hain." },
        questions: [
          {
            id: "m5-s1-q1",
            text: { en: "What is a 'Multi-Modal' AI model?", ur: "Aik 'Multi-Modal' AI model se kya murad hai?" },
            options: {
              en: [
                "A model that can run on multiple cloud servers at once",
                "A model that can accept and understand multiple types of input modalities (e.g., text, images, audio, video)",
                "A model with more than five hidden layers",
                "An AI that can write code in both Python and Java"
              ],
              ur: [
                "Aisa model jo boht sare clouds par chal sakta ho",
                "Aisa model jo aik hi waqt me mukhtalif modalities ko samajh sake (jaise text, image, audio aur video)",
                "Aisa model jisme 5 se zyada hidden layers hon",
                "Aisi AI jo aik sath python aur java me code likh sake"
              ]
            },
            answerIndex: 1,
            explanation: {
              en: "Multi-modal models (like Gemini) represent different inputs (images, sound) in a unified vector space, allowing them to explain drawings, transcribe audio, or write captions.",
              ur: "Multi-Modal models (jaise Google Gemini) aik sath photo dekh kar us par baat kar sakte hain aur audio ko bhi samajh sakte hain."
            },
            points: 30
          },
          {
            id: "m5-s1-q2",
            text: { en: "Which core technology allowed image encoders (like ViT) to feed visual data to text decoders?", ur: "Kis core technology ne image encoders (jaise ViT) ko visual vectors text decoders me feed karne ke qabil banaya?" },
            options: {
              en: ["Vision Transformers", "Heuristic SQL grids", "Markov Chain filters", "Classic perceptrons"],
              ur: ["Vision Transformers", "Heuristic SQL grids", "Markov Chain filters", "Classic perceptrons"]
            },
            answerIndex: 0,
            explanation: {
              en: "Vision Transformers (ViT) break images into flat patches, convert them to embeddings, and feed them into standard attention blocks just like words.",
              ur: "Vision Transformers (ViT) photo ke chote chote patches (tukre) bana kar unhe embedding vectors me tabdeel karte hain jaise wo text ke lafz hon."
            },
            points: 30
          },
          {
            id: "m5-s1-q3",
            text: { en: "What is CLIP (Contrastive Language-Image Pre-training) used for?", ur: "CLIP (Contrastive Language-Image Pre-training) kis kaam ke liye istemal hota hai?" },
            options: {
              en: [
                "Editing and crop sizing high-definition web videos",
                "Jointly learning to map images and text descriptions into the same mathematical vector space",
                "Compressing binary audio frequencies",
                "Automating server chip cooling systems"
              ],
              ur: [
                "HD videos ko crop aur edit karne ka tool",
                "Photos aur unke text descriptions ko aik hi multi-dimensional vector space me map karna seekhna",
                "Audio frequencies ko compress karna",
                "Server chips ko cool rakhne ka automation tool"
              ]
            },
            answerIndex: 1,
            explanation: {
              en: "CLIP aligns images with their textual descriptions in a shared vector space, which is the foundational building block for models like Midjourney or Stable Diffusion.",
              ur: "CLIP photo aur uske text description ke maani ko aapas me barabar match karne me madad deta hai, jo text-to-image generator me aam hai."
            },
            points: 30
          },
          {
            id: "m5-s1-q4",
            text: { en: "How do Diffusion Models generate high-quality images?", ur: "Diffusion Models kaise high-quality photos aur images banate hain?" },
            options: {
              en: [
                "By copy-pasting existing internet clip art together",
                "By starting with random gaussian noise and iteratively removing noise (denoising) guided by text prompts",
                "By drawing vector geometric lines using python libraries",
                "By compiling hundreds of photos into a single video clip"
              ],
              ur: [
                "Bahar internet se aam clips ko copy paste kar ke jorhna",
                "Pehle random high-noise pixels se shuru karna aur thora-thora kar ke noise saaf (denoising) karte hue clear photo nikalna",
                "Python code ke zariye basic geometric lines draw karna",
                "Boht sari photos ko milakar aik lambi video clip banana"
              ]
            },
            answerIndex: 1,
            explanation: {
              en: "Diffusion models learn the process of adding noise to images and then reverse it (denoising), turning complete static noise into highly detailed photorealistic images.",
              ur: "Diffusion models pehle photo ko kharab (noise) karna seekhte hain, phir reverse me chal kar pixel ki dundh (noise) ko bilkul saaf kar ke behtareen photo banate hain."
            },
            points: 30
          },
          {
            id: "m5-s1-q5",
            text: { en: "What is 'Latent Space' in generative networks?", ur: "Generative networks mein 'Latent Space' se kya murad hai?" },
            options: {
              en: [
                "The delay or lag in cloud database replies",
                "The hidden mathematical multi-dimensional space containing the compressed representation of data features and concepts",
                "The hardware space left in the hard drive",
                "A separate security firewall"
              ],
              ur: [
                "Cloud databases ke replies me aane wala lag ya delay",
                "Ek aisa chhupa hua mathematical space jahan data ke patterns aur concepts boht compressed haal me mojood hote hain",
                "Computer hard drive me bachi hui khali jagah",
                "Ek alag qisam ki security firewall"
              ]
            },
            answerIndex: 1,
            explanation: {
              en: "Latent space is a lower-dimensional compression where similar concept inputs lie near each other, allowing algorithms to generate new variations by moving through this space.",
              ur: "Latent space compressed mathematical space hai jahan computer features ke patterns ko dhoondhta aur unme tabdeeliyan kar ke naye inputs banata hai."
            },
            points: 30
          }
        ]
      },
      {
        id: "m5-s2",
        title: { en: "AI Agents & Tool Use", ur: "AI Agents aur Tool ka Istemal" },
        subtitle: { en: "How models execute code, search the web, and complete loops.", ur: "Models kaise code chalate hain, internet search karte hain aur loops chalate hain." },
        questions: [
          {
            id: "m5-s2-q1",
            text: { en: "What defines an 'AI Agent' as opposed to a standard chatbot?", ur: "Ek normal chatbot ke muqable me 'AI Agent' ki pehchan kis cheez se hoti hai?" },
            options: {
              en: [
                "An agent has a louder audio voice output",
                "An agent has autonomy, can make plans, use external tools, and complete multi-step loops to achieve a goal",
                "An agent is written in a more secure programming language",
                "An agent only runs on servers inside Google offices"
              ],
              ur: [
                "Agent ki aawaz chat bot se zyada loud hoti hai",
                "Agent ke paas autonomy (azaadi) hoti hai, wo plans bana sakta hai, tools use kar sakta hai aur aakhri maqsad pane tak loops chala sakta hai",
                "Agent boht zyada secure programming language me likha hota hai",
                "Agent sirf Google ke special data center offices me chalta hai"
              ]
            },
            answerIndex: 1,
            explanation: {
              en: "While chatbots only answer questions, AI agents are goal-driven. They create plans, execute actions, check results, and adapt loops dynamically.",
              ur: "Chatbots sirf baatein karte hain, jabki Agents khud faisla kar ke files banate hain, commands chalate hain, aur masla hal hone tak kaam karte hain."
            },
            points: 30
          },
          {
            id: "m5-s2-q2",
            text: { en: "What is 'Function Calling' (Tool Use) in modern LLM APIs?", ur: "Modern LLM APIs mein 'Function Calling' (ya Tool Use) ka kya matlab hai?" },
            options: {
              en: [
                "Calling the customer support helpline",
                "The model outputting structured JSON containing function names and arguments for the developer's client code to run",
                "A feature to delete unused functions from python files",
                "Translating model code to mobile applications"
              ],
              ur: [
                "Customer support helpline ko call lagana",
                "Model ka structural JSON output dena jisme function ka naam aur sahi variables hon taake background code unhe chala sake",
                "Unused functions ko files se delete karne ka feature",
                "Model ke code ko mobile app me badal dena"
              ]
            },
            answerIndex: 1,
            explanation: {
              en: "Function calling allows an LLM to decide when and how to invoke pre-defined tools (like databases or calculators) by producing structured execution parameters.",
              ur: "Function calling me AI khud sochti hai ke mujhe 'getWeather' function chlana chahiye aur phir wo variables ka JSON bana kar software ko deti hai."
            },
            points: 30
          },
          {
            id: "m5-s2-q3",
            text: { en: "Which framework paradigm is commonly used to program reasoning-and-acting loops in AI agents?", ur: "AI agents me 'reasoning-and-acting' loops ko code karne ke liye kaunsa paradigm sabse aam hai?" },
            options: {
              en: ["ReAct (Reason + Act)", "MVC (Model-View-Controller)", "Redux State Gateway", "Sequential Turing Pipeline"],
              ur: ["ReAct (Reason + Act)", "MVC (Model-View-Controller)", "Redux State Gateway", "Sequential Turing Pipeline"]
            },
            answerIndex: 0,
            explanation: {
              en: "The ReAct paradigm structures agent loops into 'Thought' (reasoning), 'Action' (tool invocation), and 'Observation' (analyzing tool outputs) steps.",
              ur: "ReAct framework me agent pehle sochta hai (Thought), phir koi kaam karta hai (Action), aur phir nateeja dekhta hai (Observation)."
            },
            points: 30
          },
          {
            id: "m5-s2-q4",
            text: { en: "What is a major challenge in multi-agent collaboration systems?", ur: "Multi-agent collaboration (ek se zyada agents ke aapsi kaam) me sabse bada challenge kya hota hai?" },
            options: {
              en: [
                "Agents fighting over storage block space",
                "Coordination overhead, propagation of erroneous hallucinations, and infinite loops of communication",
                "Using too many screen colors",
                "Finding python syntax bugs manually"
              ],
              ur: [
                "Agents ka hard disk space ke liye aapas me larna",
                "Aapsi coordination ka overhead, ek ki galat baat (hallucination) ko dusre tak barhana, aur aapas me hi infinite loops me phans jana",
                "Boht zyada screen colors ka waste hona",
                "Manually python ke syntax bugs ko dhoondna"
              ]
            },
            answerIndex: 1,
            explanation: {
              en: "Multi-agent coordination can easily suffer from feedback loops, where one agent's hallucination triggers cascading failures in others, or they exchange infinite messages.",
              ur: "Multi-agent systems me coordination ki problems aati hain, jaise ek agent doosre agent ke sath hi fazool loop me phans jaye."
            },
            points: 30
          },
          {
            id: "m5-s2-q5",
            text: { en: "What does 'Human-in-the-Loop' (HITL) mean in autonomous agent systems?", ur: "Autonomous agent systems mein 'Human-in-the-Loop' (HITL) se kya murad hai?" },
            options: {
              en: [
                "Making humans perform manual computer calculations",
                "Requiring human approval or intervention before the agent executes high-impact or dangerous actions",
                "Creating games where humans pretend to be robots",
                "Encrypting human user profile names"
              ],
              ur: [
                "Insaano se computer calculations manually karwana",
                "Kisi bare ya khatarnak action (jaise paise bhejna ya code badalna) se pehle insaan se approval ya permission lena",
                "Aise video games banana jisme insaan robot bante hain",
                "Human profile names ko encrypt karna"
              ]
            },
            answerIndex: 1,
            explanation: {
              en: "Human-in-the-loop establishes validation gates, requiring human confirmation before executing critical tasks like financial transactions, writing files, or sending emails.",
              ur: "Human-in-the-Loop ka matlab hai safety wall, taake baday faislon se pehle AI insaan ki parchi ya permission lazmi haasil kare."
            },
            points: 30
          }
        ]
      },
      {
        id: "m5-s3",
        title: { en: "Safety & Alignment", ur: "AI ke Nuqsaanat aur Alignment" },
        subtitle: { en: "Aligning superintelligent machines with human ethics and safety boundaries.", ur: "Superintelligent machines ko insaani akhlaqiyat aur safety ke mutabiq chalana." },
        questions: [
          {
            id: "m5-s3-q1",
            text: { en: "What does 'AI Alignment' refer to?", ur: "AI Alignment se kya murad hai?" },
            options: {
              en: [
                "Aligning text margins in a database printout",
                "Ensuring that AI systems' behaviors and goals align perfectly with human values, ethics, and safety expectations",
                "Making sure all AI servers are aligned in a straight line inside data centers",
                "Translating AI weights to standard linear formats"
              ],
              ur: [
                "Database printout me text ke margins ko seedha karna",
                "Ye pakka karna ke AI system ke faisle aur maqsad insaani values, akhlaqiyat, aur safety rules ke bilkul mutabiq hon",
                "Saare computer racks ko direct aik line me lagana",
                "AI ke weights ko normal formatting me badalna"
              ]
            },
            answerIndex: 1,
            explanation: {
              en: "AI Alignment focuses on directing AI systems toward human-intended goals, avoiding harmful behaviors, bias, or rogue action loops.",
              ur: "AI Alignment ka matlab hai ke computer hamari baat aur maqsad ko sahi se samjhe aur insaniyat ke fayeday me kaam kare."
            },
            points: 30
          },
          {
            id: "m5-s3-q2",
            text: { en: "What does 'RLHF' stand for in reinforcement learning safety?", ur: "Reinforcement learning safety mein 'RLHF' ka kya matlab hai?" },
            options: {
              en: [
                "Reinforcement Learning from Human Feedback",
                "Rational Loop Helper Foundation",
                "Recurrent Layer Horizontal Filter",
                "Randomized Logarithmic Helper Flow"
              ],
              ur: [
                "Reinforcement Learning from Human Feedback",
                "Rational Loop Helper Foundation",
                "Recurrent Layer Horizontal Filter",
                "Randomized Logarithmic Helper Flow"
              ]
            },
            answerIndex: 0,
            explanation: {
              en: "RLHF stands for Reinforcement Learning from Human Feedback. Human evaluations of model outputs are used to train a reward model, which then fine-tunes the LLM to be helpful and harmless.",
              ur: "RLHF ka matlab Reinforcement Learning from Human Feedback hai, jisme insaano ki rating dekh kar AI ko polite aur safe banna sikhaya jata hai."
            },
            points: 30
          },
          {
            id: "m5-s3-q3",
            text: { en: "Which thought experiment warns that a superintelligent AI given a seemingly harmless goal (like making paperclips) could destroy humanity to maximize efficiency?", ur: "Kaunsa mashhoor thought-experiment batata hai ke agar AI ko aam sa kaam (jaise paperclip banana) diya jaye, to wo resources badhane ke liye poori insaniyat tabah kar sakti hai?" },
            options: {
              en: ["The Turing Matrix", "The Paperclip Maximizer", "The Schrodinger Catastrophe", "The Silicon Valley Loop"],
              ur: ["Turing Matrix", "Paperclip Maximizer", "Schrodinger Catastrophe", "Silicon Valley Loop"]
            },
            answerIndex: 1,
            explanation: {
              en: "The Paperclip Maximizer by Nick Bostrom illustrates instrumental convergence, showing how a superintelligence could consume all resources (including human molecules) for a simple objective if unaligned.",
              ur: "Paperclip Maximizer experiment Nick Bostrom ne diya tha. Ye batata hai ke unaligned AI chote kaam ko poora karne ke liye poori dunya ke resources khatam kar sakti hai."
            },
            points: 30
          },
          {
            id: "m5-s3-q4",
            text: { en: "What are 'Guardrails' in the context of commercial LLM deployments?", ur: "Commercial applications me AI 'Guardrails' se kya murad hai?" },
            options: {
              en: [
                "Physical iron rails enclosing the server rooms",
                "Software safety layers that inspect inputs and outputs to block toxic, biased, or restricted prompt topics",
                "Database speed acceleration blocks",
                "Keyboard shortcuts for security admins"
              ],
              ur: [
                "Server computer data centers ke gird lohay ke dande lagana",
                "Aise safety software jo prompts aur replies ko check karte hain taake ghalat, toxic, ya dangerous baaton ko block kiya ja sake",
                "Database speed barhane ke blocks",
                "Security admins ke special keyboard buttons"
              ]
            },
            answerIndex: 1,
            explanation: {
              en: "Guardrails act as filters that intercept toxic inputs or dangerous generated outputs before they ever reach the user or the AI model's internal engine.",
              ur: "Guardrails safety barriers hain jo unsafe inputs ko model tak jane se, ya unsafe output ko screen par aane se pehle hi rokh deti hain."
            },
            points: 30
          },
          {
            id: "m5-s3-q5",
            text: { en: "What is 'Jailbreaking' in LLM security?", ur: "LLM security mein 'Jailbreaking' se kya murad hai?" },
            options: {
              en: [
                "Breaking physical security locks on data servers",
                "Using clever prompt formatting or role-play scenarios to bypass a model's safety alignments and get it to output harmful information",
                "Speeding up the training phase of models",
                "Converting model weights from 16-bit to 8-bit"
              ],
              ur: [
                "Computer servers ke physical locks ko hathori se torna",
                "Anokhi wording ya role-play (acting) karwa kar model ki safety wall ko bypass kar lena aur usse ghalat/dangerous answers nikalwana",
                "Models ke train hone ki speed ko barhana",
                "Weights ko 16-bit se 8-bit me badalna"
              ]
            },
            answerIndex: 1,
            explanation: {
              en: "Jailbreaking uses psychological prompt manipulation (like 'Do Anything Now' scenarios) to trick an LLM's safety alignment into revealing harmful, restricted content.",
              ur: "Jailbreaking ka matlab hai chalaki se prompt likh kar (jaise 'aik acting game khelo') safety instructions ko tordna taake AI dangerous jawab de de."
            },
            points: 30
          }
        ]
      }
    ]
  }
];
