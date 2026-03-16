import { useEffect, useState } from "react";
import Certificate from "./Certificate";
import { API_ENDPOINTS, apiClient, resolveAssetUrl } from "../../lib/api";

export default function CertificatePage() {
  const [loading, setLoading] = useState(true);
  const [certificates, setCertificates] = useState([]);

  useEffect(() => {
    apiClient
      .get(API_ENDPOINTS.documents)
      .then((res) => {
        const docs = res.data?.data?.documents || [];
        setCertificates(
          docs.map((doc) => ({
            url: resolveAssetUrl(doc.imageUrl),
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
  }, []);

  return <Certificate loading={loading} certificates={certificates} />;
}
