
import { ReactNode } from "react";
import { useLazyLoad } from "../../../../hook/useLazyLoad";
import { CarouselSkeleton } from "../CarouselSkeleton";
import { GenericCarousel } from "../../../../shared";

interface Props<T> {
    title: string;
    items: T[];
    isLoading: boolean;
    renderItem: (item: T) => ReactNode;
}

export function LazyCarousel<T>({
    title,
    items,
    isLoading,
    renderItem,
}: Props<T>) {
    const { ref, isVisible } = useLazyLoad();

    return (
        <div ref={ref}>
            {!isVisible && <CarouselSkeleton />}

            {isVisible && (
                <>
                    {isLoading ? (
                        <CarouselSkeleton />
                    ) : (
                        <GenericCarousel
                            title={title}
                            items={items}
                            renderItem={renderItem}
                        />
                    )}
                </>
            )}
        </div>
    );
}
