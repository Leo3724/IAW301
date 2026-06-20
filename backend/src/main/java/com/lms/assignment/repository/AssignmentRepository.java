package com.lms.assignment.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.lms.assignment.entity.Assignment;

public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
    List<Assignment> findByCourseIdOrderByCreatedAtDesc(Long courseId);
    List<Assignment> findByInstructorIdOrderByCreatedAtDesc(Long instructorId);
}
