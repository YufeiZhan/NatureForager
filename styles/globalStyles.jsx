import { StyleSheet } from "react-native";

export const themes = {
    fontSize: {
        headerTitle: 20,
      }
}

export const globalStyles = StyleSheet.create({
    headerTitleStyle: { // header title styling for each tab stack
        fontSize: themes.fontSize.headerTitle,
        fontWeight: 'bold'
    }
})



// export default globalStyles;