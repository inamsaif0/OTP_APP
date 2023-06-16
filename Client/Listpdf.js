import React, { useState } from 'react';
import {Modal,StyleSheet, Text, View, FlatList, Image, TouchableOpacity, Pressable, Linking,ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import pdf from './assets/pdf.png';
import { UserContext } from './App';
const PdfReader = ({ url: uri }) => <WebView javaScriptEnabled={true}  style={{ flex: 1 }} source={{ uri }} />
export default function Listpdf() {
  const email = React.useContext(UserContext);

  const [docs, setDocs] = useState(null);
  const [selectedItem, setSelectedItem] = useState(false);
  const [isLoading,setIsloading]=useState(true)

  React.useEffect(() => {
    async function getDocs(email) {
      try {
        console.log(email)
        const response = await fetch(`http://192.168.1.4:3000/documents?email=${email}`, { method: 'GET' })
        .then((response)=>response.json())
        .then((data)=>setDocs(data))
        .then(()=>setIsloading(false))
        .catch((error) => console.error('Error retrieving doc files:', error)); 
        
      } catch (error) {
        console.log("Error getting documents", error);
      }
    }
    getDocs(email.userEmail);
  }, []);

  function openWebView(url) {
    setSelectedItem(url);
  }
  

  

  const [modalVisible, setModalVisible] = useState(false);
  function renderListItem({ item }) {

    return (
      <View>
        <Modal animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
          <View>

          <PdfReader url={item.fileUrl} />
          </View>

        </Modal>
        
      <Pressable onPress={() =>setModalVisible(true)} style={styles.listItem}>
        <Image source={pdf} style={{ width: 60, height: 60, borderRadius: 30 }} />
        <View style={{ alignItems: "center", flex: 1 }}>
          <Text style={{ fontWeight: "bold" }}>{item.filename}</Text>
          <Text>{item.position}</Text>
        </View>
      </Pressable>
      </View>
    );
  }

  if(isLoading){
    return(

      <View style={{flex:1,justifyContent:'center'}}>
      <ActivityIndicator size={'large'} color={'#800000'}/>
    </View>
      )
  }

  return (
    <View style={styles.container}>
      <FlatList
        style={{ flex: 1 }}
        data={docs}
        renderItem={renderListItem}
        keyExtractor={(item) => item.filename}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1.5,
    backgroundColor: '#F7F7F7',
    marginTop: 20,
    borderRadius: 10,
  },
  listItem: {
    margin: 10,
    padding: 10,
    backgroundColor: "#FFF",
    width: "95%",
    flex: 1,
    alignSelf: "center",
    flexDirection: "row",
    borderRadius: 5
  }
});
