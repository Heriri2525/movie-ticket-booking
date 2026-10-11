import { useEffect } from "react";

export default function useDocumentTitle(title) {
  useEffect(() => {
    const previous = document.title;
    document.title = title ? `${title} • CineBook` : "CineBook – Movie Ticket Booking";
    return () => {
      document.title = previous;
    };
  }, [title]);
}
