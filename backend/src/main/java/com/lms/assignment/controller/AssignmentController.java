package com.lms.assignment.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lms.assignment.dto.AssignmentResponseDto;
import com.lms.assignment.dto.CreateAssignmentRequestDto;
import com.lms.assignment.service.AssignmentService;
import com.lms.shared.dto.ApiResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/assignments")
@RequiredArgsConstructor
public class AssignmentController {

    private final AssignmentService assignmentService;

    @PostMapping
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<ApiResponse<AssignmentResponseDto>> createAssignment(
            Authentication auth,
            @RequestBody CreateAssignmentRequestDto request) {
        Long instructorId = (Long) auth.getCredentials();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Assignment created",
                        assignmentService.createAssignment(instructorId, request)));
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<ApiResponse<List<AssignmentResponseDto>>> getAssignmentsByCourse(
            @PathVariable Long courseId) {
        return ResponseEntity.ok(ApiResponse.success("Assignments fetched",
                assignmentService.getAssignmentsByCourse(courseId)));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<ApiResponse<List<AssignmentResponseDto>>> getMyAssignments(
            Authentication auth) {
        Long instructorId = (Long) auth.getCredentials();
        return ResponseEntity.ok(ApiResponse.success("My assignments fetched",
                assignmentService.getAssignmentsByInstructor(instructorId)));
    }
}
