import React, { useState, createContext, useContext } from 'react';
import { supabaseWishlistService } from '../services/SupabaseWishlistService';
// Define the wishlist state type
type WishlistState = {
  currentQuestion: number;
  userName: string;
  mustHaveItems: string;
  niceToHaveItems: string;
  preposterousWishes: string;
  dreamSnacks: string;
  additionalComments: string;
};
// Define the context type
type WishlistContextType = {
  wishlistState: WishlistState;
  updateAnswer: (field: keyof WishlistState, value: string | string[]) => void;
  nextQuestion: () => void;
  submitForm: () => Promise<boolean>;
};
// Create context with default values
const WishlistContext = createContext<WishlistContextType>({
  wishlistState: {
    currentQuestion: 0,
    userName: '',
    mustHaveItems: '',
    niceToHaveItems: '',
    preposterousWishes: '',
    dreamSnacks: '',
    additionalComments: ''
  },
  updateAnswer: () => {},
  nextQuestion: () => {},
  submitForm: async () => false
});
// Context provider component
export const WishlistProvider: React.FC<{
  children: React.ReactNode;
}> = ({
  children
}) => {
  const [wishlistState, setWishlistState] = useState<WishlistState>({
    currentQuestion: 0,
    userName: '',
    mustHaveItems: '',
    niceToHaveItems: '',
    preposterousWishes: '',
    dreamSnacks: '',
    additionalComments: ''
  });
  // Update a specific field in the state
  const updateAnswer = (field: keyof WishlistState, value: string | string[]) => {
    console.log('updateAnswer called with field:', field, 'value:', value);
    return new Promise<void>((resolve) => {
      setWishlistState(prev => {
        const newState = {
          ...prev,
          [field]: value
        };
        console.log('new wishlistState:', newState);
        // Resolve after state update
        setTimeout(() => resolve(), 0);
        return newState;
      });
    });
  };
  // Move to the next question
  const nextQuestion = () => {
    setWishlistState(prev => ({
      ...prev,
      currentQuestion: prev.currentQuestion + 1
    }));
  };
  // Submit the form and save to Supabase
  const submitForm = async (): Promise<boolean> => {
    try {
      console.log('submitForm called with wishlistState:', wishlistState);
      // Create submission object for Supabase
      const submission = {
        user_name: wishlistState.userName,
        must_have_items: wishlistState.mustHaveItems,
        nice_to_have_items: wishlistState.niceToHaveItems,
        preposterous_wishes: wishlistState.preposterousWishes,
        dream_snacks: wishlistState.dreamSnacks,
        additional_comments: wishlistState.additionalComments
      };
      console.log('submission object:', submission);
      
      // Save to Supabase
      const result = await supabaseWishlistService.saveSubmission(submission);
      
      if (result) {
        console.log('Form submitted successfully to Supabase:', result);
        return true;
      } else {
        console.error('Failed to submit form to Supabase');
        return false;
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      return false;
    }
  };
  return <WishlistContext.Provider value={{
    wishlistState,
    updateAnswer,
    nextQuestion,
    submitForm
  }}>
      {children}
    </WishlistContext.Provider>;
};
// Custom hook to use the wishlist context
export const useWishlist = () => useContext(WishlistContext);