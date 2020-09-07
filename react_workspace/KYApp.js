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
  Switch,
} from 'react-native';
import axios from 'axios';
import KYFooter from "./KYFooter";
import KYHeader from "./KYHeader";

import { SERVER_BASIC_URL, REQUEST_TYPE, RESPONSE_TYPE } from "./KYUtil";

export const VIEW_TABLE = {'home':0, 'lottery':1, 'admin':2};


// admin view (관리용)
class KYAdminView extends Component {
  constructor() {
    super();

    this.setupAssigningCell = this.setupAssigningCell.bind(this);
    this.initState = this.initState.bind(this);

    // state
    this.state = { isOn: false, numOfGroups: 0 }

    // 서버 요청해서 현재 상태 받아옴
    this.initState();
  }

  initState() {
    myInstance = this;
    const json = JSON.stringify({
      REQ_TYPE: REQUEST_TYPE['CHECK_NUM_GROUPS'],
    });

    axios.post(SERVER_BASIC_URL, json, { headers: {
      'Content-Type': 'application/json'
    }}
    ).then(function (response) {
      response = response['data'];
        switch(response['RES_TYPE'])
        {
          case RESPONSE_TYPE['SUCCESS']:
            {
              num_groups = response['num_groups'];
              if (num_groups > 0) {
                myInstance.setState({ isOn : true, numOfGroups: num_groups});
              }
            }
            break;
          default:
            break;
        }
    })
    .catch(function (error) {
      alert(error);
    });
  }

  // 셀 개수&뽑기 설정
  setupAssigningCell() {
    if (true == this.state.isOn) // 끄기
    {
      // post 요청
      const json = JSON.stringify({
        REQ_TYPE: REQUEST_TYPE['TURN_OFF_CELL_SELECTION'],
        num_of_groups : 0,
      });
      axios.post(SERVER_BASIC_URL, json, { headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }}
      ).then(function (response) {
        
      }).catch(function (error) {
        alert(error);
      });

      this.setState({ isOn : !this.state.isOn});
    }
    else // 켜기 (기존 결과 db 삭제)
    {
      if (0 >= this.state.numOfGroups)
      {
        alert("그룹 수로 유효하지 않은 값입니다.")
      }
      else
      {
        // post 요청
        const json = JSON.stringify({
          REQ_TYPE: REQUEST_TYPE['TURN_ON_CELL_SELECTION'],
          num_of_groups : this.state.numOfGroups,
        });
        axios.post(SERVER_BASIC_URL, json, { headers: {
          // Overwrite Axios's automatically set Content-Type
          'Content-Type': 'application/json'
        }}
        ).then(function (response) {
          // response handling
        })
        .catch(function (error) {
          alert(error);
        });

        this.setState({ isOn : !this.state.isOn});
      }
    }
  }

  render() {
    return (
      <View style={appStyles.adminView}>
          <TextInput style={appStyles.cellGroupEditBox}
            placeholder="나눌 그룹 수 입력"
            onChangeText={text => this.setState({numOfGroups : parseInt(text)})}
            defaultValue={""}
          />
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={"#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={this.setupAssigningCell}
            value={this.state.isOn}/>
      </View>
    );
  }
}

// home tab view
class KYHomeView extends Component {
  render() {
    return (
      <View style={appStyles.homeView}>
          <Text>
            홈 화면입니다. 공지사항이 추가될 예정입니다.(현서)
          </Text>
      </View>
    );
  }
}

// 셀뽑기 tab view
class KYLotteryView extends Component {
  constructor() {
    super();

    // method
    this.selectCellGroup = this.selectCellGroup.bind(this);
  }

  selectCellGroup() {
    const json = JSON.stringify({
      REQ_TYPE: REQUEST_TYPE['SELECT_MY_CELL'],
      user_name : this.props.userName,
    });

    myName = this.props.userName;
    axios.post(SERVER_BASIC_URL, json, { headers: {
      // Overwrite Axios's automatically set Content-Type
      'Content-Type': 'application/json'
    }}
    ).then(function (response) {
      // 서버에서 보낸 response는 data 섹터이 있음
      response = response['data'];
      switch(response['RES_TYPE'])
      {
        case RESPONSE_TYPE['SUCCESS']:
          {
            cell_no = response['my_cell_no'].toString();
            Alert.alert(
              "성공!",
              myName + "님은 " + cell_no + "번 셀입니다.",
              [
                { text: "확인"},
              ],
            );
          }
          break;
        case RESPONSE_TYPE['NOT_ACTIVATED']:
          {
            alert("셀뽑기가 기간이 아닙니다. 관리자에게 말씀해주세요.");
          }
          break;
        case RESPONSE_TYPE['ALREADY_EXIST']:
          {
            cell_no = response['my_cell_no'].toString();
            Alert.alert(
              "이미 뽑음",
              myName + "님은 " + cell_no + "번 셀입니다.",
              [
                { text: "확인"},
              ],
            );
          }
          break;
        default:
          break;
      }
    })
    .catch(function (error) {
      alert(error);
    });
  }

  render() {
    return (
      <View style={appStyles.lotteryView}>
          <Text>
            셀 뽑기 뷰 (디자인 추천 받아여)
            (알려드릴테니 개발하실 분도 받음)
          </Text>
          <TouchableOpacity style={appStyles.selectCellButton}
            onPress={this.selectCellGroup}
            activeOpacity={0.8}>
            <Text style={appStyles.submitText}>
              셀 뽑기
            </Text>
          </TouchableOpacity>
      </View>
    );
  }
}

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
      case 1: return <KYLotteryView userName={this.myName}/>;
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
  adminView:
  {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'scroll',
    flexDirection: 'row',
    flexWrap: 'wrap'
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
  lotteryView:
  {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
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
  cellGroupEditBox:
  {
    width: '50%',
    height: 40,
    marginTop: 10,
    justifyContent: 'center',
    borderRadius:10,
    borderWidth: 1,
    borderColor: '#111'
  },
  selectCellButton:
  {
    width: '70%',
    height: '10%',
    justifyContent: 'center',
    backgroundColor:'#777777',
    borderRadius: 5,
  },
});