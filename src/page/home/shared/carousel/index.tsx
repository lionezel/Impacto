import { useEffect, useState } from "react";
import { GenericCarousel, ProductCard } from "../../../../shared";
import { useCarousels } from "../../../../hook/useCarousels";
import { Carousel } from "../../../../interfaces/Carousel";
import { getProductsByIds } from "../../../../services/products.service";
import { Product } from "../../../../interfaces/product";
import { CarouselProductCard } from "../CarouselProductCard";

export const HomeCarousels = () => {
    const { getCarousels } = useCarousels();

    const [data, setData] = useState<
        { carousel: Carousel; products: Product[] }[]
    >([]);

    useEffect(() => {
        const load = async () => {
            const carousels = await getCarousels();

            const result = await Promise.all(
                carousels.map(async (carousel) => ({
                    carousel,
                    products: await getProductsByIds(carousel.productIds),
                }))
            );

            setData(result);
        };

        load();
    }, []);

    return (
        <>
            {data.map(({ carousel, products }) => (
                <GenericCarousel
                    key={carousel.id}
                    title={carousel.title}
                    items={products}
                    renderItem={(product) => (
                        <CarouselProductCard
                            product={product}
                            variant={product.variants[0]}
                        />
                    )}
                />
            ))}
        </>
    );
};
