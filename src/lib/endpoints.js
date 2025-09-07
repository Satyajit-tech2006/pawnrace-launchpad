// This file serves as a single source of truth for all backend API endpoint paths.

export const ENDPOINTS = {
  USERS: {
    REGISTER: '/users/register',
    LOGIN: '/users/login',
    LOGOUT: '/users/logout',
    REFRESH_TOKEN: '/users/refresh-token',
    CHANGE_PASSWORD: '/users/change-password',
    CURRENT_USER: '/users/current-user',
    UPDATE_AVATAR: '/users/avatar',
    UPDATE_PROFILE: '/users/update-account',
  },
  COURSES: {
    CREATE: '/courses',
    GET_ALL: '/courses/all',
    GET_SYLLABI: '/courses/syllabi',
    GET_MY_COURSES_AS_COACH: '/courses/coach/my-courses',
    GET_STUDENT_COURSES: '/courses/student/my-courses',
    GET_BY_ID: (courseId) => `/courses/${courseId}`,
    UPDATE: (courseId) => `/courses/${courseId}`,
    DELETE: (courseId) => `/courses/${courseId}`, // DELETE uses the same path as UPDATE/GET_BY_ID
    ADD_STUDENT: (courseId) => `/courses/${courseId}/students`,
    // ADDED: The specific endpoint for removing a student from a course
    REMOVE_STUDENT: (courseId, studentId) => `/courses/${courseId}/students/${studentId}`,
  },
  ASSIGNMENTS: {
    CREATE: (courseId) => `/assignments/course/${courseId}`,
    GET_BY_COURSE: (courseId) => `/assignments/course/${courseId}`,
    GET_BY_ID: (assignmentId) => `/assignments/${assignmentId}`,
    UPDATE: (assignmentId) => `/assignments/${assignmentId}`,
  },
  SUBMISSIONS: {
    SUBMIT: (assignmentId) => `/submissions/assignment/${assignmentId}`,
    GET_BY_ASSIGNMENT: (assignmentId) => `/submissions/assignment/${assignmentId}`,
    GRADE: (submissionId) => `/submissions/${submissionId}/grade`,
  },
  CLASSES: {
    SCHEDULE: (courseId) => `/classes/course/${courseId}`,
    GET_BY_COURSE: (courseId) => `/classes/course/${courseId}`,
    UPDATE: (classId) => `/classes/${classId}`,
    DELETE: (classId) => `/classes/${classId}`,
  },
  CHATS: {
    GET_STUDENTS_FOR_COACH: '/chats/students',
    GET_CHAT_HISTORY: '/chats/history', 
  },
};

