import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";
import { Appearance } from "react-native";

type Theme = 'light' | 'dark';

type ThemeContextType = {
    theme: Theme;
    toggleTheme: () => void;
    isDark: boolean;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error("useTheme debe ser utilizado dentro de ThemeProvider")
    return context;
}

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [theme, setTheme] = useState<Theme>('light');

    useEffect(() => {
        const loadTheme = async () => {
            try {
                const storedTheme = await AsyncStorage.getItem('premier-motors-theme');
                if (storedTheme === 'light' || storedTheme === 'dark') {
                    setTheme(storedTheme);
                } else {
                    const systemTheme = Appearance.getColorScheme();
                    setTheme(systemTheme === 'dark' ? 'dark' : 'light');
                }
            } catch (error) {
                console.log('Error loading theme:', error);
            }
        };

        loadTheme();
    }, []);

    const toggleTheme = async () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        try {
            await AsyncStorage.setItem('premier-motors-theme', newTheme);
        } catch (error) {
            console.log('Error saving theme:', error);
        }
    };

    const isDark = theme === 'dark';

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, isDark }}>
            {children}
        </ThemeContext.Provider>
    );
}