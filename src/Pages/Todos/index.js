import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    View,
    Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { DatabaseConnection } from '../../Config/database/database';

const db = new DatabaseConnection.getConnection();

export default function Todos() {
    const navigation = useNavigation();
    const [registros, setRegistros] = useState([]);

    const atualizaLista = () => {
        db.transaction(tx => {
            tx.executeSql(
                `SELECT 
                    C.ID AS ID_CLIENTE,
                    C.NOME,
                    C.DATA_NASC,
                    T.NUMERO,
                    T.TIPO
                FROM CLIENTES AS C
                    INNER JOIN telefone_has_cliente AS TC ON C.ID = TC.CLIENTE_ID
                    INNER JOIN TELEFONE AS T ON TC.TELEFONE_ID = T.ID;`,
                [],
                (_, { rows }) => {
                    setRegistros(rows._array);
                }
            );
        });
    };

    const deletaDatabase = () => {
        db.transaction(tx => {
            tx.executeSql(
                "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'",
                [],
                (_, { rows }) => {
                    rows._array.forEach(table => {
                        tx.executeSql(
                            `DROP TABLE IF EXISTS ${table.name}`,
                            [],
                            () => {
                                console.log(`Tabela ${table.name} excluída com sucesso!`);
                                setRegistros([]);
                            },
                            (_, error) => {
                                console.error(`Erro ao excluir a tabela ${table.name}:`, error);
                                Alert.alert('Erro', `Ocorreu um erro ao excluir a tabela ${table.name}`);
                            }
                        );
                    });
                }
            );
        });
    };

    useEffect(() => {
        atualizaLista();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Clientes Cadastrados:</Text>
            <ScrollView style={styles.scrollContainer}>
                {registros.map((item) => (
                    <View key={item.ID_CLIENTE} style={styles.clienteItem}>
                        <Text style={styles.itemText}>ID: {item.ID_CLIENTE}</Text>
                        <Text style={styles.itemText}>Nome: {item.nome}</Text>
                        <Text style={styles.itemText}>Data de Nascimento: {item.data_nasc}</Text>
                        <Text style={styles.itemText}>Número: {item.numero}</Text>
                        <Text style={styles.itemText}>Tipo: {item.tipo}</Text>
                    </View>
                ))}
            </ScrollView>
            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => {
                        Alert.alert(
                            "Atenção!",
                            'Deseja excluir o banco de dados do sistema? Esta ação não pode ser desfeita!',
                            [
                                {
                                    text: 'Sim',
                                    onPress: deletaDatabase
                                },
                                {
                                    text: 'Cancelar',
                                    style: 'cancel'
                                }
                            ]
                        );
                    }}
                >
                    <FontAwesome6 name='trash-can' color='red' size={30} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => navigation.navigate('Home')}
                >
                    <FontAwesome6 name='house-user' color='#591DA9' size={30} />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#CB98ED',
        alignItems: 'center'
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#391A4A',
        marginBottom: 20,
    },
    scrollContainer: {
        width: '100%',
        flexGrow: 1,
    },
    clienteItem: {
        backgroundColor: 'white',
        padding: 15,
        marginVertical: 5,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    itemText: {
        fontSize: 16,
        color: '#391A4A',
        marginBottom: 5,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingTop: 20,
    },
    actionButton: {
        padding: 10,
        borderRadius: 10,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    }
});
