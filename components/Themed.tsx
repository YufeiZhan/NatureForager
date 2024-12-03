import {
  StyleSheet,
  View,
  ViewProps,
  Text,
  TextProps,
  FlatList,
  FlatListProps,
  Pressable,
  TextInputProps,
  TextInput,
  PressableProps,
  ViewStyle,
  Image,
  ImageProps,
} from "react-native";
import { ivoryWhite, darkGreen, pureWhite } from "@/constants/Colors";
import DropDownPicker, {
  DropDownPickerProps,
} from "react-native-dropdown-picker";
import { Month } from "@/app/(tabs)/home/HomeScreen";
import { globalStyles } from "@/styles/globalStyles";
import ImageView from "react-native-image-viewing";
import { useState } from "react";

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
export function ThemedButton(
  props: PressableProps & { title: string; action?: "primary" | "secondary" }
) {
  const { action = "primary", title, onPress, style } = props;

  if (action === "primary") {
    return (
      <Pressable
        style={[styles.button, styles.primaryButton, style as ViewStyle]}
        onPress={onPress}
      >
        <ThemedText style={[styles.buttonText, styles.primaryButtonText]}>
          {title}
        </ThemedText>
      </Pressable>
    );
  } else {
    return (
      <Pressable
        style={[styles.button, styles.secondaryButton, style as ViewStyle]}
        onPress={onPress}
      >
        <ThemedText style={[styles.buttonText, styles.secondaryButtonText]}>
          {title}
        </ThemedText>
      </Pressable>
    );
  }
}

const iconMapping = {
  reminded: require("../assets/icons/reminder-on.png"),
  unreminded: require("../assets/icons/reminder-off.png"),
  fav: require("../assets/icons/favorite-on.png"),
  unfav: require("../assets/icons/favorite-off.png"),
  edit: require("../assets/icons/edit-icon.png"),
  x: require("../assets/icons/x.png"),
  iconInfo: require("../assets/icons/info-icon.png"),
  flower: require("../assets/plant/flower.png"),
  fruit: require("../assets/plant/fruit.png"),
  leaf: require("../assets/plant/leaf.png"),
  nut: require("../assets/plant/nut.png"),
  pod: require("../assets/plant/pod.png"),
  pollen: require("../assets/plant/pollen.png"),
  root: require("../assets/plant/root.png"),
  seed: require("../assets/plant/seed.png"),
  shoot: require("../assets/plant/shoot.png"),
  tea: require("../assets/plant/tea.png"),
  tuber: require("../assets/plant/tuber.png"),
};
export function ThemedIcon(
  props: PressableProps & { iconName: keyof typeof iconMapping }
) {
  const { iconName, onPress, ...otherProps } = props;
  return (
    <Pressable onPress={onPress} {...otherProps}>
      <Image
        resizeMode="contain"
        source={iconMapping[iconName]}
        style={globalStyles.icon}
      />
    </Pressable>
  );
}

// Image that can be enlarged
export function ThemedImage(props: { uri: string | undefined } & ImageProps) {
  const { uri, style, ...otherProps } = props;
  const [enlargeImage, setEnlargeImage] = useState(false);

  return (
    <Pressable
      style={{ width: "100%", alignItems: "center" }}
      onPress={() => setEnlargeImage(true)}
    >
      <Image
        source={{ uri: uri }}
        style={[globalStyles.image, style]}
        {...otherProps}
      />

      <ImageView
        images={[{ uri: uri }]}
        imageIndex={0}
        visible={enlargeImage}
        onRequestClose={() => setEnlargeImage(false)}
      />
    </Pressable>
  );
}

export function ThemedTextInput(props: TextInputProps) {
  const { style, ...otherProps } = props;
  return (
    <TextInput style={[styles.text, styles.textInput, style]} {...otherProps} />
  ); // use same styling as text
}

export function ThemedDropDownPicker(props: DropDownPickerProps<Month>) {
  const {
    style,
    textStyle,
    containerStyle,
    dropDownContainerStyle,
    renderListItem,
    ...otherProps
  } = props;
  return (
    <DropDownPicker
      style={[styles.dropDown, style]} //main dropdown box when collapsed
      containerStyle={[styles.dropDownContainer, containerStyle]} //outer dropdown container
      dropDownContainerStyle={[
        styles.dropDownDropDownContainer,
        dropDownContainerStyle,
      ]} //dropdown container
      textStyle={[, styles.text, styles.dropDownText, textStyle]}
      //  renderListItem={(props) => {
      //   const { item, listItemContainerStyle, listItemLabelStyle } = props;
      //   return (
      //     <View style={[listItemContainerStyle]}>
      //       <Text style={[listItemLabelStyle, styles.text]}>{item.label}</Text>
      //     </View>
      //   );
      //  }}
      {...otherProps}
    />
  );
}

export function ThemedFlatList<T>(props: FlatListProps<T>) {
  const { style, ...otherProps } = props;
  return <FlatList style={[styles.flatList, style]} {...otherProps}></FlatList>;
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 25,
    borderRadius: 20,
    // iOS Shadow
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 2,

    // Android Shadow
    elevation: 5,
  },
  primaryButton: {
    backgroundColor: pureWhite,
  },
  secondaryButton: {
    backgroundColor: darkGreen,
  },
  buttonText: {
    fontSize: 24,
    alignItems: "center",
    margin: 0,
  },
  primaryButtonText: {
    color: darkGreen,
  },
  secondaryButtonText: {
    color: ivoryWhite,
  },
  view: {},
  text: {
    fontSize: 20,
    letterSpacing: -1,
    fontFamily: "Hubballi_400Regular",
  },
  textInput: {
    opacity: 0.8,
  },
  dropDown: {
    alignSelf: "center",
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
    textAlign: "center",
  },
  flatList: {},
});
