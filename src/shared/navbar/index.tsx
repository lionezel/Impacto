import { useEffect, useState } from "react";
import styled from "styled-components";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Badge from "@mui/material/Badge";

import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

import { category } from "../../interfaces/category";
import { CartDrawer } from "../CartDrawer";
import { useAuth } from "../../hook/useAuth";
import { UserMenu } from "../UserMenu";
import { SearchOverlay } from "../SearchOverlay";
import { useProducts } from "../../hook/useProducts";


interface Props {
  category: category[];
  cartCount?: number;
}

export const Navbar = ({ category, cartCount = 0 }: Props) => {
  const { products } = useProducts();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  /* Sticky + shadow */
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleProfileClick = () => {
    if (user) {
      navigate("/profile");
    } else {
      navigate("/login");
    }
  };


  return (
    <Nav $scrolled={scrolled}>
      <Logo to="/">Impacto</Logo>

      {/* Desktop Menu */}
      <Menu>
        {category.map((item) => (
          <li key={item.id} className={item.isSale ? "sale" : ""}>
            <NavLink to={`/catalog/${item.name}`}>{item.name}</NavLink>
          </li>
        ))}
      </Menu>

      {/* Icons */}
      <Icons>
        {user ? (
          <UserMenu email={user.email!} />
        ) : (

          <PersonOutlineIcon onClick={() => navigate("/login")}
            style={{ cursor: "pointer" }} />
        )}
        <SearchIcon onClick={() => setSearchOpen(true)} />
        <Badge badgeContent={cartCount} color="error">
          <ShoppingBagOutlinedIcon onClick={() => setCartOpen(true)} />
        </Badge>
      </Icons>

      <SearchOverlay
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        products={products}
      />

      {/* Mobile toggle */}
      <Toggle onClick={() => setOpen(!open)}>
        {open ? <CloseIcon /> : <MenuIcon />}
      </Toggle>

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
      />


      {/* Mobile animated menu */}
      <AnimatePresence>
        {open && (
          <MobileMenu
            as={motion.ul}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.35 }}
          >

            {/* USUARIO */}
            <MobileUser>
              {user ? (
                <>
                  <PersonOutlineIcon />
                  <span>{user.email}</span>
                </>
              ) : (
                <button onClick={() => navigate("/login")}>
                  Iniciar sesión
                </button>
              )}
            </MobileUser>

            {/* CATEGORÍAS */}
            {category.map((item) => (
              <li key={item.id} onClick={() => setOpen(false)}>
                <NavLink to={`/catalog/${item.name}`}>
                  {item.name}
                </NavLink>
              </li>
            ))}

            {/* ACCIONES */}
            <MobileActions>
              <button onClick={() => setCartOpen(true)}>
                <ShoppingBagOutlinedIcon />
                Carrito
              </button>

              <button onClick={() => {
                handleProfileClick();
                setOpen(false);
              }}>
                <PersonOutlineIcon />
                Perfil
              </button>

              <button onClick={() => setSearchOpen(true)}>
                <SearchIcon />
                Buscar
              </button>

            </MobileActions>



          </MobileMenu>
        )}
      </AnimatePresence>
    </Nav>
  );
};

const Nav = styled.nav<{ $scrolled: boolean }>`
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 16px 24px;
  display: flex;
  align-items: center;

  background: ${({ $scrolled }) =>
    $scrolled ? "rgba(20, 20, 20, 0.85)" : "transparent"};

  backdrop-filter: ${({ $scrolled }) =>
    $scrolled ? "blur(10px)" : "none"};

  transition: background 0.35s ease, box-shadow 0.35s ease;

  box-shadow: ${({ $scrolled }) =>
    $scrolled ? "0 6px 20px rgba(0,0,0,0.35)" : "none"};
`;


const Logo = styled(NavLink)`
  font-family: "Old English Text MT", serif;
  font-size: 28px;
  font-weight: bold;
  flex: 1;
  text-decoration: none;
  color: white;
`;

const Menu = styled.ul`
  display: flex;
  gap: 24px;
  list-style: none;
  flex: 3;
  justify-content: center;

  li a {
    text-decoration: none;
    color: white;
    font-size: 14px;
    font-weight: 600;
    position: relative;
  }

  li a.active::after {
    content: "";
    position: absolute;
    bottom: -6px;
    left: 0;
    width: 100%;
    height: 2px;
    background: white;
  }

  li.sale a {
    opacity: 0.7;
  }

  @media (max-width: 1024px) {
    display: none;
  }
`;

const Icons = styled.div`
  display: flex;
  gap: 18px;
  font-size: 24px;
  flex: 1;
  justify-content: flex-end;
  color: white;
  svg {
    cursor: pointer;
  }

  @media (max-width: 1024px) {
    display: none;
  }
`;

const Toggle = styled.button`
  display: none;
  background: none;
  border: none;
  color: white;
  cursor: pointer;

  svg {
    font-size: 30px;
  }

  @media (max-width: 1024px) {
    display: block;
  }
`;

const MobileMenu = styled.ul`
  position: fixed;
  top: 64px;
  left: 0;
  width: 100%;
  height: calc(100vh - 64px);
  background: rgba(20, 20, 20, 0.98);
  backdrop-filter: blur(8px);
  list-style: none;
  padding: 0;
  z-index: 999;

  li {
    padding: 16px;
    font-size: 18px;
    border-bottom: 1px solid rgba(255,255,255,0.08);
  }

  li a {
    color: white;
    text-decoration: none;
    font-weight: 500;
  }
`;


const MobileUser = styled.div`
  padding: 16px;
  color: white;
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid rgba(255,255,255,0.1);

  button {
    width: 100%;
    background: white;
    color: black;
    border: none;
    padding: 10px;
    border-radius: 6px;
    font-weight: 600;
  }
`;

const MobileActions = styled.div`
  margin-top: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  button {
    width: 100%;
    padding: 14px;
    background: #000;
    color: white;
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.15);
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 16px;
  }
`;
