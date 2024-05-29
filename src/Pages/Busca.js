import { View, Text, TextInput, StyleSheet, FlatList, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

export default function Busca() {
    const [usuarios, setUsuarios ] = useState( [] );
    const [clientes, setClientes ] = useState( [] );
    const [edicao, setEdicao] = useState(false);
    const [error, setError ] = useState(false);
    const [busca, setBusca] = useState(false);
    const [filtro, setFiltro ] = useState(false);
    const [clientId, setclientId] = useState(0);
    const [clientNome, setNome] = useState();
    const [clientEmail, setEmail] = useState();
    const [clientGenere, setGenere] = useState();
    const [deleteResposta, setResposta] = useState(false);

    async function getClientes()
    {
        await fetch('http://10.139.75.21:5251/api/Clients/GetAllClients', {
            method: 'GET',
            headers: {
              'content-type': 'application/json'
            }
          })
          .then( res => res.json())
          .then(json => setClientes(json))
          .catch(err => setError(true))
    }

    async function getClients(id)
    {    
      await fetch('http://10.139.75.21:5251/api/Clients/GetClientId/' + id,{
              method: 'GET',
              headers: {
                  'Content-type' : 'application/json; charset=UTF-8',
              },
          })
          .then((response)=> response.json())        
          .then(json=>{
            setclientId(json.clientId);
            setNome(json.clientName);
            setEmail(json.clientEmail);
            setGenere(json.clientGenere);
          });
    }

    async function editClient()
  {    
    await fetch('http://10.139.75.41:5251/api/Clients/UpdateClient/' + clientId,{
            method: 'PUT',
            headers: {
                'Content-type' : 'application/json; charset=UTF-8',
            },
            body: JSON.stringify({
                clientId : clientId,
                clientName : clientNome,
                clientEmail : clientEmail,
                clientGenere : clientGenere,

            })
        })
        .then( (response) => response.json())
        .catch(err => console.log(err));
        getClientes();
        setEdicao(false);
  }

  function showAlert(id, clientName) {
    Alert.alert(
      '',
      'Deseja realmente excluir esse cliente?',
      [
        { text: 'Sim', onPress: () => deleteClient(id, clientName) },
        { text: 'Não', onPress: () => ('') }
      ],
      { cancelable: false }
    );
  }

  async function deleteClient(id, clientName) {
    await fetch('http://10.139.75.21:5251/api/Clients/DeleteClient/' + id,{
            method: 'DELETE',
            headers: {
                'Content-type' : 'application/json; charset=UTF-8',
            },
        })
        .then(res => res.json())
        .then(json => setResposta(json))
        .catch(err => setError(true))

        if(deleteResposta == true)
          {
            Alert.alert(
              '',
              'Cliente' + clientName + 'não foi excluido com sucesso',
              [
                { text: '', onPress: () => ('')},
                { text: 'Ok', onPress: () => ('')},
              ],
              { cancelable: false}
            );
            getClientes();
          }
          else{
            Alert.alert(
              '',
              'Cliente' + clientName + 'foi excluido com sucesso',
              [
                { text: '', onPress: () => ('')},
                { text: 'Ok', onPress: () => ('')},
              ],
              { cancelable: false}
            );
            getClientes();
          }

  }

    useEffect( () => {
        getClientes();
    }, [] );

    useFocusEffect(
        React.useCallback(()=>{
          getClientes();
        },[])
      );

    useEffect( () => {
        setFiltro( usuarios.filter( (item) => item.name.firstname == busca )[0] );
    }, [busca] );

    return (
        <View style={css.container}>
            <View style={css.container}>
                {edicao == false ?
                <FlatList
                style={css.flat}
                data={clientes}
                keyExtractor={(item) => item.clientId}
                renderItem={({item})=>(
                    <Text style={css.text}>
                        {item.clientName}
                        <TouchableOpacity style={css.btnEdit} onPress={() => {setEdicao(true); getClients(item.clientId)}}>
                            <Text style={css.btnLoginText}>EDITAR   </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={css.btnDelete} onPress={()=> showAlert(item.clientId, item.clientName)}>
                            <Text style={css.btnLoginText}>EXCLUIR</Text>
                        </TouchableOpacity>
                    </Text>
                )}
            />

        :
        <View style={css.editar}>
        <TextInput
            inputMode="text"
            style={css.input}
            value={clientNome}
            onChangeText={(digitado)=> setNome(digitado)}
            placeholderTextColor="black"   
        />
        <TextInput
            inputMode="email"
            style={css.input}
            value={clientEmail}
            onChangeText={(digitado)=> setEmail(digitado)}
            placeholderTextColor="black"   
        />
        <TextInput
            inputMode="text"
            secureTextEntry={true}
            style={css.input}
            value={clientGenere}
            onChangeText={(digitado)=> setGenere(digitado)}
            placeholderTextColor="black"    
        />
        <TouchableOpacity style={css.btnCreate} onPress={()=>editClient()}>
            <Text styel={css.btnLoginText}>SALVAR</Text>
        </TouchableOpacity>
    </View>

        }
    </View>
    </View>

    )}
        
const css = StyleSheet.create({
    container:{
        flexGrow: 1,
        backgroundColor:'#D8ADF2',
        alignItems:'center',
        marginTop: 20
      },
      searchBox: {
        width: "80%",
        height: 50,
        borderWidth: 1,
        borderRadius: 5,
        padding: 15,
        marginBottom: 25,
        color:"white",
        backgroundColor: "gray"
    
      }
})