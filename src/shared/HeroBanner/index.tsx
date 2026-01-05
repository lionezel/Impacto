import styled, { keyframes } from "styled-components";

interface Props {
  backgroundImage: string;
  title: string;
  subtitle: string;
  description?: string;
}

export const HeroBanner = ({
  backgroundImage,
  title,
  subtitle,
  description,
}: Props) => {
  return (
    <Wrapper>
      <Background image={backgroundImage} />
      <Overlay />

      <Content>
        <Subtitle>{subtitle}</Subtitle>
        <Title>{title}</Title>
        {description && <Description>{description}</Description>}
      </Content>
    </Wrapper>
  );
};

const fadeZoom = keyframes`
  from {
    opacity: 0;
    transform: scale(1.08);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(25px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;


const NAVBAR_HEIGHT = 90;

const Wrapper = styled.section`
  position: relative;
  height: 75vh;
  min-height: 420px;
  width: 100%;
  overflow: hidden;
    margin-top: -${NAVBAR_HEIGHT}px;
  padding-top: ${NAVBAR_HEIGHT}px;
`;

const Background = styled.div<{ image: string }>`
  position: absolute;
  inset: 0;
  background-image: url(${({ image }) => image});
  background-size: cover;
  background-position: center;
  animation: ${fadeZoom} 1.4s ease-out forwards;
`;

const Content = styled.div`
  position: relative;
  z-index: 2;
  height: 100%;
  padding: 0 6%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 700px;
`;

const Subtitle = styled.span`
color: white;
  font-size: 14px;
  letter-spacing: 4px;
  text-transform: uppercase;
  opacity: 0;
  animation: ${slideUp} 0.8s ease-out forwards;
`;

const Title = styled.h1`
color: white;
  font-size: clamp(42px, 6vw, 72px);
  font-weight: 800;
  margin: 12px 0;
  opacity: 0;
  animation: ${slideUp} 0.9s ease-out forwards;
  animation-delay: 0.15s;
`;

const Description = styled.p`
color: white;
  font-size: 16px;
  max-width: 480px;
  opacity: 0;
  animation: ${slideUp} 0.9s ease-out forwards;
  animation-delay: 0.3s;
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to right,
    rgba(0, 0, 0, 0.65),
    rgba(0, 0, 0, 0.1)
  );
  z-index: 1;
`;
