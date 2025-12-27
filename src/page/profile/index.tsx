import {
  Box,
  Container,
  Typography,
  Divider,
  Chip,
} from "@mui/material";
import { useUserOrders } from "../../hook/useUserOrders";


export const ProfilePage = () => {
  const { orders, loading } = useUserOrders();

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" fontWeight={700} mb={4}>
        Mis pedidos
      </Typography>

      {loading && <Typography>Cargando pedidos...</Typography>}

      {!loading && orders.length === 0 && (
        <Typography>No tienes pedidos aún</Typography>
      )}

      {orders.map((order) => (
        <Box
          key={order.id}
          sx={{
            border: "1px solid #eee",
            borderRadius: 2,
            padding: 3,
            mb: 3,
          }}
        >
          {/* HEADER */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography fontWeight={600}>
              Pedido #{order.id.slice(0, 8)}
            </Typography>

            <Chip
              label={order.status}
              color={order.status === "paid" ? "success" : "warning"}
            />
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* ITEMS */}
          {order.items.map((item, index) => (
            <Box
              key={index}
              display="flex"
              alignItems="center"
              mb={2}
              gap={2}
            >
              <img
                src={item.image}
                alt={item.title}
                width={70}
                style={{ borderRadius: 8 }}
              />

              <Box flex={1}>
                <Typography fontWeight={600}>{item.title}</Typography>
                <Typography variant="body2">
                  Cantidad: {item.quantity}
                </Typography>
              </Box>

              <Typography fontWeight={600}>
                ${item.price.toLocaleString()}
              </Typography>
            </Box>
          ))}

          <Divider sx={{ my: 2 }} />

          {/* TOTAL */}
          <Box display="flex" justifyContent="flex-end">
            <Typography fontWeight={700}>
              Total: ${order.total.toLocaleString()}
            </Typography>
          </Box>
        </Box>
      ))}
    </Container>
  );
};
