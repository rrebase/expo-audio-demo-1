import { useEffect } from "react";
import { View, StyleSheet, Button, Alert } from "react-native";
import {
  useAudioRecorder,
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorderState,
} from "expo-audio";

setAudioModeAsync({
  playsInSilentMode: true,
  allowsRecording: true,
});

export default function App() {
  const audioRecorder = useAudioRecorder({
    ...RecordingPresets.HIGH_QUALITY,
    isMeteringEnabled: true,
  });
  const state = useAudioRecorderState(audioRecorder);

  const record = async () => {
    await audioRecorder.prepareToRecordAsync({
      isMeteringEnabled: true,
    });
    audioRecorder.record();
  };

  console.log("state", state);

  const stopRecording = async () => {
    await audioRecorder.stop();
    console.log("audioRecorder.uri", audioRecorder.uri);
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
        title={state.isRecording ? "Stop Recording" : "Start Recording"}
        onPress={state.isRecording ? stopRecording : record}
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
