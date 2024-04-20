import { SafeAreaView, Text, StyleSheet, TouchableOpacity } from 'react-native';
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import { useNavigation} from '@react-navigation/native'

export default function Home() {
    const navegation = useNavigation();

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.text}>Bem-Vindo(a)</Text>
            <Text>Cadastrar um novo Cliente:</Text>
            <TouchableOpacity>
                <FontAwesome6 name='user-plus' color='#591DA9' size={70} onPress={()=> navegation.navigate('Cadastro')}></FontAwesome6>
            </TouchableOpacity>
            <Text>Todos os Clientes:</Text>
            <TouchableOpacity style={styles.buttonTouchable}  >
                <FontAwesome6 name='users' color='#591DA9' size={70} onPress={() => navegation.navigate('Todos')}></FontAwesome6>
            </TouchableOpacity>
            <Text>Pesquisar sobre um Cliente:</Text>
           <TouchableOpacity>
            <FontAwesome6 name='person-circle-question' color='#591DA9' size={70} onPress={()=> navegation.navigate('Pesquisar')}></FontAwesome6>
           </TouchableOpacity>
           <Text>Editar um Cliente:</Text>
           <TouchableOpacity>
            <FontAwesome6 name='user-pen' color='#591DA9' size={70} onPress={()=> navegation.navigate('EditarExcluir')}></FontAwesome6>
           </TouchableOpacity>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#CB98ED',
        alignItems: 'center',
        justifyContent: 'center',
        gap:5
    },
    text:{
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom:80
    }
});