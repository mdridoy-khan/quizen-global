import {
  FaFacebookF,
  FaLink,
  FaLinkedinIn,
  FaWhatsapp,
  FaXTwitter,
} from "react-icons/fa6";
import { toast } from "react-toastify";

const SocialShare = ({ url, title }) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const handleShare = (platform) => {
    let shareUrl = "";

    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case "whatsapp":
        shareUrl = `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`;
        break;
      case "copy":
        navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard!");
        return;
      default:
        return;
    }

    window.open(shareUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex gap-3">
      <button
        onClick={() => handleShare("facebook")}
        className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition"
      >
        <FaFacebookF />
      </button>
      <button
        onClick={() => handleShare("twitter")}
        className="p-2 rounded-full bg-black text-white hover:bg-gray-800 transition"
      >
        <FaXTwitter />
      </button>
      <button
        onClick={() => handleShare("linkedin")}
        className="p-2 rounded-full bg-blue-700 text-white hover:bg-blue-800 transition"
      >
        <FaLinkedinIn />
      </button>
      <button
        onClick={() => handleShare("whatsapp")}
        className="p-2 rounded-full bg-green-600 text-white hover:bg-green-700 transition"
      >
        <FaWhatsapp />
      </button>
      <button
        onClick={() => handleShare("copy")}
        className="p-2 rounded-full bg-gray-500 text-white hover:bg-gray-600 transition"
      >
        <FaLink />
      </button>
    </div>
  );
};

export default SocialShare;
