import React, { Component } from 'react'
import { View, Text, StyleSheet, StatusBar, FlatList, TouchableOpacity, SafeAreaView, ActivityIndicator, ToastAndroid, TextInput, Dimensions } from 'react-native'
import { storeDataListAction, readDataListAction } from '../Actions/HomeListActions'
import { connect } from 'react-redux'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage';
import database from '@react-native-firebase/database';

import GifHomeItemView from '../Components/GifHomeItemView'
import HomeHeader from '../Components/HomeHeader'

const { height, width } = Dimensions.get('window')

class HomeScreen extends Component {

  constructor(props) {
    super(props)
    this.state = {
      list: [],
      offset: 0,
      loading: true,
      errorLoading: false,
      initLoad: true,
      favList: [],
      searchGif: '',
      searchList: [],
      isSearching: false,
      userId: ""
    }
  }

  async componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkUser()
      this.setState({ searchGif: '', isSearching: false, searchList: [] })
    });
    this.checkUser()
    this.loadMoreData()

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

    //Using AsyncStorage.................... 

    // console.log("checked favorites");
    // let favListStr = await AsyncStorage.getItem("@favoriteItems")
    // if (favListStr) {
    //   let favList = JSON.parse(favListStr)
    //   this.setState({ favList })
    // }
    // else
    //   this.setState({ favList: [] })


    //Using firebase...........................
    let reference = database().ref("users/" + userId + "/");
    reference.once('value', async (snapshot) => {
      let favListData = []
      if (snapshot.exists()) {
        snapshot.forEach(async childSnapshot => {
          favListData.push(childSnapshot.val());
        })
      }
      this.setState({ favList: favListData })
    }, (error) => {
      // this.setState({ errorLoading: true, })
    })
  }

  loadMoreData = () => {

    this.setState({ loading: true })
    axios.get(`http://api.giphy.com/v1/gifs/trending?api_key=RGS3TOZiKXScGnGpqVcyLQDgvXRWj6sm&limit=10&offset=${this.state.offset}&q=`)
      .then(async (response) => {
        await this.props.storeDataListAction({
          list: [...this.state.list, ...response.data.data]
        })
        this.setState({ list: [...this.state.list, ...response.data.data], offset: this.state.offset + 11, loading: false, initLoad: false })
      })
      .catch((error) => {
        console.log(error)
        ToastAndroid.showWithGravity("Something went wrong.", ToastAndroid.SHORT, ToastAndroid.BOTTOM);
      })
  }

  listFooter = () => {
    return (
      this.state.isSearching
        ?
        <></>
        :
        <View style={styles.footerList}>
          <TouchableOpacity
            disabled={this.state.loading}
            activeOpacity={0.9}
            onPress={() => this.loadMoreData()}
            style={styles.loadMoreButton}>
            <Text style={styles.loadMoreTxt}>Load More</Text>
            {this.state.loading ? (
              <ActivityIndicator
                color="white"
                style={{ marginLeft: 8 }} />
            ) : null}
          </TouchableOpacity>
        </View>
    );
  };

  onFavoritePress = async (item) => {
    let { favList } = this.state
    let newItems = []
    if (favList.filter(e => e.id === item.id).length > 0) {

      //Remove item from firebase
      await database()
        .ref('users/' + this.state.userId + "/" + item.id)
        .remove();

      //AsyncStorage.............
      const filteredItems = favList.filter((e) => e.id !== item.id);
      await AsyncStorage.setItem("@favoriteItems", JSON.stringify(filteredItems))
      this.setState({ favList: filteredItems })
      ToastAndroid.showWithGravity("Gif removed from favorites list.", ToastAndroid.SHORT, ToastAndroid.BOTTOM);
    }
    else {
      if (favList.length == 5) {
        ToastAndroid.showWithGravity("You can add only 5 items in favorite list.", ToastAndroid.SHORT, ToastAndroid.BOTTOM);
        return
      }

      //Add item from firebase
      database()
        .ref('users/' + this.state.userId + "/" + item.id + "/")
        .set(item)
        .then(() => {
          // console.log('Data set.')
        });


      //AsyncStorage.............
      newItems = [...favList, item]
      await AsyncStorage.setItem("@favoriteItems", JSON.stringify(newItems))
      this.setState({ favList: newItems })
      ToastAndroid.showWithGravity("Gif added to favorites list.", ToastAndroid.SHORT, ToastAndroid.BOTTOM);

    }

  }

  onChangeValue = async (value) => {
    this.setState({ searchGif: value });

    const filteredItems = this.state.list.filter((e) => e.title.toLowerCase().includes(value.toLowerCase()));
    if (value !== "")
      this.setState({ searchList: filteredItems, isSearching: true })
    else
      this.setState({ isSearching: false })
  }


  render() {

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar backgroundColor={'#c53434'} barStyle={'light-content'} />
        <HomeHeader onPressFavList={() => {
          this.props.navigation.navigate("favoriteScreen")
        }} />
        {
          this.state.initLoad
            ?
            <View style={styles.initLoaderView}>
              <ActivityIndicator
                size={'large'}
                color="black"
                style={{ marginLeft: 8 }} />
              <Text style={{ marginTop: 10 }}>Loading data...</Text>
            </View>
            :
            <View style={styles.container}>

              <View style={{ width: width, alignItems: 'center', marginVertical: -10 }}>
                <TextInput
                  style={styles.inputStyle}
                  placeholder={"Search gif here"}
                  value={this.state.searchGif}
                  onChangeText={value => { this.onChangeValue(value) }}
                  autoCorrect={false}
                  keyboardType={"visible-password"}
                />
              </View>

              <FlatList
                // data={this.props.listData.list}
                data={this.state.isSearching ? this.state.searchList : this.props.listData.list}
                keyExtractor={({ item, index }) => index}
                enableEmptySections={true}
                renderItem={({ item, index }) =>
                  <GifHomeItemView item={{
                    gifImage: item.images.original.url,
                    title: item.title
                  }}
                    onItemPress={() => {
                      this.props.navigation.navigate("detailScreen", {
                        item: {
                          id: item.id,
                          title: item.title,
                          url: item.images.original.url,
                          rating: item.rating,
                          source: item.source_post_url,
                          username: item.username,
                          importedOn: item.import_datetime
                        },
                      })
                    }}
                    onFavoritePress={() => {
                      this.onFavoritePress({
                        id: item.id,
                        title: item.title,
                        url: item.images.original.url,
                        rating: item.rating,
                        source: item.source_post_url,
                        username: item.username,
                        importedOn: item.import_datetime
                      })
                    }}
                    favIcon={this.state.favList.filter(e => e.id === item.id).length > 0 ? "heart" : 'hearto'}
                  />
                }
                ListFooterComponent={this.listFooter()}
              />
            </View>
        }
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    flex: 1,
  },
  footerList: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  loadMoreButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#c53434',
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadMoreTxt: {
    fontSize: 16,
    color: "white",
    fontWeight: 'bold'
  },
  initLoaderView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%'
  },
  inputStyle: {
    flexDirection: 'row',
    marginVertical: 20,
    backgroundColor: '#fafafa',
    padding: 12,
    borderWidth: 0.5,
    borderColor: '#000',
    fontSize: 15,
    color: '#000',
    width: '90%',
    borderRadius: 5,
  },
})


const mapStateToProps = state => {
  // console.log("State",state);
  return {
    listData: state && state.listData
  }
}

const mapDispatchToProps = dispatch => ({
  storeDataListAction: (payload) => dispatch(storeDataListAction(payload)),
  readDataListAction: (payload) => dispatch(readDataListAction(payload))
})

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen)
