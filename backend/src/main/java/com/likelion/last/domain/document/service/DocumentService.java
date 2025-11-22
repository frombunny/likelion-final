package com.likelion.last.domain.document.service;

import com.likelion.last.domain.document.entity.Document;
import com.likelion.last.domain.document.repository.DocumentRepository;
import com.likelion.last.domain.document.web.dto.GetAllDocumentsRes;
import com.likelion.last.domain.user.entity.User;
import com.likelion.last.domain.user.repository.UserRepository;
import com.likelion.last.global.auth.UserPrincipal;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DocumentService {
    private final UserRepository userRepository;
    private final DocumentRepository documentRepository;

    public GetAllDocumentsRes getDocumentListByUser(UserPrincipal userPrincipal) {
        User user = userRepository.getUserById(userPrincipal.getId());

        List<Document> documents = documentRepository.findAllByUser(user);
        return GetAllDocumentsRes.from(documents);
    }

    private void createDocument() {

    }
}
