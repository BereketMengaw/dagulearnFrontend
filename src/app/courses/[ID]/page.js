import { fetchCourseByName, fetchChaptersByCourseId } from "@/lib/fetcher";
import CourseDetails from "../../../components/coursePage/CourseDetails";
import Navbar from "@/components/Navbar/Navbar";

export const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default async function CoursePage({ params }) {
  const { courseName } = params;

  // Fetch course by name
  const course = await fetchCourseByName(courseName);

  if (!course) {
    return (
      <div className="text-center mt-10 text-red-500">Course not found</div>
    );
  }

  // Fetch chapters using the course ID
  const chapters = await fetchChaptersByCourseId(course.id);

  return (
    <div>
      <Navbar classname="bg-green bg-red-400" />
      <CourseDetails course={course} chapters={chapters} />
    </div>
  );
}
