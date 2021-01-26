import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import RootNavigation from './src/Navigators/RootNavigation'

AppRegistry.registerComponent(appName, () => App);
