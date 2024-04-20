import React, { useEffect, useState, useRef } from 'react';
import { SafeAreaView, Text, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';

import { DatabaseConnection } from '../../Config/database/database';
const db = DatabaseConnection.getConnection();

export default function Pesquisar() {
    const navigation = useNavigation();
    const inputRef = useRef(null);
    const [input, setInput] = useState('');
    const [registros, setRegistros] = useState([]);

    useEffect(() => {
        if (input) {
            getClientes();
        }
    }, [input]);

    function getClientes() {
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
                    INNER JOIN TELEFONE AS T ON TC.telefone_id = T.ID
                 WHERE C.NOME LIKE ? OR T.NUMERO LIKE ?;`,
                [`%${input}%`, `%${input}%`],
                (_, { rows }) => {
                    setRegistros(rows._array);
                },
                (_, error) => {
                    console.error('Erro ao buscar clientes:', error);
                }
            );
        });
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput
                    ref={inputRef}
                    onChangeText={setInput}
                    placeholder='Nome ou Telefone do Cliente:'
                    style={styles.inputText}
                />
                <TouchableOpacity onPress={getClientes} style={styles.searchButton}>
                    <FontAwesome6 name='magnifying-glass' color='white' size={20} />
                </TouchableOpacity>
            </View>
            <View style={styles.resultsContainer}>
                {registros.length > 0 && (
                    <View style={styles.resultsList}>
                        {registros.map((item, index) => (
                            <View key={index} style={styles.resultItem}>
                                <Text style={styles.resultText}>ID: {item.ID_CLIENTE}</Text>
                                <Text style={styles.resultText}>Nome: {item.nome}</Text>
                                <Text style={styles.resultText}>Data de Nascimento: {item.data_nasc}</Text>
                                <Text style={styles.resultText}>Número: {item.numero}</Text>
                                <Text style={styles.resultText}>Tipo: {item.tipo}</Text>
                            </View>
                        ))}
                    </View>
                )}
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.homeButton}>
                <FontAwesome6 name='house-user' color='white' size={30} />
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
       
        flex: 1,
        backgroundColor: '#CB98ED',
        alignItems: 'center',
        padding: 20,
    },
    inputContainer: {
        marginTop:15,
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginBottom: 20,
    },
    inputText: {
        flex: 1,
        height: 40,
        borderColor: 'white',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        color: 'white',
        marginRight: 10,
        backgroundColor: '#734FB3',
    },
    searchButton: {
        backgroundColor: '#734FB3',
        padding: 10,
        borderRadius: 10,
    },
    resultsContainer: {
        flex: 1,
        width: '100%',
        paddingBottom: 10,
    },
    resultsList: {
        flex: 1,
    },
    resultItem: {
        backgroundColor: '#FFFFFF',
        padding: 15,
        marginVertical: 5,
        borderRadius: 10,
        shadowColor: 'black',
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 3,
    },
    resultText: {
        color: '#591DA9',
        fontSize: 14,
        marginBottom: 5,
    },
    homeButton: {
        backgroundColor: '#734FB3',
        padding: 15,
        borderRadius: 30,
        marginTop: 20,
    }
});

