// Course prices arrive from the API as strings like "350.00".
export const formatPrice = (price) => {
  const n = Number(price);
  if (!n) return "Free";
  return `${n.toLocaleString("en-US", { maximumFractionDigits: 2 })} ETB`;
};

export const courseHref = (course) => `/${encodeURIComponent(course.title)}`;
