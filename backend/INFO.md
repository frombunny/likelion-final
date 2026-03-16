# API INFO

이 문서는 현재 백엔드 프로젝트에 구현되어 있는 API와 각 API의 내부 로직을 정리한 문서입니다.

## 1. 공통 사항

### 1-1. 베이스 경로
- REST API는 모두 `/api` 하위에 있습니다.
- 실시간 채팅은 WebSocket STOMP 엔드포인트 `/ws` 를 사용합니다.

### 1-2. 인증 방식
- 인증은 JWT 기반입니다.
- 로그인 성공 시 발급된 `accessToken` 을 이후 요청에서 사용합니다.
- 인증이 필요한 REST API는 `Authorization: Bearer {token}` 헤더가 필요합니다.
- WebSocket 연결 시에는 STOMP `CONNECT` 헤더에 `Authorization: Bearer {token}` 값을 넣어야 합니다.

### 1-3. 인증 예외 경로
- `POST /api/users`
- `POST /api/users/login`
- `POST /api/documents/create`
- `POST /api/documents/create/awards`
- `/ws/**`

즉, 위 경로를 제외한 나머지 REST API는 인증이 필요합니다.

### 1-4. 성공 응답 형식
성공 응답은 공통적으로 아래 구조를 사용합니다.

```json
{
  "isSuccess": true,
  "code": "SUCCESS_200",
  "message": "호출에 성공하였습니다.",
  "timeStamp": "2026-03-16 12:00:00",
  "httpStatus": 200,
  "data": {}
}
```

생성/저장만 수행하는 API는 `data` 가 `null` 일 수 있습니다.

## 2. User API

### 2-1. 회원가입
- 메서드: `POST`
- 경로: `/api/users`
- 인증: 불필요

#### 요청 바디
```json
{
  "name": "홍길동",
  "part": "BE",
  "role": "ROLE_BABY_LION",
  "kakaoId": 123456789,
  "profileImageUrl": "https://example.com/profile.png"
}
```

#### 사용 가능한 enum 값
- `part`: `PM`, `DE`, `FE`, `BE`
- `role`: `ROLE_LEADER`, `ROLE_SUB_LEADER`, `ROLE_PART_LEADER`, `ROLE_EXECUTIVE`, `ROLE_BABY_LION`

#### 내부 로직
1. 요청으로 받은 `kakaoId` 로 기존 사용자가 있는지 조회합니다.
2. 이미 가입된 사용자가 있으면 예외를 발생시킵니다.
3. 없으면 `User` 엔티티로 변환해서 저장합니다.

#### 응답
- HTTP `201 Created`
- 본문은 공통 성공 포맷이며 `data` 는 비어 있습니다.

### 2-2. 로그인
- 메서드: `POST`
- 경로: `/api/users/login`
- 인증: 불필요

#### 요청 바디
```json
{
  "code": "kakao_authorization_code"
}
```

#### 내부 로직
1. 카카오 인가 코드를 카카오 액세스 토큰으로 교환합니다.
2. 카카오 사용자 정보를 조회합니다.
3. 조회한 카카오 사용자 ID로 내부 회원 테이블을 찾습니다.
4. 가입된 회원이면 JWT를 발급해서 반환합니다.
5. 가입되지 않은 사용자이면 회원가입이 필요하다는 상태와 카카오 사용자 정보를 반환합니다.

#### 응답 예시

로그인 성공:
```json
{
  "isSuccess": true,
  "code": "SUCCESS_200",
  "message": "호출에 성공하였습니다.",
  "timeStamp": "2026-03-16 12:00:00",
  "httpStatus": 200,
  "data": {
    "status": "LOGIN_SUCCESS",
    "accessToken": "jwt-token",
    "kakaoInfo": null
  }
}
```

회원가입 필요:
```json
{
  "isSuccess": true,
  "code": "SUCCESS_200",
  "message": "호출에 성공하였습니다.",
  "timeStamp": "2026-03-16 12:00:00",
  "httpStatus": 200,
  "data": {
    "status": "SIGNUP_REQUIRED",
    "accessToken": null,
    "kakaoInfo": {
      "..."
    }
  }
}
```

### 2-3. 테스트용 JWT 발급
- 메서드: `POST`
- 경로: `/api/test/token`
- 인증: 불필요

#### 요청 바디
```json
{
  "userId": 1
}
```

#### 내부 로직
1. 전달받은 `userId` 로 사용자가 존재하는지 조회합니다.
2. 사용자가 존재하면 해당 사용자 ID를 subject로 하는 JWT를 즉시 발급합니다.
3. 포스트맨에서 바로 붙여넣기 쉽도록 `accessToken` 과 `Bearer ` 접두사가 포함된 `bearerToken` 을 함께 반환합니다.

#### 응답 예시
```json
{
  "isSuccess": true,
  "code": "SUCCESS_200",
  "message": "호출에 성공하였습니다.",
  "timeStamp": "2026-03-16 12:00:00",
  "httpStatus": 200,
  "data": {
    "userId": 1,
    "accessToken": "jwt-token",
    "bearerToken": "Bearer jwt-token"
  }
}
```

## 3. Document API

### 3-1. 내 문서 목록 조회
- 메서드: `GET`
- 경로: `/api/documents`
- 인증: 필요

#### 내부 로직
1. JWT에서 인증된 사용자 정보를 가져옵니다.
2. 인증된 사용자의 `name` 과 일치하는 문서들을 조회합니다.
3. 문서 목록을 `id`, `documentType`, `imageUrl` 형태로 반환합니다.

#### 주의
- 문서 조회 기준이 사용자 ID가 아니라 `name` 입니다.
- 같은 이름의 사용자가 여러 명이면 문서가 섞일 가능성이 있습니다.

#### 응답 데이터 예시
```json
{
  "documents": [
    {
      "id": 1,
      "documentType": "CERTIFICATION",
      "imageUrl": "https://s3.example.com/cert.png"
    },
    {
      "id": 2,
      "documentType": "AWARD",
      "imageUrl": "https://s3.example.com/award.png"
    }
  ]
}
```

### 3-2. 수료증 생성
- 메서드: `POST`
- 경로: `/api/documents/create`
- 인증: 불필요

#### 요청 바디
```json
{
  "name": "홍길동",
  "role": "ROLE_BABY_LION"
}
```

#### 내부 로직
1. 요청으로 받은 `name`, `role` 기준으로 수료증 템플릿 경로를 계산합니다.
2. `ROLE_LEADER`, `ROLE_SUB_LEADER` 는 역할명만으로 템플릿을 선택합니다.
3. 그 외 역할은 사용자 이름으로 사용자를 조회한 뒤, 사용자의 `part` 와 `role` 조합으로 템플릿을 선택합니다.
4. 이미지 생성 서비스가 템플릿 위에 이름을 렌더링합니다.
5. 생성된 이미지 URL을 포함해 `Document` 엔티티를 저장합니다.

#### 생성되는 문서 타입
- `CERTIFICATION`

### 3-3. 상장 일괄 생성
- 메서드: `POST`
- 경로: `/api/documents/create/awards`
- 인증: 불필요

#### 내부 로직
1. 모든 `Sector` 값을 순회합니다.
2. 각 분야별 수상자 이름 목록을 투표 테이블에서 조회합니다.
3. 분야별 상장 템플릿 경로를 계산합니다.
4. 수상자 이름을 템플릿 이미지 위에 렌더링합니다.
5. 생성된 이미지 URL과 함께 `Document` 엔티티를 저장합니다.

#### 생성되는 문서 타입
- `AWARD`

#### 사용 가능한 `sector` 기준 값
- `VITALITY_AWARD`
- `KINDNESS_AWARD`
- `CONTRIBUTION_AWARD`
- `EXCELLENCE_AWARD`
- `GROWTH_AWARD`

## 4. Vote API

### 4-1. 분야별 수상자 조회
- 메서드: `GET`
- 경로: `/api/votes/winners`
- 인증: 필요

#### 쿼리 파라미터
- `sector`: `VITALITY_AWARD`, `KINDNESS_AWARD`, `CONTRIBUTION_AWARD`, `EXCELLENCE_AWARD`, `GROWTH_AWARD`

#### 요청 예시
```text
GET /api/votes/winners?sector=EXCELLENCE_AWARD
```

#### 내부 로직
1. 요청받은 `sector` 로 수상자 테이블을 조회합니다.
2. `id` 오름차순으로 정렬된 수상자 이름 목록을 가져옵니다.
3. 이름 목록을 응답 DTO로 변환합니다.

#### 응답 데이터 예시
```json
{
  "count": 2,
  "winners": [
    {
      "name": "홍길동"
    },
    {
      "name": "김사자"
    }
  ]
}
```

## 5. Chat API

### 5-1. 전체 채팅 조회
- 메서드: `GET`
- 경로: `/api/chats`
- 인증: 필요

#### 내부 로직
1. 저장된 채팅을 생성 시각 오름차순으로 조회합니다.
2. 각 메시지를 발신자 이름, 프로필 이미지, 메시지 내용으로 변환합니다.

#### 응답 데이터 예시
```json
{
  "count": 2,
  "chats": [
    {
      "senderName": "홍길동",
      "senderProfileImage": "https://example.com/a.png",
      "message": "안녕하세요"
    },
    {
      "senderName": "김사자",
      "senderProfileImage": "https://example.com/b.png",
      "message": "반갑습니다"
    }
  ]
}
```

### 5-2. 실시간 채팅 메시지 전송
- 프로토콜: WebSocket + STOMP + SockJS
- 연결 엔드포인트: `/ws`
- 발행 경로: `/pub/send`
- 구독 경로: `/sub/chat`
- 인증: 필요

#### STOMP CONNECT 헤더 예시
```text
Authorization: Bearer {jwt-token}
```

#### 전송 메시지 예시
```json
{
  "message": "안녕하세요"
}
```

#### 내부 로직
1. WebSocket 연결 시 인터셉터가 `Authorization` 헤더를 읽습니다.
2. JWT 유효성을 검사하고, 인증 정보를 세션에 저장합니다.
3. 클라이언트가 `/pub/send` 로 메시지를 보내면 인증된 사용자인지 다시 확인합니다.
4. 메시지가 `null`, 공백, 300자 초과인지 검증합니다.
5. 인증 사용자 정보를 기준으로 채팅을 DB에 저장합니다.
6. 저장 후 `/sub/chat` 으로 전체 구독자에게 메시지를 브로드캐스트합니다.

#### 브로드캐스트 메시지 형식
```json
{
  "senderName": "홍길동",
  "senderProfileImage": "https://example.com/a.png",
  "message": "안녕하세요"
}
```

## 6. 현재 프로젝트의 API 목록 요약

### REST API
- `POST /api/users` : 회원가입
- `POST /api/users/login` : 카카오 로그인 및 JWT 발급
- `POST /api/test/token` : 테스트용 JWT 발급
- `GET /api/documents` : 로그인한 사용자의 문서 조회
- `POST /api/documents/create` : 수료증 생성
- `POST /api/documents/create/awards` : 상장 일괄 생성
- `GET /api/votes/winners?sector=...` : 분야별 수상자 조회
- `GET /api/chats` : 전체 채팅 조회

### WebSocket/STOMP
- `CONNECT /ws` : SockJS 기반 WebSocket 연결
- `SEND /pub/send` : 채팅 메시지 발행
- `SUBSCRIBE /sub/chat` : 채팅 메시지 구독
