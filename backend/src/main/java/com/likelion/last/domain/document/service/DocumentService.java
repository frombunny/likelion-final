package com.likelion.last.domain.document.service;

import com.likelion.last.domain.document.entity.Document;
import com.likelion.last.domain.document.entity.enums.DocumentType;
import com.likelion.last.domain.document.repository.DocumentRepository;
import com.likelion.last.domain.document.web.dto.GetAllDocumentsRes;
import com.likelion.last.domain.user.entity.User;
import com.likelion.last.domain.user.entity.enums.Role;
import com.likelion.last.domain.user.repository.UserRepository;
import com.likelion.last.domain.vote.entity.enums.Sector;
import com.likelion.last.domain.vote.service.VoteService;
import com.likelion.last.domain.vote.web.dto.GetWinnersRes;
import com.likelion.last.global.auth.entity.UserPrincipal;
import com.likelion.last.global.external.imageGeneration.service.ImageGenerationService;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DocumentService {
    private final UserRepository userRepository;
    private final DocumentRepository documentRepository;
    private final VoteService voteService;
    private final ImageGenerationService imageGenerationService;

    public GetAllDocumentsRes getDocumentListByUser(UserPrincipal userPrincipal) {
        User user = userRepository.getUserById(userPrincipal.getId());

        List<Document> documents = documentRepository.findAllByUser(user);
        return GetAllDocumentsRes.from(documents);
    }

    @Transactional
    public void createAwards() {
        voteService.validateVoteIsClosed();

        Map<Sector, List<User>> winnersWithSector =
                Arrays.stream(Sector.values()).collect(
                        Collectors.toMap(sector -> sector, voteService::findWinnersBySector)
                );

        winnersWithSector.forEach((sector, users) ->
                users.forEach(user ->
                        createDocument(user, getAwardTemplatePath(sector), DocumentType.AWARD))
        );
    }

    @Transactional
    public void createCertificates() {
        List<User> users = userRepository.findAll();

        users.forEach(
                user -> {
                    String templatePath = getCertificateTemplatePath(user);
                    createDocument(user, templatePath, DocumentType.CERTIFICATION);
                }
        );
    }

    private void createDocument(User user, String path, DocumentType documentType) {
        String imageUrl = imageGenerationService.writeOnDocument(path, user.getName(), documentType);

        Document document = Document.builder()
                .documentType(documentType)
                .imageUrl(imageUrl)
                .user(user)
                .build();

        documentRepository.save(document);
    }

    private String getCertificateTemplatePath(User user) {
        String part = user.getPart().toString();
        String role = user.getRole().getPureName();
        if (user.getRole().equals(Role.ROLE_LEADER) || user.getRole().equals(Role.ROLE_SUB_LEADER)) {
            return String.format(
                    "static/document/certificate/%s.jpg",
                    role
            );
        }

        return String.format(
                "static/document/certificate/%s_%s.jpg",
                part,
                role
        );
    }

    private String getAwardTemplatePath(Sector sector) {
        String sectorName = sector.name();
        return String.format(
                "static/document/award/%s.jpg",
                sectorName
        );
    }
}
