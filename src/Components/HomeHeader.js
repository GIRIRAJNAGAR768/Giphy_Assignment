import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

const HomeHeader = ({ onPressFavList }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.headTitle}>{"GIPHY"}</Text>
            {/* <Text style={{...styles.headTitle,fontSize:14,marginTop:-5}}>{"powered by Giphy"}</Text> */}
            <FontAwesome onPress={() => {
                onPressFavList()
            }} style={{ position: 'absolute', right: 20 }} name={'bookmark'} size={30} color={'white'} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 55,
        width: '100%',
        backgroundColor: '#c53434',
        justifyContent: 'center',
        alignItems: 'center'
    },
    headTitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold'
    },

})

export default HomeHeader
