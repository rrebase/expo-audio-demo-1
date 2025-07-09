import { useState, useEffect, useRef } from "react";
import { View, StyleSheet, Button, Alert } from "react-native";
import {
  useAudioRecorder,
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
} from "expo-audio";

setAudioModeAsync({
  allowsRecording: true,
  shouldPlayInBackground: true,
});

export default function App() {
  const audioRecorder = useAudioRecorder({
    ...RecordingPresets.HIGH_QUALITY,
    isMeteringEnabled: true,
  });

  const [isRecording, setIsRecording] = useState(false);

  const intervalRef = useRef<any>(null);

  const record = async () => {
    await audioRecorder.prepareToRecordAsync();
    audioRecorder.record();

    intervalRef.current = setInterval(() => {
      console.log("status", JSON.stringify(audioRecorder.getStatus(), null, 2));
    }, 250);

    setIsRecording(true);
  };

  const stopRecording = async () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    await audioRecorder.stop();
    console.log("audioRecorder", audioRecorder.uri);
    setIsRecording(false);
  };

  useEffect(() => {
    (async () => {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      if (!status.granted) {
        Alert.alert("Permission to access microphone was denied");
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Button
        title={isRecording ? "Stop Recording" : "Start Recording"}
        onPress={isRecording ? stopRecording : record}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#ecf0f1",
    padding: 10,
  },
});
