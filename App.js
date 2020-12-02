import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { RNCamera } from 'react-native-camera-tflite'
import outputs from './Output.json'
import _ from 'lodash'

let _currentInstance = 0

const App = () => {
  const cameraRef = React.useRef(null)
  const [output, setOutput] = React.useState('')

  function proccessOutputData({ data }) {
    const probs = _.map(data, item => _.round(item / 255.0, 0.02));
    const orderedData = _.chain(data).zip(outputs).orderBy(0, 'desc').map(item => [_.round(item[0] / 255.0, 2), item[1]]).value();
    const outputData = _.chain(orderedData).take(3).map(item => `${item[1]}: ${item[0]}`).join('\n').value();
    const time = Date.now() - (_currentInstance || Date.now())

    const output = `Guesses:\n${outputData}\nTime:${time} ms`

    setOutput(output)

    _currentInstance = Date.now()

  }

  const modelParams = {
    file: "mobilenet_v1_1.0_224_quant.tflite",
    inputDimX: 224,
    inputDimY: 224,
    outputDim: 1001,
    freqms: 0
  }

  return (
    <View style={styles.container}>
      <RNCamera
        ref={cameraRef}
        style={styles.preview}
        type={RNCamera.Constants.Type.back}
        flashMode={RNCamera.Constants.FlashMode.on}
        permissionDialogTitle={'Permission Camera'}
        permissionDialogMessage={'DinoBoy need camera permission to use camera'}
        onModelProcessed={data => proccessOutputData(data)}
        modelParams={modelParams}>
        <Text style={styles.cameraText}>{output}</Text>
      </RNCamera>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    flexDirection: 'column'
  },

  preview: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  cameraText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold'
  }
})


export default App;
