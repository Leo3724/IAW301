package com.lms.certificate.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lms.certificate.dto.CertificateResponseDto;
import com.lms.certificate.service.CertificateService;
import com.lms.shared.dto.ApiResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/certificates")
@RequiredArgsConstructor
public class CertificateController {

    private final CertificateService certificateService;

    /** Issue (or retrieve existing) certificate after course completion */
    @PostMapping("/{courseId}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<CertificateResponseDto>> issueCertificate(
            @PathVariable Long courseId, Authentication auth) {
        Long studentId = (Long) auth.getCredentials();
        CertificateResponseDto cert = certificateService.issueCertificate(studentId, courseId);
        return ResponseEntity.ok(ApiResponse.success("Certificate issued successfully", cert));
    }

    /** Get my certificate for a specific course */
    @GetMapping("/{courseId}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<CertificateResponseDto>> getCertificate(
            @PathVariable Long courseId, Authentication auth) {
        Long studentId = (Long) auth.getCredentials();
        CertificateResponseDto cert = certificateService.getCertificate(studentId, courseId);
        return ResponseEntity.ok(ApiResponse.success("Certificate fetched", cert));
    }

    /** List all my certificates */
    @GetMapping
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<List<CertificateResponseDto>>> getMyCertificates(Authentication auth) {
        Long studentId = (Long) auth.getCredentials();
        return ResponseEntity.ok(ApiResponse.success("Certificates fetched", certificateService.getStudentCertificates(studentId)));
    }

    /** Public endpoint — verify a certificate by its unique code */
    @GetMapping("/verify/{certificateCode}")
    public ResponseEntity<ApiResponse<CertificateResponseDto>> verifyCertificate(
            @PathVariable String certificateCode) {
        return ResponseEntity.ok(ApiResponse.success("Certificate verified", certificateService.verifyCertificate(certificateCode)));
    }
}
