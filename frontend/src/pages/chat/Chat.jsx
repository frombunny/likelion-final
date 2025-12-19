import { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import sendButtonActivate from "../../assets/chat/sendButtonActivate.svg";
import sendButtonDeactivate from "../../assets/chat/sendButtonDeactivate.svg";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [chatList, setChatList] = useState([]);
  const [connected, setConnected] = useState(false);
  const [isComposing, setIsComposing] = useState(false);

  const stompRef = useRef(null);

  useEffect(() => {
    const socket = new SockJS(import.meta.env.VITE_BACKEND_WS_URL + "/ws");

    const stomp = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,

      debug: (msg) => console.log("STOMP >>>", msg),

      connectHeaders: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },

      onConnect: () => {
        setConnected(true);

        stomp.subscribe("/sub/chat", (frame) => {
          const data = JSON.parse(frame.body);

          const id = Date.now();
          const randomX = Math.random() * 20 + 40;
          const randomY = Math.random() * 70 + 10;

          const bubble = {
            id,
            message: data.message,
            senderProfileImage: data.senderProfileImage,
            x: randomX,
            y: randomY,
          };

          setChatList((prev) => [...prev, bubble]);

          setTimeout(() => {
            setChatList((prev) => prev.filter((m) => m.id !== id));
          }, 5000);
        });
      },

      onStompError: () => setConnected(false),
      onWebSocketClose: () => setConnected(false),
    });

    stomp.activate();
    stompRef.current = stomp;

    return () => stomp.deactivate();
  }, []);

  const sendMessage = () => {
    if (!message.trim() || !connected) return;

    stompRef.current.publish({
      destination: "/pub/send",
      body: JSON.stringify({ message }),
    });

    setMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !isComposing) {
      sendMessage();
    }
  };

  return (
    <ChatWrapper>
      <FloatingArea>
        {chatList.map((c) => (
          <FloatingMessage
            key={c.id}
            style={{
              top: `${c.y}%`,
              left: `${c.x}%`,
            }}
          >
            <Profile src={c.senderProfileImage} />
            <Bubble>{c.message}</Bubble>
          </FloatingMessage>
        ))}
      </FloatingArea>

      <InputBar>
        <ChatInput
          placeholder={
            connected ? "내용을 입력해 주세요" : "채팅 서버 연결 중..."
          }
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
          disabled={!connected}
        />

        <SendButton
          disabled={!message.trim() || !connected}
          onClick={sendMessage}
        >
          <img
            src={
              !message.trim() || !connected
                ? sendButtonDeactivate
                : sendButtonActivate
            }
            alt="send"
          />
        </SendButton>
      </InputBar>
    </ChatWrapper>
  );
}

const ChatWrapper = styled.div`
  width: 100%;
  height: calc(100vh - 60px);
  margin-top: 12px;
  position: relative;
`;

const FloatingArea = styled.div`
  position: relative;
  width: 100%;
  height: 90%;
`;

const FloatingMessage = styled.div`
  position: absolute;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  gap: 8px;
  animation: fade 5s forwards;

  @keyframes fade {
    0% {
      opacity: 0;
      transform: scale(0.8);
    }
    10% {
      opacity: 1;
      transform: scale(1);
    }
    80% {
      opacity: 1;
    }
    100% {
      opacity: 0;
      transform: scale(0.9);
    }
  }
`;

const Profile = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
`;

const Bubble = styled.div`
  background: white;
  border-radius: 14px;
  padding: 10px 14px;
  font-size: 1.4rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
`;

const InputBar = styled.div`
  padding: 14px 16px;
  display: flex;
  gap: 10px;
`;

const ChatInput = styled.input`
  flex: 1;
  height: 44px;
  border-radius: 10px;
  border: 1px solid #ddd;
  padding: 0 14px;
  font-size: 1.4rem;
`;

const SendButton = styled.button`
  width: 44px;
  height: 44px;
  border: none;
  padding: 0;
  background: transparent;
  cursor: ${({ disabled }) => (disabled ? "default" : "pointer")};

  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
  }
`;
