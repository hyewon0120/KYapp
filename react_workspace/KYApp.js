/**
 * Main Entry View
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';

import KYFooter from "./KYFooter";
import KYHeader from "./KYHeader";
import KYAdminView from "./KYAdminView";
import KYHomeView from "./KYHomeView";
import KYCellLoterryView from "./KYCellLotteryView";

import { SERVER_BASIC_URL, REQUEST_TYPE, RESPONSE_TYPE } from "./KYUtil";

export const VIEW_TABLE = {'home':0, 'lottery':1, 'admin':2};

export default class KYApp extends Component {
  constructor() {
    super();
    
    // state
    this.state = { viewIndex: VIEW_TABLE['home'], login: false, userName: '' }

    // method
    this.setViewState = this.setViewState.bind(this);
    this.getCurrentTabView = this.getCurrentTabView.bind(this);
    this.doLogin = this.doLogin.bind(this);

    // member
    this.logo = require('./resource/img/KY_logo.png');
    this.myName = "";
    this.adminMode = false;
  }

  getCurrentTabView() {
    switch (this.state.viewIndex) {
      case 0: return <KYHomeView/>;
      case 1: return <KYCellLoterryView userName={this.myName}/>;
      case 2: return <KYAdminView/>;
      default: return;
    }
  }

  setViewState(newState) {
    this.setState( { viewIndex: newState } );
  }

  doLogin() {
    if ('' == this.state.userName)
    {
      Alert.alert(
        "경고",
        "이름을 입력해주세요.",
        [
          { text: "싫어요", onPress: () => alert("성격나쁘시네")},
          { text: "넵"},
        ],
      );
    }
    else
    {
      this.myName = this.state.userName;

      // 이름뒤 admin이 붙은경우 admin mode on
      splitedString = this.myName.split(":");
      if (splitedString.length == 2) {
        if (splitedString[1] == "admin") {
          this.adminMode = true;
        }
      }

      this.setState({login: true});
    }
  }

  render() {
    let currentTabView = this.getCurrentTabView();

    if (true == this.state.login) // 일반 뷰 (로고가 흐릿하게 보임)
    {
      return (
        <View style={appStyles.mianContainer}>
          <KYHeader/>
          <View style={appStyles.bodyContainer}>
            <Image source={this.logo} style={appStyles.imageBackground}/>
            {currentTabView}
          </View>
          <KYFooter adminMode={this.adminMode} changeView={this.setViewState}/>
        </View>
      );
    }
    else // login view, center align을 위해 style을 home view로 적용
    {
      return (
        <View style={appStyles.homeView}>
          <Image source={this.logo} style={appStyles.imageBackground_login}/>
          <TextInput style={appStyles.nameEditBox}
            placeholder="Your Name"
            onChangeText={text => this.setState({userName : text})}
            defaultValue={this.state.userName}
          />
          <TouchableOpacity style={appStyles.submitButton} onPress={this.doLogin}>
            <Text style={appStyles.submitText}>
              login
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
  }
}

const appStyles = StyleSheet.create({
  mianContainer:
  {
    flex: 1,
    backgroundColor: '#fff',
  },
  bodyContainer:
  {
    flex: 15,
  },
  homeView:
  {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageBackground:
  {
    position: 'absolute',
    left: '35%',
    top: '35%',
    width: '30%',
    height: '30%',
    resizeMode:'contain',
    opacity: 0.3,
  },
  imageBackground_login:
  {
    width: '30%',
    height: '30%',
    resizeMode:'contain',
  },
  submitButton:
  {
    width: '90%',
    height: 40,
    marginTop: 10,
    justifyContent: 'center',
    backgroundColor:'#68a0cf',
    borderRadius:10,
    borderWidth: 1,
    borderColor: '#fff'
  },
  submitText:
  {
    color:'#fff',
    textAlign:'center',
  },
  nameEditBox:
  {
    width: '90%',
    height: 40,
    marginTop: 10,
    justifyContent: 'center',
    borderRadius:10,
    borderWidth: 1,
    borderColor: '#111'
  },
});