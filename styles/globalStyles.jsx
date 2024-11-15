import { StyleSheet } from "react-native";

export const themes = {
    fontSize: {
        headerTitle: 20,
      }
}

export const globalStyles = StyleSheet.create({
    headerTitleStyle: { // header title styling for each tab stack
        fontSize: themes.fontSize.headerTitle,
        fontWeight: 'bold',
        fontFamily: 'Hubballi_400Regular', 
        fontSize:25
    }
})



// export default globalStyles;