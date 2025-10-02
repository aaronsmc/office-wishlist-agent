import React from 'react';

// Airtable service for reliable cross-device data storage
export class AirtableService {
  private baseId: string;
  private apiKey: string;
  private tableName: string;

  constructor() {
    // Airtable configuration
    this.baseId = 'appYourBaseId';
    this.apiKey = 'keyYourApiKey';
    this.tableName = 'WishlistSubmissions';
  }

  // Get all submissions from Airtable
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
      const response = await fetch(`https://api.airtable.com/v0/${this.baseId}/${this.tableName}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.records.map((record: any) => ({
        id: record.id,
        timestamp: new Date(record.createdTime).getTime(),
        userName: record.fields.userName || '',
        mustHaveItems: record.fields.mustHaveItems || '',
        niceToHaveItems: record.fields.niceToHaveItems || '',
        preposterousWishes: record.fields.preposterousWishes || '',
        snackPreferences: record.fields.snackPreferences || [],
        additionalComments: record.fields.additionalComments || '',
      }));
    } catch (error) {
      console.error('Error fetching from Airtable:', error);
      // Fallback to localStorage
      return this.getFromLocalStorage();
    }
  }

  // Save a new submission to Airtable
  async saveSubmission(submission: {
    userName: string;
    mustHaveItems: string;
    niceToHaveItems: string;
    preposterousWishes: string;
    snackPreferences: string[];
    additionalComments: string;
  }): Promise<boolean> {
    try {
      const response = await fetch(`https://api.airtable.com/v0/${this.baseId}/${this.tableName}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fields: {
            userName: submission.userName,
            mustHaveItems: submission.mustHaveItems,
            niceToHaveItems: submission.niceToHaveItems,
            preposterousWishes: submission.preposterousWishes,
            snackPreferences: submission.snackPreferences.join(', '),
            additionalComments: submission.additionalComments,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log('Successfully saved to Airtable');
      return true;
    } catch (error) {
      console.error('Error saving to Airtable:', error);
      // Fallback to localStorage
      return this.saveToLocalStorage(submission);
    }
  }

  // Delete a specific submission
  async deleteSubmission(id: string): Promise<boolean> {
    try {
      const response = await fetch(`https://api.airtable.com/v0/${this.baseId}/${this.tableName}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error('Error deleting from Airtable:', error);
      // Fallback to localStorage
      return this.deleteFromLocalStorage(id);
    }
  }

  // Clear all submissions
  async clearAllSubmissions(): Promise<boolean> {
    try {
      // Get all records first
      const submissions = await this.getAllSubmissions();
      
      // Delete each record
      for (const submission of submissions) {
        await this.deleteSubmission(submission.id);
      }

      return true;
    } catch (error) {
      console.error('Error clearing Airtable:', error);
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

export const airtableService = new AirtableService();
