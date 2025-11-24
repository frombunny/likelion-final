import Certificate from "./Certificate";
import celebImg from "../../assets/certificate/celeb.svg";

export default function CertificatePage() {
  const certificates = [
    {
      downloadUrl: "https://placekitten.com/400/600",
      topImage: celebImg,
      track: "기획 트랙",
      text:
        "한성대학교 멋쟁이사자처럼 13기\n" +
        "기획 트랙 활동을 성실히 수행하였기에...",
      date: "2025년 12월 19일",
      from: "한성대학교 멋쟁이사자처럼",
    },
  ];

  return <Certificate certificates={certificates} />;
}

