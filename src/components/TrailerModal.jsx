import { useEffect } from "react";

export default function TrailerModal({ videoKey, title, onClose }) {
  // close on Escape + lock page scroll while open
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-label={`${title} trailer`}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close trailer">✕</button>
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoKey}?autoplay=1`}
          title={`${title} trailer`}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}
