import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Button,
  View,
  ActivityIndicator,
  Platform
} from 'react-native';

import { addEventListener, removeEventListener, requestPermissions, EuroMessageApi, VisilabsApi } from 'react-native-related-digital'

const App = () => {
  const [loading, setLoading] = useState(false)

  const appAlias = Platform.OS === "ios" ? "jimmykeyios" : "jimmykeyandroid";
  const siteId = "356467332F6533766975593D";
  const organizationId = "676D325830564761676D453D";
  const dataSource = "visistore";


  const euroMessageApi = new EuroMessageApi(appAlias)
  const visilabsApi = new VisilabsApi(appAlias, siteId, organizationId, dataSource)

  useEffect(() => {
    addExtra()
    addListeners()
    requestPermissions()

    return () => removeListeners()
  }, [])

  const addListeners = () => {

    addEventListener('register', async (token) => {
      console.log("token",token);
      const subscribeResult = await euroMessageApi.subscribe(token)

      console.log("subscribeResult",subscribeResult);

    }, (notificationPayload) => {
      console.log('notification payload', notificationPayload)
    }, euroMessageApi, visilabsApi)

    addEventListener('registrationError', async (registrationError) => {
      console.log('registrationError is ', registrationError)
    }, euroMessageApi)
  }

  const getCustomTime = () => {
    var d = new Date();
    var date_format_str = d.getFullYear().toString() + "-" + ((d.getMonth() + 1).toString().length == 2 ? (d.getMonth() + 1).toString() : "0" + (d.getMonth() + 1).toString()) + "-" + (d.getDate().toString().length == 2 ? d.getDate().toString() : "0" + d.getDate().toString()) + " " + (d.getHours().toString().length == 2 ? d.getHours().toString() : "0" + d.getHours().toString()) + ":" + ((d.getMinutes()).toString().length == 2 ? (d.getMinutes()).toString() : "0" + (d.getMinutes()).toString()) + ":" + (d.getSeconds()).toString();
    return date_format_str
  }

  const addExtra = async () => { 
    await euroMessageApi.setUserProperty("email", "baris.arslan@euromsg.com");
    await euroMessageApi.setUserProperty("keyID", "baris.arslan@euromsg.com");
    await euroMessageApi.setUserProperty("pushPermit", "Y");
    await euroMessageApi.setUserProperty('ConsentTime', getCustomTime());
    await euroMessageApi.setUserProperty('RecipientType', "BIREYSEL");
    await euroMessageApi.setUserProperty('ConsentSource', "HS_MOBIL");
  }

  const removeListeners = () => {
    removeEventListener('register')
    removeEventListener('registrationError')
  }

  return (
    <>
      <SafeAreaView>
        {
          loading ?
          <ActivityIndicator 
            size='large'
            animating={loading} /> :
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.scrollView}>
            
            <Button 
              title='REQUEST PERMISSONS'
              onPress={() => {
                requestPermissions()
              }} 
            />
          </ScrollView>
        }
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#FFF',
    padding: 20
  },
  divider: {
    height: 20
  }
});

export default App;