import { supabase } from '../lib/supabase';

export interface WishlistSubmission {
  id: string;
  created_at: string;
  user_name: string;
  must_have_items: string;
  nice_to_have_items: string;
  preposterous_wishes: string;
  snack_preferences: string;
  additional_comments: string;
}

export interface WishlistSubmissionInput {
  user_name: string;
  must_have_items: string;
  nice_to_have_items: string;
  preposterous_wishes: string;
  snack_preferences: string;
  additional_comments: string;
}

export class SupabaseWishlistService {
  // Save a new wishlist submission to Supabase
  async saveSubmission(submission: WishlistSubmissionInput): Promise<WishlistSubmission | null> {
    try {
      const { data, error } = await supabase
        .from('wishlist_submissions')
        .insert([submission])
        .select()
        .single();

      if (error) {
        console.error('Error saving submission to Supabase:', error);
        return null;
      }

      console.log('Submission saved successfully:', data);
      return data;
    } catch (error) {
      console.error('Error saving submission:', error);
      return null;
    }
  }

  // Get all wishlist submissions from Supabase
  async getAllSubmissions(): Promise<WishlistSubmission[]> {
    try {
      const { data, error } = await supabase
        .from('wishlist_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching submissions from Supabase:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching submissions:', error);
      return [];
    }
  }

  // Get submissions by user name
  async getSubmissionsByUser(userName: string): Promise<WishlistSubmission[]> {
    try {
      const { data, error } = await supabase
        .from('wishlist_submissions')
        .select('*')
        .eq('user_name', userName)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user submissions from Supabase:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching user submissions:', error);
      return [];
    }
  }

  // Delete a specific submission by ID
  async deleteSubmissionById(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('wishlist_submissions')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting submission from Supabase:', error);
        return false;
      }

      console.log('Submission deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting submission:', error);
      return false;
    }
  }

  // Update a specific submission by ID
  async updateSubmission(id: string, updates: Partial<WishlistSubmissionInput>): Promise<WishlistSubmission | null> {
    try {
      const { data, error } = await supabase
        .from('wishlist_submissions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating submission in Supabase:', error);
        return null;
      }

      console.log('Submission updated successfully:', data);
      return data;
    } catch (error) {
      console.error('Error updating submission:', error);
      return null;
    }
  }

  // Clear all submissions (use with caution!)
  async clearAllSubmissions(): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('wishlist_submissions')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all records

      if (error) {
        console.error('Error clearing all submissions from Supabase:', error);
        return false;
      }

      console.log('All submissions cleared successfully');
      return true;
    } catch (error) {
      console.error('Error clearing all submissions:', error);
      return false;
    }
  }
}

export const supabaseWishlistService = new SupabaseWishlistService();
