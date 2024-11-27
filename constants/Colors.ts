import { DarkTheme, DefaultTheme, Theme } from "@react-navigation/native";

export const oliveGreen = "#6D6245";
export const yellowSand = "#C69B66";
export const darkGreen = "#454F34";
export const charcoalBlack = "#2D2D2C";
export const ivoryWhite = "#FFFFF0";
export const pureWhite = "#FFFFFF";

export default {
  light: {},
};

// set the theme to always return the only theme that we implemented for now
// if new theme is implemented in the future, return different theme based on the parameter boolean
export function getTheme(dark: boolean): Theme {

  return {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: oliveGreen, // screens' background
      card: yellowSand, // set the header/tab bg color
      text: pureWhite, // text for navigational elements
    },
  }
}
