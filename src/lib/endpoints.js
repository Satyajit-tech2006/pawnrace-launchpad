
export const API_BASE_URL = import.meta.env.VITE_API_URL;

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
    GET_BY_ID: (courseId) => `/courses/${courseId}`,
    UPDATE: (courseId) => `/courses/${courseId}`,
    ADD_STUDENT: (courseId) => `/courses/${courseId}/students`,
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
};
