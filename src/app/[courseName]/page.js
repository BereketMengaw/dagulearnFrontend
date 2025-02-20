import { fetchCourseByName, fetchChaptersByCourseId } from "@/lib/fetcher";
import CourseDetails from "@/components/coursePage/CourseDetails";
import Navbar from "@/components/Navbar/Navbar";

export const dynamic = "force-dynamic"; // Ensures fresh data on each request

export default async function CoursePage({ params: rawParams }) {
  // Ensure params is awaited before use
  const params = await rawParams;
  const courseName = decodeURIComponent(params.courseName);

  console.log("Fetching course:", courseName);

  if (!courseName) {
    return <div className="text-center mt-10 text-red-500">Invalid course</div>;
  }

  // Fetch course by name
  const course = await fetchCourseByName(courseName);

  if (!course) {
    return (
      <div className="text-center mt-10 text-red-500">Course not found</div>
    );
  }

  // Fetch chapters using the course ID
  const chapters = await fetchChaptersByCourseId(course.id);
  console.log(course);

  return (
    <div>
      <Navbar className="bg-green bg-red-400" />
      <CourseDetails course={course} chapters={chapters} />
    </div>
  );
}
