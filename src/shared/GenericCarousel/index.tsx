import { Box, Typography } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

interface GenericCarouselProps<T> {
    title: string;
    items: T[];
    renderItem: (item: T) => React.ReactNode;
}

export function GenericCarousel<T>({
    title,
    items,
    renderItem,
}: GenericCarouselProps<T>) {
    if (!items.length) return null;

    return (
        <Box sx={{ mb: 5 }}>
            <Typography variant="h6" fontWeight={700} fontSize={25} m={2} mt={5}>
                {title}
            </Typography>

            <Swiper
                modules={[Navigation]}
                navigation
                freeMode
                grabCursor
                spaceBetween={10}
                slidesPerView={3.2}
                breakpoints={{
                    640: { slidesPerView: 4.2 },
                    900: { slidesPerView: 5.5 },
                    1200: { slidesPerView: 7 },
                }}
                style={{ padding: "6px 2px" }}
            >
                {items.map((item, index) => (
                    <SwiperSlide key={index}>
                        {renderItem(item)}
                    </SwiperSlide>
                ))}
            </Swiper>
        </Box>
    );
}
