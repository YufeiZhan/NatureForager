import { DarkTheme, DefaultTheme, Theme } from "@react-navigation/native";

export const oliveGreen = "#7D7050"
export const yelloSand = "#C69B66"
export const darkGreen = "#454F34"
export const charcoalBlack = "#2D2D2C"
export const ivoryWhite = "#FFFFF0"
export const pureWhite = "#FFFFFF"

export default {
    light: {
    }
}

export function getTheme(dark:boolean) : Theme {
    return dark 
            ? {...DarkTheme}
            : {...DefaultTheme, colors: {...DefaultTheme.colors, 
                                            card:yelloSand, // set the header/tab bg color
                                            text:pureWhite
                                        }} 
}