import styled from "styled-components";
import { isRouteErrorResponse, useNavigate, useRouteError } from "react-router-dom";
import BasicButton from "../../shared/BasicButton";
import colors from "../../styles/common/colors";

export default function RouteErrorPage() {
  const navigate = useNavigate();
  const error = useRouteError();

  const status = isRouteErrorResponse(error) ? error.status : 500;
  const message = isRouteErrorResponse(error)
    ? error.statusText
    : "페이지를 불러오는 중 문제가 발생했습니다.";

  return (
    <Page>
      <Title>{status === 404 ? "페이지를 찾을 수 없습니다." : "오류가 발생했습니다."}</Title>
      <Description>{message}</Description>
      <BottomArea>
        <BasicButton text="홈으로 이동" onClick={() => navigate("/", { replace: true })} />
      </BottomArea>
    </Page>
  );
}

const Page = styled.div`
  width: 100%;
  min-height: var(--content-min-height);
  padding: 48px 20px 140px;
`;

const Title = styled.h1`
  margin: 0;
  color: ${colors.textPrimary};
  font-size: 2.4rem;
  font-weight: 600;
  line-height: 3.4rem;
`;

const Description = styled.p`
  margin: 12px 0 0;
  color: ${colors.textGray};
  font-size: 1.5rem;
  line-height: 2.2rem;
`;

const BottomArea = styled.div`
  position: fixed;
  left: 50%;
  bottom: 50px;
  transform: translateX(-50%);
  width: 100%;
  max-width: var(--app-width);
  padding: 0 20px;
`;
