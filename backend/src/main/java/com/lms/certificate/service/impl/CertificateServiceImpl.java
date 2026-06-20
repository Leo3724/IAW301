package com.lms.certificate.service.impl;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.lms.certificate.dto.CertificateResponseDto;
import com.lms.certificate.entity.Certificate;
import com.lms.certificate.repository.CertificateRepository;
import com.lms.certificate.service.CertificateService;
import com.lms.course.entity.Course;
import com.lms.course.service.CourseService;
import com.lms.enrollment.entity.Enrollment;
import com.lms.enrollment.repository.EnrollmentRepository;
import com.lms.enrollment.vo.EnrollmentStatus;
import com.lms.shared.exception.BadRequestException;
import com.lms.shared.exception.ResourceNotFoundException;
import com.lms.user.entity.User;
import com.lms.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class CertificateServiceImpl implements CertificateService {

    private final CertificateRepository certificateRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final CourseService courseService;
    private final UserRepository userRepository;

    @Override
    public CertificateResponseDto issueCertificate(Long studentId, Long courseId) {
        // Return existing certificate if already issued
        return certificateRepository.findByStudentIdAndCourseId(studentId, courseId)
                .map(this::toDto)
                .orElseGet(() -> createCertificate(studentId, courseId));
    }

    @Override
    public CertificateResponseDto getCertificate(Long studentId, Long courseId) {
        return certificateRepository.findByStudentIdAndCourseId(studentId, courseId)
                .map(this::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("Certificate not found. Complete the course to earn one."));
    }

    @Override
    public List<CertificateResponseDto> getStudentCertificates(Long studentId) {
        return certificateRepository.findAllByStudentId(studentId)
                .stream()
                .map(this::toDto)
                .toList();
    }

    @Override
    public CertificateResponseDto verifyCertificate(String certificateCode) {
        return certificateRepository.findByCertificateCode(certificateCode)
                .map(this::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("Certificate not found for code: " + certificateCode));
    }

    // ─── Private helpers ────────────────────────────────────────────────────────

    private CertificateResponseDto createCertificate(Long studentId, Long courseId) {
        // Verify enrollment is completed
        Enrollment enrollment = enrollmentRepository.findByStudentIdAndCourseId(studentId, courseId)
                .orElseThrow(() -> new BadRequestException("You are not enrolled in this course."));

        if (enrollment.getStatus() != EnrollmentStatus.COMPLETED) {
            throw new BadRequestException("Course not yet completed. Finish all lessons to earn your certificate.");
        }

        // Fetch course details
        Course course = courseService.getCourseEntityById(courseId);

        // Fetch student details
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        // Fetch instructor name (best-effort)
        String instructorName = userRepository.findById(course.getInstructorId())
                .map(User::getFullName)
                .orElse("LearnHub Instructor");

        Certificate certificate = Certificate.builder()
                .studentId(studentId)
                .courseId(courseId)
                .enrollmentId(enrollment.getId())
                .studentName(student.getFullName())
                .courseName(course.getTitle())
                .instructorName(instructorName)
                .completedAt(enrollment.getCompletedAt())
                .certificateCode(UUID.randomUUID().toString())
                .build();

        Certificate saved = certificateRepository.save(certificate);
        log.info("Certificate issued: {} for student {} course {}", saved.getCertificateCode(), studentId, courseId);
        return toDto(saved);
    }

    private CertificateResponseDto toDto(Certificate cert) {
        return CertificateResponseDto.builder()
                .id(cert.getId())
                .studentId(cert.getStudentId())
                .courseId(cert.getCourseId())
                .studentName(cert.getStudentName())
                .courseName(cert.getCourseName())
                .instructorName(cert.getInstructorName())
                .completedAt(cert.getCompletedAt())
                .issuedAt(cert.getIssuedAt())
                .certificateCode(cert.getCertificateCode())
                .build();
    }
}
