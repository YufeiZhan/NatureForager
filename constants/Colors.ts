import { DarkTheme, DefaultTheme, Theme } from "@react-navigation/native";

const oliveGreen = "#7D7050"
const yelloSand = "#C69B66"
const darkGreen = "#454F34"
const charcoalBlack = "#2D2D2C"
const ivoryWhite = "#FFFFF0"
const pureWhite = "#FFFFFF"

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