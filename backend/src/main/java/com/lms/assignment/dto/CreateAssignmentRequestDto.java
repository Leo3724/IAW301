package com.lms.assignment.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class CreateAssignmentRequestDto {
    private Long courseId;
    private String title;
    private String description;
    private LocalDateTime dueDate;
}
