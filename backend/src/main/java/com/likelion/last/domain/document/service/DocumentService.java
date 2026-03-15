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
import com.likelion.last.global.auth.entity.UserPrincipal;
import com.likelion.last.global.external.imageGeneration.service.ImageGenerationService;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
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
        List<Document> documents = documentRepository.findAllByName(userPrincipal.getName());
        return GetAllDocumentsRes.from(documents);
    }

    @Transactional
    public void createAwards() {
        Map<Sector, List<String>> winnersWithSector =
                Arrays.stream(Sector.values()).collect(
                        Collectors.toMap(sector -> sector, voteService::findWinnerNamesBySector)
                );

        winnersWithSector.forEach((sector, winnerNames) ->
                winnerNames.forEach(name ->
                        createDocument(name, getAwardTemplatePath(sector), DocumentType.AWARD))
        );
    }

    @Transactional
    public void createCertificates(String name, Role role) {
        String templatePath = getCertificateTemplatePath(name, role);
        createDocument(name, templatePath, DocumentType.CERTIFICATION);
    }

    private void createDocument(String name, String path, DocumentType documentType) {
        String imageUrl = imageGenerationService.writeOnDocument(path, name, documentType);

        Document document = Document.builder()
                .documentType(documentType)
                .imageUrl(imageUrl)
                .name(name)
                .build();

        documentRepository.save(document);
    }

    private String getCertificateTemplatePath(String name, Role role) {
        if (role.equals(Role.ROLE_LEADER) || role.equals(Role.ROLE_SUB_LEADER)) {
            return String.format(
                    "static/document/certificate/%s.jpg",
                    role
                            .getPureName()
            );
        }

        User user = userRepository.getUserByName(name);

        return String.format(
                "static/document/certificate/%s_%s.jpg",
                user.getPart(),
                role.getPureName()
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
