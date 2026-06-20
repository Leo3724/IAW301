package com.lms.course.service.impl;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.lms.course.service.S3StorageService;
import com.lms.shared.exception.BadRequestException;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;

/**
 * Local file-system storage implementation for development.
 * Activated when Spring profile is "local".
 * Files are stored under ./uploads/ and served via /uploads/** endpoint.
 */
@Service
@Profile("disabled")
@Slf4j
public class LocalStorageServiceImpl implements S3StorageService {

    @Value("${app.local-storage.path:./uploads}")
    private String storagePath;

    @Value("${app.local-storage.base-url:http://localhost:8080/uploads}")
    private String baseUrl;

    private Path rootLocation;

    @PostConstruct
    public void init() {
        rootLocation = Paths.get(storagePath).toAbsolutePath().normalize();
        try {
            Files.createDirectories(rootLocation);
            log.info("Local storage initialized at: {}", rootLocation);
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory: " + rootLocation, e);
        }
    }

    @Override
    public String uploadFile(MultipartFile file, String folder) {
        if (file.isEmpty()) {
            throw new BadRequestException("Cannot upload empty file");
        }

        String originalName = file.getOriginalFilename() != null ? file.getOriginalFilename() : "file";
        String safeName = originalName.replaceAll("[^a-zA-Z0-9._-]", "_");
        String fileName = UUID.randomUUID() + "_" + safeName;

        try {
            Path folderPath = rootLocation.resolve(folder).normalize();
            Files.createDirectories(folderPath);

            Path targetPath = folderPath.resolve(fileName).normalize();

            // Security check: ensure path is within root
            if (!targetPath.startsWith(rootLocation)) {
                throw new BadRequestException("Cannot store file outside upload directory");
            }

            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

            String url = baseUrl + "/" + folder + "/" + fileName;
            log.info("File uploaded locally: {}", url);
            return url;

        } catch (IOException e) {
            throw new BadRequestException("Failed to upload file: " + e.getMessage());
        }
    }

    @Override
    public String getAccessibleFileUrl(String fileUrl) {
        // Local files are directly accessible, no pre-signed URL needed
        return fileUrl;
    }

    @Override
    public void deleteFile(String fileUrl) {
        if (fileUrl == null || fileUrl.isBlank()) return;

        try {
            // Extract relative path from URL
            String relativePath = fileUrl.replace(baseUrl + "/", "");
            Path filePath = rootLocation.resolve(relativePath).normalize();

            if (filePath.startsWith(rootLocation) && Files.exists(filePath)) {
                Files.delete(filePath);
                log.info("File deleted: {}", filePath);
            }
        } catch (IOException e) {
            log.warn("Failed to delete file {}: {}", fileUrl, e.getMessage());
        }
    }
}
