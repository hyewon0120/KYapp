import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

class KYHomeTab extends Component {
  styles = StyleSheet.create({
    homeTabContainer:
    {
      flex: 1,
      margin: 2,
      justifyContent: 'center',
      alignItems: 'center',
    },
    tabButton:
    {
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  render() {
    var colorStyles = { backgroundColor: '#ff9999' };
    if (this.props.color)
    {
      colorStyles = { backgroundColor: this.props.color, };
    }

    return (
      <View style={this.styles.homeTabContainer}>
          <TouchableOpacity style={[this.styles.tabButton, colorStyles]}
            //onPress={this.selectCellGroup}
            activeOpacity={0.8}>
            <Text>
              {this.props.tabDesc}
            </Text>
          </TouchableOpacity>
      </View>
    );
  }
}

// home view
class KYHomeView extends Component {
  styles = StyleSheet.create({
    homeView:
    {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    tabsWrapper:
    {
      width: '100%',
      height: 200,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      marginBottom: 10,
    },
  });

  render() {
    return (
      <View style={this.styles.homeView}>
          {/* upper wapper */}
          <View style={this.styles.tabsWrapper}>

            <View style={{width:'50%'}}>
              <KYHomeTab tabDesc="이런식으로"></KYHomeTab>
              <KYHomeTab tabDesc="색깔변경!" color="#77ee33"></KYHomeTab>
            </View>
            <KYHomeTab tabDesc="될듯"></KYHomeTab>

          </View>

          {/* lower wapper */}
          <View style={this.styles.tabsWrapper}>

            <KYHomeTab tabDesc="글쿤"></KYHomeTab>
            <View style={{width:'50%'}}>

              <KYHomeTab tabDesc="ㅋ"></KYHomeTab>
              <KYHomeTab tabDesc="될듯111"></KYHomeTab>
            </View>

          </View>
      </View>
    );
  }
}

export default KYHomeView