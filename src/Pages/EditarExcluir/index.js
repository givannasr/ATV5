import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, Button, TextInput } from 'react-native';
import { DatabaseConnection } from '../../Config/database/database';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { useNavigation } from '@react-navigation/native';

export default function EditarOuExcluir() {
    const db = DatabaseConnection.getConnection();
    const navigation = useNavigation();
    const [todos, setTodos] = useState([]);
    const [id, setId] = useState('');
    const [nome, setNome] = useState('');
    const [dataNasc, setDataNasc] = useState('');
    const [numero, setNumero] = useState('');
    const [tipo, setTipo] = useState('');

    useEffect(() => {
        atualizaRegistros();
    }, []);

    const atualizaRegistros = () => {
        db.transaction(tx => {
            tx.executeSql(`SELECT 
                            C.ID AS ID_CLIENTE,
                            C.NOME,
                            C.DATA_NASC,
                            T.ID AS ID_TELEFONE,
                            T.NUMERO,
                            T.TIPO
                        FROM CLIENTES AS C
                            INNER JOIN TELEFONE_HAS_CLIENTE AS TC ON C.ID = TC.CLIENTE_ID
                            INNER JOIN TELEFONE AS T ON TC.TELEFONE_ID = T.ID;`,
                [], 
                (_, { rows }) => setTodos(rows._array),
                (_, error) => console.error('Erro ao buscar clientes:', error)
            );
        });
    };

    const excluirClientes = idCliente => {
        db.transaction(
            tx => {
                tx.executeSql(
                    'DELETE FROM CLIENTES WHERE ID = ?',
                    [idCliente],
                    (_, { rowsAffected }) => {
                        if (rowsAffected > 0) {
                            atualizaRegistros();
                            Alert.alert('Sucesso', 'Registro excluído com sucesso.');
                        } else {
                            Alert.alert('Erro', 'Nenhum registro foi excluído, verifique e tente novamente!');
                        }
                    },
                    (_, error) => console.error('Erro ao excluir o cliente:', error)
                );
            }
        );
    };

    const salvarEdicao = () => {
        db.transaction(
            tx => {
                tx.executeSql(
                    'UPDATE CLIENTES SET NOME = ?, DATA_NASC = ? WHERE ID = ?',
                    [nome, dataNasc, id],
                    (_, { rowsAffected }) => {
                        if (rowsAffected > 0) {
                            Alert.alert('Sucesso', 'Cliente editado com sucesso');
                        } else {
                            Alert.alert('Erro', 'O cliente que está sendo editado não foi encontrado');
                        }
                    },
                    (_, error) => console.error('Erro ao editar o cliente:', error)
                );
                tx.executeSql(
                    'UPDATE TELEFONE SET NUMERO = ?, TIPO = ? WHERE ID = ?',
                    [numero, tipo, id], 
                    (_, { rowsAffected }) => {
                        if (rowsAffected > 0) {
                            Alert.alert('Sucesso', 'Telefone editado com sucesso');
                        } else {
                            Alert.alert('Erro', 'O telefone que está sendo editado não foi encontrado');
                        }
                    },
                    (_, error) => console.error('Erro ao editar o telefone:', error)
                );
            },
            null,
            atualizaRegistros
        );
    };

    const handleEditPress = (idCliente, nome, dataNasc, numero, tipo) => {
        setId(idCliente);
        setNome(nome);
        setDataNasc(dataNasc);
        setNumero(numero);
        setTipo(tipo);
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.containerScroll}>
                {todos.map(item => (
                    <View key={item.id} style={styles.clienteItem}>
                        <Text style={styles.celItemText}>ID: {item.id}</Text>
                        <Text style={styles.celItemText}>Nome: {item.nome}</Text>
                        <Text style={styles.celItemText}>Data de nascimento: {item.data_nasc}</Text>
                        <Text style={styles.celItemText}>Número: {item.numero}</Text>
                        <Text style={styles.celItemText}>Tipo: {item.tipo}</Text>
                        <View style={styles.buttonsContainer}>
                            <TouchableOpacity onPress={() => {
                                Alert.alert(
                                    "Atenção!",
                                    "Deseja excluir o registro selecionado?",
                                    [
                                        {
                                            text: 'OK',
                                            onPress: () => excluirClientes(item.id)
                                        },
                                        {
                                            text: 'Cancelar',
                                            onPress: () => {},
                                            style: 'cancel',
                                        }
                                    ],
                                )
                            }}>
                                <FontAwesome6 name="trash-can" color="red" size={24} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleEditPress(item.id, item.nome, item.data_nasc, item.numero, item.tipo)}>
                                <FontAwesome6 name="pen-to-square" color="black" size={24} />
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </ScrollView>
            <View style={styles.editContainer}>
                <Text>Editar informações do Cliente</Text>
                <TextInput
                    style={styles.inputText}
                    value={nome}
                    onChangeText={setNome}
                    placeholder='Digite o nome:'
                />
                <TextInput
                    style={styles.inputText}
                    value={dataNasc}
                    onChangeText={setDataNasc}
                    placeholder='Digite a data de nascimento:'
                />
                <TextInput
                    style={styles.inputText}
                    value={numero}
                    onChangeText={setNumero}
                    placeholder='Digite um número:'
                />
                <TextInput
                    style={styles.inputText}
                    value={tipo}
                    onChangeText={setTipo}
                    placeholder='Digite um tipo:'
                />
                <View style={styles.saveButton}>
                    <Button title="Salvar" onPress={salvarEdicao} />
                    <Button title="Cancelar" onPress={() => navigation.navigate('Home')} />
                </View>
            </View>
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#CB98ED'
    },
    containerScroll: {
        paddingBottom: 20
    },
    clienteItem: {
        backgroundColor: '#FFF',
        marginBottom: 10,
        padding: 10,
        borderRadius: 10,
        flexDirection: 'column'
    },
    celItemText: {
        fontSize: 16
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10
    },
    editContainer: {
        backgroundColor: '#F1F1F1',
        padding: 20,
        borderRadius: 10,
        marginVertical: 20
    },
    inputText: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
        borderRadius: 5
    },
    saveButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10
    }
});
