import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@heroui/navbar";
import { link as linkStyles } from "@heroui/theme";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";

import { ThemeSwitch } from "@/components/theme-switch";
import { Logo } from "@/components/icons";
import { useDispatch, useSelector } from "react-redux";
import { logOut, selectIsAuthenticated } from "@/authSlicer";

export const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const handleLogout = () => {
      dispatch(logOut());
      navigate("/login");
  }

  return (
    <HeroUINavbar maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand className="gap-3 max-w-fit">
          <button
            className="flex justify-start items-center gap-1 hover:opacity-80 transition-opacity"
            onClick={() => navigate("/")}
          >
            <Logo />
            <p className="font-bold text-inherit">Active Annotate</p>
          </button>
        </NavbarBrand>
        <div className="hidden lg:flex gap-4 justify-start ml-2">
          <NavbarItem>
            <button
              className={clsx(
                linkStyles({ color: "foreground" }),
                "cursor-pointer text-foreground hover:text-primary transition-colors"
              )}
              onClick={() => navigate("/")}
            >
              Datasets
            </button>
          </NavbarItem>
        </div>
        {isAuthenticated && (
          <div>
            <button 
              className={clsx(
                linkStyles({ color: "foreground" }),
                "cursor-pointer text-foreground hover:text-primary transition-colors"
              )} 
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        )}
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-2">
          <ThemeSwitch />
        </NavbarItem>
      </NavbarContent>
    </HeroUINavbar>
  );
};
