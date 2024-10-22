import { useState, useMemo, useRef, useEffect } from 'react';
import { ThemedView, ThemedText } from '@/components/Themed'; // Assuming you have Themed components
import BottomSheet from '@gorhom/bottom-sheet';
import { StyleSheet } from 'react-native';

interface PlantInfoProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function PlantInfo({ isVisible, onClose }: PlantInfoProps) {
  const bottomSheetRef = useRef<BottomSheet>(null);  // Ref for BottomSheet

  const snapPoints = useMemo(() => ['25%', '50%', '90%'], []);

  // When the component becomes visible, expand the BottomSheet
  useEffect(() => {
    if (isVisible) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [isVisible]);

  return (
    <>
      {isVisible && (
        <BottomSheet
          ref={bottomSheetRef}
          index={0}  // Start at 25% height
          snapPoints={snapPoints}
          enablePanDownToClose={true}  // Allow dragging down to close
          onClose={onClose}  // Trigger onClose when fully closed
        >
          <ThemedView style={styles.sheetContent}>
            <ThemedText>Plant Info</ThemedText>
            {/* Example plant data */}
            <ThemedText>Common Name: Dandelion</ThemedText>
            <ThemedText>Scientific Name: Taraxacum officinale</ThemedText>
            <ThemedText>Type: Leaf, Flower</ThemedText>
            <ThemedText>Month Ripe: April</ThemedText>
          </ThemedView>
        </BottomSheet>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  sheetContent: {
    padding: 20,
    backgroundColor: 'white',
  },
});
