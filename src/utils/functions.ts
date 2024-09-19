import {
  useGetBeachApartmentsQuery,
  useGetRestaurantApartmentsQuery,
} from "@/api/api";
export const formatDateString = (dateString: string): string => {
  const date = new Date(dateString);

  // Get local day, month, and year
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const year = date.getFullYear();

  // Format as DD/MM/YYYY
  return `${day}/${month}/${year}`;
};

export const formatImageUrl = (imgUrl: string) => {
  return (
    import.meta.env.VITE_SERVER_LOCATION + "/" + imgUrl.replace("public/", "")
  );
};

export const getColorFromUUID = (uuid: string) => {
  // List of colors
  const colors = [
    "#464af5", // Primary vibrant blue
    "#ffb347", // Warm yellow-orange
    "#ff6f61", // Bright coral
    "#6b8e23", // Olive green
    "#20b2aa", // Light sea green
    "#dda0dd", // Plum
    "#ff69b4", // Hot pink
    "#ffa500", // Orange
    "#00ced1", // Dark turquoise
    "#9370db", // Medium purple
  ];
  // Simple hash function to generate an index from the UUID
  function hashCode(str: string) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  }

  // Generate a hash code from the UUID and map it to an index
  const hash = hashCode(uuid);
  const index = Math.abs(hash) % colors.length;

  // Return the color at the calculated index
  return colors[index];
};
