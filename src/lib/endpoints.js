// This file serves as a single source of truth for all backend API endpoint paths.
// Using this ensures consistency and prevents typos when making API calls.

export const ENDPOINTS = {
  USERS: {
    REGISTER: '/users/register',
    LOGIN: '/users/login',
    LOGOUT: '/users/logout',
    REFRESH_TOKEN: '/users/refresh-token',
    CHANGE_PASSWORD: '/users/change-password',
    FORGOT_PASSWORD: '/users/forgot-password',
    RESET_PASSWORD: (token) => `/users/reset-password/${token}`,
    UPDATE_PROFILE: '/users/update-profile',
  },
  COURSES: {
    CREATE: '/courses',
    GET_ALL: '/courses/all',
    GET_SYLLABI: '/courses/syllabi',
    GET_MY_COURSES_AS_COACH: '/courses/coach/my-courses',
    GET_MY_COURSES_AS_STUDENT: '/courses/student/my-courses',
    GET_BY_ID: (courseId) => `/courses/${courseId}`,
    UPDATE: (courseId) => `/courses/${courseId}`,
    DELETE: (courseId) => `/courses/${courseId}`,
    ADD_STUDENT: (courseId) => `/courses/${courseId}/students`,
    REMOVE_STUDENT: (courseId, studentId) => `/courses/${courseId}/students/${studentId}`,
  },
  ASSIGNMENTS: {
    CREATE: (courseId) => `/assignments/course/${courseId}`,
    GET_BY_COURSE: (courseId) => `/assignments/course/${courseId}`,
    DELETE: (assignmentId) => `/assignments/${assignmentId}`,
    UPDATE_STATUS: (assignmentId) => `/assignments/${assignmentId}/status`,
  },
  SUBMISSIONS: {
    SUBMIT: (assignmentId) => `/submissions/assignment/${assignmentId}`,
    GET_BY_ASSIGNMENT: (assignmentId) => `/submissions/assignment/${assignmentId}`,
    REVIEW: (submissionId) => `/submissions/${submissionId}/review`,
  },
  CLASSES: {
    SCHEDULE: (courseId) => `/classes/course/${courseId}`,
    GET_BY_COURSE: (courseId) => `/classes/course/${courseId}`,
    UPDATE: (classId) => `/classes/${classId}`,
    DELETE: (classId) => `/classes/${classId}`,
  },
  CHATS: {
    GET_STUDENTS_FOR_COACH: '/chats/coach/students',
    GET_CHAT_HISTORY: (receiverId) => `/chats/conversation/${receiverId}`,
  },

  TESTS: {
    CREATE: (courseId) => `/tests/course/${courseId}`,
    GET_BY_COURSE: (courseId) => `/tests/course/${courseId}`,
    DELETE: (testId) => `/tests/${testId}`,
  },
};
