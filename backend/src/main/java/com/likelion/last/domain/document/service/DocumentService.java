package com.likelion.last.domain.document.service;

import com.likelion.last.domain.document.entity.Document;
import com.likelion.last.domain.document.entity.enums.DocumentType;
import com.likelion.last.domain.document.repository.DocumentRepository;
import com.likelion.last.domain.document.web.dto.CreateAwardsBySectorRes;
import com.likelion.last.domain.document.web.dto.GetAllDocumentsRes;
import com.likelion.last.domain.user.entity.User;
import com.likelion.last.domain.user.entity.enums.Role;
import com.likelion.last.domain.user.repository.UserRepository;
import com.likelion.last.domain.vote.entity.enums.Sector;
import com.likelion.last.domain.vote.service.VoteService;
import com.likelion.last.global.auth.entity.UserPrincipal;
import com.likelion.last.global.external.imageGeneration.service.ImageGenerationService;
import com.likelion.last.global.external.s3.S3Service;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.io.IOException;
import java.io.OutputStream;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

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
    private final S3Service s3Service;

    public GetAllDocumentsRes getDocumentListByUser(UserPrincipal userPrincipal) {
        String userName = userPrincipal.getName();
        List<String> certificationUrls = s3Service.listCertificationUrlsByUserName(userName);
        List<String> awardUrls = getOrCreateAwardUrls(userName);
        return GetAllDocumentsRes.fromUrls(certificationUrls, awardUrls);
    }

    public void downloadAllDocuments(UserPrincipal userPrincipal, OutputStream outputStream) {
        String userName = userPrincipal.getName();
        List<String> certificationKeys = s3Service.listCertificationKeysByUserName(userName);
        List<String> awardKeys = voteService.isWinner(userName)
                ? getOrCreateAwardKeys(userName)
                : List.of();
        List<Sector> wonSectors = voteService.findWonSectorsByName(userName);

        try (ZipOutputStream zipOutputStream = new ZipOutputStream(outputStream)) {
            addFilesToZip(zipOutputStream, certificationKeys, null, userName);
            addFilesToZip(zipOutputStream, awardKeys, wonSectors, userName);
            zipOutputStream.finish();
        } catch (IOException e) {
            throw new IllegalStateException("문서 압축 파일 생성에 실패했습니다.", e);
        }
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
    public CreateAwardsBySectorRes createAwardsBySector(Sector sector) {
        List<CreateAwardsBySectorRes.CreateAwardDetailRes> awards = voteService.findWinnerNamesBySector(sector).stream()
                .map(name -> new CreateAwardsBySectorRes.CreateAwardDetailRes(
                        name,
                        createDocument(name, getAwardTemplatePath(sector), DocumentType.AWARD)
                ))
                .toList();

        return CreateAwardsBySectorRes.of(sector, awards);
    }

    @Transactional
    public void createCertificates(String name, Role role) {
        String templatePath = getCertificateTemplatePath(name, role);
        createDocument(name, templatePath, DocumentType.CERTIFICATION);
    }

    private String createDocument(String name, String path, DocumentType documentType) {
        String imageUrl = imageGenerationService.writeOnDocument(path, name, documentType);

        Document document = Document.builder()
                .documentType(documentType)
                .imageUrl(imageUrl)
                .name(name)
                .build();

        documentRepository.save(document);
        return imageUrl;
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

    @Transactional
    protected List<String> getOrCreateAwardUrls(String userName) {
        if (!voteService.isWinner(userName)) {
            return List.of();
        }

        List<String> awardUrls = s3Service.listAwardUrlsByUserName(userName);
        if (!awardUrls.isEmpty() || !imageGenerationService.isImageGenerationEnabled()) {
            return awardUrls;
        }

        voteService.findWonSectorsByName(userName).forEach(
                sector -> createDocument(userName, getAwardTemplatePath(sector), DocumentType.AWARD)
        );

        return s3Service.listAwardUrlsByUserName(userName);
    }

    @Transactional
    protected List<String> getOrCreateAwardKeys(String userName) {
        if (!voteService.isWinner(userName)) {
            return List.of();
        }

        List<String> awardKeys = s3Service.listAwardKeysByUserName(userName);
        if (!awardKeys.isEmpty() || !imageGenerationService.isImageGenerationEnabled()) {
            return awardKeys;
        }

        voteService.findWonSectorsByName(userName).forEach(
                sector -> createDocument(userName, getAwardTemplatePath(sector), DocumentType.AWARD)
        );

        return s3Service.listAwardKeysByUserName(userName);
    }

    private void addFilesToZip(
            ZipOutputStream zipOutputStream,
            List<String> keys,
            List<Sector> sectors,
            String userName
    ) throws IOException {
        for (int i = 0; i < keys.size(); i++) {
            String key = keys.get(i);
            ZipEntry zipEntry = new ZipEntry(resolveDownloadFileName(key, sectors, i, userName));
            zipOutputStream.putNextEntry(zipEntry);
            s3Service.writeFileToOutputStream(key, zipOutputStream);
            zipOutputStream.closeEntry();
        }
    }

    private String extractFileName(String key) {
        int slashIndex = key.lastIndexOf('/');
        return slashIndex >= 0 ? key.substring(slashIndex + 1) : key;
    }

    private String resolveDownloadFileName(String key, List<Sector> sectors, int index, String userName) {
        if (sectors == null || sectors.isEmpty()) {
            return extractFileName(key);
        }

        String extension = extractExtension(key);
        Sector sector = index < sectors.size() ? sectors.get(index) : null;
        String awardName = sector == null ? "상장" : sector.getName();
        return awardName + "_" + userName + "." + extension;
    }

    private String extractExtension(String key) {
        String fileName = extractFileName(key);
        int dotIndex = fileName.lastIndexOf('.');
        return dotIndex >= 0 ? fileName.substring(dotIndex + 1) : "jpg";
    }
}
