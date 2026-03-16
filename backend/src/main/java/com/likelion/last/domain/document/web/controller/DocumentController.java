package com.likelion.last.domain.document.web.controller;

import com.likelion.last.domain.document.service.DocumentService;
import com.likelion.last.domain.document.web.dto.CreateCertificateReq;
import com.likelion.last.domain.document.web.dto.GetAllDocumentsRes;
import com.likelion.last.global.auth.entity.UserPrincipal;
import com.likelion.last.global.response.SuccessResponse;
import jakarta.validation.Valid;
import java.nio.charset.StandardCharsets;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor
public class DocumentController {
    private final DocumentService documentService;

    @GetMapping
    public ResponseEntity<SuccessResponse<GetAllDocumentsRes>> getAllDocumentByUser(@AuthenticationPrincipal
                                                                                    UserPrincipal userPrincipal) {
        GetAllDocumentsRes getAllDocumentsRes = documentService.getDocumentListByUser(userPrincipal);
        return ResponseEntity.status(HttpStatus.OK).body(SuccessResponse.from(getAllDocumentsRes));
    }

    @GetMapping("/download")
    public ResponseEntity<byte[]> downloadAllDocuments(
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        byte[] zippedDocuments = documentService.downloadAllDocuments(userPrincipal);
        String fileName = "13기_" + userPrincipal.getName() + ".zip";

        return ResponseEntity.status(HttpStatus.OK)
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename*=UTF-8''" + java.net.URLEncoder.encode(fileName, StandardCharsets.UTF_8))
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(zippedDocuments);
    }

    @PostMapping("/create")
    public ResponseEntity<SuccessResponse<Void>> createDocument(@Valid @RequestBody CreateCertificateReq createCertificateReq){
        documentService.createCertificates(createCertificateReq.name(), createCertificateReq.role());
        return ResponseEntity.status(HttpStatus.OK).body(SuccessResponse.empty());
    }

    @PostMapping("/create/awards")
    public ResponseEntity<SuccessResponse<Void>> createAwards() {
        documentService.createAwards();
        return ResponseEntity.status(HttpStatus.OK).body(SuccessResponse.empty());
    }
}
