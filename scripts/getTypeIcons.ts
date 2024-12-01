export const getTypeIcons = (type: string): any[] => {
  const typeIconMap: { [key: string]: any } = {
    leaf: require("@/assets/plant/leaf.png"),
    flower: require("@/assets/plant/flower.png"),
    fruit: require("@/assets/plant/fruit.png"),
    nut: require("@/assets/plant/nut.png"),
    pod: require("@/assets/plant/pod.png"),
    pollen: require("@/assets/plant/pollen.png"),
    root: require("@/assets/plant/root.png"),
    seed: require("@/assets/plant/seed.png"),
    shoot: require("@/assets/plant/shoot.png"),
    tea: require("@/assets/plant/tea.png"),
    tuber: require("@/assets/plant/tuber.png"),
  };

  // For types that share icons with other types
  const aliases: { [key: string]: string } = {
    berry: "fruit",
    sap: "tea",
  };

  const icons: any[] = [];

  const typeWords = type.toLowerCase().split(/[\s,]+/);

  // Check each type word against the keys in the typeIconMap and aliases
  typeWords.forEach((word) => {
    if (typeIconMap[word]) {
      icons.push(typeIconMap[word]);
    } else if (aliases[word]) {
      icons.push(typeIconMap[aliases[word]]);
    }
  });

  return icons;
};
