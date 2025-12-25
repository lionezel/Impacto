import React from "react";
import styled from "styled-components";

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

const NAVBAR_HEIGHT = 90;

const Wrapper = styled.section`
  position: relative;
  width: 100%;
  height: 50vh;
  min-height: 560px;
  margin-top: -${NAVBAR_HEIGHT}px;
  padding-top: ${NAVBAR_HEIGHT}px;
  overflow: hidden;
`;

const Background = styled.div<{ image: string }>`
  position: absolute;
  inset: 0;
  background-image: url(${({ image }) => image});
  background-size: cover;
  background-position: center;
  transform: scale(1.08);
  filter: grayscale(100%);
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.35),
    rgba(0, 0, 0, 0.65)
  );
`;

const Content = styled.div`
  position: relative;
  z-index: 2;
  height: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: white;
`;

const Subtitle = styled.span`
  font-size: 13px;
  letter-spacing: 4px;
  text-transform: uppercase;
  opacity: 0.85;
  margin-bottom: 14px;
`;

const Title = styled.h1`
  font-size: clamp(42px, 7vw, 84px);
  font-weight: 700;
  letter-spacing: 8px;
  margin: 0;
  line-height: 1.05;
`;

const Description = styled.p`
  margin-top: 20px;
  font-size: 15px;
  letter-spacing: 2px;
  opacity: 0.85;
  max-width: 600px;
`;
