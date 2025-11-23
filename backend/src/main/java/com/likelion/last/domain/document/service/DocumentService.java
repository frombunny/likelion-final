package com.likelion.last.domain.document.service;

import com.likelion.last.domain.document.entity.Document;
import com.likelion.last.domain.document.repository.DocumentRepository;
import com.likelion.last.domain.document.web.dto.GetAllDocumentsRes;
import com.likelion.last.domain.user.entity.User;
import com.likelion.last.domain.user.repository.UserRepository;
import com.likelion.last.domain.vote.entity.enums.Sector;
import com.likelion.last.domain.vote.exception.VoteProgressException;
import com.likelion.last.domain.vote.repository.VoteStatusRepository;
import com.likelion.last.domain.vote.service.VoteService;
import com.likelion.last.domain.vote.web.dto.GetWinnersRes;
import com.likelion.last.global.auth.UserPrincipal;
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
    private static final Long VOTE_STATUS_ID = 1L;

    private final UserRepository userRepository;
    private final DocumentRepository documentRepository;
    private final VoteStatusRepository voteStatusRepository;
    private final VoteService voteService;

    public GetAllDocumentsRes getDocumentListByUser(UserPrincipal userPrincipal) {
        User user = userRepository.getUserById(userPrincipal.getId());

        List<Document> documents = documentRepository.findAllByUser(user);
        return GetAllDocumentsRes.from(documents);
    }

    @Transactional
    public void createAwards() {
        validateVoteIsClosed();
        Map<Sector, GetWinnersRes> winnersWithSectors = Arrays.stream(Sector.values())
                .collect(Collectors.toMap(
                        sector -> sector,
                        voteService::getWinnersBySector
                ));

        winnersWithSectors.forEach((sector, getWinnersRes) ->
                getWinnersRes.winners().forEach(getWinnerDetailRes ->
                        createDocument(getWinnerDetailRes.id(), getAwardTemplatePath(sector))
                )
        );
    }

    @Transactional
    public void createCertificates() {
        List<User> users = userRepository.findAll();

        users.forEach(
                user -> {
                    String templatePath = getCertificateTemplatePath(user);
                    createDocument(user.getId(), templatePath);
                }
        );
    }

    private void createDocument(Long userId, String path) {
        User user = userRepository.getUserById(userId);

        // 문서 작성 로직
    }

    private String getCertificateTemplatePath(User user) {
        String part = user.getPart().toString();
        String role = user.getRole().getPureName();

        return String.format(
                "templates/document/certificate/%s_%s.jpg",
                role,
                part
        );
    }

    private String getAwardTemplatePath(Sector sector) {
        String sectorName = sector.getName();
        return String.format(
                "templates/document/award/%s.jpg",
                sectorName
        );
    }

    private void validateVoteIsClosed() {
        if (voteStatusRepository.getVoteStatus(VOTE_STATUS_ID).isOpen()) {
            throw new VoteProgressException();
        }
    }
}
