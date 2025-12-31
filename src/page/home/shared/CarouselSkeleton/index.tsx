import styled, { keyframes } from "styled-components";

export const CarouselSkeleton = () => {
    return (
        <SkeletonRow>
            {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
            ))}
        </SkeletonRow>
    );
};

const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: 200px 0; }
`;

const SkeletonRow = styled.div`
  display: flex;
  gap: 10px;
  padding: 6px 2px;
`;

const SkeletonCard = styled.div`
  width: 120px;
  aspect-ratio: 2.5 / 3;
  border-radius: 10px;
  background: linear-gradient(
    90deg,
    #1a1a1a 25%,
    #2a2a2a 37%,
    #1a1a1a 63%
  );
  background-size: 400% 100%;
  animation: ${shimmer} 1.4s ease infinite;
`;
