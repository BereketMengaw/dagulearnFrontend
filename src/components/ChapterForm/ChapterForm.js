import React from "react";

const ChaptersForm = ({ chapters, handleChapterChange, addChapter }) => {
  return (
    <div>
      <h3 className="text-xl font-semibold">Chapters</h3>
      {chapters.map((chapter, index) => (
        <div key={index} className="space-y-2">
          <div>
            <label className="block text-gray-700">Chapter Title</label>
            <input
              type="text"
              name="title"
              value={chapter.title}
              onChange={(e) => handleChapterChange(index, e)}
              className="w-full p-3 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Chapter Order</label>
            <input
              type="number"
              name="order"
              value={chapter.order}
              onChange={(e) => handleChapterChange(index, e)}
              className="w-full p-3 border rounded-md"
              required
            />
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={addChapter}
        className="text-blue-500 hover:text-blue-600"
      >
        + Add Chapter
      </button>
    </div>
  );
};

export default ChaptersForm;
