package com.lms.certificate.service;

import java.util.List;

import com.lms.certificate.dto.CertificateResponseDto;

public interface CertificateService {
    CertificateResponseDto issueCertificate(Long studentId, Long courseId);
    CertificateResponseDto getCertificate(Long studentId, Long courseId);
    List<CertificateResponseDto> getStudentCertificates(Long studentId);
    CertificateResponseDto verifyCertificate(String certificateCode);
}
