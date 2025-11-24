# 🦁 Hansung Univ. LikeLion 13th — Final Certificate & Voting System

멋쟁이사자처럼 한성대학교 13기의 활동을 안정적으로 마무리하고, 기념하기 위해 개발되었습니다.

---

## ✨ 주요 기능

### 🧾 1. 수료증 자동 생성 & 발급
- 템플릿 이미지 기반 자동 렌더링 (Java Graphics2D)
- 사용자 이름을 동적으로 삽입하여 JPG 생성
- AWS S3 업로드 & 퍼블릭 URL 제공

### 🗳️ 2. 투표 시스템
- 후보 리스트 조회
- 후보별 단일 선택 투표
- 중복 투표 방지 로직
- 투표 결과 집계

### 👤 3. 사용자 관리 & 인증
- 카카오 로그인 기반 사용자 정보 등록
- JWT 기반 API 인증/인가
- 사용자 권한(Role) 관리

### 🖥️ 4. 프론트/백엔드 통합 플랫폼
- React 기반 UX/UI
- Keen Slider 기반 수료증 슬라이드 뷰어
- Spring Boot REST API와 연동

---

## ⚙️ Tech Stack

### 🔧 Backend
- Java 21  
- Spring Boot 3.x  
- Spring Security + JWT  
- Spring Data JPA / Hibernate  
- MariaDB (MySQL)  
- AWS S3 (파일 업로드)  
- Lombok  
- Validation  
- Gradle  

### 🎨 Frontend
- React (Vite)  
- Styled-components  
- Keen Slider  
- Fetch API  
- JWT Auth  

---
