import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';

import { WebView } from 'react-native-webview';

const api = axios.create({
  baseURL: 'http://localhost:3333/',
});

const App = () => {
  const [products, setProducts] = useState([]);
  const [checkoutUrl, setCheckoutUrl] = useState();

  useEffect(() => {
    async function loadProducts() {
      const { data } = await api.get('products');

      setProducts(data);
    }

    loadProducts();
  }, []);

  async function handleProductClick(productId: string) {
    const { data } = await api.post('payment', { productId });

    setCheckoutUrl(data.checkoutUrl);
  }

  return checkoutUrl ? (
    <WebView
      source={{ uri: checkoutUrl }}
      style={{ marginTop: 20 }}
      onNavigationStateChange={({ url }) => {
        if (url === 'https://google.com/') {
          setCheckoutUrl(undefined);
          Alert.alert('Parabéns pela compra');
          return;
        }

        if (url === 'https://github.com/') {
          setCheckoutUrl(undefined);
        }
      }}
    />
  ) : (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={products}
        numColumns={2}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => handleProductClick(item.id)}
          >
            <Image style={styles.cardImage} source={{ uri: item.images[0] }} />
            <Text numberOfLines={2}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 10,
    justifyContent: 'center',
    flex: 1,
  },
  card: {
    borderColor: 'rgba(0, 0, 0, 0.5)',
    borderWidth: 0.2,
    borderRadius: 4,
    paddingBottom: 10,
    marginHorizontal: 10,
    marginBottom: 20,
    flex: 0.5,
    alignItems: 'center',
  },
  cardImage: {
    width: '100%',
    height: 165,
    marginBottom: 10,
  },
});

export default App;
