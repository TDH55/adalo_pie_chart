import React, { Component } from 'react'
import { Text, View, StyleSheet } from 'react-native'
import { PieChart as ChartKitPie } from 'react-native-chart-kit'

//TODO: resizing, coloring

const PieChartAdalo = props => {
	let { items, numberOfSlices, _width, _height, editor } = props
	if (!items) {
		items = []
	}
	let otherSlices = []
	let otherValue = 0
	let data
	let otherObject
	console.log(props)
	//sort items array big to little
	items.sort((a, b) => (a.slices.sliceValue < b.slices.sliceValue ? 1 : -1))
	if (numberOfSlices < items.length) {
		//subtract 1 to account for the other slice
		otherSlices = items.slice(numberOfSlices - 1, items.length)
		items = items.slice(0, numberOfSlices - 1)
	}

	otherSlices.forEach(slice => {
		otherValue += slice.slices.sliceValue
	})

	//TODO: simplify editor preview - change colors
	if (editor) {
		data = [
			{
				name: 'Toronto',
				value: 2800000,
				color: 'rgba(131, 167, 234, 1)',
				legendFontColor: '#7F7F7F',
				legendFontSize: 15,
			},
			{
				name: 'Beijing',
				value: 527612,
				color: 'rgba(131, 167, 234, 1)',
				legendFontColor: '#7F7F7F',
				legendFontSize: 15,
			},
			{
				name: 'New York',
				value: 8538000,
				color: 'rgba(131, 167, 234, 1)',
				legendFontColor: '#7F7F7F',
				legendFontSize: 15,
			},
		]
	} else {
		data = items.map((item, index) => {
			//TODO: handle colors - use index for transparence?
			return {
				name: item.slices.sliceLabel,
				value: item.slices.sliceValue,
				color: 'rgba(131, 167, 234, 1)',
				legendFontColor: '#7F7F7F',
				legendFontSize: 15,
			}
		})
	}

	if (otherValue > 0) {
		otherObject = {
			name: 'other',
			value: otherValue,
			color: 'rgba(131, 167, 234, 1)',
			legendFontColor: '#7F7F7F',
			legendFontSize: 15,
		}

		data.push(otherObject)
	}

	console.log(data)

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

	//todo: create other slice object if

	return (
		<ChartKitPie
			data={data}
			width={_width}
			height={220}
			chartConfig={chartConfig}
			accessor={'value'}
			backgroundColor={'transparent'}
			paddingLeft={'15'}
			center={[10, 0]}
			absolute
		/>
	)
}

const styles = StyleSheet.create({
	wrapper: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
})

export default PieChartAdalo
