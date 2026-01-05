import {
  Box,
  Container,
  Typography,
  Divider,
  Chip,
  Avatar,
  Stack,
} from "@mui/material";
import { useUserOrders } from "../../../hook/useUserOrders";
import { NavbarLight } from "../../../shared/NabvarLight";

export const ProfilePage = () => {
  const { orders, loading } = useUserOrders();

  const stateColorMap: Record<string, "success" | "primary" | "warning" | "error" | "default"> = {
    pendiente: "warning",
    enProceso: "primary",
    enCamino: "primary",
    completada: "success",
    cancelada: "error",
  };

  const paymentColorMap: Record<string, "success" | "primary" | "warning"> = {
    efectivo: "success",
    tarjeta: "primary",
    pendiente: "warning",
  };

  // Estilos reutilizables
  const orderBoxSx = {
    border: "1px solid #eee",
    borderRadius: 3,
    p: 3,
    mb: 3,
    boxShadow: 2,
    transition: "0.3s",
    "&:hover": { boxShadow: 5 },
  };

  const avatarSx = {
    width: 56,
    height: 56,
    borderRadius: 2,
  };

  return (
    <>
    <NavbarLight />
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" fontWeight={700} mb={4}>
        Mis pedidos
      </Typography>

      {loading && <Typography>Cargando pedidos...</Typography>}

      {!loading && orders.length === 0 && (
        <Typography>No tienes pedidos aún</Typography>
      )}

      {!loading &&
        orders.map((order: any) => {
          const date = order.date?.toDate ? order.date.toDate() : new Date(order.date);

          const totalGeneral = order.products.reduce(
            (acc: any, p: any) => acc + Number(p.total ?? Number(p.price) * Number(p.quantity)),
            0
          );

          return (
            <Box key={order.id} sx={orderBoxSx}>
              {/* HEADER */}
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography fontWeight={600}>Pedido #{order.id?.slice(0, 8)}</Typography>
                
                <Stack direction="row" spacing={1}>
                  <Chip
                    label={order.paymentMethod}
                    color={paymentColorMap[order.paymentMethod] || "warning"}
                  />
                  <Chip
                    label={order.state}
                    color={stateColorMap[order.state] || "default"}
                  />
                </Stack>
              </Box>

              {/* FECHA */}


              {/* DIRECCIÓN */}
              {order.address && (
                <Typography variant="body2" color="text.secondary" mb={2}>
                  📍 {order.address}
                </Typography>
              )}

              <Divider sx={{ mb: 2 }} />

              {/* ITEMS */}
              <Stack spacing={2}>
                {order.products.map((p: any) => (
                  <Stack key={p.id} direction="row" spacing={2} alignItems="center">
                    <Avatar src={p.image} alt={p.name} sx={avatarSx} />
                    <Box flex={1}>
                      <Typography fontWeight={600}>{p.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Cantidad: {p.quantity} | Precio: ${p.price.toLocaleString()} | Total: $
                        {Number(p.total ?? Number(p.price) * p.quantity).toLocaleString()}
                      </Typography>
                    </Box>
                  </Stack>
                ))}
              </Stack>

              <Divider sx={{ my: 2 }} />

              {/* TOTAL */}
              <Box display="flex" justifyContent="flex-end">
                <Typography fontWeight={700} variant="subtitle1">
                  Total: ${totalGeneral.toLocaleString()}
                </Typography>
              </Box>
            </Box>
          );
        })}
    </Container>
    </>
  );
};
