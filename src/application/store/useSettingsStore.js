import { create } from 'zustand';

export const useSettingsStore = create((set) => {
    // Initial load from localStorage
    const savedTheme = localStorage.getItem('theme') || 'dark';
    const savedLang = localStorage.getItem('lang') || 'en';

    // Apply initial attributes to DOM
    document.documentElement.setAttribute('data-theme', savedTheme);
    document.documentElement.setAttribute('dir', savedLang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', savedLang);

    return {
        theme: savedTheme,
        lang: savedLang,
        
        toggleTheme: () => set((state) => {
            const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
            localStorage.setItem('theme', nextTheme);
            document.documentElement.setAttribute('data-theme', nextTheme);
            return { theme: nextTheme };
        }),

        setLang: (lang) => set(() => {
            localStorage.setItem('lang', lang);
            document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
            document.documentElement.setAttribute('lang', lang);
            return { lang };
        })
    };
});
