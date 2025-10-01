import React from 'react';

// API service for communicating with the backend
export class ApiService {
  private baseUrl: string;

  constructor() {
    // Use environment variable or default to Vercel API routes
    this.baseUrl = import.meta.env.VITE_API_URL || '/api';
  }

  // Get all submissions from the server
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
      return await response.json();
    } catch (error) {
      console.error('Error fetching submissions from API, falling back to localStorage:', error);
      // Fallback to localStorage when API is not available
      return this.getAllSubmissionsFromLocalStorage();
    }
  }

  // Save a new submission to the server
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

      const result = await response.json();
      return result.success || false;
    } catch (error) {
      console.error('Error saving submission to API, falling back to localStorage:', error);
      // Fallback to localStorage when API is not available
      return this.saveToLocalStorage(submission);
    }
  }

  // Fallback method to save to localStorage
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

      const existingSubmissions = this.getAllSubmissionsFromLocalStorage();
      existingSubmissions.push(submissionWithId);
      localStorage.setItem('wishlist_submissions', JSON.stringify(existingSubmissions));
      
      console.log('Saved to localStorage:', submissionWithId);
      return true;
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      return false;
    }
  }

  // Get all submissions from localStorage
  getAllSubmissionsFromLocalStorage(): Array<{
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
      console.error('Error retrieving submissions from localStorage:', error);
      return [];
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

      const result = await response.json();
      return result.success || false;
    } catch (error) {
      console.error('Error deleting submission:', error);
      return false;
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

      const result = await response.json();
      return result.success || false;
    } catch (error) {
      console.error('Error clearing submissions:', error);
      return false;
    }
  }

  // Check if the API is available
  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      return response.ok;
    } catch (error) {
      console.error('API health check failed:', error);
      return false;
    }
  }
}

export const apiService = new ApiService();
