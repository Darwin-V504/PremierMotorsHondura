// components/LogoHeader.tsx
import { View, Image, StyleSheet } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { getThemeColors } from "../infoutils/theme";

type LogoHeaderProps = {
    size?: 'small' | 'medium';
    position?: 'center' | 'left';
};

export default function LogoHeader({ size = 'small', position = 'center' }: LogoHeaderProps) {
    const { theme } = useTheme();
    const colors = getThemeColors(theme);
    
    const companyLogo = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsBHnLPALDBQ7CgbDq-NFh0_3nPbX--5y2aw&s";
    
    const styles = StyleSheet.create({
        container: {
            alignItems: position === 'center' ? 'center' : 'flex-start',
            paddingVertical: 8,
            paddingHorizontal: position === 'left' ? 16 : 0,
        },
        logo: {
            width: size === 'small' ? 40 : 60,
            height: size === 'small' ? 40 : 60,
            borderRadius: size === 'small' ? 8 : 12,
        }
    });

    return (
        <View style={styles.container}>
            <Image
                source={{ uri: companyLogo }}
                style={styles.logo}
                resizeMode="contain"
            />
        </View>
    );
}