import React, { useEffect } from "react";
import "./InfoModal.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmarkCircle } from "@fortawesome/free-regular-svg-icons";
import { faDownload, faFile, faUpload, faArrowRight } from "@fortawesome/free-solid-svg-icons";

export default function InfoModal({ toggleModal }) {
  useEffect(() => {
    document.body.classList.add("active-modal");
    return () => {
      document.body.classList.remove("active-modal");
    };
  }, []);

  const steps = [
    {
      icon: faDownload,
      title: "Download",
      description: "Download the pre-filled enrollment form from the download section.",
    },
    {
      icon: faFile,
      title: "Fill Out",
      description: "Complete the downloaded form.",
    },
    {
      icon: faUpload,
      title: "Upload",
      description: "Upload the completed form in the upload section.",
    },
  ];

  return (
    <div className="modal">
      <div className="overlay" onClick={toggleModal}></div>
      <div className="modal-content">
        {/* Close Button */}
        <div className="top-part">
          <button className="close-modal" onClick={toggleModal} aria-label="Close Modal">
            <FontAwesomeIcon icon={faXmarkCircle} />
          </button>
        </div>

        {/* Modal Steps */}
        <div className="bottom-part">
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              <div className="info-modal-element">
                <i><FontAwesomeIcon icon={step.icon} /></i>
                <h1>{step.title}</h1>
                <p>{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="arrow">
                  <FontAwesomeIcon icon={faArrowRight} />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
