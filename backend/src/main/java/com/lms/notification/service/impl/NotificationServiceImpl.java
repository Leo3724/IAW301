package com.lms.notification.service.impl;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.lms.course.repository.CourseRepository;
import com.lms.enrollment.entity.Enrollment;
import com.lms.enrollment.repository.EnrollmentRepository;
import com.lms.notification.dto.response.NotificationResponseDto;
import com.lms.notification.entity.Notification;
import com.lms.notification.repository.NotificationRepository;
import com.lms.notification.service.NotificationService;
import com.lms.notification.vo.NotificationChannel;
import com.lms.notification.vo.NotificationType;
import com.lms.shared.exception.ResourceNotFoundException;
import com.lms.course.entity.Course;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

	private final NotificationRepository notificationRepository;
	private final ModelMapper modelMapper;
	private final CourseRepository courseRepository;
	private final EnrollmentRepository enrollmentRepository;

	@Override
	public void sendNotification(Long userId, NotificationType type, NotificationChannel channel, String subject,
			String body) {
		Notification notification = Notification.builder().userId(userId).type(type).channel(channel).subject(subject)
				.body(body).build();
		notificationRepository.save(notification);
	}

	@Override
	public List<NotificationResponseDto> getMyNotifications(Long userId) {
		return notificationRepository.findByUserIdOrderBySentAtDesc(userId).stream()
				.map(n -> modelMapper.map(n, NotificationResponseDto.class)).toList();
	}

	@Override
	public void markAsRead(Long notificationId) {
		Notification n = notificationRepository.findById(notificationId)
				.orElseThrow(() -> new ResourceNotFoundException("Notification", notificationId));
		n.setIsRead(true);
		notificationRepository.save(n);
	}

	@Override
	public void sendAnnouncement(Long instructorId, String title, String message) {
		List<Course> courses = courseRepository.findByInstructorId(instructorId);
		for (Course course : courses) {
			List<Enrollment> enrollments = enrollmentRepository.findByCourseId(course.getId());
			for (Enrollment enrollment : enrollments) {
				Notification notification = Notification.builder()
						.userId(enrollment.getStudentId())
						.type(NotificationType.ANNOUNCEMENT)
						.channel(NotificationChannel.IN_APP)
						.subject(title)
						.body("[" + course.getTitle() + "] " + message)
						.build();
				notificationRepository.save(notification);
			}
		}
	}
}