import {
  StyleSheet,
  View,
  ViewProps,
  Text,
  TextProps,
  ScrollView,
  ScrollViewProps,
  FlatList,
  FlatListProps,
  Pressable,
  TextInputProps,
  TextInput,
  PressableProps,
  ViewStyle,
} from "react-native";
import { ivoryWhite, darkGreen, pureWhite } from "@/constants/Colors";
import DropDownPicker, { DropDownPickerProps } from "react-native-dropdown-picker";
import { Month } from "@/app/(tabs)/home/HomeScreen";
import { globalStyles } from "@/styles/globalStyles";


// Apply the default styling to the common components unless othersie defined to overwrite
// Should not need to apply additional styles normally
// Use primary/secondary property to choose stylings

export function ThemedView(props: ViewProps) {
  const { style, ...otherProps } = props;
  return <View style={[styles.view, style]} {...otherProps}></View>;
}
export function ThemedText(props: TextProps) {
  const { style, ...otherProps } = props;
  return <Text style={[styles.text, style]} {...otherProps}></Text>;
}

// Provide 1) title, 2) onPress behavior, 3) action (primary or secondary)
// Optional: style
export function ThemedButton(props: PressableProps & { title: string, action?: "primary" | "secondary"}) {
  const { action = "primary", title, onPress, style, ...otherProps } = props;

  if (action === "primary") {
    return (
      <Pressable style={[styles.primaryButton, style as ViewStyle]} onPress={onPress}>
        <ThemedText style={[styles.primaryButtonText]}>{title}</ThemedText>
      </Pressable>
    );
  } else {
    return (
      <Pressable style={[styles.secondaryButton, style as ViewStyle]} onPress={onPress}>
        <ThemedText style={styles.secondaryButtonText}>{title}</ThemedText>
      </Pressable>
    );
  }
}

// export function ThemedIcon(props: PressableProps & {icon:}){

// }

export function ThemedTextInput(props: TextInputProps){
  const { style, ...otherProps } = props;
  return <TextInput style={[styles.text, styles.textInput, style]} {...otherProps} /> // use same styling as text
}

export function ThemedDropDownPicker(props: DropDownPickerProps<Month>){
  const { style, textStyle, containerStyle, dropDownContainerStyle, renderListItem, ...otherProps } = props;
  return <DropDownPicker style={[styles.dropDown, style]}  //main dropdown box when collapsed
                         containerStyle={[styles.dropDownContainer,containerStyle]} //outer dropdown container
                         dropDownContainerStyle={[styles.dropDownDropDownContainer, dropDownContainerStyle]} //dropdown container
                         textStyle={[, styles.text, styles.dropDownText, textStyle]} 
                        //  renderListItem={(props) => {
                        //   const { item, listItemContainerStyle, listItemLabelStyle } = props;
                        //   return (
                        //     <View style={[listItemContainerStyle]}>
                        //       <Text style={[listItemLabelStyle, styles.text]}>{item.label}</Text>
                        //     </View>
                        //   );
                        //  }}
                         {...otherProps}/>
}

export function ThemedScrollView(props: ScrollViewProps) {
  const { style, ...otherProps } = props;
  return (
    <ScrollView style={[styles.scrollView, style]} {...otherProps}></ScrollView>
  );
}

export function ThemedFlatList<T>(props: FlatListProps<T>) {
  const { style, ...otherProps } = props;
  return <FlatList style={[styles.flatList, style]} {...otherProps}></FlatList>;
}

const styles = StyleSheet.create({
  primaryButton: {
    backgroundColor: pureWhite,
    alignSelf: "center",
    justifyContent: "center",
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 20,
  },
  primaryButtonText: {
    color: darkGreen,
    fontSize: 18,
    alignItems: "center",
  },
  secondaryButton: {
    backgroundColor: darkGreen,
    alignSelf: "center",
    justifyContent: "center",
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 20,
  },
  secondaryButtonText: {
    color: ivoryWhite,
    fontSize: 18,
    alignItems: "center",
  },
  view: {},
  text: {
    fontSize: 20,
    letterSpacing: -1,
    fontFamily: "Hubballi_400Regular",
  },
  textInput: {
    opacity: 0.8
  },
  dropDown: {
    alignSelf: 'center',
    borderWidth: 0,
    // backgroundColor: "transparent",
    opacity: 0.95,
  },
  dropDownContainer: {
    width: 180,
    marginVertical: 20,
  },
  dropDownDropDownContainer: {
    backgroundColor: pureWhite,
    borderWidth: 0,
    opacity: 0.95,
  },
  dropDownText: {
    // fontSize: 25,
    textAlign: 'center',
  },
  scrollView: {},
  flatList: {},
});
