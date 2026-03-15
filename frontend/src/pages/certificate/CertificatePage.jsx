import { useEffect, useState } from "react";
import Certificate from "./Certificate";

export default function CertificatePage() {
  const apiBase = import.meta.env.VITE_API_BASE || import.meta.env.VITE_API_URL;
  const [loading, setLoading] = useState(Boolean(apiBase));
  const [certificates, setCertificates] = useState([]);

  useEffect(() => {
    if (!apiBase) return;

    fetch(`${apiBase}/documents`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
      },
    })
      .then((res) => res.json())
      .then((json) => {
        const docs = json?.data?.documents || [];
        setCertificates(
          docs.map((doc) => ({
            url: doc.imageUrl,
            type: doc.documentType,
          }))
        );
      })
      .catch((error) => {
        console.error("수료증 조회 실패:", error);
        setCertificates([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [apiBase]);

  return <Certificate loading={loading} certificates={certificates} />;
}
