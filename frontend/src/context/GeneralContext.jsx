import React, { createContext, useState } from "react";

export const GeneralContext = createContext();

const GeneralProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  return (
    <GeneralContext.Provider value={{ user, setUser }}>
      {children}
    </GeneralContext.Provider>
  );
};

export default GeneralProvider;