package com.likelion.last;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.likelion.last.domain.chat.entity.Chat;
import com.likelion.last.domain.chat.repository.ChatRepository;
import com.likelion.last.domain.document.entity.Document;
import com.likelion.last.domain.document.entity.enums.DocumentType;
import com.likelion.last.domain.document.repository.DocumentRepository;
import com.likelion.last.domain.user.entity.User;
import com.likelion.last.domain.user.entity.enums.Part;
import com.likelion.last.domain.user.entity.enums.Role;
import com.likelion.last.domain.user.repository.UserRepository;
import com.likelion.last.global.auth.JwtTokenProvider;
import com.likelion.last.global.auth.oauth2.dto.KakaoTokenRes;
import com.likelion.last.global.auth.oauth2.dto.KakaoUserInfoRes;
import com.likelion.last.global.auth.oauth2.service.KakaoService;
import com.likelion.last.global.external.imageGeneration.service.ImageGenerationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class ApiIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private ChatRepository chatRepository;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @MockBean
    private KakaoService kakaoService;

    @MockBean
    private ImageGenerationService imageGenerationService;

    private User savedUser;
    private String bearerToken;

    @BeforeEach
    void setUp() {
        savedUser = userRepository.save(User.builder()
                .name("테스트유저")
                .part(Part.BE)
                .role(Role.ROLE_BABY_LION)
                .kakaoId(1004L)
                .profileImageUrl("https://example.com/profile.png")
                .build());
        bearerToken = "Bearer " + jwtTokenProvider.createToken(savedUser.getId());
    }

    @Test
    void 회원가입_API_테스트() throws Exception {
        mockMvc.perform(post("/api/users")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "name": "새유저",
                                  "part": "FE",
                                  "role": "ROLE_EXECUTIVE",
                                  "kakaoId": 2004,
                                  "profileImageUrl": "https://example.com/new.png"
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.isSuccess").value(true));
    }

    @Test
    void 로그인_API_테스트() throws Exception {
        given(kakaoService.getAccessTokenFromKakao("test-code"))
                .willReturn(new KakaoTokenRes("kakao-access-token"));
        given(kakaoService.getKakaoUserInfo("kakao-access-token"))
                .willReturn(new KakaoUserInfoRes(
                        1004L,
                        new KakaoUserInfoRes.KakaoAccount(
                                new KakaoUserInfoRes.Profile("테스트유저", "https://example.com/profile.png")
                        )
                ));

        mockMvc.perform(post("/api/users/login")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "code": "test-code"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("LOGIN_SUCCESS"))
                .andExpect(jsonPath("$.data.accessToken").isNotEmpty());
    }

    @Test
    void 테스트용_JWT_발급_API_테스트() throws Exception {
        mockMvc.perform(post("/api/test/token")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "userId": %d
                                }
                                """.formatted(savedUser.getId())))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.userId").value(savedUser.getId()))
                .andExpect(jsonPath("$.data.accessToken").isNotEmpty())
                .andExpect(jsonPath("$.data.bearerToken").value(org.hamcrest.Matchers.startsWith("Bearer ")));
    }

    @Test
    void 내_문서_조회_API_테스트() throws Exception {
        documentRepository.save(Document.builder()
                .name(savedUser.getName())
                .documentType(DocumentType.CERTIFICATION)
                .imageUrl("https://example.com/document.png")
                .build());

        mockMvc.perform(get("/api/documents")
                        .header("Authorization", bearerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.documents[0].documentType").value("CERTIFICATION"))
                .andExpect(jsonPath("$.data.documents[0].imageUrl").value("https://example.com/document.png"));
    }

    @Test
    void 수료증_생성_API_테스트() throws Exception {
        given(imageGenerationService.writeOnDocument(anyString(), anyString(), org.mockito.ArgumentMatchers.any()))
                .willReturn("https://example.com/generated-cert.png");

        mockMvc.perform(post("/api/documents/create")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "name": "테스트유저",
                                  "role": "ROLE_BABY_LION"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.isSuccess").value(true));
    }

    @Test
    void 상장_일괄_생성_API_테스트() throws Exception {
        given(imageGenerationService.writeOnDocument(anyString(), anyString(), org.mockito.ArgumentMatchers.any()))
                .willReturn("https://example.com/generated-award.png");

        mockMvc.perform(post("/api/documents/create/awards")
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.isSuccess").value(true));
    }

    @Test
    void 분야별_수상자_조회_API_테스트() throws Exception {
        mockMvc.perform(get("/api/votes/winners")
                        .header("Authorization", bearerToken)
                        .param("sector", "VITALITY_AWARD"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.count").isNumber())
                .andExpect(jsonPath("$.data.winners[0].name").isNotEmpty())
                .andExpect(jsonPath("$.data.winners[0].imageUrl").exists());
    }

    @Test
    void 전체_채팅_조회_API_테스트() throws Exception {
        chatRepository.save(Chat.toEntity(savedUser, "안녕하세요"));

        mockMvc.perform(get("/api/chats")
                        .header("Authorization", bearerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.count").value(1))
                .andExpect(jsonPath("$.data.chats[0].senderName").value("테스트유저"))
                .andExpect(jsonPath("$.data.chats[0].message").value("안녕하세요"));
    }

    @Test
    void 문서_조회_인증_필수_테스트() throws Exception {
        mockMvc.perform(get("/api/documents"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void 테스트용_토큰으로_인증_API_호출_테스트() throws Exception {
        MvcResult tokenResult = mockMvc.perform(post("/api/test/token")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "userId": %d
                                }
                                """.formatted(savedUser.getId())))
                .andExpect(status().isOk())
                .andReturn();

        JsonNode root = objectMapper.readTree(tokenResult.getResponse().getContentAsString());
        String issuedBearerToken = root.path("data").path("bearerToken").asText();

        mockMvc.perform(get("/api/chats")
                        .header("Authorization", issuedBearerToken))
                .andExpect(status().isOk());
    }
}
