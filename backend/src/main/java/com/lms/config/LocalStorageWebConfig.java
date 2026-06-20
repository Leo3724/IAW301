package com.lms.config;

import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Serves uploaded files from the local file system during development.
 * Maps /uploads/** URL path to the local ./uploads/ directory.
 */
@Configuration
@Profile("disabled")
public class LocalStorageWebConfig implements WebMvcConfigurer {

    @Value("${app.local-storage.path:./uploads}")
    private String storagePath;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        Path uploadDir = Paths.get(storagePath).toAbsolutePath().normalize();
        String resourceLocation = "file:///" + uploadDir.toString().replace("\\", "/") + "/";

        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(resourceLocation)
                .setCachePeriod(0); // no cache during dev
    }
}
