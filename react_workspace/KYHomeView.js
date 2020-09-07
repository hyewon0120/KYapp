import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';

// home tab view
class KYHomeView extends Component {
  styles = StyleSheet.create({
    homeView:
    {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  render() {
    return (
      <View style={this.styles.homeView}>
          <Text>
            홈 화면입니다. 공지사항이 추가될 예정입니다.(현서)
          </Text>
      </View>
    );
  }
}

export default KYHomeView