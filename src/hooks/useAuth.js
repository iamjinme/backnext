import React, { useState, useContext, createContext } from 'react';
import Cookie from 'js-cookie'; //Nos ayuda asignar a nuestro navegador las cookies que esté recibiendo en el momento de la autenticación
import axios from 'axios'; //Para el manejo de las peticiones como GET, PUT, POST, DELETE
import endPoints from '@services/api';
import { useRouter } from 'next/router';

const AuthContext = createContext(); //Se crea un nuevo context gracias a la api de react
// Se crea la encapsulación de nuestra aplicación
export function ProviderAuth({ children }) {
  const auth = useProvideAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

// Permite exponer cierta información que se estará requiriendo
export const useAuth = () => {
  return useContext(AuthContext);
};

// Captar la información del usuario
function useProvideAuth() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [errorLogin, setErrorLogin] = useState(null);
  const [loading, setLoading] = useState(false);

  const options = {
    headers: {
      accept: '*/*',
      'Content-Type': 'application/json',
    },
  };

  const signIn = async (email, password) => {
    // Lee un access token que regresa desde la información del servidor
    const { data: access_token } = await axios.post(endPoints.auth.login, { email, password }, options);
    // console.log(access_token); // Nos permite ver la información retornada
    if (access_token) {
      const token = access_token.access_token; //requerido para el acceso a la información
      Cookie.set('token', token, { expires: 5 });
      /* expires permite que después de un tiempos definido podamos eliminar
      la información almacenada y pueda volver a logear */
      // Se envía la información necesaria para que pueda definir el valor por defecto
      axios.defaults.headers.Authorization = `Bearer ${token}`;
      // Vamos a llamar el recurso con el profile
      const { data: user } = await axios.get(endPoints.auth.profile);
      setUser(user);
    }
  };

  const logout = () => {
    Cookie.remove('token');
    setUser(null);
    delete axios.defaults.headers.Authorization;
    router.push('/login');
  };

  return {
    user,
    signIn,
    errorLogin,
    setErrorLogin,
    loading,
    setLoading,
    logout,
  };
}
