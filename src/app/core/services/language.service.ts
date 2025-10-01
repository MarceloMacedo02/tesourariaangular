import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private currentLanguageSubject = new BehaviorSubject<string>('en');
  public currentLanguage$ = this.currentLanguageSubject.asObservable();

  private supportedLanguages = ['en', 'pt', 'es', 'fr', 'de', 'it', 'ja', 'zh', 'ar']; // Add more as needed

  constructor() {
    // Initialize with browser language or default to 'en'
    const browserLang = this.getBrowserLanguage();
    this.setLanguage(browserLang);
  }

  /**
   * Get browser language
   */
  private getBrowserLanguage(): string {
    if (typeof window !== 'undefined' && window.navigator) {
      const browserLang = window.navigator.language.substring(0, 2);
      return this.supportedLanguages.includes(browserLang) ? browserLang : 'en';
    }
    return 'en';
  }

  /**
   * Set language
   */
  setLanguage(lang: string): void {
    // Validate if language is supported
    if (!this.supportedLanguages.includes(lang)) {
      console.warn(`Language ${lang} is not supported. Falling back to 'en'.`);
      lang = 'en';
    }

    // Update the current language
    this.currentLanguageSubject.next(lang);

    // Optionally, store language preference in localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('selectedLanguage', lang);
    }

    // You can also load the appropriate translations here if needed
    this.loadTranslations(lang);
  }

  /**
   * Get current language
   */
  getCurrentLanguage(): string {
    return this.currentLanguageSubject.value;
  }

  /**
   * Get supported languages
   */
  getSupportedLanguages(): string[] {
    return [...this.supportedLanguages];
  }

  /**
   * Load translations for a specific language
   */
  private loadTranslations(lang: string): void {
    // In a real application, you would load translation files here
    // For example, using HttpClient to load JSON translation files
    console.log(`Loading translations for language: ${lang}`);
  }

  /**
   * Get browser language preference
   */
  getBrowserLanguagePreference(): string {
    return this.getBrowserLanguage();
  }

  /**
   * Check if language is supported
   */
  isLanguageSupported(lang: string): boolean {
    return this.supportedLanguages.includes(lang);
  }
}