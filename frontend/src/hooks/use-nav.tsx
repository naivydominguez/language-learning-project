import { createContext, useContext, useState } from "react";

type NavContextType = {
  navOpen: boolean;
  openNav: () => void;
  closeNav: () => void;
};

export const NavContext = createContext<NavContextType>({
  navOpen: false,
  openNav: () => {},
  closeNav: () => {},
});

export function useNav() {
  return useContext(NavContext);
}

export function useNavProvider(): NavContextType {
  const [navOpen, setNavOpen] = useState(false);

  return {
    navOpen,
    openNav: () => setNavOpen(true),
    closeNav: () => setNavOpen(false),
  };
}
