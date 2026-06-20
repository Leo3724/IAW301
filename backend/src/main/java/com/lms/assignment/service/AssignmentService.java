package com.lms.assignment.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.lms.assignment.dto.AssignmentResponseDto;
import com.lms.assignment.dto.CreateAssignmentRequestDto;
import com.lms.assignment.entity.Assignment;
import com.lms.assignment.repository.AssignmentRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AssignmentService {

    private final AssignmentRepository assignmentRepository;

    public AssignmentResponseDto createAssignment(Long instructorId, CreateAssignmentRequestDto request) {
        Assignment assignment = Assignment.builder()
                .courseId(request.getCourseId())
                .instructorId(instructorId)
                .title(request.getTitle())
                .description(request.getDescription())
                .dueDate(request.getDueDate())
                .build();
        return toDto(assignmentRepository.save(assignment));
    }

    public List<AssignmentResponseDto> getAssignmentsByCourse(Long courseId) {
        return assignmentRepository.findByCourseIdOrderByCreatedAtDesc(courseId)
                .stream().map(this::toDto).toList();
    }

    public List<AssignmentResponseDto> getAssignmentsByInstructor(Long instructorId) {
        return assignmentRepository.findByInstructorIdOrderByCreatedAtDesc(instructorId)
                .stream().map(this::toDto).toList();
    }

    private AssignmentResponseDto toDto(Assignment a) {
        AssignmentResponseDto dto = new AssignmentResponseDto();
        dto.setId(a.getId());
        dto.setCourseId(a.getCourseId());
        dto.setInstructorId(a.getInstructorId());
        dto.setTitle(a.getTitle());
        dto.setDescription(a.getDescription());
        dto.setDueDate(a.getDueDate());
        dto.setCreatedAt(a.getCreatedAt());
        return dto;
    }
}
