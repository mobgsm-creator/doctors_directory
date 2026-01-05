"use client";

import { useEffect } from 'react';

export function ClientSideSearch() {
  useEffect(() => {
    const searchInput = document.querySelector('input[placeholder*="searching"]') as HTMLInputElement;
    const searchButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
    const searchForm = document.querySelector('form') as HTMLFormElement;
    const treatmentCards = document.querySelectorAll('[data-treatment-card]');

    if (!searchInput || !searchButton || !treatmentCards.length) return;

    const handleSearch = () => {
      const query = searchInput.value.toLowerCase();
      
      treatmentCards.forEach((card) => {
        const treatmentName = card.getAttribute('data-treatment-name')?.toLowerCase() || '';
        const cardElement = card as HTMLElement;
        
        if (query === '' || treatmentName.includes(query)) {
          cardElement.style.display = '';
        } else {
          cardElement.style.display = 'none';
        }
      });
    };

    const handleFormSubmit = (e: Event) => {
      e.preventDefault();
      handleSearch();
    };

    searchButton.addEventListener('click', handleSearch);
    searchForm?.addEventListener('submit', handleFormSubmit);

    return () => {
      searchButton.removeEventListener('click', handleSearch);
      searchForm?.removeEventListener('submit', handleFormSubmit);
    };
  }, []);

  return null;
}