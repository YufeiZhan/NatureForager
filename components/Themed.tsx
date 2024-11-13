import {
  StyleSheet,
  View,
  ViewProps,
  Text,
  TextProps,
  Button,
  ButtonProps,
  ScrollView,
  ScrollViewProps,
  FlatList,
  FlatListProps,
} from "react-native";

export function ThemedView(props: ViewProps) {
  const { style, ...otherProps } = props;
  return <View style={[styles.view, style]} {...otherProps}></View>;
}
export function ThemedText(props: TextProps) {
  const { style, ...otherProps } = props;
  return <Text style={[styles.text, style]} {...otherProps}></Text>;
}

export function ThemedButton(props: ButtonProps) {
  // maybe create our custom button using a Pressable View?
  // because it will be hard to make system default look aesthetic nature-wise
  // don't take ButtonProps if we do that, probably will be ViewProps
  return <Button {...props}></Button>;
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
  view: {},
  text: {
    fontSize: 16,
  },
  scrollView: {},
  flatList: {},
});
