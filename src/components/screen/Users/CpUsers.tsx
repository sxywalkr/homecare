import React, { Component } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  View,
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  Button,
  Alert,
  ScrollView,
  Platform,
} from 'react-native';
import { ratio, colors } from '../../../utils/Styles';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { inject } from 'mobx-react/native';
import * as db1 from '../../../firebase/firebase';
import NumberFormat from 'react-number-format';
// import ImagePicker from 'react-native-image-crop-picker';
import ImagePicker from 'react-native-image-picker';
// import * as firebase from '../../../firebase/firebase';
import firebase from 'firebase';
import RNFetchBlob from 'rn-fetch-blob';
import Moment from 'moment';
import RNFS from 'react-native-fs';

interface IProps {
  navigation?: any;
  store?: any;
}

interface IState {
  isLoaded: boolean;
  users: any;
}

@inject('store') @observer
class Screen extends Component<IProps, IState> {

  private taskUser: any;

  constructor(props) {
    super(props);
    this.taskUser = db1.db.ref(`users/${this.props.store.user.uid}`);
    this.props.store.user.userPilihObatAktif = 'Tidak';
    this.state = {
      isLoaded: true,
      users: [],
    };
  }

  public componentDidMount() {
    this.getFirstData(this.taskUser);
    // console.log('cpUser', this.props.store.user.userAvatar1);
  }

  public render() {
    return (
      <View style={styles.topContainer}>
        <ScrollView>
        { this.state.isLoaded ?
            <ActivityIndicator /> :
            <View style={styles.container}>
              { this.state.users.map( (el, key) =>
                <View style={styles.header} key={key}>
                  <View style={styles.headerContent}>
                    <TouchableOpacity
                      onPress={() => this._onPressAva5()}
                      >
                      <Image style={styles.avatar}
                        source={{uri: el.userAvatar }}/>
                    </TouchableOpacity>
                    <Text style={styles.name}>Halo, {el.namaLengkap}</Text>
                    {/* <Text style={styles.textInfo}>Alamat {el.alamat}</Text> */}
                    <NumberFormat
                      value={el.saldoDeposit}
                      displayType={'text'} thousandSeparator={true} prefix={'Rp. '}
                      renderText={(value) => <Text style={styles.textInfo}>Saldo : {value}</Text>} />
                  </View>
                  <View style={styles.bodyContent}>
                    <Text style={styles.smallTextInfo}>Status request : {el.requestVisit}</Text>
                    <TouchableOpacity
                        style={ parseInt(el.saldoDeposit, 10) >= parseInt('50000', 10) &&
                                  el.statusDeposit === 'OK' && el.requestVisit === 'Idle'  ?
                                    [styles.buttonContainer, styles.loginButton] :
                                    [styles.buttonContainerDisabled, styles.loginButtonDisabled] }
                        onPress={() => this._onRequest(el)}
                        disabled={ parseInt(el.saldoDeposit, 10) >= parseInt('50000', 10) &&
                                    el.statusDeposit === 'OK' && el.requestVisit === 'Idle' ? false : true }
                      >
                          <Text style={ parseInt(el.saldoDeposit, 10) >= parseInt('50000', 10) &&
                                          el.statusDeposit === 'OK' && el.requestVisit === 'Idle' ?
                                [styles.buttonText] :
                                [styles.buttonTextDisabled] }>Layanan Homecare</Text>
                      </TouchableOpacity>
                    {/* <Text style={styles.itemSpaceV10} /> */}

                    {/* <Text style={styles.smallTextInfo}>Status request : {el.requestVisitObat}</Text> */}
                    <TouchableOpacity
                        style={ this.props.store.user.userPilihObatAktif !== 'Tidak' ?
                                [styles.buttonContainer, styles.loginButton] :
                                [styles.buttonContainerDisabled, styles.loginButtonDisabled] }
                        onPress={() => this.props.navigation.navigate('PilihanObat')}
                        disabled={ this.props.store.user.userPilihObatAktif !== 'Tidak' ? false : true }
                      >
                          <Text style={ this.props.store.user.userPilihObatAktif !== 'Tidak' ?
                                [styles.buttonText] :
                                [styles.buttonTextDisabled] }>Layanan Beli dan Antar Obat</Text>
                      </TouchableOpacity>

                    {/* <Text style={styles.itemSpaceV10} /> */}
                    <Text style={styles.smallTextInfo}>Status pembayaran : {el.statusDeposit}</Text>
                      {/* { el.statusDeposit !== 'OK' &&
                      <Text style={styles.smallTextInfo}>Silahkan melakukan transfer ke rekening berikut dan
                        melakukan konfirmasi transfer, petugas kami akan melakukan
                        verifikasi setelahnya</Text>
                      } */}
                      <TouchableOpacity
                        style={ el.statusDeposit === 'Menunggu verifikasi' ?
                                [styles.buttonContainerDisabled, styles.loginButtonDisabled] :
                                [styles.buttonContainer, styles.loginButton] }
                        onPress={() => this.props.navigation.navigate('InputKonfirmasiDeposit', { qey : {el} })}
                        disabled={ el.statusDeposit === 'Menunggu verifikasi' ? true : false }
                      >
                          <Text style={ el.statusDeposit === 'Menunggu verifikasi' ?
                                [styles.buttonTextDisabled] :
                                [styles.buttonText] }>Konfirmasi Pembayaran</Text>
                      </TouchableOpacity>
                      {/* <Button title=' Konfirmasi Deposit '
                        // color='#841584'
                        onPress={() => this.props.navigation.navigate('InputKonfirmasiDeposit', { qey : {el} })}
                        disabled={ el.statusDeposit === 'Menunggu verifikasi' ? true : false }
                      /> */}
                  </View>
                </View>,
              )}
            </View>
        }
      </ScrollView>
      </View>
    );
  }

  private async getFirstData( p ) {
    await p.on('value', (result) => {
      const r1 = [];
      r1.push(result.val());
      this.setState({
        users: r1,
        isLoaded: false,
      });
      // this.props.store.user.userAvatar1 = result.val().userAvatar;
      // console.log('cpUser', this.props.store.user.userAvatar1);
    });
  }

  private _onRequest( p ) {
    // const url2 = 'users/' + this.props.store.user.uid + '/visit';
    // const a2 = db1.db.ref(url2).push();
    // db1.db.ref(url2 + '/' + a2.key).update({
    //   _id: a2.key,
    //   uid: this.props.store.user.uid,
    //   namaLengkap: this.props.store.user.userNamaLengkap,
    //   tanggalRequestVisit: Moment().format('DD/MM/YYYY'),
    //   alamat: p.alamat,
    //   handphone: p.handphone,
    //   requestVisit: 'Request visit',
    // });
    // db1.db.ref('users/' + this.props.store.user.uid).update({
    //   requestVisit: 'Request visit',
    // });
    // const url = 'homecare/visit';
    // // const a = db1.db.ref(url).push();
    // db1.db.ref(url + '/' + a2.key).update({
    //   _id: a2.key,
    //   uid: this.props.store.user.uid,
    //   namaLengkap: this.props.store.user.userNamaLengkap,
    //   tanggalRequestVisit: Moment().format('DD/MM/YYYY'),
    //   alamat: p.alamat,
    //   handphone: p.handphone,
    //   requestVisit: 'Request visit',
    // });

    this.props.navigation.navigate('LayananHomecare');
  }

  private _onPressAva2() {
    const options = {
      title: 'Select Avatar',
      // customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.showImagePicker(options, (response) => {
      const image = response.uri;
      const dbRef = firebase.storage().ref('users/' + this.props.store.user.uid + '/images/ava.jpg');
      RNFS.read(image, 0, 0,  'base64')
        .then((resx) => {
          console.log(resx);
          dbRef.put(resx)
            .then(() => {
              console.log('res', dbRef.getDownloadURL());
              // db1.db.ref('users/' + this.props.store.user.uid).update({
              //   userAvatar: dbRef.getDownloadURL(),
              // });
            })
            .catch((err) => {
              console.log(err);
            });
        });

    });
  }

  private _onPressAva3() {
    const options = {
      title: 'Select Avatar',
      // customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.showImagePicker(options, (response) => {
      const image = response.data.toString();
      const dbRef = firebase.storage().ref('users/' + this.props.store.user.uid + '/images/ava.jpg');
      const a = new Blob([image], {type : 'image/jpeg'});
      dbRef.put(a)
        .then((res) => {
          console.log('res', dbRef.getDownloadURL());
          db1.db.ref('users/' + this.props.store.user.uid).update({
            userAvatar: dbRef.getDownloadURL(),
          });
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }

  private _onPressAva4() {
    const options = {
      title: 'Select Avatar',
      // customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.showImagePicker(options, (response) => {
      console.log('filesize', response.type, response.fileSize);
      const image = response.uri;
      const dbRef = firebase.storage().ref('users/' + this.props.store.user.uid + '/images/ava.jpg');

      const Blob = RNFetchBlob.polyfill.Blob;
      window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
      window.Blob = Blob;
      Blob.build(RNFetchBlob.wrap(image), { type: response.type + ';' })
        .then((blob) => {
          dbRef
            .put(blob)
            .then(() => {
              return dbRef.getDownloadURL();
            })
            .then((res) => {
              console.log('RES', res);
            });
        });
    });
  }

  private _onPressAva5() {
    const options = {
      title: 'Select Avatar',
      // customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.showImagePicker(options, (response) => {
      // console.log('filesize', response.type, response.fileSize);
      const image = response.uri;
      const dbRef = firebase.storage().ref('users/' + this.props.store.user.uid + '/images/ava.jpg');

      const Blob = RNFetchBlob.polyfill.Blob;
      const fs = RNFetchBlob.fs;
      window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
      window.Blob = Blob;

      const uploadImage = (uri, fbRef, mime = 'image/jpg') => {
        return new Promise((resolve, reject) => {
          const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
          let uploadBlob = null;
          // const imageRef = firebase.storage().ref('posts').child(imageName);
          const imageRef = fbRef;
          fs.readFile(uploadUri, 'base64')
            .then((data) => {
              return Blob.build(data, { type: `${mime};BASE64` });
            })
            .then((blob) => {
              uploadBlob = blob;
              return imageRef.put(blob, { contentType: mime });
            })
            .then(() => {
              uploadBlob.close();
              return imageRef.getDownloadURL();
            })
            .then((url) => {
              resolve(url);
              // console.log(url);
            })
            .catch((error) => {
              reject(error);
            });
        });
      };

      uploadImage(image, dbRef)
        .then((res) => {
          console.log(res);
          db1.db.ref('users/' + this.props.store.user.uid).update({
            userAvatar: res,
          });
        })
        .catch((err) => {
          console.log(err);
        })
      ;
    });
  }

  // error
  private _onPressAvatar() {
    // console.log(this.props.store.user.userAvatar);
    const options = {
      title: 'Select Avatar',
      // customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.showImagePicker(options, (response) => {
      // console.log(response.data);
      db1.db.ref('users/' + this.props.store.user.uid).update({
        userAvatar: response.uri,
      });
      AsyncStorage.setItem('userAva', response.uri);
      this.props.store.user.userAvatar1 = response.uri;

      const image = response.uri;
      const imageRef = firebase.storage().ref('users/' + this.props.store.user.uid )
        .child('dp.jpg');

      imageRef.putString(image, 'base64', {contentType: 'image/jpeg'})
      // .then(() => {
      //   return imageRef.getDownloadURL();
      // })
        .then((res) => {
          console.log('RES', res);
        }, (err) => {
          console.log('err', err);
        });

      // const Blob = RNFetchBlob.polyfill.Blob;
      // Blob.build(image, { type: 'image/jpeg' })
      //   .then((blob) => {
      //     imageRef
      //       .put(blob)
      //       .then(() => {
      //         return imageRef.getDownloadURL();
      //       })
      //       .then((res) => {
      //         console.log('RES', res);
      //       });
      //   });

    });
  }

}

export default Screen;

const styles: any = StyleSheet.create({
  topContainer: {
    flex: 1,
    // flexGrow: 1,
    width: '100%',
    // backgroundColor: 'yellow',
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    // marginVertical: 10,
    // marginHorizontal: 0,
    // height : 100,
    // marginTop : 10,
    // flexGrow: 1,
  },
  // card1: {
  //   flex: 1,
  //   height: 50,
  // },
  header: {
    // marginHorizontal: 0,
    width: '100%',
    // flexGrow: 1,
    flex: 1,
    // paddingVertical: 30,
    // marginHorizontal: 0,
  },
  headerContent: {
    backgroundColor: '#66bb6a',
    padding: 20,
    // paddingHorizontal: 30,
    // marginVertical: 0,
    marginHorizontal: 0,
    alignItems: 'center',
    width: '100%',
    // flex: 1,
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: 'white',
    marginBottom: 5,
  },
  name: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  bodyContent: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 5,
  },
  textInfo: {
    fontSize: 18,
    marginTop: 10,
    color: '#fff59d',
  },
  smallTextInfo: {
    fontSize: 14,
    marginTop: 5,
    color: '#696969',
  },
  itemSpaceV10: {
    marginVertical: 3,
  },
  buttonContainer: {
    // height: 50,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    // width: 220,
    borderRadius: 30,
  },
  loginButton: {
    backgroundColor: '#1976d2',
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    // marginBottom: 10,
    color: '#ffffff',
  },
  buttonContainerDisabled: {
    // height: 50,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    // width: 220,
    borderRadius: 30,
  },
  loginButtonDisabled: {
    backgroundColor: '#e0e0e0',
  },
  buttonTextDisabled: {
    fontSize: 20,
    fontWeight: 'bold',
    // marginBottom: 10,
    color: '#aeaeae',
  },
});
