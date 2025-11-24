import { useEffect, useState } from "react";
import Certificate from "./Certificate";

export default function CertificatePage() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/documents`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });

        const body = await res.json();

        const mapped = body.data.documents.map((doc) => ({
          downloadUrl: doc.imageUrl,
          topImage: null,
          track: doc.documentType,
          text: "",
          date: "",
          from: "한성대학교 멋쟁이사자처럼",
        }));

        setCertificates(mapped);
      } catch (error) {
        console.error("Failed to fetch certificates:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  if (loading) return <div>불러오는 중...</div>;

  return <Certificate certificates={certificates} />;
}
