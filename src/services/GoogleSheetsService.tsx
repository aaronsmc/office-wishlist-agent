import React from 'react';
import axios from 'axios';
// Google Sheets submission service
export class GoogleSheetsService {
  // This will be the URL to your Google Apps Script web app
  private scriptUrl = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL';
  // Submit the form data to Google Sheets
  async submitForm(formData: {
    userName: string;
    mustHaveItems: string;
    niceToHaveItems: string;
    preposterousWishes: string;
    snackPreferences: string | string[];
    additionalComments: string;
  }): Promise<boolean> {
    try {
      console.log('Submitting data to Google Sheets:', formData);
      // Convert array to string if needed
      const processedData = {
        ...formData,
        snackPreferences: Array.isArray(formData.snackPreferences) ? formData.snackPreferences.join(', ') : formData.snackPreferences
      };
      // Use fetch with CORS mode enabled
      const response = await fetch(this.scriptUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(processedData),
        mode: 'cors'
      });
      const result = await response.json();
      console.log('Google Sheets response:', result);
      return result.success || false;
    } catch (error) {
      console.error('Error submitting to Google Sheets:', error);
      // For development, simulate success
      if (process.env.NODE_ENV !== 'production') {
        return this.simulateSubmission(formData);
      }
      return false;
    }
  }
  // Simulate submission for development
  private simulateSubmission(formData: any): Promise<boolean> {
    return new Promise(resolve => {
      console.log('SIMULATION: Data that would be submitted to sheets:', formData);
      setTimeout(() => resolve(true), 1500);
    });
  }
}
export const googleSheetsService = new GoogleSheetsService();