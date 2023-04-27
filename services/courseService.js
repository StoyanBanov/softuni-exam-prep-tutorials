const Course = require("../models/Course");
const User = require("../models/User");

async function getAllCourses(top, search) {
    if (top) {
        return Course.find({}).sort({ usersEnrolled: -1 }).limit(top).lean()
    }
    return Course.find({}).where('title').regex(new RegExp(search, 'i')).lean()
}

async function getCourseById(id) {
    return Course.findById(id).lean()
}

async function createCourse(courseData) {
    return Course.create(courseData)
}

async function enrollCourse(courseId, userId) {
    const course = await Course.findById(courseId)
    const user = await User.findById(userId)
    if (!user) throw new Error('User doesn\'t exist!')
    course.usersEnrolled.push(userId)
    user.enrolledCourses.push(courseId)
    await Promise.all([course.save(), user.save()])
}

async function updateCourse(courseId, courseData) {
    const course = await Course.findById(courseId)
    Object.assign(course, courseData)
    await course.save()
}

async function deleteCourse(courseId) {
    await Course.findByIdAndRemove(courseId)
}

module.exports = {
    getAllCourses,
    getCourseById,
    createCourse,
    enrollCourse,
    updateCourse,
    deleteCourse
}