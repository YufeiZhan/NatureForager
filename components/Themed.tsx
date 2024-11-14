import {
  StyleSheet,
  View,
  ViewProps,
  Text,
  TextProps,
  Button,
  PressableProps,
  ScrollView,
  ScrollViewProps,
  FlatList,
  FlatListProps,
  Pressable,
  ButtonProps,
} from "react-native";
import { ivoryWhite, darkGreen, yellowSand } from "@/constants/Colors";

export function ThemedView(props: ViewProps) {
  const { style, ...otherProps } = props;
  return <View style={[styles.view, style]} {...otherProps}></View>;
}
export function ThemedText(props: TextProps) {
  const { style, ...otherProps } = props;
  return <Text style={[styles.text, style]} {...otherProps}></Text>;
}

// maybe create our custom button using a Pressable View?
// because it will be hard to make system default look aesthetic nature-wise
// don't take ButtonProps if we do that, probably will be ViewProps
export function ThemedButton({...props}:ButtonProps & {action?: 'primary' | 'secondary'}) {
  const {action = "primary", title, onPress, ...otherProps} = props;
  console.log(action)

  if (action === 'primary'){
    return <Pressable style={styles.primaryButton} onPress={onPress}>
            <Text style={styles.primaryButtonText}>{title}</Text>
           </Pressable>
  } else {
    return <Pressable style={styles.secondaryButton} onPress={onPress}>
            <Text style={styles.secondaryButtonText}>{title}</Text>
           </Pressable>
  }
}

// export function ThemedButton(props: ButtonProps) {
//   return <Button {...props}></Button>;
// }

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
  primaryButton:{
    backgroundColor: ivoryWhite,
    alignSelf: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 20,
  },
  primaryButtonText: {
    color: darkGreen,
    fontSize: 18,
    fontWeight: '700',
    alignItems: 'center'
  },
  secondaryButton:{
    backgroundColor: darkGreen,
    alignSelf: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 20,
  },
  secondaryButtonText: {
    color: ivoryWhite,
    fontSize: 18,
    fontWeight: '700',
    alignItems: 'center'
  },
  view: {},
  text: {
    fontSize: 16,
  },
  scrollView: {},
  flatList: {},
});
