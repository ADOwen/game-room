import React from 'react';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { useFirebaseApp, AuthProvider, DatabaseProvider } from 'reactfire';
import App from './App';

const ProvideLayer = () => {
    const app = useFirebaseApp()
    const auth = getAuth(app)
    const db = getDatabase(app)

    return (

        <AuthProvider sdk={auth}>
            <DatabaseProvider sdk={db}>
                <App />
            </DatabaseProvider>
        </AuthProvider>
    )
};

export default ProvideLayer;
