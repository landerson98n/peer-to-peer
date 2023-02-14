import React ,{ useEffect, useState } from "react"
import { Button, Keyboard, Text, TextInput, View} from "react-native"
import {MaterialIcons} from '@expo/vector-icons'
import { Container, Search, ArquivosLocais, Arquivo,SContent ,SearchIcon, Enviar, ButtonContainer, TextContent } from './style'
import { Entypo } from '@expo/vector-icons'; 
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system'
import * as Network from 'expo-network';
import SocketIOClient from 'socket.io-client';

export function Home (){
    const [documents, setDocuments] = useState<any>([])
    const [text, onChangeText] = React.useState('');
    const [musicasProcuradas, setMusicasProcuradas] = useState<any>([])
    const [socket, setSocketOn] = useState(null)
    const [ip, setIp] = React.useState('');
    const [novaMensagem, setNovaMensagem] = React.useState(false);
    useEffect(() => {
        setSocketOn(SocketIOClient('http://192.168.0.16:3333/', {
            transports: ['websocket']
        }));
        async function getIp(){
            const ip = await Network.getIpAddressAsync()
            setIp(ip)
        }
        getIp()
    },[])

    if(socket){
        socket.on('procurar musica',(mensage) => { 
                const musics = documents.filter((music)=>{
                    if(music.name.includes(mensage.text)){
                          return music  
                        } 
                    })  
                if(musics[0]){
                    socket.emit('musica encontrada',{musics, ip: mensage.ip});
                }  
        });  

        socket.on('receber musica',(mensage) => {
           setMusicasProcuradas(mensage.musics)
        });  
    }
    
     
    async function download(){
        setDocuments([...documents, musicasProcuradas[0]])
        onChangeText('')
    }
    
    function search(){
        setMusicasProcuradas([])
        if(socket && text){
            socket.emit('message',{text, ip});
        }
    }
    
    async function PickAudio(){
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type:'audio/*',
                multiple:true,
            });
            let fileBase64 = await FileSystem.readAsStringAsync(result.uri, { encoding: 'base64' });
            setDocuments([...documents,result])  
        } catch (err) {
            console.log(err);
          }
    };

    return (
    <Container>
        <SContent>
            <Search>
                <SearchIcon>
                    <MaterialIcons
                        name='search'
                        size={25}
                        color={'white'}
                    />
                </SearchIcon>
                <TextContent>
                    <TextInput onChange={search} style={{width:'100%',height:'100%', color:'white'}} placeholder='Pesquisar' placeholderTextColor={'white'}  onChangeText={onChangeText}/>
                </TextContent>
            </Search> 
        </SContent>
        {
        text === '' ? 
            <>
                <ArquivosLocais>
                    <Text style={{fontSize:'15px', color:'white', marginBottom:'3%'}}>Arquivos Locais | ID:{ip}</Text>
                    {documents === undefined ? <Entypo style={{marginTop:'30%'}}  name={'music'} color={'white'} size={60}/> :     
                        documents.map((item, i)=>(
                            <Arquivo key={i} style={{backgroundColor:'white'}}>
                                <View style={{height:'100%', justifyContent:'center'}}>
                                    <Entypo name={'music'} color={'#023FAF'} size={24}/>
                                </View>
                                <View style={{marginRight:'10%',width:'70%',height:'100%', justifyContent:'center', alignItems:'start'}} >
                                    <Text style={{fontSize:'10px', color:'black'}}>{item.name}</Text>
                                </View>
                            </Arquivo>
                        ))
                    }
                </ArquivosLocais>
                <ButtonContainer>
                    <View style={{justifyContent:'center', width:'20%', height:'100%', marginLeft:'5%'}}>
                        <Entypo
                            name='folder-music'
                            size={20}
                            color={'white'}
                        />
                    </View>
                    <View style={{height:'100%', justifyContent:'center'}} >
                        <Button color={'white'} title={'Selecionar Arquivo'} onPress={PickAudio} />
                    </View>
                </ButtonContainer>
            </>
            :
            <>
            {musicasProcuradas.map((item, i )=>(
                    <ButtonContainer key={i}>
                        <View style={{justifyContent:'center', width:'20%', height:'100%', marginLeft:'5%'}}>
                            <Entypo
                                name='music'
                                size={20}
                                color={'white'}
                            />
                        </View>
                        
                        <View  style={{marginLeft:'-13%',width:'100%',height:'100%', justifyContent:'center', alignItems:'start'}} >
                          {item === undefined? null : <Button  color={'white'} title={item.name} onPress={download}/>}  
                        </View>
                    </ButtonContainer>
                // <Arquivo key = {i} style={{backgroundColor:'#023FAF'}} onClick={()=>{download(item)}}>
                //         <View style={{marginLeft:'1%',display:'flex', justifyContent:'center',marginTop:'4%', width:'10%', height:'100%'}}>
                //             <Entypo name={'music'} color={'white'} size={24}/>
                //         </View>
                //         <View style={{height:'95%', marginTop:'-9%', marginLeft:'15%'}} >
                //             <Text style={{fontSize:'10px', color:'white'}}>{item.result.name}</Text>
                //         </View>
                // </Arquivo>
            ))}   
            </>
        }
        
    </Container>)
}