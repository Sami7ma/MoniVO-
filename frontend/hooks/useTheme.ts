// a custom hook tha retursn the curren theme colors
//  use thsi in every screen instes of importing colors direct;=ly
// ex: cons colors = useTheme();  then use colors.backgourgn, etc

import useMoniVoStore from "../store/useMoniVoStore";
import { darkTheme, lightTheme, ThemeColors } from "../constants/theme";

export default function useTheme(): ThemeColors {
    const theme = useMoniVoStore((state) => state.theme);
    return theme === 'dark' ? darkTheme : lightTheme;
}

