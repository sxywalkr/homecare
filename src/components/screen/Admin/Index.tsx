import React, { Component } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  View,
  AsyncStorage,
} from 'react-native';

import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view';
import TabBar from 'react-native-underline-tabbar';
import { ratio, colors } from '../../../utils/Styles';
import CpKonfirmasiDeposit from './CpKonfirmasiDeposit';
import CpRequestVisit from './CpRequestVisit';
import CpStatusVisit from './CpStatusVisit';

const Page = (tabLabel, {label}) => (
  <View style={styles.container}>
    <View style={styles.header} />
    {/* <Image style={styles.avatar} /> */}
    <View style={styles.body}>
      <View style={styles.bodyContent}>
        {/* <Text style={styles.name2}>متى الهجرة</Text> */}
        <Text style={styles.description}>Mattalhijra developer</Text>
        <Text style={styles.info}>mattalhijra@gmail.com</Text>
      </View>
  </View>
  </View>
);

class Index extends Component<any, any> {

  constructor(props) {
    super(props);
  }

  public render() {
      return (
        <View style={styles.container}>
        <ScrollableTabView
            tabBarActiveTextColor='#53ac49'
            renderTabBar={() => <TabBar underlineColor='#53ac49' />}
            style={{width: '100%'}}
            >
          <CpKonfirmasiDeposit tabLabel={{label: 'Konfirmasi Deposit'}} navigation={ this.props.navigation } />
          <CpRequestVisit tabLabel={{label: 'Request Visit'}} navigation={ this.props.navigation } />
          <CpStatusVisit tabLabel={{label: 'Status Visit'}} navigation={ this.props.navigation } />
          {/* <Page tabLabel={{label: 'Developr'}} /> */}
          {/* <Page tabLabel={{label: 'Page Demo'}} />
          <Page tabLabel={{label: 'Page Demo'}} /> */}
        </ScrollableTabView>
        </View>
      );
  }

}

export default Index;

const styles: any = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    // flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  header: {
    backgroundColor: '#00BFFF',
    height: 200,
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: 'white',
    marginBottom: 10,
    alignSelf: 'center',
    position: 'absolute',
    marginTop: 130,
  },
  name: {
    fontSize: 22,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  body: {
    marginTop: 40,
  },
  bodyContent: {
    flex: 1,
    alignItems: 'center',
    padding: 30,
  },
  name2: {
    fontSize: 28,
    color: '#696969',
    fontWeight: '600',
  },
  info: {
    fontSize: 16,
    color: '#00BFFF',
    marginTop: 10,
  },
  description: {
    fontSize: 16,
    color: '#696969',
    marginTop: 10,
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 10,
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: 250,
    borderRadius: 30,
    backgroundColor: '#00BFFF',
  },
});
