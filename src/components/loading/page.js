import img from "../../../public/favicon.png";

export default function LoadingSpinner() {
  return (
    <div className="relative flex justify-center items-center w-screen h-screen gap-5 ">
   <div class='flex space-x-2 justify-center items-center bg-white h-screen dark:invert'>
	<span class='sr-only'>Dagulearn...</span>
	<div class='h-8 w-8 bg-black rounded-full animate-bounce [animation-delay:-0.3s]'></div>
	<div class='h-8 w-8 bg-black rounded-full animate-bounce [animation-delay:-0.15s]'></div>
	<div class='h-8 w-8 bg-black rounded-full animate-bounce'></div>
</div>
    </div>
  );
}
