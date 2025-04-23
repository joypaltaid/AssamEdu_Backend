const express = require('express');
const { createCourse, getInstructorCourses, addSection, uploadVideo, updateCourse, getInstructorCourse, deleteCourse, updateSection, deleteSection, getAllCourses, enrollInCourse, getCourse, getEnrolledCourses, postReview, updateReview, deleteReview } = require('../controllers/courseController');
const { route } = require('./userRoute');
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');
const {imageUploader} = require('../utils/imageUploader');

const router = express.Router();

router.use(isAuthenticatedUser);

router.route('/getAllCourses').get(getAllCourses);

router.route('/courses/:courseId').get(getCourse);

router.route('/instructor/getInstructorCourses').get(authorizeRoles("instructor"),getInstructorCourses);

router.route('/instructor/courses/:courseId').get(authorizeRoles("instructor"),getInstructorCourse);

router.route('/instructor/createcourse').post(authorizeRoles("instructor"),imageUploader.single("thumbnail"),createCourse);

router.route('/instructor/courses/:courseId').put(authorizeRoles("instructor"),updateCourse);

router.route('/instructor/courses/:courseId').delete(authorizeRoles("instructor"),deleteCourse);

router.route('/instructor/:courseId/addSection').post(authorizeRoles("instructor"),addSection);

router.route('/instructor/courses/:courseId/sections/:sectionId').put(authorizeRoles("instructor"),updateSection);

router.route('/instructor/courses/:courseId/sections/:sectionId').delete(authorizeRoles("instructor"),deleteSection);

router.route('/instructor/:courseId/:sectionId/uploads/video').post(authorizeRoles("instructor"),uploadVideo);

router.route('/courses/:courseId/enroll').post(authorizeRoles("student"),enrollInCourse);

router.route('/enrolledCourses').get(getEnrolledCourses);

router.route('/courses/:courseId/review').post(postReview);

router.route('/courses/:courseId/updateReview/:reviewId').put(updateReview);

router.route('/courses/:courseId/deleteReview/:reviewId').delete(deleteReview);

module.exports = router;