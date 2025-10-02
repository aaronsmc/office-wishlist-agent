import React from 'react';

// Vercel Blob service for reliable cross-device data storage
export class VercelStorageService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = '/api';
  }

  // Get all submissions from Vercel Blob
  async getAllSubmissions(): Promise<Array<{
    id: string;
    timestamp: number;
    userName: string;
    mustHaveItems: string;
    niceToHaveItems: string;
    preposterousWishes: string;
    snackPreferences: string[];
    additionalComments: string;
  }>> {
    try {
      const response = await fetch(`${this.baseUrl}/submissions`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data || [];
    } catch (error) {
      console.error('Error fetching from Vercel Blob:', error);
      // Fallback to localStorage
      return this.getFromLocalStorage();
    }
  }

  // Save a new submission to Vercel Blob
  async saveSubmission(submission: {
    userName: string;
    mustHaveItems: string;
    niceToHaveItems: string;
    preposterousWishes: string;
    snackPreferences: string[];
    additionalComments: string;
  }): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/submissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submission),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log('Successfully saved to Vercel Blob');
      return true;
    } catch (error) {
      console.error('Error saving to Vercel Blob:', error);
      // Fallback to localStorage
      return this.saveToLocalStorage(submission);
    }
  }

  // Delete a specific submission
  async deleteSubmission(id: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/submissions?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error('Error deleting from Vercel Blob:', error);
      // Fallback to localStorage
      return this.deleteFromLocalStorage(id);
    }
  }

  // Clear all submissions
  async clearAllSubmissions(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/submissions`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error('Error clearing Vercel Blob:', error);
      // Fallback to localStorage
      return this.clearLocalStorage();
    }
  }

  // Fallback methods using localStorage
  private saveToLocalStorage(submission: {
    userName: string;
    mustHaveItems: string;
    niceToHaveItems: string;
    preposterousWishes: string;
    snackPreferences: string[];
    additionalComments: string;
  }): boolean {
    try {
      const id = `submission_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const submissionWithId = {
        id,
        timestamp: Date.now(),
        ...submission
      };

      const existingSubmissions = this.getFromLocalStorage();
      existingSubmissions.push(submissionWithId);
      localStorage.setItem('wishlist_submissions', JSON.stringify(existingSubmissions));
      
      console.log('Saved to localStorage (fallback):', submissionWithId);
      return true;
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      return false;
    }
  }

  private getFromLocalStorage(): Array<{
    id: string;
    timestamp: number;
    userName: string;
    mustHaveItems: string;
    niceToHaveItems: string;
    preposterousWishes: string;
    snackPreferences: string[];
    additionalComments: string;
  }> {
    try {
      const submissionsJson = localStorage.getItem('wishlist_submissions');
      return submissionsJson ? JSON.parse(submissionsJson) : [];
    } catch (error) {
      console.error('Error retrieving from localStorage:', error);
      return [];
    }
  }

  private deleteFromLocalStorage(id: string): boolean {
    try {
      const submissions = this.getFromLocalStorage();
      const filteredSubmissions = submissions.filter(sub => sub.id !== id);
      localStorage.setItem('wishlist_submissions', JSON.stringify(filteredSubmissions));
      return true;
    } catch (error) {
      console.error('Error deleting from localStorage:', error);
      return false;
    }
  }

  private clearLocalStorage(): boolean {
    try {
      localStorage.setItem('wishlist_submissions', JSON.stringify([]));
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }
}

export const vercelStorageService = new VercelStorageService();
