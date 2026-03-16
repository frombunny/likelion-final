package com.likelion.last.global.external.s3;

import java.io.File;
import java.text.Normalizer;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.s3.model.GetUrlRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.core.ResponseBytes;
import software.amazon.awssdk.services.s3.model.ListObjectsV2Request;
import software.amazon.awssdk.services.s3.model.S3Object;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;

@Service
@RequiredArgsConstructor
public class S3Service {

    private final S3Client s3Client;
    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    public String uploadFile(File file, String key) {
        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucket)
                .key(key)
                .build();

        s3Client.putObject(putObjectRequest, file.toPath());

        return buildFileUrl(key);
    }

    public String generateFileName(String prefix, String extension) {
        String uuid = UUID.randomUUID().toString().replace("-", "");
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));

        return String.format("%s/%s_%s.%s", prefix, timestamp, uuid, extension);
    }

    public String generateFileName(String prefix, String baseName, String extension) {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        String sanitizedBaseName = baseName
                .replace("/", "_")
                .replace("\\", "_")
                .trim();

        return String.format("%s/%s_%s.%s", prefix, sanitizedBaseName, timestamp, extension);
    }

    public List<String> listFileUrlsByPrefixContaining(String prefix, String keyword) {
        return listObjectKeys(prefix).stream()
                .filter(key -> key.contains(keyword))
                .sorted(Comparator.naturalOrder())
                .map(this::buildFileUrl)
                .toList();
    }

    public List<String> listCertificationUrlsByUserName(String userName) {
        return listCertificationKeysByUserName(userName).stream().map(this::buildFileUrl).toList();
    }

    public List<String> listAwardUrlsByUserName(String userName) {
        return listAwardKeysByUserName(userName).stream().map(this::buildFileUrl).toList();
    }

    public List<String> listCertificationKeysByUserName(String userName) {
        return listObjectKeys("CERTIFICATION/").stream()
                .filter(key -> matchesCertificationKey(key, userName))
                .sorted(Comparator.naturalOrder())
                .toList();
    }

    public List<String> listAwardKeysByUserName(String userName) {
        return listObjectKeys("AWARDS/").stream()
                .filter(key -> matchesAwardKey(key, userName))
                .sorted(Comparator.naturalOrder())
                .toList();
    }

    public String findWinnerImageUrl(String winnerName) {
        return listObjectKeys("WINNERS/").stream()
                .filter(key -> matchesWinnerKey(key, winnerName))
                .sorted(Comparator.naturalOrder())
                .map(this::buildFileUrl)
                .findFirst()
                .orElse(null);
    }

    public String findFirstFileUrlByPrefixContaining(String prefix, String keyword) {
        return listFileUrlsByPrefixContaining(prefix, keyword).stream()
                .findFirst()
                .orElse(null);
    }

    public String buildFileUrl(String key) {
        GetUrlRequest getUrlRequest = GetUrlRequest.builder()
                .bucket(bucket)
                .key(key)
                .build();

        return s3Client.utilities().getUrl(getUrlRequest).toExternalForm();
    }

    public byte[] getFileBytes(String key) {
        GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                .bucket(bucket)
                .key(key)
                .build();

        ResponseBytes<GetObjectResponse> response = s3Client.getObjectAsBytes(getObjectRequest);
        return response.asByteArray();
    }

    public void deleteFile(String key) {
        DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                .bucket(bucket)
                .key(key)
                .build();

        s3Client.deleteObject(deleteObjectRequest);
    }

    private List<String> listObjectKeys(String prefix) {
        ListObjectsV2Request request = ListObjectsV2Request.builder()
                .bucket(bucket)
                .prefix(prefix)
                .build();

        return s3Client.listObjectsV2Paginator(request).contents().stream()
                .map(S3Object::key)
                .toList();
    }

    private boolean matchesCertificationKey(String key, String userName) {
        String normalizedFileName = normalize(getFileName(key));
        String normalizedName = normalize(userName);

        int extensionIndex = normalizedFileName.lastIndexOf('.');
        String withoutExtension = extensionIndex >= 0
                ? normalizedFileName.substring(0, extensionIndex)
                : normalizedFileName;
        int underscoreIndex = withoutExtension.lastIndexOf('_');

        if (underscoreIndex < 0) {
            return false;
        }

        String extractedName = withoutExtension.substring(underscoreIndex + 1);
        return extractedName.equals(normalizedName);
    }

    private boolean matchesAwardKey(String key, String userName) {
        String normalizedFileName = normalize(getFileName(key));
        String normalizedName = normalize(userName);

        return normalizedFileName.startsWith(normalizedName + "_")
                || normalizedFileName.startsWith(normalizedName + ".")
                || normalizedFileName.contains("_" + normalizedName + "_")
                || normalizedFileName.contains("_" + normalizedName + ".");
    }

    private boolean matchesWinnerKey(String key, String winnerName) {
        String normalizedStem = normalize(removeExtension(getFileName(key)));
        String normalizedName = normalize(winnerName);

        return normalizedStem.equals(normalizedName)
                || normalizedStem.startsWith(normalizedName + "_");
    }

    private String getFileName(String key) {
        int slashIndex = key.lastIndexOf('/');
        return slashIndex >= 0 ? key.substring(slashIndex + 1) : key;
    }

    private String removeExtension(String fileName) {
        int dotIndex = fileName.lastIndexOf('.');
        return dotIndex >= 0 ? fileName.substring(0, dotIndex) : fileName;
    }

    private String normalize(String value) {
        return Normalizer.normalize(value, Normalizer.Form.NFC).toLowerCase(Locale.ROOT);
    }
}
