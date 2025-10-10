import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { SendIcon, SparklesIcon, CheckCircleIcon, ChevronRightIcon, StarIcon, BarChartIcon, HeartIcon, ShoppingCartIcon, ClipboardListIcon, BriefcaseIcon } from 'lucide-react';
import { useWishlist } from './WishlistContext';
import { useTheme } from './ThemeContext';
import { storageService } from '../services/StorageService';
import { AnimatedLogo } from './AnimatedLogo';
// Types for our chat messages
type MessageType = 'user' | 'bot';
interface Message {
  id: string;
  type: MessageType;
  text: string;
}
// Employee data with roles and profile pictures (when available)
const employees = [{
  name: 'Aaron',
  role: 'Product Manager',
  profilePic: "/aaron.jpg",
  notes: 'Always organized, keeps the team on track'
}, {
  name: 'Amy',
  role: 'Engineer',
  profilePic: "/amy.jpg",
  notes: 'Brilliant coder, solves complex problems'
}, {
  name: 'Julien',
  role: 'Growth Expert',
  profilePic: "/julien.jpg",
  notes: 'Amazing at building relationships with prospects'
}, {
  name: 'Malini',
  role: 'Growth Expert',
  profilePic: "/malini.jpg",
  notes: 'Creative marketing strategist'
}, {
  name: 'Joki',
  role: 'Account Executive',
  profilePic: "/joki.jpg",
  notes: 'Great at closing deals'
}, {
  name: 'Arun',
  role: 'CTO',
  profilePic: "/arun.jpg",
  notes: 'Technical visionary'
}, {
  name: 'Siddarth',
  role: 'Engineer',
  profilePic: "/siddarth.jpg",
  notes: 'Backend specialist'
}, {
  name: 'Maria',
  role: 'Technical Project & QA Manager',
  profilePic: "/maria.jpg",
  notes: 'Keeps projects on track and bug-free'
}, {
  name: 'Joshua',
  role: 'Engineer',
  profilePic: "/joshua.jpg",
  notes: 'Frontend expert'
}, {
  name: 'Stephen',
  role: 'Customer Success Expert',
  profilePic: "/stephen.jpg",
  notes: 'Makes customers happy'
}, {
  name: 'Sergey',
  role: 'Engineer',
  profilePic: "/sergey.jpg",
  notes: 'Algorithm wizard'
}, {
  name: 'Ivan',
  role: 'Growth Expert',
  profilePic: "/ivan.jpg",
  notes: 'Infrastructure specialist'
}, {
  name: 'Jack',
  role: 'Engineer',
  profilePic: "/jack.jpg",
  notes: 'Full-stack developer'
}, {
  name: 'Anand',
  role: 'Engineer',
  profilePic: "/anand.jpg",
  notes: 'Data specialist'
}, {
  name: 'Kunal',
  role: 'CEO',
  profilePic: "/kunal.jpg",
  notes: 'Visionary leader'
}, {
  name: 'Ian',
  role: 'Growth',
  profilePic: "/ian.jpg",
  notes: 'Analytics expert'
}, {
  name: 'Alexandria',
  role: 'BDR',
  profilePic: "/alexandria.jpg",
  notes: 'Newest BDR hire, building relationships with prospects'
}];
// The wishlist questions to ask with variations
const wishlistQuestions = [
  // Must-have questions (including snacks)
  [
    "What are your 'must-have' items for the new office? (include your favourite snacks)",
    "What are the absolute essentials you need in the new office? (including snacks)",
    "What items are non-negotiable for your office setup? (don't forget snacks!)",
    "What are your deal-breaker items for the new office? (snacks included)",
    "What office items can you absolutely not live without? (especially snacks!)"
  ],
  // Nice-to-have questions
  [
    "What 'nice-to-have' items would improve your office experience?",
    "What would make your office life even better?",
    "What luxury items would you love to have in the office?",
    "What would be the cherry on top for your office setup?",
    "What items would make you go 'wow, this office is amazing!'?"
  ],
  // Preposterous wishes questions
  [
    "What 'preposterous' but fun wishes do you have for the new office? We won't take this one seriously...... Unless? 😉",
    "What completely ridiculous but awesome ideas do you have for the office? Dream big! 🚀",
    "What wild, over-the-top office features would make you laugh but secretly love?",
    "What crazy office ideas do you have? No idea is too outlandish! 🤪",
    "What would make the office absolutely legendary? Think outside the box! 💡"
  ],
  // Excitement question
  [
    "Are you excited for the new office?",
    "How excited are you about the new office?",
    "What's your excitement level for the new office?",
    "Are you looking forward to the new office?",
    "How pumped are you for the new office?"
  ]
];
// Fun reactions to user responses
const getReactionToMustHaves = (response: string) => {
  const lowerResponse = response.toLowerCase();
  if (lowerResponse.includes('coffee') || lowerResponse.includes('espresso') || lowerResponse.includes('caffeine')) {
    const coffeeReactions = [
      "A coffee enthusiast! I'll make sure we don't cheap out on the coffee machine. ☕ Productivity depends on it!",
      "Coffee! The lifeblood of any productive office. I'll ensure we get the good stuff, not that instant powder! ☕",
      "Caffeine connoisseur! Nothing says 'I'm ready to tackle the day' like a perfectly brewed cup! ☕",
      "Coffee lover! I'll make sure we have premium beans, not that office sludge that tastes like regret! ☕"
    ];
    return coffeeReactions[Math.floor(Math.random() * coffeeReactions.length)];
  }
  if (lowerResponse.includes('monitor') || lowerResponse.includes('screen') || lowerResponse.includes('display')) {
    const monitorReactions = [
      'Ah, a multi-monitor setup person! More screen real estate equals more productivity... or just more browser tabs open? 🖥️',
      'Multiple monitors! Because one screen is for work, the other is for... "research"! 🖥️',
      'Screen real estate enthusiast! Nothing says "I mean business" like having 47 tabs open across 3 monitors! 🖥️',
      'Monitor setup! The more screens, the more productive you look, even if you\'re just watching cat videos! 🖥️'
    ];
    return monitorReactions[Math.floor(Math.random() * monitorReactions.length)];
  }
  if (lowerResponse.includes('chair') || lowerResponse.includes('ergonomic') || lowerResponse.includes('comfortable')) {
    return 'Your back thanks you for prioritizing ergonomics! No one wants to sound like Rice Krispies when they stand up. Snap, crackle, pop! 🪑';
  }
  if (lowerResponse.includes('window') || lowerResponse.includes('natural light') || lowerResponse.includes('sunlight')) {
    return "Natural light enthusiast! Vitamin D and fewer vampire jokes - I'm noting this down. 🌞";
  }
  if (lowerResponse.includes('quiet') || lowerResponse.includes('noise') || lowerResponse.includes('silence')) {
    return "Peace and quiet, got it! I'll suggest soundproofing for when the sales team celebrates closing deals. 🤫";
  }
  if (lowerResponse.includes('plant') || lowerResponse.includes('green') || lowerResponse.includes('nature')) {
    return "Plants are great! They provide oxygen and someone to talk to when your code isn't working. 🌱";
  }
  if (lowerResponse.includes('desk') || lowerResponse.includes('standing desk') || lowerResponse.includes('workspace')) {
    return "Standing desks! Great for your health and for dramatic 'I've solved it!' moments when you can stand up suddenly. 🧍";
  }
  if (lowerResponse.includes('keyboard') || lowerResponse.includes('mouse') || lowerResponse.includes('peripherals')) {
    return "Good peripherals are essential! Can't have productivity without the right tools. ⌨️";
  }
  if (lowerResponse.includes('internet') || lowerResponse.includes('wifi') || lowerResponse.includes('connection')) {
    return "Fast internet is non-negotiable! Can't have those Zoom calls cutting out during important meetings. 📶";
  }
  if (lowerResponse.includes('storage') || lowerResponse.includes('space') || lowerResponse.includes('closet')) {
    return "Storage space is crucial! Gotta have somewhere to stash all those company swag items. 📦";
  }
  return "Those are some solid must-haves! I'm taking notes faster than a startup burns through venture capital. 📝";
};
const getReactionToNiceToHaves = (response: string) => {
  const lowerResponse = response.toLowerCase();
  if (lowerResponse.includes('game') || lowerResponse.includes('ping pong') || lowerResponse.includes('foosball') || lowerResponse.includes('pool')) {
    const gameReactions = [
      'Games in the office! Perfect for team bonding and for asserting dominance over the marketing department. 🏓',
      'Office games! Nothing says "we work hard and play hard" like a ping pong tournament during lunch! 🏓',
      'Game room! The perfect place to settle disputes and prove who\'s really the office champion! 🏓',
      'Recreational activities! Because sometimes you need to decompress with a friendly game of foosball! 🏓'
    ];
    return gameReactions[Math.floor(Math.random() * gameReactions.length)];
  }
  if (lowerResponse.includes('nap') || lowerResponse.includes('rest') || lowerResponse.includes('sleep')) {
    return "Nap pods? I see you're a person of culture. 'It's not sleeping, it's compiling!' 😴";
  }
  if (lowerResponse.includes('gym') || lowerResponse.includes('fitness') || lowerResponse.includes('workout')) {
    return 'Office gym! Perfect for working out while mentally debugging that function you wrote earlier. 💪';
  }
  if (lowerResponse.includes('view') || lowerResponse.includes('rooftop') || lowerResponse.includes('balcony')) {
    return 'A nice view would be amazing! Something better to stare at than a loading screen. 🏙️';
  }
  if (lowerResponse.includes('music') || lowerResponse.includes('sound system') || lowerResponse.includes('speakers')) {
    return 'Office-wide sound system? Just prepare for the inevitable battles between the lo-fi hip-hop fans and the death metal enthusiasts. 🎵';
  }
  if (lowerResponse.includes('beer') || lowerResponse.includes('happy hour') || lowerResponse.includes('bar')) {
    return 'Office happy hours! Where the real team bonding happens and secrets accidentally slip out. 🍻';
  }
  if (lowerResponse.includes('massage') || lowerResponse.includes('spa') || lowerResponse.includes('wellness')) {
    return "Office spa services! Nothing says 'we care about your wellbeing' like a massage during lunch break. 🧘";
  }
  if (lowerResponse.includes('library') || lowerResponse.includes('quiet room') || lowerResponse.includes('study')) {
    return "A quiet library space! Perfect for deep work and pretending you're in a fancy university. 📚";
  }
  if (lowerResponse.includes('kitchen') || lowerResponse.includes('cafe') || lowerResponse.includes('cafeteria')) {
    return "A proper office kitchen! Where the real magic happens - coffee, gossip, and the occasional microwave explosion. 🍳";
  }
  if (lowerResponse.includes('outdoor') || lowerResponse.includes('patio') || lowerResponse.includes('terrace')) {
    return "Outdoor workspace! Fresh air and vitamin D while you code. Just watch out for the pigeons! 🐦";
  }
  return "These nice-to-haves would definitely level up the office experience! I'm adding them to the 'convince the CFO' list. ✨";
};
const getReactionToPreposterousWishes = (response: string) => {
  const lowerResponse = response.toLowerCase();
  if (lowerResponse.includes('slide') || lowerResponse.includes('fireman pole') || lowerResponse.includes('spiral')) {
    return "A slide between floors?! That's both ridiculous and... actually pretty awesome. Wheeeee! 🛝";
  }
  if (lowerResponse.includes('pool') || lowerResponse.includes('hot tub') || lowerResponse.includes('swimming')) {
    return "An office pool? 'I'm not late, I was doing my morning laps.' I love the creativity! 🏊";
  }
  if (lowerResponse.includes('pet') || lowerResponse.includes('dog') || lowerResponse.includes('cat') || lowerResponse.includes('animal')) {
    return 'Office pets! Great for morale, terrible for keeping food unattended on your desk. 🐕';
  }
  if (lowerResponse.includes('robot') || lowerResponse.includes('ai') || lowerResponse.includes('automation')) {
    return "Robot assistants? Hey now, don't try to replace me! Though I wouldn't mind a robot friend... 🤖";
  }
  if (lowerResponse.includes('helicopter') || lowerResponse.includes('private jet') || lowerResponse.includes('aircraft')) {
    return "Company helicopter? I'll add it to the list right after 'profitable business model'. 🚁";
  }
  if (lowerResponse.includes('nap') || lowerResponse.includes('sleep') || lowerResponse.includes('bedroom')) {
    return "Sleeping quarters? 'I'm not living at work, I'm working where I live!' Nice try! 😴";
  }
  if (lowerResponse.includes('movie') || lowerResponse.includes('theater') || lowerResponse.includes('cinema')) {
    return "Office movie theater? Perfect for those 'team building' Netflix sessions during lunch! 🎬";
  }
  if (lowerResponse.includes('garden') || lowerResponse.includes('greenhouse') || lowerResponse.includes('rooftop')) {
    return "Office garden! Nothing like growing your own vegetables while debugging code. Farm-to-desk dining! 🌱";
  }
  if (lowerResponse.includes('arcade') || lowerResponse.includes('gaming') || lowerResponse.includes('console')) {
    return "Office arcade! Because nothing says 'productive work environment' like a Pac-Man machine in the break room! 🕹️";
  }
  if (lowerResponse.includes('ball pit') || lowerResponse.includes('playground') || lowerResponse.includes('jungle gym')) {
    return "Office ball pit! For when you need to think like a 5-year-old to solve complex problems! 🎪";
  }
  return "Wow, that's gloriously preposterous! I'm secretly hoping the CEO sees this and says 'why not?' 🤣";
};
const getReactionToSnacks = (response: string) => {
  const lowerResponse = response.toLowerCase();
  if (lowerResponse.includes('chocolate') || lowerResponse.includes('candy') || lowerResponse.includes('sweet')) {
    return 'Noted: sugar-based debugging fuel! The perfect companion for late-night coding sessions. 🍫';
  }
  if (lowerResponse.includes('fruit') || lowerResponse.includes('healthy') || lowerResponse.includes('organic')) {
    return 'Healthy snacks! Your body thanks you, even if your taste buds are filing a formal complaint. 🍎';
  }
  if (lowerResponse.includes('chips') || lowerResponse.includes('crisps') || lowerResponse.includes('salty')) {
    return "Chips - the official sound of open office spaces! *crunch crunch* 'Sorry, what was that important thing you said?' 🍟";
  }
  if (lowerResponse.includes('coffee') || lowerResponse.includes('espresso') || lowerResponse.includes('caffeine')) {
    return 'Premium coffee! Turning caffeine into code since... well, forever. ☕';
  }
  if (lowerResponse.includes('tea') || lowerResponse.includes('herbal')) {
    return 'A tea connoisseur! Perfect for when you need to look contemplative while staring at a bug. 🍵';
  }
  if (lowerResponse.includes('soda') || lowerResponse.includes('coke') || lowerResponse.includes('pepsi') || lowerResponse.includes('soft drink')) {
    return "Soda stash noted! Nothing says 'I'm an adult' like a sugar rush at 3 PM. 🥤";
  }
  if (lowerResponse.includes('beer') || lowerResponse.includes('wine') || lowerResponse.includes('alcohol')) {
    return "Adult beverages! For when 'It works on my machine' needs to be celebrated or mourned. 🍻";
  }
  if (lowerResponse.includes('nuts') || lowerResponse.includes('trail mix') || lowerResponse.includes('granola')) {
    return "Nuts and trail mix! Perfect for when you need to feel like you're hiking while debugging. 🥜";
  }
  if (lowerResponse.includes('yogurt') || lowerResponse.includes('smoothie') || lowerResponse.includes('protein')) {
    return "Protein snacks! For when you need to fuel your muscles while your brain does the heavy lifting. 💪";
  }
  if (lowerResponse.includes('ice cream') || lowerResponse.includes('frozen') || lowerResponse.includes('dessert')) {
    return "Ice cream! Because nothing says 'I'm stressed' like eating frozen dairy at 2 PM. 🍦";
  }
  return 'Your snack preferences have been noted! The office kitchen shall be stocked accordingly. 🛒';
};

// Reaction to excitement question
const getReactionToExcitement = (response: string) => {
  const lowerResponse = response.toLowerCase();
  if (lowerResponse.includes('yes') || lowerResponse.includes('excited') || lowerResponse.includes('pumped') || lowerResponse.includes('can\'t wait')) {
    return "That's the spirit! 🎉 I'm excited too! This new office is going to be amazing!";
  }
  if (lowerResponse.includes('no') || lowerResponse.includes('not') || lowerResponse.includes('meh')) {
    return "Aww, well I hope we can change your mind! The new office is going to be pretty awesome! 😊";
  }
  return "Great to hear your thoughts! The new office is going to be fantastic! 🚀";
};

// Handle off-topic conversations
const handleOffTopicResponse = (response: string, currentStep: number) => {
  const lowerResponse = response.toLowerCase();
  
  // Common off-topic responses
  const offTopicResponses = [
    "That's interesting! But let's get back to the office wishlist - I'm really curious about your thoughts on the new space! 😊",
    "I love chatting about that, but I'm on a mission to collect everyone's office wishes! Can you tell me about your office preferences? 🏢",
    "Fascinating topic! Though I'm here specifically to hear about your office wishlist ideas. What would make your workday better? 💭",
    "That sounds great! But I'm focused on gathering office wishlist items right now. What are your thoughts on the new office? 🤔",
    "Interesting point! I'm actually here to collect your office wishlist. What would you love to have in the new space? ✨"
  ];
  
  // Check for common off-topic patterns
  const isOffTopic = 
    lowerResponse.includes('how are you') ||
    lowerResponse.includes('what\'s up') ||
    lowerResponse.includes('how\'s it going') ||
    lowerResponse.includes('tell me about') ||
    lowerResponse.includes('what do you think about') ||
    lowerResponse.includes('i want to talk about') ||
    lowerResponse.includes('can we discuss') ||
    lowerResponse.includes('i have a question') ||
    lowerResponse.includes('do you know') ||
    lowerResponse.includes('what\'s your opinion') ||
    lowerResponse.includes('i\'m bored') ||
    lowerResponse.includes('this is boring') ||
    lowerResponse.includes('can we change the subject') ||
    (lowerResponse.length > 100 && !lowerResponse.includes('office') && !lowerResponse.includes('work') && !lowerResponse.includes('desk') && !lowerResponse.includes('chair'));
  
  if (isOffTopic) {
    return offTopicResponses[Math.floor(Math.random() * offTopicResponses.length)];
  }
  
  return null; // Not off-topic, continue with normal flow
};
const getReactionToAdditionalComments = (response: string) => {
  const lowerResponse = response.toLowerCase();
  if (lowerResponse.includes('thank') || lowerResponse.includes('thanks')) {
    return "You're very welcome! It's been fun chatting about office dreams that don't involve printer jams or awkward kitchen small talk.";
  }
  if (lowerResponse.includes('excited') || lowerResponse.includes('looking forward')) {
    return "Your excitement is contagious! I'm looking forward to seeing these ideas come to life too!";
  }
  if (lowerResponse.includes('joke') || lowerResponse.includes('funny')) {
    return "I aim to please! Who says office planning can't be fun? Not this AI!";
  }
  if (lowerResponse.length < 15) {
    return 'Short and sweet! Thanks for all your input today.';
  }
  return 'Thanks for sharing! Your feedback is like good code - valuable, appreciated, and definitely not getting lost in a backlog somewhere!';
};
export function WishlistChat() {
  const {
    theme
  } = useTheme();
  const {
    wishlistState,
    updateAnswer,
    nextQuestion,
    submitForm
  } = useWishlist();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [currentStep, setCurrentStep] = useState(0); // 0: Name, 1-4: Wishlist questions, 5: Complete
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    userName: '',
    mustHaveItems: '',
    niceToHaveItems: '',
    preposterousWishes: '',
    additionalComments: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  // State to track if user has identified themselves
  const [currentUser, setCurrentUser] = useState<{
    name: string;
    role: string;
    profilePic: string;
    isKnown: boolean;
  } | null>(null);
  // Scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  };
  // Initialize chat
  useEffect(() => {
    const introMessages = [
      "Hey there! 👋 I'm Mavi, your friendly office wishlist collector. Can you tell me your FIRST name so I can check if you're on the nice or naughty list? Only those on the nice list get to add something to the office wishlist! 😉",
      "Hello! 🎉 I'm Mavi, the office wishlist fairy! Can you tell me your FIRST name and I'll check if you're on the nice list. Nice list members get to add their dream office items! ✨",
      "Hi there! 👋 I'm Mavi, your office wishlist genie! Can you tell me your FIRST name? I need to verify you're on the nice list before we can add your wishes to the office dream list! 🧞‍♀️",
      "Greetings! 🎊 I'm Mavi, the keeper of the office wishlist! Can you tell me your FIRST name so I can confirm you're on the nice list. Only nice list members can contribute to our office wishlist! 📝",
      "Hey! 👋 I'm Mavi, your office wishlist curator! Can you tell me your FIRST name? I'll check if you're on the nice list - only nice people get to add items to our office wishlist! 😊"
    ];
    const randomIntro = introMessages[Math.floor(Math.random() * introMessages.length)];
    setMessages([{
      id: uuidv4(),
      type: 'bot',
      text: randomIntro
    }]);
  }, []);
  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  // Add bot message with typing effect
  const addBotMessage = (text: string) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: uuidv4(),
        type: 'bot',
        text
      }]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };
  // Get a personalized reaction based on user's answer and current step
  const getReactionToAnswer = (answer: string, step: number) => {
    switch (step) {
      case 1:
        // Must-have items (including snacks)
        return getReactionToMustHaves(answer);
      case 2:
        // Nice-to-have items
        return getReactionToNiceToHaves(answer);
      case 3:
        // Preposterous wishes
        return getReactionToPreposterousWishes(answer);
      case 4:
        // Excitement question
        return getReactionToExcitement(answer);
      default:
        return 'Thanks for sharing!';
    }
  };
  // Ask next question
  const askNextQuestion = () => {
    // Skip step 0 (name) since we already handled that
    if (currentStep >= 1 && currentStep <= 4) {
      const questionIndex = currentStep - 1;
      if (questionIndex < wishlistQuestions.length) {
        // Get random variation of the question
        const questionVariations = wishlistQuestions[questionIndex];
        const randomQuestion = questionVariations[Math.floor(Math.random() * questionVariations.length)];
        addBotMessage(randomQuestion);
      }
    }
  };
  // Save response to form data
  const saveResponse = async (response: string) => {
    console.log('saveResponse called with currentStep:', currentStep, 'response:', response);
    const newFormData = {
      ...formData
    };
    // Map the current step to the corresponding form field
    switch (currentStep) {
      case 1:
        // Must-have items (including snacks)
        newFormData.mustHaveItems = response;
        console.log('Saved to mustHaveItems:', response);
        break;
      case 2:
        // Nice-to-have items
        newFormData.niceToHaveItems = response;
        console.log('Saved to niceToHaveItems:', response);
        break;
      case 3:
        // Preposterous wishes
        newFormData.preposterousWishes = response;
        console.log('Saved to preposterousWishes:', response);
        break;
      case 4:
        // Excitement question (not saved, just for fun)
        console.log('Excitement response:', response);
        break;
    }
    setFormData(newFormData);
    
    // Map current step to the correct field name
    let fieldName: keyof typeof newFormData;
    switch (currentStep) {
      case 1:
        fieldName = 'mustHaveItems';
        break;
      case 2:
        fieldName = 'niceToHaveItems';
        break;
      case 3:
        fieldName = 'preposterousWishes';
        break;
      case 4:
        // Excitement question - don't save to context
        return;
      default:
        fieldName = 'additionalComments';
    }
    
    console.log('Calling updateAnswer with fieldName:', fieldName, 'value:', newFormData[fieldName]);
    await updateAnswer(fieldName, newFormData[fieldName]);
    console.log('State update completed');
  };
  // Submit the form to storage
  const saveToStorage = async () => {
    try {
      const result = await submitForm();
      return result;
    } catch (error) {
      console.error('Error submitting form:', error);
      return false;
    }
  };
  // Handle form submission
  const handleSubmit = async () => {
    if (!input.trim()) return;
    // Add user message
    setMessages(prev => [...prev, {
      id: uuidv4(),
      type: 'user',
      text: input
    }]);
    const userInput = input;
    setInput('');
    // If we're at the name step
    if (currentStep === 0) {
      // Check if the input matches any employee name (case insensitive)
      const matchedEmployee = employees.find(emp => 
        emp.name.toLowerCase() === userInput.toLowerCase() || 
        (emp.name === 'Siddarth' && userInput.toLowerCase() === 'sid') ||
        (emp.name === 'Alexandria' && (userInput.toLowerCase() === 'alex' || userInput.toLowerCase() === 'alexandria'))
      );
      if (matchedEmployee) {
        // Found a known employee
        setCurrentUser({
          name: matchedEmployee.name,
          role: matchedEmployee.role,
          profilePic: matchedEmployee.profilePic,
          isKnown: true
        });
        // Update form data with the user name
        setFormData(prev => ({
          ...prev,
          userName: matchedEmployee.name
        }));
        updateAnswer('userName', matchedEmployee.name);
        // Personalized response for nice list people
        let personalizedGreeting = '';
        if (matchedEmployee.role.includes('Engineer')) {
          personalizedGreeting = `Ah, ${matchedEmployee.name}! Our awesome ${matchedEmployee.role}! 🖥️ Good news - you're on the nice list! Ready to talk office upgrades that don't involve debugging?`;
        } else if (matchedEmployee.role.includes('Manager')) {
          personalizedGreeting = `${matchedEmployee.name}! Our amazing ${matchedEmployee.role}! 📊 You made the nice list this year! Let's plan an office that makes your team actually want to come in on Mondays!`;
        } else if (matchedEmployee.role.includes('BDR')) {
          personalizedGreeting = `${matchedEmployee.name}! Our newest ${matchedEmployee.role}! 🎯 Welcome to the team! You're on the nice list! Let's create an office space that helps you build amazing relationships with prospects!`;
        } else if (matchedEmployee.role.includes('Growth') || matchedEmployee.role.includes('Sales') || matchedEmployee.role.includes('Executive')) {
          personalizedGreeting = `${matchedEmployee.name}! Our rockstar ${matchedEmployee.role}! 🚀 You're definitely on the nice list! Let's design an office worthy of all those deals you close!`;
        } else if (matchedEmployee.role.includes('CTO') || matchedEmployee.role.includes('CEO')) {
          personalizedGreeting = `${matchedEmployee.name}! 👑 The boss has entered the chat! You're on the nice list (as if I'd dare put you on the naughty one)! I'll be sure to prioritize your wishlist items... for completely unbiased reasons, of course!`;
        } else {
          personalizedGreeting = `Ah, ${matchedEmployee.name}! Our brilliant ${matchedEmployee.role}! You're on the nice list! Great to see you here!`;
        }
        // Add this to messages immediately
        setMessages(prev => [...prev, {
          id: uuidv4(),
          type: 'bot',
          text: personalizedGreeting
        }]);
      } else {
        // Unknown user
        setCurrentUser({
          name: userInput,
          role: 'Unknown',
          profilePic: '',
          isKnown: false
        });
        // Update form data with the user name
        setFormData(prev => ({
          ...prev,
          userName: userInput
        }));
        updateAnswer('userName', userInput);
        // Generic response - add this to messages immediately
        setMessages(prev => [...prev, {
          id: uuidv4(),
          type: 'bot',
          text: `Nice to meet you, ${userInput}! 👋 I don't think we've met before, but I've checked my list and you're not on the naughty list! I'm excited to hear your office wishlist ideas! Let's get started with a few questions.`
        }]);
      }
      // Move to next step
      if (matchedEmployee) {
        setCurrentStep(1);
        // Add the first question immediately after a short delay
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          // Get random variation of the first question
          const firstQuestionVariations = wishlistQuestions[0];
          const randomFirstQuestion = firstQuestionVariations[Math.floor(Math.random() * firstQuestionVariations.length)];
          setMessages(prev => [...prev, {
            id: uuidv4(),
            type: 'bot',
            text: randomFirstQuestion
          }]);
        }, 1000);
      }
      return;
    }
    // If we're in the wishlist questions (steps 1-4)
    if (currentStep >= 1 && currentStep <= 4) {
      // Check for off-topic responses first
      const offTopicResponse = handleOffTopicResponse(userInput, currentStep);
      if (offTopicResponse) {
        addBotMessage(offTopicResponse);
        return; // Don't save the response or move to next step
      }
      
      // Save the response
      await saveResponse(userInput);
      // Add a reactionary response to the user's answer
      const reaction = getReactionToAnswer(userInput, currentStep);
      addBotMessage(reaction);
      // Move to the next step
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      
      // If we have more questions, ask the next one
      if (nextStep <= 4) {
        // Use the NEXT question index based on the updated step
        const nextQuestionIndex = nextStep - 1; // Convert step to question index
        if (nextQuestionIndex < wishlistQuestions.length) {
          setTimeout(() => {
            const questionVariations = wishlistQuestions[nextQuestionIndex];
            const randomQuestion = questionVariations[Math.floor(Math.random() * questionVariations.length)];
            addBotMessage(randomQuestion);
          }, 2000); // Add a delay before asking the next question
        }
      } else {
        // This was the last question, so we're done
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          // Submit the form
          saveToStorage().then(success => {
            if (success) {
              setFormSubmitted(true);
              setMessages(prev => [...prev, {
                id: uuidv4(),
                type: 'bot',
                text: `Woohoo! 🎉 Thanks so much for your input, ${formData.userName}! Your wishlist has been saved. I've forwarded it to our office planning team (and definitely not to Santa Claus). Check out the dashboard to see what your colleagues are wishing for too!`
              }]);
            } else {
              setMessages(prev => [...prev, {
                id: uuidv4(),
                type: 'bot',
                text: 'Oops! 😅 There was a glitch in the matrix when saving your wishlist. Either the servers are rebelling or someone spilled coffee on our database again. Please try again later!'
              }]);
            }
          });
        }, 1500);
      }
    }
  };
  return <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-slate-100 via-gray-50 to-emerald-50/30 p-2">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[90vh] sm:h-[85vh] border border-gray-100">
        {/* Header */}
        <div className="p-2 sm:p-3 bg-gradient-to-r from-emerald-500 via-emerald-600 to-green-700 text-white flex justify-between items-center shadow-lg">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-white/30 to-white/10 flex items-center justify-center text-white mr-2 shadow-md border border-white/20">
              M
            </div>
            <h1 className="text-lg font-semibold">Office Wishlist</h1>
          </div>
          <div className="flex items-center space-x-3">
            {currentUser && currentUser.isKnown && <div className="flex items-center bg-gradient-to-r from-white/20 to-white/10 rounded-full px-3 py-1 shadow-md border border-white/20">
                <span className="mr-2 text-xs font-medium">
                  {currentUser.name} 😇
                </span>
                {currentUser.profilePic && <img src={currentUser.profilePic} alt={currentUser.name} className="w-6 h-6 rounded-full object-cover border-2 border-white/30 shadow-sm" />}
              </div>}
            <Link to="/dashboard" className="bg-white/20 hover:bg-white/30 text-white py-2 px-4 rounded-lg transition-all duration-300 flex items-center shadow-md hover:shadow-lg border border-white/20 backdrop-blur-sm">
              <ClipboardListIcon size={16} className="mr-2" />
              Go to Dashboard
            </Link>
          </div>
        </div>
        {/* Chat area */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 bg-gradient-to-br from-slate-50 via-gray-50 to-emerald-50/30">
          {messages.map(message => <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-[fadeIn_0.3s_ease-out]`}>
              {message.type === 'bot' && <div className="w-8 h-8 sm:w-10 sm:h-10 mr-2 rounded-full bg-gradient-to-br from-emerald-400 via-emerald-500 to-green-600 flex items-center justify-center text-white text-xs shadow-lg flex-shrink-0 border border-emerald-300/20">
                  M
                </div>}
              <div className={`max-w-[85%] sm:max-w-[80%] p-3 sm:p-4 rounded-2xl ${message.type === 'user' ? 'bg-gradient-to-br from-emerald-500 via-emerald-600 to-green-700 text-white rounded-tr-none shadow-lg border border-emerald-400/20' : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none shadow-lg'}`}>
                <p className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">
                  {message.text}
                </p>
                {message.type === 'user' && currentUser && <div className="text-xs text-green-100 text-right mt-1 flex items-center justify-end">
                    <span>{currentUser.name} • just now</span>
                    {currentUser.profilePic && <img src={currentUser.profilePic} alt={currentUser.name} className="w-5 h-5 rounded-full object-cover ml-1 border border-white/30" />}
                  </div>}
              </div>
            </div>)}
          {isTyping && <div className="flex items-start animate-[fadeIn_0.3s_ease-out]">
              <div className="w-10 h-10 mr-2 rounded-full bg-gradient-to-br from-emerald-400 via-emerald-500 to-green-600 flex items-center justify-center text-white text-xs shadow-lg border border-emerald-300/20">
                M
              </div>
              <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-lg border border-gray-200">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{
                animationDelay: '0s'
              }}></div>
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{
                animationDelay: '0.2s'
              }}></div>
                  <div className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce" style={{
                animationDelay: '0.4s'
              }}></div>
                </div>
              </div>
            </div>}
          {formSubmitted && <div className="flex justify-center mt-6 animate-[fadeIn_0.5s_ease-out]">
              <Link to="/dashboard" className="bg-gradient-to-r from-emerald-500 to-green-600 text-white py-3 px-6 rounded-full shadow-md hover:shadow-lg hover:from-emerald-600 hover:to-green-700 transition-all flex items-center">
                <ClipboardListIcon size={18} className="mr-2" />
                View Dashboard
              </Link>
            </div>}
          <div ref={messagesEndRef} />
        </div>
        {/* Input area */}
        <div className="p-3 sm:p-4 border-t border-gray-200 bg-gradient-to-r from-white to-gray-50/50 shadow-lg">
          <div className="flex space-x-2">
            <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyPress={e => {
            if (e.key === 'Enter' && input.trim()) {
              handleSubmit();
            }
          }} className="flex-1 rounded-full border border-gray-300 py-2 sm:py-3 px-3 sm:px-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-md text-sm sm:text-base bg-white/90 backdrop-blur-sm" placeholder="Type your message..." disabled={formSubmitted} />
            <button onClick={handleSubmit} className="bg-gradient-to-r from-emerald-500 via-emerald-600 to-green-700 text-white p-2 sm:p-3 rounded-full shadow-lg hover:shadow-xl hover:from-emerald-600 hover:via-emerald-700 hover:to-green-800 transition-all duration-300 disabled:opacity-50 flex-shrink-0 border border-emerald-400/20" disabled={!input.trim() || formSubmitted}>
              <SendIcon size={18} className="sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>;
}