import React ,{ useEffect, useState } from "react"
import { Button, Text, TextInput, View} from "react-native"
import {MaterialIcons} from '@expo/vector-icons'
import { Container, Search, ArquivosLocais, Arquivo,SContent ,SearchIcon, Enviar, ButtonContainer, TextContent } from './style'
import { Entypo } from '@expo/vector-icons'; 
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system'
import { Audio  } from 'expo-av';
import api from "../services/api";
import * as Network from 'expo-network';



const key = ((Math.random() + 1).toString(36).substring(7))


export function Home (){
    const [documents, setDocuments] = useState<any>([])
    const [text, onChangeText] = React.useState('');
    const [musicasProcuradas, setMusicasProcuradas] = useState<any>([])
    const [ip, setIp] = React.useState('');
    useEffect(()=>{
        async function getIp(){
             const ipEffect = await Network.getIpAddressAsync();
             setIp(ipEffect)
        }   
        getIp()
    })

    async function download(item){
        try {
            const result =  await api.get(`/musics`, {
                params: {
                  id: item.id
                }
            })  
            setDocuments([...documents,result.data[0]])
            onChangeText('')
            } catch (error) {
                console.error(error);
            }
     }
    
    async function search() {
        setMusicasProcuradas([])
        const result =  await api.get(`/musics`)
          {result.data.filter((music)=>{
            if(music.name.includes(text)){
                setMusicasProcuradas([...musicasProcuradas,music]) 
            }
          })}  
    }
    
    
    async function PickAudio(){
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type:'audio/*',
                multiple:true,
            });
            let fileBase64 = await FileSystem.readAsStringAsync(result.uri, { encoding: 'base64' });
            api.post('/musics', {...result, data: fileBase64 })
            setDocuments([...documents, result])  
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
                    <TextInput value={text} style={{width:'100%',height:'100%', color:'white'}} placeholder='Pesquisar' placeholderTextColor={'white'}  onChangeText={onChangeText} onTextInput={search}/>
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
                          {item === undefined? null : <Button  color={'white'} title={item.name} onPress={()=>{download(item)}}/>}  
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