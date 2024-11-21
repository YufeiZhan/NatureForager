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
  ButtonProps,
  TextInputProps,
  TextInput
} from "react-native";
import { ivoryWhite, darkGreen } from "@/constants/Colors";

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

// Provide 1) title, 2) onPress behavior, and 3) action (primary or secondary)
export function ThemedButton(props: ButtonProps & { action?: "primary" | "secondary" }) {
  const { action = "primary", title, onPress, ...otherProps } = props;

  if (action === "primary") {
    return (
      <Pressable style={styles.primaryButton} onPress={onPress}>
        <ThemedText style={styles.primaryButtonText}>{title}</ThemedText>
      </Pressable>
    );
  } else {
    return (
      <Pressable style={styles.secondaryButton} onPress={onPress}>
        <ThemedText style={styles.secondaryButtonText}>{title}</ThemedText>
      </Pressable>
    );
  }
}

export function ThemedTextInput(props: TextInputProps){
  const { style, ...otherProps } = props;
  return <TextInput style={[styles.text, style]} {...otherProps} /> // use same styling as text
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
    backgroundColor: ivoryWhite,
    alignSelf: "center",
    justifyContent: "center",
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 20,
  },
  primaryButtonText: {
    color: darkGreen,
    fontSize: 18,
    fontWeight: "700",
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
    fontWeight: "700",
    alignItems: "center",
  },
  view: {},
  text: {
    fontSize: 20,
    letterSpacing: -1,
    fontFamily: "Hubballi_400Regular",
    opacity: 0.8
  },
  scrollView: {},
  flatList: {},
});
