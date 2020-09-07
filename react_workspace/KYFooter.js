import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import {VIEW_TABLE} from './KYApp';

class KYFooterTab extends Component {
  styles = StyleSheet.create({
    tabContainer:
    {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    imageDefault:
    {
      width: 25,
      height: 25,
    },
  });

  constructor() {
    super();
    this.onPressHandler = this.onPressHandler.bind(this);
  }

  onPressHandler()
  {
    this.props.changeView(VIEW_TABLE[this.props.tabName]);
  }

  getTabImagePath()
  {
    // NOTE(김현서) : require 생성시 static한 string으로만 넘겨야 함..... 2020.6.6
    switch(this.props.tabName)
    {
      case 'home': return require('./resource/img/home.png');
      case 'lottery': return require('./resource/img/lottery.png');
      case 'admin': return require('./resource/img/admin.png');
    }
  }

  render() {
    return (
      <TouchableOpacity style={this.styles.tabContainer} onPress={this.onPressHandler}>
        <Image
        style={this.styles.imageDefault}
        source={this.getTabImagePath()}/>
      </TouchableOpacity>
    )
  }
}

class KYFooter extends Component {
  styles = StyleSheet.create({
    footerContainer:
    {
      flex: 1,
      flexDirection: 'row',
      backgroundColor: '#eee',
    },
  });

  render() {
    let adminTab = null;
    if (true == this.props.adminMode) {
      adminTab = <KYFooterTab tabName='admin' changeView={this.props.changeView}/>;
    }

    return (
      <View style={this.styles.footerContainer}>
        <KYFooterTab tabName='home' changeView={this.props.changeView}/>
        <KYFooterTab tabName='lottery' changeView={this.props.changeView}/>
        {adminTab}
      </View>
    )
  }
}

export default KYFooter