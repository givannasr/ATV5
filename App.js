import { StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';

import Home from './src/Pages/Home';
import Todos from './src/Pages/Todos';
import Cadastro from './src/Pages/Cadastro';
import Pesquisar from './src/Pages/Pesquisar';
import EditarExcluir from './src/Pages/EditarExcluir';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name='Home'
            component={Home}
            options={{
              title: 'Home',
              headerShown: false
            }}
          />
          <Stack.Screen
            name='Cadastro'
            component={Cadastro}
            options={{
              title: 'Novo Cadastro de cliente',
            }}
          />
          <Stack.Screen
            name='Todos'
            component={Todos}
            options={{
              title: 'Todos os clientes',
            }}
          />
          <Stack.Screen
            name='EditarExcluir'
            component={EditarExcluir}
            options={{
              title: 'Editar ou excluir Cliente',
            }}
          />

          <Stack.Screen
            name='Pesquisar'
            component={Pesquisar}
            options={{
              title: 'Pesquisar cliente',
            }}
          />

        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
