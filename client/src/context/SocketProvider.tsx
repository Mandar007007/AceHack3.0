import React , { createContext, useContext, useMemo } from 'react';
import * as io from 'socket.io-client';

const SocketContext = createContext(null);


type SocketProviderProps = {
    children: React.ReactNode
}


export const useSocket = () => {
    return useContext(SocketContext);
}


export const SocketProvider = ( {children } : SocketProviderProps ) => {
    const socket = useMemo(() => io.connect('http://localhost:3000'), []);

    return (
        <SocketContext.Provider value={socket as unknown as null}>
            {children}
        </SocketContext.Provider>
    )
}