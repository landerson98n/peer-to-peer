import styled from "styled-components/native";

export const Container = styled.ScrollView.attrs({
    contentContainerStyle:{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        backgroundColor: 'white',
      },
    showsVerticalScrollIndicator:false
})`
    
`

export const SContent = styled.View`
   width: 100%;
   padding: 5%;
`
export const Search = styled.View`
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 54px;
    background-color: #023FAF;
    border-radius: 30px;
    margin-top: 5%;
    justify-content: center;
`
export const Arquivo = styled.View`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 90%;
    height: 44px;
    margin-top: 5%;
    border-radius: 30px;
    padding-left: 5%;
    margin-bottom: 1%;
`
export const ArquivosLocais = styled.View`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: start;
    height: 60%;
    padding: 10%;
    margin-top: 10%;
    background-color: #023FAF;
`
export const ButtonContainer = styled.View`
    display: flex;
    flex-direction: row;
    width: 80%;
    height: 10%;
    display: flex;
    margin-top: 10%;
    border-radius: 18px;
    background-color: #023FAF;
`

export const TextContent = styled.View`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 70%;
  height: 100%;
  margin-left: 5%;
 `;
export const SearchIcon = styled.View`
  width: 10%;
  height:100%;
  justify-content: center;
 `; 

export const Enviar = styled.View`
    width: 30%;
    margin-top: 30px;
    background-color: #023FAF;
    border-radius: 18px;
`

