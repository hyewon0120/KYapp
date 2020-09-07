import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Switch,
} from 'react-native';
import axios from 'axios';
import { SERVER_BASIC_URL, REQUEST_TYPE, RESPONSE_TYPE } from "./KYUtil";

// admin view (관리용)
class KYAdminView extends Component {
  styles = StyleSheet.create({
    adminView:
    {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'scroll',
      flexDirection: 'row',
      flexWrap: 'wrap'
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
  });

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
      <View style={this.styles.adminView}>
          <TextInput style={this.styles.cellGroupEditBox}
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

export default KYAdminView