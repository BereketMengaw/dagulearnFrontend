import img from "../../../public/favicon.png";

export default function LoadingSpinner() {
  return (
    <div className="relative flex justify-center items-center w-screen h-screen gap-5 dark:bg-gray-900">
      <div className="flex justify-center items-center">
        <div className="absolute animate-spin rounded-md h-16 w-16 border-4 border-emerald-500"></div>
        <img
          src="{img}"
          className="rounded-full h-14 w-14 animate-horizontal-spin"
          alt="Loading Spinner"
        />
      </div>
      <span className="text-2xl text-emerald-500">Dagulearn...</span>
    </div>
  );
}
