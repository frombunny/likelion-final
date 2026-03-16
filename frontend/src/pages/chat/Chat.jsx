import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import sendButtonActivate from "../../assets/chat/sendButtonActivate.svg";
import sendButtonDeactivate from "../../assets/chat/sendButtonDeactivate.svg";
import boogie from "../../assets/common/boogie.svg";
import colors from "../../styles/common/colors";
import { API_ENDPOINTS, apiClient, getWsBaseUrl } from "../../lib/api";

const FALLBACK_PROFILE =
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);
  const [isComposing, setIsComposing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [connectionError, setConnectionError] = useState("");

  const listRef = useRef(null);
  const stompRef = useRef(null);
  const userNameRef = useRef(localStorage.getItem("userName") || "");

  const canSend = Boolean(message.trim());

  useEffect(() => {
    apiClient
      .get(API_ENDPOINTS.chats)
      .then((res) => {
        const chatList = res.data?.data?.chats || [];
        setMessages(
          chatList.map((item, index) => ({
            id: `history-${index}`,
            mine: item.senderName === userNameRef.current,
            senderName: item.senderName || "",
            text: item.message || "",
            profile: item.senderProfileImage || FALLBACK_PROFILE,
          }))
        );
      })
      .catch((error) => {
        console.error("채팅 내역 조회 실패:", error);
        setMessages([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const wsBase = getWsBaseUrl();
    if (!wsBase) return;

    const socket = new SockJS(`${wsBase}/ws`);
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      connectHeaders: {
        Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
      },
      onConnect: () => {
        setConnected(true);
        setConnectionError("");

        client.subscribe("/sub/chat", (frame) => {
          try {
            const payload = JSON.parse(frame.body);
            setMessages((prev) => [
              ...prev,
              {
                id: `in-${Date.now()}-${Math.random()}`,
                mine: payload.senderName === userNameRef.current,
                senderName: payload.senderName || "",
                text: payload.message || "",
                profile: payload.senderProfileImage || FALLBACK_PROFILE,
              },
            ]);
          } catch (error) {
            console.error("채팅 파싱 실패:", error);
          }
        });
      },
      onWebSocketClose: () => {
        setConnected(false);
      },
      onStompError: (frame) => {
        setConnected(false);
        setConnectionError(frame.headers.message || "실시간 연결에 실패했습니다.");
      },
    });

    client.activate();
    stompRef.current = client;

    return () => {
      client.deactivate();
    };
  }, []);

  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages]);

  const send = () => {
    const text = message.trim();
    if (!text) return;

    apiClient
      .post(API_ENDPOINTS.chats, { message: text })
      .then((res) => {
        const payload = res.data?.data;
        if (!connected) {
          setMessages((prev) => [
            ...prev,
            {
              id: `rest-${Date.now()}-${Math.random()}`,
              mine: true,
              senderName: payload?.senderName || userNameRef.current,
              text: payload?.message || text,
              profile: payload?.senderProfileImage || FALLBACK_PROFILE,
            },
          ]);
        }
        setMessage("");
      })
      .catch((error) => {
        console.error("채팅 전송 실패:", error);
      });
  };

  const onKeyDown = (event) => {
    if (event.key === "Enter" && !isComposing) {
      event.preventDefault();
      send();
    }
  };

  return (
    <Page>
      {!loading && messages.length === 0 && <Watermark src={boogie} alt="" aria-hidden="true" />}

      <MessageList ref={listRef}>
        {loading && <StatusText>불러오는 중...</StatusText>}
        {messages.map((item) => (
          <MessageRow key={item.id} mine={item.mine}>
            {!item.mine && <Avatar src={item.profile} alt="profile" />}
            <MessageGroup mine={item.mine}>
              <SenderName mine={item.mine}>{item.senderName}</SenderName>
              <Bubble>{item.text}</Bubble>
            </MessageGroup>
            {item.mine && <Avatar src={item.profile} alt="profile" />}
          </MessageRow>
        ))}
      </MessageList>

      {!connected && (
        <ConnectionText>
          {connectionError || "실시간 연결이 불안정해 REST 방식으로 전송합니다."}
        </ConnectionText>
      )}

      <Composer>
        <Input
          value={message}
          maxLength={300}
          placeholder="질문 내용을 작성해 주세요"
          onChange={(event) => setMessage(event.target.value)}
          onKeyDown={onKeyDown}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
        />
        <SendButton type="button" disabled={!canSend} onClick={send}>
          <img src={canSend ? sendButtonActivate : sendButtonDeactivate} alt="send" />
        </SendButton>
      </Composer>
    </Page>
  );
}

const Page = styled.div`
  width: 100%;
  min-height: var(--content-min-height);
  padding: 24px 20px 138px;
  position: relative;
`;

const MessageList = styled.div`
  width: var(--content-width);
  height: 100%;
  max-height: calc(var(--content-min-height) - 186px);
  margin: 0 auto;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const StatusText = styled.p`
  margin: auto 0;
  color: ${colors.textGray};
  text-align: center;
  font-size: 1.5rem;
`;

const Watermark = styled.img`
  width: 250px;
  height: 250px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -38%);
  opacity: 0.08;
  pointer-events: none;
`;

const MessageRow = styled.div`
  width: 100%;
  display: flex;
  gap: 8px;
  align-items: flex-start;
  justify-content: ${({ mine }) => (mine ? "flex-end" : "flex-start")};
`;

const MessageGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${({ mine }) => (mine ? "flex-end" : "flex-start")};
  gap: 4px;
`;

const SenderName = styled.p`
  margin: 0 4px;
  color: ${colors.textGray};
  font-size: 1.1rem;
  line-height: 1.6rem;
  text-align: ${({ mine }) => (mine ? "right" : "left")};
`;

const Avatar = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 150px;
  border: 1.5px solid ${colors.border};
  object-fit: cover;
  background: ${colors.white};
`;

const Bubble = styled.div`
  width: fit-content;
  max-width: 221px;
  border: 1px solid ${colors.border};
  border-radius: 8px;
  background: ${colors.white};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
  padding: 10px 12px;
  color: ${colors.textPrimary};
  font-size: 1.3rem;
  font-weight: 400;
  line-height: 1.8rem;
  letter-spacing: -0.0325rem;
  white-space: pre-wrap;
  word-break: break-word;
`;

const Composer = styled.div`
  position: fixed;
  left: 50%;
  bottom: 48px;
  transform: translateX(-50%);
  width: 100%;
  max-width: var(--app-width);
  padding: 0 20px;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const ConnectionText = styled.p`
  width: var(--content-width);
  margin: 12px auto 0;
  color: ${colors.textGray};
  font-size: 1.2rem;
  line-height: 1.7rem;
  text-align: center;
`;

const Input = styled.input`
  width: 300px;
  height: 52px;
  border: 1px solid ${colors.border};
  border-radius: 8px;
  background: ${colors.white};
  padding: 0 15px;
  color: ${colors.textPrimary};
  font-size: 1.4rem;
  font-weight: 400;
  line-height: 2rem;
  letter-spacing: -0.035rem;

  &::placeholder {
    color: ${colors.textMuted};
  }
`;

const SendButton = styled.button`
  width: 52px;
  height: 52px;
  border-radius: 8px;
  background: ${({ disabled }) => (disabled ? "#cacaca" : colors.primaryBlue)};
  display: grid;
  place-items: center;
  cursor: ${({ disabled }) => (disabled ? "default" : "pointer")};

  img {
    width: 26px;
    height: 26px;
  }
`;
