import { createContext, useContext, useEffect, useState } from "react";

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const [colorTheme, setColorTheme] = useState("LightBlue");

  // Map der Theme-Farben
  const themeColors = {
    LightBlue: {
      background: "#f9fafb",
      card:"#138bac8d",
      button: "#138bacff",
      buttonBackground: "#138bac8d",
      border: "#f9fafb",
      text: "#ffffff",
      inaktivText: "#474c54ff",
      buttonInvert: "#0c1f44ff",
      bottomSheetHandle: "#292d36ff",
      bottomSheetBackground: "#ececf8ff",
      done: "#10b981ff",
    },
    DarkBlue: {
      background: "#111827",
      card:"#1f2937",
      button:'#0c1f44ff',
      buttonBackground:"#111827",
      border: "#138bacff",
      text: "#ffffff",
      inaktivText: "#888888",
      buttonInvert: "#138bacff",
      bottomSheetHandle: "#5a5c5fff",
      bottomSheetBackground: "#292d36ff",
      done: "#10b981ff",
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
