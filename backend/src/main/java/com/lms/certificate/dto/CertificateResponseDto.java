package com.lms.certificate.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CertificateResponseDto {
    private Long id;
    private Long studentId;
    private Long courseId;
    private String studentName;
    private String courseName;
    private String instructorName;
    private LocalDateTime completedAt;
    private LocalDateTime issuedAt;
    private String certificateCode;
}
