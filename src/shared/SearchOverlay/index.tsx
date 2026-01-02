import { useEffect, useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { useNavigate } from "react-router-dom";
import { Highlight } from "./shared";

interface Product {
  id: string;
  name: string;
  image?: string;
  price?: number;
}

interface Props {
  open: boolean;
  onClose: () => void;
  products: Product[];
}

const useDebounce = (value: string, delay = 250) => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);

  return debounced;
};


export const SearchOverlay = ({ open, onClose, products }: Props) => {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) setQuery("");
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open, onClose]);

  const results = products.filter((p) =>
    p.name.toLowerCase().includes(debouncedQuery.toLowerCase())
  );

  const handleSelect = (id: string) => {
    onClose();
    navigate(`/products/${id}`);
  };

  return (
    <AnimatePresence>
      {open && (
        <Overlay
          as={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Container
            as={motion.div}
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            exit={{ y: -20 }}
          >
            <Header>
              <SearchIcon />
              <input
                autoFocus
                placeholder="¿Qué estás buscando?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <CloseIcon onClick={onClose} />
            </Header>

            {!query && (
              <Suggestions>
                <span>
                  <TrendingUpIcon /> Búsquedas populares
                </span>
                <button>Cerveza</button>
                <button>Perfume</button>
                <button>Oferta</button>
              </Suggestions>
            )}

            <Results>
              {debouncedQuery && results.length === 0 && (
                <Empty>
                  No encontramos resultados para
                  <strong> “{debouncedQuery}”</strong>
                </Empty>
              )}

              {results.map((p) => (
                <Item
                  key={p.id}
                  onClick={() => handleSelect(p.id)}
                  whileHover={{ scale: 1.02 }}
                >
                  {p.image && <img src={p.image} alt={p.name} />}
                  <div>
                    <Highlight text={p.name} query={debouncedQuery} />
                    {p.price && <small>${p.price}</small>}
                  </div>
                </Item>
              ))}
            </Results>
          </Container>
        </Overlay>
      )}
    </AnimatePresence>
  );
};

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.85);
  z-index: 9999;
`;

const Container = styled.div`
  background: #0f0f0f;
  height: 100vh;
  padding-top: 60px;
`;

const Header = styled.div`
  position: fixed;
  top: 0;
  width: 100%;
  height: 60px;
  background: #0f0f0f;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 16px;
  border-bottom: 1px solid rgba(255,255,255,0.1);

  input {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    color: white;
    font-size: 16px;
  }

  svg {
    color: white;
  }
`;

const Suggestions = styled.div`
  padding: 16px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;

  span {
    width: 100%;
    color: #aaa;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  button {
    background: #1b1b1b;
    border: none;
    color: white;
    padding: 8px 14px;
    border-radius: 20px;
    font-size: 14px;
  }
`;

const Results = styled.div`
  padding: 16px;
`;

const Item = styled(motion.div)`
  display: flex;
  gap: 14px;
  padding: 12px;
  border-radius: 10px;
  cursor: pointer;

  &:hover {
    background: rgba(255,255,255,0.06);
  }

  img {
    width: 56px;
    height: 56px;
    border-radius: 8px;
    object-fit: cover;
  }

  mark {
    background: none;
    color: #00e676;
    font-weight: 600;
  }

  span {
    color: white;
    font-weight: 500;
  }

  small {
    color: #aaa;
  }
`;

const Empty = styled.div`
  padding: 40px 16px;
  color: #aaa;
  text-align: center;
`;
