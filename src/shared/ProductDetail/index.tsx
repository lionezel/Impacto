import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  Divider,
  Avatar,
} from "@mui/material";

interface ProductDetailProps {
  product: {
    name: string;
    category: string;
    price: number;
    images: string[];
    description: string;
  };
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ product }) => {
  const [selectedImage, setSelectedImage] = useState(product.images[0]);

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Stack direction={{ xs: "column", md: "row" }} spacing={4}>
        {/* IMAGEN PRINCIPAL Y MINIATURAS */}
        <Box flex={1}>
          <Box
            component="img"
            src={selectedImage}
            alt={product.name}
            sx={{ width: "100%", borderRadius: 2, mb: 2 }}
          />

          <Stack direction="row" spacing={1}>
            {product.images.map((img, index) => (
              <Avatar
                key={index}
                src={img}
                variant="square"
                sx={{
                  width: 64,
                  height: 64,
                  border: selectedImage === img ? "2px solid black" : "1px solid #ccc",
                  cursor: "pointer",
                }}
                onClick={() => setSelectedImage(img)}
              />
            ))}
          </Stack>
        </Box>

        {/* DETALLE DEL PRODUCTO */}
        <Box flex={1}>
          <Typography variant="overline" color="text.secondary">
            {product.category.toUpperCase()}
          </Typography>
          <Typography variant="h5" fontWeight={700} mb={2}>
            {product.name}
          </Typography>

          <Typography variant="h6" fontWeight={600} mb={3}>
            ${product.price.toLocaleString()}
          </Typography>

          <Stack direction="row" spacing={2} mb={3}>
            <Button variant="outlined" fullWidth>
              AÑADIR AL CARRITO
            </Button>
            <Button variant="contained" fullWidth>
              COMPRAR AHORA
            </Button>
          </Stack>

          <Divider sx={{ mb: 3 }} />

          <Typography variant="body2" color="text.secondary">
            {product.description}
          </Typography>
        </Box>
      </Stack>
    </Container>
  );
};
