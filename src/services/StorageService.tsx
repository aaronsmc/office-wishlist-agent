import React from 'react';
// Local storage service for storing and retrieving wishlist submissions
export class StorageService {
  private readonly STORAGE_KEY = 'wishlist_submissions';
  // Save a new submission to localStorage
  saveSubmission(submission: {
    id: string;
    timestamp: number;
    userName: string;
    mustHaveItems: string;
    niceToHaveItems: string;
    preposterousWishes: string;
    snackPreferences: string[];
    additionalComments: string;
  }): void {
    try {
      // Get existing submissions
      const existingSubmissions = this.getAllSubmissions();
      // Add the new submission
      existingSubmissions.push(submission);
      // Save back to localStorage
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(existingSubmissions));
      // Also save to sessionStorage for more persistence options
      try {
        sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(existingSubmissions));
      } catch (sessionError) {
        console.warn('Could not save to session storage:', sessionError);
      }
    } catch (error) {
      console.error('Error saving submission:', error);
    }
  }
  // Get all submissions from localStorage with fallback to sessionStorage
  getAllSubmissions(): Array<{
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
      // Try localStorage first
      const submissionsJson = localStorage.getItem(this.STORAGE_KEY);
      if (submissionsJson) {
        return JSON.parse(submissionsJson);
      }
      // If localStorage is empty, try sessionStorage as fallback
      const sessionSubmissionsJson = sessionStorage.getItem(this.STORAGE_KEY);
      return sessionSubmissionsJson ? JSON.parse(sessionSubmissionsJson) : [];
    } catch (error) {
      console.error('Error retrieving submissions:', error);
      return [];
    }
  }
  // Clear all submissions
  clearAllSubmissions(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      sessionStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing submissions:', error);
    }
  }
  // Delete a specific submission by ID
  deleteSubmissionById(id: string): boolean {
    try {
      const submissions = this.getAllSubmissions();
      const filteredSubmissions = submissions.filter(sub => sub.id !== id);
      if (filteredSubmissions.length < submissions.length) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredSubmissions));
        // Also update sessionStorage
        try {
          sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredSubmissions));
        } catch (sessionError) {
          console.warn('Could not update session storage:', sessionError);
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting submission:', error);
      return false;
    }
  }
}
export const storageService = new StorageService();