package com.likelion.last.domain.document.web.dto;

import com.likelion.last.domain.document.entity.Document;
import com.likelion.last.domain.document.entity.enums.DocumentType;
import java.util.List;

public record GetAllDocumentsRes(
        List<GetOneDocumentRes> documents
) {
    public record GetOneDocumentRes(
            Long id,
            String title,
            DocumentType documentType,
            String imageUrl
    ) {
        public static GetOneDocumentRes from(Document document) {
            return new GetOneDocumentRes(
                    document.getId(),
                    document.getTitle(),
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
}
