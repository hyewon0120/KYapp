import React, { Component } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

class KYHeader extends Component {
  styles = StyleSheet.create({
    headerContainer:
    {
      flex: 1,
      backgroundColor: '#eee',
    },
  });

  render() {
    return (
      <View style={this.styles.headerContainer}>
      </View>
    )
  }
}

export default KYHeader