import React from 'react'
import { View, Text, StyleSheet, Image, Platform, TouchableOpacity, TouchableNativeFeedback } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'

const TouchableElement = Platform.OS === 'ios' ? TouchableOpacity : TouchableNativeFeedback

export default GifHomeItemView = ({ item, onItemPress, onFavoritePress, favIcon }) => {
    return (
        <TouchableElement onPress={() => onItemPress()}>
            <View style={styles.container}>
                <Image
                    thumbnailSource={{ uri: item.gifImage + "?w=50&buster=1" }}
                    source={{ uri: item.gifImage }}
                    style={styles.image}
                />
                <View style={styles.detailsContainer}>
                    <View style={{ width: '90%' }}>
                        <Text style={{ fontSize: 14 }}>{item.title}</Text>
                    </View>
                    <View style={styles.favIconView}>
                        <AntDesign onPress={() => {
                            onFavoritePress()
                        }} name={favIcon} size={30} color="#c53434" />
                    </View>
                </View>
            </View>
        </TouchableElement>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 400,
        width: '100%',
        backgroundColor: 'white',
        alignItems: 'center',
        margin: 5,
        padding: 5,
        elevation: 2,
        borderRadius: 10
    },
    image: {
        height: '85%',
        width: "98%",
        backgroundColor: '#eeecec'
    },
    detailsContainer: {
        width: '95%',
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        height: '15%'
    },
    favIconView: {
        width: '10%',
        justifyContent: 'center',
        alignItems: 'center'
    }

})