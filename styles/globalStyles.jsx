import { StyleSheet } from "react-native";
import { oliveGreen, ivoryWhite } from "@/constants/Colors";

export const globalStyles = StyleSheet.create({
    // header title styling for each tab stack
    headerTitleStyle: { 
        fontSize: 20,
        fontWeight: 'bold',
        fontFamily: 'Hubballi_400Regular', 
        fontSize:25
    },
    //bottom sheet
    bottomSheet: {
        backgroundColor: oliveGreen,
    },
    // content page (e.g. plant info, observation info) styling
    infoPageContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingHorizontal: 20,
        backgroundColor: oliveGreen
    },
    infoPageSubContainer:{
        alignItems: 'center',
        paddingBottom: 20,
        backgroundColor: ivoryWhite,
        borderRadius: 20,
        opacity: 0.9
    },
    infoPrimaryTitle: {
        fontSize: 30,
        marginTop: 10
    },
    infoSecondaryTitle: {
        fontSize: 18,
        marginVertical: 2,
        marginHorizontal: 40
    },
    infoUnderlinedTitle: {
        textAlign:'left', 
        // alignSelf: 'flex-start', 
        marginHorizontal:20, 
        textDecorationLine:"underline"
    },
    secondaryGroup:{
        marginVertical:5,
        alignItems: 'center'
    },
    divider:{
        height: 1,
        width: '90%',
        backgroundColor: oliveGreen,
        marginVertical: 10, 
    },
    icon: {
        width: 25,
        height: 25,
    },
    image: {
        width: '90%',
        height: 220,
        borderRadius: 10,
        marginVertical: 20
    },
    html: {
        marginHorizontal: 20
    }
})