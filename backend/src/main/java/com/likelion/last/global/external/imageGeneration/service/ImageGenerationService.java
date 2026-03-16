package com.likelion.last.global.external.imageGeneration.service;

import com.likelion.last.domain.document.entity.enums.DocumentType;
import com.likelion.last.global.external.imageGeneration.exception.FileNotCreatedException;
import com.likelion.last.global.external.imageGeneration.exception.FontNotLoadedException;
import com.likelion.last.global.external.s3.S3Service;
import java.awt.Color;
import java.awt.Font;
import java.awt.FontFormatException;
import java.awt.Graphics2D;
import java.awt.RenderingHints;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import javax.imageio.ImageIO;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ImageGenerationService {

    private final S3Service s3Service;

    public String writeOnDocument(String templatePath, String username, DocumentType documentType) {
        try {
            ClassPathResource resource = new ClassPathResource(templatePath);
            System.out.println("exists? " + resource.exists());
            System.out.println("url: " + resource.getURL());

            System.out.println("시작");
            BufferedImage bufferedImage = ImageIO.read(
                    new ClassPathResource(templatePath).getInputStream()
            );

            System.out.println("이미지 로드");

            Graphics2D graphics2D = bufferedImage.createGraphics();
            applyQuality(graphics2D);

            Font font = loadFont("static/NotoSerifKR-Bold.ttf", 280f);
            graphics2D.setFont(font);
            graphics2D.setColor(Color.BLACK);

            System.out.println("폰트 로드");

            int x = 5100;
            int y = 3040;

            graphics2D.drawString(username, x, y);
            graphics2D.dispose();
            System.out.println("그리기");

            String localPath = "/tmp/" + System.currentTimeMillis() + ".jpg";
            File outputFile = new File(localPath);
            ImageIO.write(bufferedImage, "jpg", outputFile);
            System.out.println("로컬에 저장");

            if (!outputFile.exists()) {
                throw new FileNotCreatedException();
            }

            String prefix = documentType == DocumentType.CERTIFICATION ? "CERTIFICATION" : "AWARDS";
            String key = s3Service.generateFileName(prefix, username, "jpg");
            String url = s3Service.uploadFile(outputFile, key);

            outputFile.delete();

            return url;

        } catch (IOException e) {
            throw new FileNotCreatedException();
        }

    }

    private void applyQuality(Graphics2D graphics2D) {
        graphics2D.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
        graphics2D.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING, RenderingHints.VALUE_TEXT_ANTIALIAS_ON);
    }

    private Font loadFont(String path, float size) throws IOException {
        try {
            return Font.createFont(Font.TRUETYPE_FONT, new ClassPathResource(path).getFile()).deriveFont(size);
        } catch (FontFormatException e) {
            throw new FontNotLoadedException();
        }
    }
}
