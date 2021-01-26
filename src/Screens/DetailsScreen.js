import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Image, ToastAndroid, Linking } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import AsyncStorage from '@react-native-async-storage/async-storage'
import database from '@react-native-firebase/database';

const DetailsScreen = (props) => {

    const [favData, setFavData] = useState([])
    const [userId, setUserId] = useState("")
    let details = props.route.params.item

    useEffect(() => {
        checkUser()
        checkFavData()
    }, [])


    const checkUser = async () => {
        const userId = await AsyncStorage.getItem("@userId")
        if (userId) {
            setUserId(userId)
        }
    }

    const checkFavData = async () => {

        let favListStr = await AsyncStorage.getItem("@favoriteItems")
        if (favListStr) {
            let favList = JSON.parse(favListStr)
            setFavData(favList)
        }
    }

    const onFavoritePress = async () => {
        let newItems = []
        if (favData.filter(e => e.id === details.id).length > 0) {

            //Remove item from firebase
            await database()
                .ref('users/' + userId + "/" + details.id)
                .remove();

            const filteredItems = favData.filter((e) => e.id !== details.id);
            await AsyncStorage.setItem("@favoriteItems", JSON.stringify(filteredItems))
            setFavData(filteredItems)
            ToastAndroid.showWithGravity("Gif removed from favorites list.", ToastAndroid.SHORT, ToastAndroid.BOTTOM);
        }
        else {
            if (favData.length == 5) {
                ToastAndroid.showWithGravity("You can add only 5 items in favorite list.", ToastAndroid.SHORT, ToastAndroid.BOTTOM);
                return
            }

            //Add item from firebase
            database()
                .ref('users/' + userId + "/" + details.id + "/")
                .set(details)
                .then(() => {
                    // console.log('Data set.')
                }
            );

            newItems = [...favData, details]
            await AsyncStorage.setItem("@favoriteItems", JSON.stringify(newItems))
            setFavData(newItems)
            ToastAndroid.showWithGravity("Gif added to favorites list.", ToastAndroid.SHORT, ToastAndroid.BOTTOM);
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.imageView}>
                <Image
                    source={{ uri: details.url }}
                    style={styles.image}
                />
            </View>
            <View style={styles.detailsViewParent}>

                <View style={styles.detailsView}>
                    <Text style={styles.titleTxt}>{details.title}</Text>
                    <Text style={styles.otherTxt}>{"Uploaded By: " + details.username}</Text>
                    <Text style={styles.otherTxt}>{"Rating: " + details.rating}</Text>
                    <Text style={styles.otherTxt}>{"Imported On: " + details.importedOn}</Text>
                    <Text onPress={async () => {
                        const supported = await Linking.canOpenURL(details.source == "" ? " " : details.source)
                        if (supported)
                            await Linking.openURL(details.source);
                        else
                            ToastAndroid.showWithGravity("can not open url.", ToastAndroid.SHORT, ToastAndroid.BOTTOM);
                    }} style={styles.sourceTxt}>{"Source: " + details.source}</Text>
                </View>

                <View style={styles.favIconView}>
                    <AntDesign onPress={() => {
                        onFavoritePress()
                    }} name={favData.filter(e => e.id === details.id).length > 0 ? "heart" : 'hearto'} size={30} color="#c53434" />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 2,
        margin: 2,
    },
    imageView: {
        height: '40%',
        width: '100%'
    },
    image: {
        height: '100%',
        width: "100%",
        backgroundColor: '#eeecec'
    },
    detailsViewParent: {
        padding: 5,
        width: '100%',
        backgroundColor: 'white',
        elevation: 2,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    detailsView: {
        width: '88%',
        height: '100%',
        backgroundColor: 'white',
        padding: 5
    },
    titleTxt: {
        marginBottom: 10,
        fontSize: 18,
        fontWeight: 'bold'
    },
    otherTxt: {
        fontSize: 16,
        marginBottom: 10
    },
    sourceTxt: {
        fontSize: 16,
        textDecorationLine: 'underline'
    },
    favIconView: {
        width: '12%',
        height: '100%',
        backgroundColor: 'white',
        alignItems: 'center',
        paddingTop: 20
    }
})

export default DetailsScreen
