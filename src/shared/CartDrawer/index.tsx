import { motion, AnimatePresence } from "framer-motion";
import CloseIcon from "@mui/icons-material/Close";
import styled from "styled-components";

interface Props {
  open: boolean;
  onClose: () => void;
}

export const CartDrawer = ({ open, onClose }: Props) => {
  return (
    <AnimatePresence>
      {open && (
        <>
          <Overlay
            as={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <Drawer
            as={motion.aside}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.4 }}
          >
            <Header>
              <Title>CARRITO</Title>
              <CloseButton onClick={onClose}>
                <CloseIcon />
              </CloseButton>
            </Header>

            <Empty>TU CARRITO ESTÁ VACÍO</Empty>
          </Drawer>
        </>
      )}
    </AnimatePresence>
  );
};

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 999;
`;

export const Drawer = styled.aside`
  position: fixed;
  top: 0;
  right: 0;
  width: 420px;
  max-width: 100%;
  height: 100vh;
  background: white;
  z-index: 1000;
  display: flex;
  flex-direction: column;
`;

export const Header = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid #e5e5e5;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Title = styled.h2`
  font-size: 16px;
  letter-spacing: 3px;
  margin: 0;
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;

  svg {
    font-size: 22px;
  }
`;

export const Empty = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 13px;
  letter-spacing: 2px;
  color: #444;
`;

