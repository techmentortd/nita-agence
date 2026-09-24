import { createContext, useContext, useState } from 'react';

const NavVisibilityContext = createContext(null);

// Permet à une page (ex. la liste d'agences sur /carte) de masquer
// temporairement MobileBottomNav pour libérer de la place à l'écran,
// sans que les deux composants (page et nav) aient de lien direct.
export function NavVisibilityProvider({ children }) {
  const [hidden, setHidden] = useState(false);
  return (
    <NavVisibilityContext.Provider value={{ hidden, setHidden }}>
      {children}
    </NavVisibilityContext.Provider>
  );
}

export function useNavVisibility() {
  return useContext(NavVisibilityContext);
}
