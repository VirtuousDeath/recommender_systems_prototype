import React, { createContext, useState, useContext, type ReactNode } from 'react';

export interface GeneralContextValue {
    collapse_menu: boolean 
}

export interface GeneralContextType {
    context: GeneralContextValue;
    setContext: (value: GeneralContextValue) => void;
}

export const GeneralContext = createContext<[GeneralContextValue, (value: GeneralContextValue) => void] | null>(null);

// 2. Create the Provider Component
export const GeneralContextProvider = ({ children }: { children: ReactNode }) => {
    const [context, setContext] = useState({ collapse_menu: true });

    return (
        <GeneralContext.Provider value={[ context, setContext ]}>
            {children}
        </GeneralContext.Provider>
    );
};

// export const useGeneralContext = useContext(GeneralContext);