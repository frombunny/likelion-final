package com.likelion.last.domain.document.web.dto;

import com.likelion.last.domain.document.entity.Document;
import com.likelion.last.domain.document.entity.enums.DocumentType;
import java.util.ArrayList;
import java.util.List;

public record GetAllDocumentsRes(
        List<GetOneDocumentRes> documents
) {
    public record GetOneDocumentRes(
            Long id,
            DocumentType documentType,
            String imageUrl
    ) {
        public static GetOneDocumentRes from(Document document) {
            return new GetOneDocumentRes(
                    document.getId(),
                    document.getDocumentType(),
                    document.getImageUrl()
            );
        }
    }

    public static GetAllDocumentsRes from(List<Document> documents) {
        return new GetAllDocumentsRes(
                documents.stream()
                        .map(GetOneDocumentRes::from)
                        .toList()
        );
    }

    public static GetAllDocumentsRes fromUrls(List<String> certificationUrls, List<String> awardUrls) {
        List<GetOneDocumentRes> documents = new ArrayList<>();

        documents.addAll(certificationUrls.stream()
                .map(url -> new GetOneDocumentRes(null, DocumentType.CERTIFICATION, url))
                .toList());
        documents.addAll(awardUrls.stream()
                .map(url -> new GetOneDocumentRes(null, DocumentType.AWARD, url))
                .toList());

        return new GetAllDocumentsRes(documents);
    }
}
