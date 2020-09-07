import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import axios from 'axios';
import { SERVER_BASIC_URL, REQUEST_TYPE, RESPONSE_TYPE } from "./KYUtil";

// 셀뽑기 tab view
class KYCellLotteryView extends Component {
  styles = StyleSheet.create({
    lotteryView:
    {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    
    selectCellButton:
    {
      width: '70%',
      height: '10%',
      justifyContent: 'center',
      backgroundColor:'#777777',
      borderRadius: 5,
    },

    submitText:
    {
      color:'#fff',
      textAlign:'center',
    },
  });

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
      // 서버에서 보낸 response는 data 섹터에 있음
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
      <View style={this.styles.lotteryView}>
          <Text>
            셀 뽑기 뷰 (디자인 추천 받아여)
            (알려드릴테니 개발하실 분도 받음)
          </Text>
          <TouchableOpacity style={this.styles.selectCellButton}
            onPress={this.selectCellGroup}
            activeOpacity={0.8}>
            <Text style={this.styles.submitText}>
              셀 뽑기
            </Text>
          </TouchableOpacity>
      </View>
    );
  }
}

export default KYCellLotteryView