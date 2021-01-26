import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, ToastAndroid, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'
import database from '@react-native-firebase/database';

import GifHomeItemView from '../Components/GifHomeItemView'

class FavoriteListScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      favList: [],
      userId: '',
      loading: false,
    };
  }

  async componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkUser()
    });
    this.checkUser()
  }
  componentWillUnmount() {
    this.unsubscribe
  }

  checkUser = async () => {
    const userId = await AsyncStorage.getItem("@userId")
    if (userId) {
      // console.log("userId", userId);
      this.setState({ userId: userId })
      this.checkFavorites(userId)
    }
  }


  checkFavorites = async (userId) => {

    // AsyncStorage.................
    let favListStr = await AsyncStorage.getItem("@favoriteItems")
    if (favListStr) {
      let favList = JSON.parse(favListStr)
      this.setState({ favList: favList })
    }

    //Using firebase...............
    // let reference = database().ref("users/"+userId+"/");
    // reference.once('value', async(snapshot) => {
    //     let favListData = []
    //     if(snapshot.exists())
    //     { 
    //       snapshot.forEach(async childSnapshot => {
    //           favListData.push(childSnapshot.val());
    //           this.setState({ favList: favListData,})
    //       })
    //     }
    //     this.setState({loading:false})
    // }, (error) => {
    //     // this.setState({ errorLoading: true, })
    // })

  }

  onFavoritePress = async (id) => {

    //Remove item from firebase
    await database()
      .ref('users/' + this.state.userId + "/" + id)
      .remove();

    //AsyncStorage...............
    const filteredItems = this.state.favList.filter((e) => e.id !== id);
    await AsyncStorage.setItem("@favoriteItems", JSON.stringify(filteredItems))
    this.setState({ favList: filteredItems })
    ToastAndroid.showWithGravity("Gif removed from favorites list.", ToastAndroid.SHORT, ToastAndroid.BOTTOM);
  }

  render() {

    return (
      <View style={styles.container}>
        {
          this.state.loading
            ?
            <View style={styles.initLoaderView}>
              <ActivityIndicator
                size={'large'}
                color="black"
                style={{ marginLeft: 8 }} />
              <Text style={{ marginTop: 10 }}>Loading List...</Text>
            </View>
            :
            this.state.favList.length == 0
              ?
              <Text style={styles.emptyTxt}>List is Empty</Text>
              :
              <FlatList
                data={this.state.favList}
                keyExtractor={({ item, index }) => index}
                enableEmptySections={true}
                renderItem={({ item, index }) =>
                  <GifHomeItemView item={{
                    gifImage: item.url,
                    title: item.title
                  }}
                    onItemPress={() => {
                      this.props.navigation.navigate("detailScreen", {
                        item: item
                      })
                    }}
                    onFavoritePress={() => { this.onFavoritePress(item.id) }}
                    favIcon={this.state.favList.filter(e => e.id === item.id).length > 0 ? "heart" : 'hearto'}
                  />
                }
              />
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  emptyTxt: {
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold'
  },
  initLoaderView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%'
  },

})

export default FavoriteListScreen;
