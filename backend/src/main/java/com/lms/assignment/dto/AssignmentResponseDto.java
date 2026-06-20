package com.lms.assignment.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class AssignmentResponseDto {
    private Long id;
    private Long courseId;
    private Long instructorId;
    private String title;
    private String description;
    private LocalDateTime dueDate;
    private LocalDateTime createdAt;
}
