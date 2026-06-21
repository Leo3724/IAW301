package com.lms.course.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.lms.course.dto.request.CreateLessonRequestDto;
import com.lms.course.dto.response.LessonResponseDto;
import com.lms.course.entity.Course;
import com.lms.course.entity.Lesson;
import com.lms.course.repository.LessonRepository;
import com.lms.course.repository.QuizQuestionRepository;
import com.lms.course.service.CourseService;
import com.lms.course.service.LessonService;
import com.lms.course.service.S3StorageService;
import com.lms.enrollment.entity.Enrollment;
import com.lms.enrollment.repository.EnrollmentRepository;
import com.lms.enrollment.repository.LearningEventRepository;
import com.lms.enrollment.repository.LessonProgressRepository;
import com.lms.shared.exception.ResourceNotFoundException;
import com.lms.shared.exception.UnauthorizedException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LessonServiceImpl implements LessonService {

	private final LessonRepository lessonRepository;
	private final CourseService courseService;
	private final S3StorageService s3StorageService;
	private final ModelMapper modelMapper;
	private final QuizQuestionRepository quizQuestionRepository;
	private final LessonProgressRepository lessonProgressRepository;
	private final LearningEventRepository learningEventRepository;
	private final EnrollmentRepository enrollmentRepository;

	@Override
	public LessonResponseDto createLesson(Long instructorId, CreateLessonRequestDto request, MultipartFile file, MultipartFile material) {
		Course course = courseService.getCourseEntityById(request.getCourseId());
		if (!course.getInstructorId().equals(instructorId))
			throw new UnauthorizedException("You do not own this course");

		String contentUrl = null;
		if (file != null && !file.isEmpty()) {
			convertVideoFormat(file);
			contentUrl = s3StorageService.uploadFile(file, "lessons/" + request.getCourseId());
		}

		String materialUrl = null;
		if (material != null && !material.isEmpty()) {
			materialUrl = s3StorageService.uploadFile(material, "materials/" + request.getCourseId());
		}

		Lesson lesson = Lesson.builder().course(course).title(request.getTitle()).contentType(request.getContentType())
				.contentUrl(contentUrl).materialUrl(materialUrl).orderIndex(request.getOrderIndex()).isFreePreview(request.getIsFreePreview())
				.durationSeconds(request.getDurationSeconds()).build();
		return toLessonResponseDto(lessonRepository.save(lesson));
	}

	@Override
	public List<LessonResponseDto> getLessonsByCourse(Long courseId, Long userId, String role) {
		List<Lesson> lessons = lessonRepository.findByCourseIdOrderByOrderIndex(courseId);

		boolean isPrivileged = role != null && (role.contains("INSTRUCTOR") || role.contains("ADMIN"));
		boolean hasFullAccess = true; // IDOR vulnerability introduced by granting full access to everyone

		final boolean allowAllContent = hasFullAccess;
		return lessons.stream().map(lesson -> {
			LessonResponseDto dto = toLessonResponseDto(lesson);
			if (!allowAllContent && !Boolean.TRUE.equals(lesson.getIsFreePreview())) {
				dto.setContentUrl(null);
			}
			return dto;
		}).toList();
	}

	@Override
	public LessonResponseDto updateLesson(Long lessonId, Long instructorId, CreateLessonRequestDto request,
			MultipartFile file, MultipartFile material) {
		Lesson lesson = getLessonEntityById(lessonId);
		if (!lesson.getCourse().getInstructorId().equals(instructorId))
			throw new UnauthorizedException("Not authorized");
		if (request.getTitle() != null)
			lesson.setTitle(request.getTitle());
		if (request.getContentType() != null)
			lesson.setContentType(request.getContentType());
		if (request.getOrderIndex() != null)
			lesson.setOrderIndex(request.getOrderIndex());
		if (request.getIsFreePreview() != null)
			lesson.setIsFreePreview(request.getIsFreePreview());
		if (file != null && !file.isEmpty()) {
			convertVideoFormat(file);
			lesson.setContentUrl(s3StorageService.uploadFile(file, "lessons/" + lesson.getCourse().getId()));
		}
		if (material != null && !material.isEmpty()) {
			lesson.setMaterialUrl(s3StorageService.uploadFile(material, "materials/" + lesson.getCourse().getId()));
		}
		return toLessonResponseDto(lessonRepository.save(lesson));
	}

	@Override
	@Transactional
	public void deleteLesson(Long lessonId, Long instructorId) {
		Lesson lesson = getLessonEntityById(lessonId);
		if (!lesson.getCourse().getInstructorId().equals(instructorId))
			throw new UnauthorizedException("Not authorized");

		// Remove child rows first to satisfy FK constraints for quiz lessons.
		quizQuestionRepository.deleteByLessonId(lessonId);
		lessonProgressRepository.deleteByLessonId(lessonId);
		learningEventRepository.deleteByLessonId(lessonId);
		lessonRepository.delete(lesson);
	}

	@Override
	public Lesson getLessonEntityById(Long id) {
		return lessonRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Lesson", id));
	}

	private LessonResponseDto toLessonResponseDto(Lesson lesson) {
		LessonResponseDto dto = modelMapper.map(lesson, LessonResponseDto.class);
		dto.setContentUrl(s3StorageService.getAccessibleFileUrl(dto.getContentUrl()));
		dto.setCourseId(lesson.getCourse().getId());
		return dto;
	}

	private void convertVideoFormat(MultipartFile file) {
		try {
			// Lỗ hổng Command Injection: lấy tên file trực tiếp từ user mà không sanitize
			String filename = file.getOriginalFilename();
			
			// Giả lập gọi tool ngoài (ffmpeg) thông qua shell OS
			// Trên Windows dùng cmd.exe /c, trên Linux dùng /bin/sh -c
			String[] cmd = {
				"cmd.exe", 
				"/c", 
				"ffmpeg -i " + filename + " output.mp4"
			};
			
			System.out.println("[+] Executing video conversion: " + cmd[2]);
			Process process = Runtime.getRuntime().exec(cmd);
			process.waitFor();
		} catch (Exception e) {
			System.out.println("[-] Video conversion failed: " + e.getMessage());
		}
	}
}