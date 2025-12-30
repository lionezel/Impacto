import styled, { keyframes, css } from "styled-components";
import { NavLink } from "react-router-dom";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import Badge from "@mui/material/Badge";
import { useEffect, useRef, useState } from "react";
import { CartDrawer } from "../CartDrawer";

interface Props {
  cartCount?: number;
}

/* 🔥 Animación */
const pop = keyframes`
  0% { transform: scale(1); }
  30% { transform: scale(1.35); }
  60% { transform: scale(0.9); }
  100% { transform: scale(1); }
`;

export const NavbarLight = ({ cartCount = 0 }: Props) => {
  const [cartOpen, setCartOpen] = useState(false);
  const [animate, setAnimate] = useState(false);
  const prevCount = useRef(cartCount);

  /* Detectar aumento */
  useEffect(() => {
    if (cartCount > prevCount.current) {
      setAnimate(true);
      setTimeout(() => setAnimate(false), 400);
    }
    prevCount.current = cartCount;
  }, [cartCount]);

  return (
    <Nav>
      <Spacer />

      <Logo to="/">Impacto</Logo>

      <Icons>
        <AnimatedWrapper $animate={animate}>
          <Badge
            badgeContent={cartCount}
            color="error"
            invisible={cartCount === 0}
          >
            <ShoppingBagOutlinedIcon
              onClick={() => setCartOpen(true)}
              style={{ cursor: "pointer" }}
            />
          </Badge>
        </AnimatedWrapper>
      </Icons>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </Nav>
  );
};

/* ---------------- STYLES ---------------- */

const AnimatedWrapper = styled.div<{ $animate: boolean }>`
  ${({ $animate }) =>
    $animate &&
    css`
      animation: ${pop} 0.4s ease;
    `}
`;

const Nav = styled.nav`
  position: sticky;
  top: 0;
  z-index: 100;
  height: 72px;
  padding: 0 32px;
  display: flex;
  align-items: center;
  background: white;
  border-bottom: 1px solid #eee;
`;

const Spacer = styled.div`
  flex: 1;
`;

const Logo = styled(NavLink)`
  flex: 1;
  text-align: center;
  font-family: "Old English Text MT", serif;
  font-size: 32px;
  font-weight: bold;
  text-decoration: none;
  color: black;
`;

const Icons = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
  font-size: 26px;
  color: black;

  svg {
    cursor: pointer;
  }
`;
