import React, { Component } from 'react'
import { Text, View, StyleSheet } from 'react-native'
import { PieChart as ChartKitPie } from 'react-native-chart-kit'

//TODO: Label styling, click action, issues caused by library limitation, refactoring

const PieChartAdalo = props => {
  let { items, slices, legend, _width, _height, editor } = props
  let {
    numberOfSlices,
    otherSliceLabel,
    colorScheme,
    monochromaticScheme,
    customColor1,
    customColor2,
    customColor3,
    customColor4,
    customColor5,
    customColor6,
  } = slices
  let { enabled: legendEnabled, absoluteNumbers } = legend

  if (!items) {
    items = []
  }
  let colors = [],
    otherSlices = [],
    otherValue = 0,
    data,
    otherObject,
    xOffset = 0,
    yOffset = 0,
    height = _width / 1.62,
    width = _width,
    flexDirection
  const colorIncrement = 10

  if (height > width) {
    flexDirection = 'row'
  } else {
    flexDirection = 'column'
  }

  if (colorScheme === 0) {
    let hslBase = hexToHSL(monochromaticScheme),
      lValue = getLValue(hslBase),
      lValues = [lValue],
      upCount = 0,
      downCount = 0
    const possibleUp = (100 - lValue) / colorIncrement
    const possibleDown = lValue / colorIncrement

    let multiplier = 1
    for (let i = 0; i < numberOfSlices - 1; i++) {
      if (i % 2 === 0) {
        // go down
        if (downCount <= possibleDown) {
          lValues.push(lValue - colorIncrement * multiplier)
        } else {
          lValues.push(lValue + colorIncrement * multiplier)
          multiplier += 1
        }
      } else {
        // go up
        if (upCount <= possibleUp) {
          lValues.push(lValue + colorIncrement * multiplier)
        } else {
          lValues.push(lValue - colorIncrement * multiplier)
        }
        multiplier += 1
      }
    }
    lValues.sort((a, b) => (a > b ? 1 : -1))
    //generate colors array from hsl base and lValues
    colors = generateScheme(hslBase, lValues)
  } else if (colorScheme === 1) {
    //custom color scheme
    //TODO: refactor this?
    colors.push(customColor1)
    colors.push(customColor2)
    colors.push(customColor3)
    colors.push(customColor4)
    colors.push(customColor5)
    colors.push(customColor6)
  }

  //center the chart if the legend is turned off
  if (!legendEnabled) {
    xOffset = _width / 4
  }

  //sort items array big to little
  items.sort((a, b) => (a.sliceValue < b.sliceValue ? 1 : -1))
  if (numberOfSlices < items.length) {
    //subtract 1 to account for the other slice
    otherSlices = items.slice(numberOfSlices - 1, items.length)
    items = items.slice(0, numberOfSlices - 1)
  }

  otherSlices.forEach(slice => {
    otherValue += slice.sliceValue
  })

  if (editor) {
	  //preview data
    data = [
      {
        name: 'Beijing',
        value: 527612,
        color: colors[0],
        legendFontColor: '#7F7F7F',
        legendFontSize: 12,
      },
      {
        name: 'New York',
        value: 8538000,
        color: colors[1],
        legendFontColor: '#7F7F7F',
        legendFontSize: 12,
      },
      {
        name: otherSliceLabel,
        value: 2800000,
        color: colors[2],
        legendFontColor: '#7F7F7F',
        legendFontSize: 12,
      },
    ]
  } else {
    data = items.map((item, index) => {
      return {
        name: item.sliceLabel,
        value: item.sliceValue,
        color: colors[index],
        legendFontColor: '#7F7F7F',
        legendFontSize: 12,
      }
    })
  }

  //add the other slice if it exists
  if (otherValue > 0) {
    otherObject = {
      name: otherSliceLabel,
      value: otherValue,
      color: colors[numberOfSlices - 1],
      legendFontColor: '#7F7F7F',
      legendFontSize: 12,
    }

    data.push(otherObject)
  }

  const chartConfig = {
    backgroundGradientFrom: '#1E2923',
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: '#08130D',
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 3, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false, // optional
  }

  //TODO: is this still needed?
  const wrapperStyle = {
    height: _width / 1.62,
    width,
    flexDirection,
    display: 'flex',
    alignItems: 'center',
    alignContent: 'center',
    // backgroundColor: 'red',
  }

  return (
    <View style={wrapperStyle}>
      <ChartKitPie
        data={data}
        width={_width}
        height={height}
        chartConfig={chartConfig}
        accessor={'value'}
        backgroundColor={'transparent'}
        center={[xOffset, yOffset]}
        absolute={absoluteNumbers} //TODO: make this a prop
        hasLegend={legendEnabled} //TODO: make this a prop
        avoidFalseZero
      />
    </View>
  )
  i
}

//hexToHSL function derived from https://css-tricks.com/converting-color-spaces-in-javascript/
const hexToHSL = hex => {
  let r = 0
  let g = 0
  let b = 0
  let a = 1

  r = '0x' + hex[1] + hex[2]
  g = '0x' + hex[3] + hex[4]
  b = '0x' + hex[5] + hex[6]
  //get alpha
  if (hex.length == 9) {
    a = '0x' + hex[7] + hex[8]
  }

  r /= 255
  g /= 255
  b /= 255

  let minColor = Math.min(r, g, b)
  let maxColor = Math.max(r, g, b)
  let diff = maxColor - minColor
  let h = 0
  let s = 0
  let l = 0

  if (diff === 0) {
    h = 0
  } else if (maxColor === r) {
    h = ((g - b) / diff) % 6
  } else if (maxColor === g) {
    h = (b - r) / diff + 2
  } else {
    h = (r - g) / diff + 4
  }

  h = Math.round(h * 60)
  if (h < 0) {
    h += 360
  }

  l = (maxColor + minColor) / 2
  s = diff == 0 ? 0 : diff / (1 - Math.abs(2 * l - 1))
  s = +(s * 100).toFixed(1)
  l = +(l * 100).toFixed(1)

  if (a !== 1) {
    a = (a / 255).toFixed(3)
  }

  return 'hsl(' + h + ',' + s + '%,' + l + '%,' + a + ')'
}

const getLValue = hsl => {
  return parseInt(hsl.split(',')[2].slice(0, -1))
}

const generateScheme = (hslBase, lValues) => {
  let splitBase = hslBase.split(',')
  let hslColors = []
  for (const lValue of lValues) {
    let color =
      splitBase[0] +
      ',' +
      splitBase[1] +
      ',' +
      lValue +
      '%' +
      ',' +
      splitBase[3]
    hslColors.push(color)
  }
  return hslColors
}

export default PieChartAdalo
