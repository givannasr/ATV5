import { SafeAreaView, Text, StyleSheet, Button, View, TextInput, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';

import { DatabaseConnection } from '../../Config/database/database';
const db = new DatabaseConnection.getConnection;

export default function Cadastro() {
    const navegation = useNavigation();
    const [registros, setRegistros] = useState([]);
    const [nome, setNome] = useState();
    const [data_nasc, setDataNasc] = useState();
    const [numero, setNumero] = useState();
    const [tipo, setTipo] = useState();
    const [cliente_id, setClienteId] = useState();
    const [telefone_id, setTelefoneId] = useState();

    useEffect(() => {
        db.transaction(tx => {
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS clientes (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT NOT NULL, data_nasc DATE NOT NULL);',
                // 'drop table clientes',
                [],
                () => console.log('Tabela clientes renderizada!'),
                (er, error) => console.error(er, error),
            );
        });
    }, [registros]);

    useEffect(() => {
        db.transaction(tx => {
            tx.executeSql('CREATE TABLE IF NOT EXISTS telefone (id INTEGER PRIMARY KEY AUTOINCREMENT, numero TEXT NOT NULL, tipo TEXT NOT NULL);',
                [],
                () => console.log('Tabela telefone renderizada!'),
                (er, error) => console.error(er, error),
            );
        });
    }, [registros]);

    useEffect(() => {
        db.transaction(tx => {
            tx.executeSql('CREATE TABLE IF NOT EXISTS telefone_has_cliente (telefone_id INTEGER , cliente_id INTEGER , foreign key (telefone_id) references telefone(id),foreign key (cliente_id) references clientes(id));',
                [],
                () => console.log('Tabela telefone_has_cliente renderizada!'),
                (er, error) => console.error(er, error),
            );
        });
    }, [registros]);

    const adicionaCliente = () => {
        if (nome === null || nome.trim() === '') {
            Alert.alert('Erro', 'insira um valor válido para o modelo!');
            return;
        }

        db.transaction(tx => {
            tx.executeSql('INSERT INTO clientes (nome, data_nasc) VALUES (?,?);',
                [nome, data_nasc],
                (_, res) => {
                    const idc = res.insertId;
                    // Alert.alert('Info', 'Registro inserido com sucesso!')
                    // setNome();
                    // setDataNasc();
                    // atualizaLista();
                    tx.executeSql('INSERT INTO telefone (numero, tipo) VALUES (?,?);',
                        [numero, tipo],
                        (_, res) => {
                            const idt = res.insertId;
                            // Alert.alert('Info', 'Registro inserido com sucesso!')
                            // setNumero();
                            // setTipo();
                            // atualizaLista();
                            tx.executeSql('INSERT INTO telefone_has_cliente (telefone_id, cliente_id) VALUES (?,?);',
                                [idt, idc],
                                (_,) => {
                                    Alert.alert('Info', 'Registro inserido com sucesso!')
                                    setTelefoneId();
                                    setClienteId();
                                    atualizaLista();
                                },
                                (_, error) => {
                                    console.error('Erro ao adicionar o telefone', error);
                                    Alert.alert('Erro', 'Ocorreu um erro ao adicionar o telefone');
                                }
                            )
                        },
                        (_, error) => {
                            console.error('Erro ao adicionar o telefone', error);
                            Alert.alert('Erro', 'Ocorreu um erro ao adicionar o telefone');
                        }
                    )
                },
                (_, error) => {
                    console.error('Erro ao adicionar o cliente', error);
                    Alert.alert('Erro', 'Ocorreu um erro ao adicionar o cliente');
                }
            )
        })

        // console.log(telefone_id, cliente_id);
    }

    const atualizaLista = () => {
        db.transaction(tx => {
            tx.executeSql(
                `SELECT 
                    C.ID AS ID_CLIENTE,
                    C.NOME,
                    C.DATA_NASC,
                    T.ID AS ID_TELEFONE,
                    T.NUMERO,
                    T.TIPO
                FROM CLIENTES AS C
                    INNER JOIN telefone_has_cliente AS TC ON C.ID = TC.CLIENTE_ID
                    INNER JOIN TELEFONE AS T ON TC.telefone_id= T.ID;`,
                [],
                (_, { rows }) => {
                    console.log(rows._array);
                    setRegistros(rows._array);
                }
            )
        })
    }
    useEffect(() => {
        atualizaLista();
    }, [])

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.container}>
                <Text style={styles.title}>Cadastro de novos Clientes</Text>
                <TextInput style={styles.inputText}
                    value={nome}
                    onChangeText={setNome}
                    placeholder='Digite um Nome:'
                />
                <TextInput style={styles.inputText}
                    value={data_nasc}
                    onChangeText={setDataNasc}
                    placeholder='Digite a data de nascimento:'
                />
                <TextInput style={styles.inputText}
                    value={numero}
                    onChangeText={setNumero}
                    placeholder='Digite um numero de telefone:'
                />
                <TextInput style={styles.inputText}
                    value={tipo}
                    onChangeText={setTipo}
                    placeholder='Digite o tipo do numero:'
                />

                <Button color={'#591DA9'} title='Cadastrar um novo Cliente' onPress={adicionaCliente} />

                <Text style={styles.cardTitle}>Celulares cadastrados</Text>
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    <View style={styles.containerScroll}>
                        {
                            registros.map(item => (
                                <View key={item.id} style={styles.input}>
                                    <Text>{item.id}</Text>
                                    <Text>{item.nome}</Text>
                                    <Text>{item.data_nasc}</Text>
                                    <Text>{item.numero}</Text>
                                    <Text>{item.tipo}</Text>
                                </View>))
                        }
                    </View>
                </ScrollView>
            </View>
            <TouchableOpacity title='VoltarHome' onPress={() => navegation.navigate('Home')}>
                <FontAwesome6 name='house-user' color='#591DA9' size={40}></FontAwesome6>
            </TouchableOpacity>
        </SafeAreaView>)

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#CB98ED',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        padding: 10
    },
    inputText: {
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 5,
        padding: 5,
        width: 300,
        height: '5%'
    },
    cardTitle: {
        paddingTop: 30,
        alignItems: 'center'

    },
    title: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    input: {
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 5,
        padding: 15,
        width: 270,
        height: 120,
        borderWidth: 2,
        justifyContent: 'center',
        margin: 5
    },
    containerScroll: {
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 20,
        padding: 10,
        width: '100%',
        height: '100%',
        alignItems: 'center',
        gap: 10
    },
    alignLeft: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '80%',
        alignSelf: 'auto',
        paddingLeft: '70%',
        gap: 5,
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
});