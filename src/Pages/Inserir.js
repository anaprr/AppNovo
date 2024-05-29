import { View,  Text, ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'

export default function Inserir() {
    const[nome, setNome] = useState("");
    const[email, setEmail] = useState("");
    const[genere, setGenere] = useState("");
    const[erro, setErro]=useState("");
    const[sucesso, setSucesso]=useState("");

    async function Cadastro(){
      await fetch('https://fakestoreapi.com/users',{
          method: 'POST',
          headers:{
              'content-type' : 'application/json'
          },
          body:JSON.stringify(
              {
                nome:nome,
                email:email,
                genere:genere,
                  name:{
                      firstname:nome
                  },
              }
          )
      })
      .then( res => (res.ok == true) ? res.json () : false)
      .then(json => {
          setSucesso((json.id) ? true : false);
          setErro((json.id) ? false : true);

      } )
      .catch(err => setErro(true))
  }


  return (
    <ScrollView contentContainerStyle={css.container}>
    { sucesso ? 
        <Text>Obrigada por se cadastrar</Text>
    :
    <>
    <TextInput style={css.texto} placeholder='Nome'TextInput={nome} onChangeText={(digitado) => setNome(digitado)}></TextInput>
    <TextInput style={css.texto} placeholder='Genere' TextInput={genere} onChangeText={(digitado) => setGenere(digitado)}></TextInput>
     <TextInput style={css.texto} placeholder='Email'TextInput={email} onChangeText={(digitado) => setEmail(digitado)}></TextInput>
    <TouchableOpacity style={css.btn} onPress={Cadastro}>
      <Text style={css.btnText}>Cadastrar</Text>
    </TouchableOpacity>
    {erro && <Text>Revise os campos e Tente novamente</Text>}
    </>
    
}

</ScrollView>
  )
}
const css = StyleSheet.create({
  container:{
      backgroundColor:"#D8ADF2",
      flexGrow: 1,
      justifyContent:"center",
      alignItems:"center"
  },
  texto:{
    width: "90%", 
    height: 60,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'black',
    padding: 15,
    marginTop: 20,
    marginBottom: 15,
    
  },
  btn: {
      backgroundColor: "white",
      color:"black",
      width: "70%",
      height: 60,
      borderRadius: 5,
    },
    btnText: {
      color: "black",
      textAlign: "center",
      lineHeight: 60,
      fontSize: 25, 
      fontWeight: "bold"
  },
})