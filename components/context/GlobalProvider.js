import { createContext, useContext, useEffect, useState } from "react";

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const [colorTheme, setColorTheme] = useState("LightBlue");

  // Map der Theme-Farben
  const themeColors = {
    LightBlue: {
      background: "#f9fafb",
      card:"#474c54ff",
      button: "#138bacff",
      border: "#f9fafb",
      text: "#ffffff",
    },
    DarkBlue: {
      background: "#111827",
      card:"#1f2937",
      button:'#0c1f44ff',
      border: "#138bacff",
      text: "#ffffff",
    },
  };

  
  return (
    <GlobalContext.Provider
      value={{
        colorTheme,
        setColorTheme,
        themeColors
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
