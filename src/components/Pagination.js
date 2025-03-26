import { StyleSheet, Text, View, Animated, Dimensions } from 'react-native'
import React from 'react'

const Pagination = ({data, scrollX}) => {
  return (
    <View style={styles.container}>
      {data.map((_, idx) => {
        const inputRange = [(idx - 1) * Dimensions.get('window').width, idx * Dimensions.get('window').width, (idx + 1) * Dimensions.get('window').width]
        const doWidth = scrollX.interpolate({
            inputRange,
            outputRange: [12, 30, 12],
            extrapolate: 'clamp'
        })
        const backgroundColor = scrollX.interpolate({
            inputRange,
            outputRange: ['#ccc', '#fff','#ccc'],
            extrapolate: 'clamp'
        })
        return <Animated.View 
            key={idx.toString()} 
            style={[
                styles.dot, 
                {width: doWidth, backgroundColor}, 
            ]}
        />
      })}
    </View>
  )
}

export default Pagination

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 10,
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    dot: {
        width: 12,
        height: 12,
        borderRadius: 12,
        marginHorizontal: 3,
        backgroundColor: '#ccc'
    },
})