import { useState, useCallback } from 'react';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';

interface UseImageCaptureReturn {
  permission: ReturnType<typeof useCameraPermissions>[0];
  requestPermission: ReturnType<typeof useCameraPermissions>[1];
  pickImage: () => Promise<string | null>;
  capturedUri: string | null;
  setCapturedUri: (uri: string | null) => void;
}

export function useImageCapture(): UseImageCaptureReturn {
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedUri, setCapturedUri] = useState<string | null>(null);

  const pickImage = useCallback(async (): Promise<string | null> => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.canceled && result.assets[0]) {
      const uri = result.assets[0].uri;
      setCapturedUri(uri);
      return uri;
    }
    return null;
  }, []);

  return { permission, requestPermission, pickImage, capturedUri, setCapturedUri };
}
