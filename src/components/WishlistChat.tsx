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
  profilePic: "/images/profiles/aaron.jpg",
  notes: 'Always organized, keeps the team on track'
}, {
  name: 'Amy',
  role: 'Engineer',
  profilePic: "/images/profiles/amy.jpg",
  notes: 'Brilliant coder, solves complex problems'
}, {
  name: 'Julien',
  role: 'Cold Caller',
  profilePic: "/images/profiles/julien.jpg",
  notes: 'Amazing at building relationships with prospects',
  onNaughtyList: true // Julien is on the naughty list!
}, {
  name: 'Malini',
  role: 'Growth',
  profilePic: "/images/profiles/malini.jpg",
  notes: 'Creative marketing strategist'
}, {
  name: 'Joki',
  role: 'Account Executive',
  profilePic: "/images/profiles/joki.jpg",
  notes: 'Great at closing deals'
}, {
  name: 'Arun',
  role: 'CTO',
  profilePic: "/images/profiles/arun.jpg",
  notes: 'Technical visionary'
}, {
  name: 'Siddarth',
  role: 'Engineer',
  profilePic: "/images/profiles/siddarth.jpg",
  notes: 'Backend specialist'
}, {
  name: 'Maria',
  role: 'Technical Project & QA Manager',
  profilePic: "/images/profiles/maria.jpg",
  notes: 'Keeps projects on track and bug-free'
}, {
  name: 'Joshua',
  role: 'Engineer',
  profilePic: "/images/profiles/joshua.jpg",
  notes: 'Frontend expert'
}, {
  name: 'Stephen',
  role: 'Customer Success',
  profilePic: "/images/profiles/stephen.jpg",
  notes: 'Makes customers happy'
}, {
  name: 'Sergey',
  role: 'Engineer',
  profilePic: "/images/profiles/sergey.jpg",
  notes: 'Algorithm wizard'
}, {
  name: 'Ivan',
  role: 'Engineer',
  profilePic: "/images/profiles/ivan.jpg",
  notes: 'Infrastructure specialist'
}, {
  name: 'Jack',
  role: 'Engineer',
  profilePic: "/images/profiles/jack.jpg",
  notes: 'Full-stack developer'
}, {
  name: 'Anand',
  role: 'Engineer',
  profilePic: "/images/profiles/anand.jpg",
  notes: 'Data specialist'
}, {
  name: 'Kunal',
  role: 'CEO',
  profilePic: "/images/profiles/kunal.jpg",
  notes: 'Visionary leader'
}, {
  name: 'Ian',
  role: 'Growth',
  profilePic: "/images/profiles/ian.jpg",
  notes: 'Analytics expert'
}];
// The wishlist questions to ask
const wishlistQuestions = ["What are your 'must-have' items for the new office?", "What 'nice-to-have' items would improve your office experience?", "What 'preposterous' but fun wishes do you have for the new office? We won't take this one seriously...... Unless? 😉", 'Tell us your dream snack and drink preferences for the office kitchen!', 'Do you have anything else you would like to share?'];
// Fun reactions to user responses
const getReactionToMustHaves = (response: string) => {
  const lowerResponse = response.toLowerCase();
  if (lowerResponse.includes('coffee') || lowerResponse.includes('espresso')) {
    return "A coffee enthusiast! I'll make sure we don't cheap out on the coffee machine. ☕ Productivity depends on it!";
  }
  if (lowerResponse.includes('monitor') || lowerResponse.includes('screen')) {
    return 'Ah, a multi-monitor setup person! More screen real estate equals more productivity... or just more browser tabs open? 🖥️';
  }
  if (lowerResponse.includes('chair') || lowerResponse.includes('ergonomic')) {
    return 'Your back thanks you for prioritizing ergonomics! No one wants to sound like Rice Krispies when they stand up. Snap, crackle, pop! 🪑';
  }
  if (lowerResponse.includes('window') || lowerResponse.includes('natural light')) {
    return "Natural light enthusiast! Vitamin D and fewer vampire jokes - I'm noting this down. 🌞";
  }
  if (lowerResponse.includes('quiet') || lowerResponse.includes('noise')) {
    return "Peace and quiet, got it! I'll suggest soundproofing for when the sales team celebrates closing deals. 🤫";
  }
  if (lowerResponse.includes('plant') || lowerResponse.includes('green')) {
    return "Plants are great! They provide oxygen and someone to talk to when your code isn't working. 🌱";
  }
  if (lowerResponse.includes('desk') || lowerResponse.includes('standing desk')) {
    return "Standing desks! Great for your health and for dramatic 'I've solved it!' moments when you can stand up suddenly. 🧍";
  }
  return "Those are some solid must-haves! I'm taking notes faster than a startup burns through venture capital. 📝";
};
const getReactionToNiceToHaves = (response: string) => {
  const lowerResponse = response.toLowerCase();
  if (lowerResponse.includes('game') || lowerResponse.includes('ping pong') || lowerResponse.includes('foosball')) {
    return 'Games in the office! Perfect for team bonding and for asserting dominance over the marketing department. 🏓';
  }
  if (lowerResponse.includes('nap') || lowerResponse.includes('rest')) {
    return "Nap pods? I see you're a person of culture. 'It's not sleeping, it's compiling!' 😴";
  }
  if (lowerResponse.includes('gym') || lowerResponse.includes('fitness')) {
    return 'Office gym! Perfect for working out while mentally debugging that function you wrote earlier. 💪';
  }
  if (lowerResponse.includes('view') || lowerResponse.includes('rooftop')) {
    return 'A nice view would be amazing! Something better to stare at than a loading screen. 🏙️';
  }
  if (lowerResponse.includes('music') || lowerResponse.includes('sound system')) {
    return 'Office-wide sound system? Just prepare for the inevitable battles between the lo-fi hip-hop fans and the death metal enthusiasts. 🎵';
  }
  if (lowerResponse.includes('beer') || lowerResponse.includes('happy hour')) {
    return 'Office happy hours! Where the real team bonding happens and secrets accidentally slip out. 🍻';
  }
  return "These nice-to-haves would definitely level up the office experience! I'm adding them to the 'convince the CFO' list. ✨";
};
const getReactionToPreposterousWishes = (response: string) => {
  const lowerResponse = response.toLowerCase();
  if (lowerResponse.includes('slide') || lowerResponse.includes('fireman pole')) {
    return "A slide between floors?! That's both ridiculous and... actually pretty awesome. Wheeeee! 🛝";
  }
  if (lowerResponse.includes('pool') || lowerResponse.includes('hot tub')) {
    return "An office pool? 'I'm not late, I was doing my morning laps.' I love the creativity! 🏊";
  }
  if (lowerResponse.includes('pet') || lowerResponse.includes('dog') || lowerResponse.includes('cat')) {
    return 'Office pets! Great for morale, terrible for keeping food unattended on your desk. 🐕';
  }
  if (lowerResponse.includes('robot') || lowerResponse.includes('ai')) {
    return "Robot assistants? Hey now, don't try to replace me! Though I wouldn't mind a robot friend... 🤖";
  }
  if (lowerResponse.includes('helicopter') || lowerResponse.includes('private jet')) {
    return "Company helicopter? I'll add it to the list right after 'profitable business model'. 🚁";
  }
  if (lowerResponse.includes('nap') || lowerResponse.includes('sleep')) {
    return "Sleeping quarters? 'I'm not living at work, I'm working where I live!' Nice try! 😴";
  }
  return "Wow, that's gloriously preposterous! I'm secretly hoping the CEO sees this and says 'why not?' 🤣";
};
const getReactionToSnacks = (response: string) => {
  const lowerResponse = response.toLowerCase();
  if (lowerResponse.includes('chocolate') || lowerResponse.includes('candy')) {
    return 'Noted: sugar-based debugging fuel! The perfect companion for late-night coding sessions. 🍫';
  }
  if (lowerResponse.includes('fruit') || lowerResponse.includes('healthy')) {
    return 'Healthy snacks! Your body thanks you, even if your taste buds are filing a formal complaint. 🍎';
  }
  if (lowerResponse.includes('chips') || lowerResponse.includes('crisps')) {
    return "Chips - the official sound of open office spaces! *crunch crunch* 'Sorry, what was that important thing you said?' 🍟";
  }
  if (lowerResponse.includes('coffee') || lowerResponse.includes('espresso')) {
    return 'Premium coffee! Turning caffeine into code since... well, forever. ☕';
  }
  if (lowerResponse.includes('tea')) {
    return 'A tea connoisseur! Perfect for when you need to look contemplative while staring at a bug. 🍵';
  }
  if (lowerResponse.includes('soda') || lowerResponse.includes('coke') || lowerResponse.includes('pepsi')) {
    return "Soda stash noted! Nothing says 'I'm an adult' like a sugar rush at 3 PM. 🥤";
  }
  if (lowerResponse.includes('beer') || lowerResponse.includes('wine') || lowerResponse.includes('alcohol')) {
    return "Adult beverages! For when 'It works on my machine' needs to be celebrated or mourned. 🍻";
  }
  return 'Your snack preferences have been noted! The office kitchen shall be stocked accordingly. 🛒';
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
  const [currentStep, setCurrentStep] = useState(0); // 0: Name, 1-5: Wishlist questions, 6: Complete
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    userName: '',
    mustHaveItems: '',
    niceToHaveItems: '',
    preposterousWishes: '',
    snackPreferences: [] as string[],
    additionalComments: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  // State to track if user has identified themselves
  const [currentUser, setCurrentUser] = useState<{
    name: string;
    role: string;
    profilePic: string;
    isKnown: boolean;
    onNaughtyList?: boolean;
  } | null>(null);
  // Scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  };
  // Initialize chat
  useEffect(() => {
    setMessages([{
      id: uuidv4(),
      type: 'bot',
      text: "Hey there! 👋 I'm Arya, your friendly office wishlist collector. What's your name so I can check if you're on the nice or naughty list? Only those on the nice list get to add something to the office wishlist! 😉"
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
        // Must-have items
        return getReactionToMustHaves(answer);
      case 2:
        // Nice-to-have items
        return getReactionToNiceToHaves(answer);
      case 3:
        // Preposterous wishes
        return getReactionToPreposterousWishes(answer);
      case 4:
        // Snack preferences
        return getReactionToSnacks(answer);
      case 5:
        // Additional comments
        return getReactionToAdditionalComments(answer);
      default:
        return 'Thanks for sharing!';
    }
  };
  // Ask next question
  const askNextQuestion = () => {
    // Skip step 0 (name) since we already handled that
    if (currentStep >= 1 && currentStep <= 5) {
      const questionIndex = currentStep - 1;
      if (questionIndex < wishlistQuestions.length) {
        addBotMessage(wishlistQuestions[questionIndex]);
      }
    }
  };
  // Save response to form data
  const saveResponse = (response: string) => {
    const newFormData = {
      ...formData
    };
    // Map the current step to the corresponding form field
    switch (currentStep) {
      case 1:
        // Must-have items
        newFormData.mustHaveItems = response;
        break;
      case 2:
        // Nice-to-have items
        newFormData.niceToHaveItems = response;
        break;
      case 3:
        // Preposterous wishes
        newFormData.preposterousWishes = response;
        break;
      case 4:
        // Snack preferences
        // Split by commas and clean up
        newFormData.snackPreferences = response.split(',').map(item => item.trim()).filter(item => item.length > 0);
        break;
      case 5:
        // Additional comments
        newFormData.additionalComments = response;
        break;
    }
    setFormData(newFormData);
    updateAnswer(Object.keys(newFormData)[currentStep] as any, newFormData[Object.keys(newFormData)[currentStep] as keyof typeof newFormData]);
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
  const handleSubmit = () => {
    if (!input.trim()) return;
    // Add user message
    setMessages(prev => [...prev, {
      id: uuidv4(),
      type: 'user',
      text: input
    }]);
    const userInput = input;
    setInput('');
    // If the user is already identified as Julien (on the naughty list)
    if (currentUser?.onNaughtyList) {
      // Always respond with "WOMP WOMP" for any input from Julien
      addBotMessage('WOMP WOMP 😈');
      return;
    }
    // If we're at the name step
    if (currentStep === 0) {
      // Check if the input matches any employee name (case insensitive)
      const matchedEmployee = employees.find(emp => emp.name.toLowerCase() === userInput.toLowerCase());
      if (matchedEmployee) {
        // Found a known employee
        const isOnNaughtyList = matchedEmployee.name.toLowerCase() === 'julien';
        setCurrentUser({
          name: matchedEmployee.name,
          role: matchedEmployee.role,
          profilePic: matchedEmployee.profilePic,
          isKnown: true,
          onNaughtyList: isOnNaughtyList
        });
        // Update form data with the user name
        setFormData(prev => ({
          ...prev,
          userName: matchedEmployee.name
        }));
        updateAnswer('userName', matchedEmployee.name);
        // Special handling for Julien (naughty list)
        if (isOnNaughtyList) {
          setMessages(prev => [...prev, {
            id: uuidv4(),
            type: 'bot',
            text: `😱 OH NO! It's ${matchedEmployee.name}! I just checked my list twice and you're the ONLY ONE on the naughty list this year! I'm sorry, but you can't add anything to the office wishlist. Try being nicer to your colleagues next year! 🙅‍♂️`
          }]);
          // Add a follow-up message after a delay
          setTimeout(() => {
            setMessages(prev => [...prev, {
              id: uuidv4(),
              type: 'bot',
              text: "But go ahead, try to tell me what you want... I'll just respond with WOMP WOMP. 😈"
            }]);
          }, 2000);
          return;
        }
        // Personalized response for nice list people
        let personalizedGreeting = '';
        if (matchedEmployee.role.includes('Engineer')) {
          personalizedGreeting = `Ah, ${matchedEmployee.name}! Our awesome ${matchedEmployee.role}! 🖥️ Good news - you're on the nice list! Ready to talk office upgrades that don't involve debugging?`;
        } else if (matchedEmployee.role.includes('Manager')) {
          personalizedGreeting = `${matchedEmployee.name}! Our amazing ${matchedEmployee.role}! 📊 You made the nice list this year! Let's plan an office that makes your team actually want to come in on Mondays!`;
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
      // Move to next step (only if not Julien)
      if (!(matchedEmployee && matchedEmployee.name.toLowerCase() === 'julien')) {
        setCurrentStep(1);
        // Add the first question immediately after a short delay
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          setMessages(prev => [...prev, {
            id: uuidv4(),
            type: 'bot',
            text: wishlistQuestions[0]
          }]);
        }, 1000);
      }
      return;
    }
    // If we're in the wishlist questions (steps 1-5)
    if (currentStep >= 1 && currentStep <= 5) {
      // Save the response
      saveResponse(userInput);
      // Add a reactionary response to the user's answer
      const reaction = getReactionToAnswer(userInput, currentStep);
      addBotMessage(reaction);
      // Move to the next step
      setCurrentStep(prev => prev + 1);
      // If we have more questions, ask the next one
      if (currentStep < 5) {
        // Use the NEXT question index based on the updated step
        const nextQuestionIndex = currentStep; // This is now the next question index after incrementing
        if (nextQuestionIndex < wishlistQuestions.length) {
          setTimeout(() => {
            addBotMessage(wishlistQuestions[nextQuestionIndex]);
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
  return <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
      {/* Dashboard Button */}
      <div className="w-full max-w-2xl bg-gradient-to-r from-emerald-500 to-green-600 p-3 rounded-t-xl shadow-lg flex justify-center">
        <Link to="/dashboard" className="bg-white/20 hover:bg-white/30 text-white py-2 px-4 rounded-lg transition-colors duration-200 flex items-center shadow-sm">
          <ClipboardListIcon size={16} className="mr-2" />
          Go to Dashboard
        </Link>
      </div>
      <div className="w-full max-w-2xl bg-white rounded-b-xl shadow-lg overflow-hidden flex flex-col h-[80vh]">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white mr-3">
              A
            </div>
            <h1 className="text-xl font-semibold">Arya Office Wishlist</h1>
          </div>
          {currentUser && currentUser.isKnown && <div className={`flex items-center ${currentUser.onNaughtyList ? 'bg-red-500/30' : 'bg-white/10'} rounded-full px-3 py-1`}>
              <span className="mr-2 text-sm font-medium">
                {currentUser.name} {currentUser.onNaughtyList ? '😈' : '😇'}
              </span>
              {currentUser.profilePic && <img src={currentUser.profilePic} alt={currentUser.name} className={`w-7 h-7 rounded-full object-cover border-2 ${currentUser.onNaughtyList ? 'border-red-300/50' : 'border-white/30'}`} />}
            </div>}
        </div>
        {/* Chat area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-gray-100">
          {messages.map(message => <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-[fadeIn_0.3s_ease-out]`}>
              {message.type === 'bot' && <div className="w-8 h-8 mr-2 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center text-white text-xs shadow-md">
                  A
                </div>}
              <div className={`max-w-[80%] p-4 rounded-2xl ${message.type === 'user' ? 'bg-gradient-to-br from-emerald-500 to-green-600 text-white rounded-tr-none shadow-md' : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none shadow-md'}`}>
                <p className="text-sm whitespace-pre-wrap leading-relaxed">
                  {message.text}
                </p>
                {message.type === 'user' && currentUser && <div className="text-xs text-green-100 text-right mt-1 flex items-center justify-end">
                    <span>{currentUser.name} • just now</span>
                    {currentUser.profilePic && <img src={currentUser.profilePic} alt={currentUser.name} className="w-5 h-5 rounded-full object-cover ml-1 border border-white/30" />}
                  </div>}
              </div>
            </div>)}
          {isTyping && <div className="flex items-start animate-[fadeIn_0.3s_ease-out]">
              <div className="w-8 h-8 mr-2 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center text-white text-xs shadow-md">
                A
              </div>
              <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-md border border-gray-100">
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
        <div className="p-4 border-t border-gray-100 bg-white">
          <div className="flex space-x-2">
            <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyPress={e => {
            if (e.key === 'Enter' && input.trim()) {
              handleSubmit();
            }
          }} className="flex-1 rounded-full border border-gray-200 py-3 px-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm" placeholder="Type your message..." disabled={formSubmitted} />
            <button onClick={handleSubmit} className="bg-gradient-to-r from-emerald-500 to-green-600 text-white p-3 rounded-full shadow-md hover:shadow-lg hover:from-emerald-600 hover:to-green-700 transition-all disabled:opacity-50" disabled={!input.trim() || formSubmitted}>
              <SendIcon size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>;
}