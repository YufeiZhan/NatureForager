// app/home/_layout.tsx
import { Stack } from 'expo-router';
import { globalStyles } from '@/styles/globalStyles';
import { Button, Image, Modal, StyleSheet, View } from 'react-native';
import { ThemedIcon, ThemedText, ThemedButton } from '@/components/Themed';
import { useState } from 'react';



export default function HomeStack() {
  const [modal, setModal] = useState(false)
  
  return (
    <>
      <Stack
        screenOptions ={{
          headerTitleStyle: { ...globalStyles.headerTitleStyle },
          headerBackTitleVisible: false,
          headerTintColor: 'white'
        }}
      >
        <Stack.Screen
          name="HomeScreen"
          options={{ 
            title: 'Nature Forager',
            headerRight : () => (<ThemedIcon iconName="iconInfo" 
                                            onPress={() => setModal(true)}/>)
          }}
        />
        <Stack.Screen
          name="PlantLocation"
          options={{ title: 'Plant Locations' }}
        />
      </Stack>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={{flexDirection: 'row', marginVertical: 5}}>
              <ThemedIcon iconName='flower' />
              <ThemedText>Flower</ThemedText>
            </View>
            <View style={{flexDirection: 'row', marginVertical: 5}}>
              <ThemedIcon iconName='fruit' />
              <ThemedText>Fruit</ThemedText>
            </View>
            <View style={{flexDirection: 'row', marginVertical: 5}}>
              <ThemedIcon iconName='leaf' />
              <ThemedText>Leaf</ThemedText>
            </View>
            <View style={{flexDirection: 'row', marginVertical: 5}}>
              <ThemedIcon iconName='nut' />
              <ThemedText>Nut</ThemedText>
            </View>
            <View style={{flexDirection: 'row', marginVertical: 5}}>
              <ThemedIcon iconName='pod' />
              <ThemedText>Pod</ThemedText>
            </View>
            <View style={{flexDirection: 'row', marginVertical: 5}}>
              <ThemedIcon iconName='pollen' />
              <ThemedText>Pollen</ThemedText>
            </View>
            <View style={{flexDirection: 'row', marginVertical: 5}}>
              <ThemedIcon iconName='root' />
              <ThemedText>Root</ThemedText>
            </View>
            <ThemedButton title="Close" action="secondary" onPress={() => setModal(false)} />
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 20, // Set the width of the icon
    height: 20, // Set the height of the icon
    resizeMode: "contain", // Optional: controls how the image fits
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 15,
  },
});