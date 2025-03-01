import React, { useState, useEffect, useCallback } from "react";
import "./RomaniaMap.scss";
import { ReactComponent as RomaniaSVG } from "./romania-map.svg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

const RomaniaMap = () => {
  const [selectedDistrictId, setSelectedDistrictId] = useState();
  const [selectedDistrictName, setSelectedDistrictName] = useState();
  const [institutionsInDistrict, setInstitutionsInDistrict] = useState([]);
  const [showMoreInfo, setShowMoreInfo] = useState(false);

  const fetchInstitutionsFromDatabase = async (districtId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/enrolledInstitutions/code/${districtId}`);
      const institutions = response.ok ? await response.json() : [];

      // If the response contains a 'message', treat it as no institutions found
      setInstitutionsInDistrict(institutions.message ? [] : institutions);
    } catch (error) {
      console.error('Error fetching institutions:', error);
      setInstitutionsInDistrict([]); // Set to empty array in case of error
    }
  };

  const handleClick = useCallback((element) => {
    const districtId = element.getAttribute("id");
    setSelectedDistrictId(districtId);
    setSelectedDistrictName(element.getAttribute("name"));
    fetchInstitutionsFromDatabase(districtId);
  }, []);

  const handleInfoClick = useCallback((institutionName) => {
    setShowMoreInfo((prevState) => ({
      ...prevState,
      [institutionName]: !prevState[institutionName],
    }));
  }, []);

  const updateDistrictStyles = useCallback(() => {
    const paths = document.querySelectorAll("path");
    paths.forEach((path) => {
      const pathId = path.getAttribute("id");
      path.setAttribute("fill", pathId === selectedDistrictId ? "#02755D" : "");
    });
  }, [selectedDistrictId]);

  useEffect(() => {
    const paths = document.querySelectorAll("path");
    paths.forEach((path) => {
      path.removeEventListener("click", handleClick);
      path.addEventListener("click", () => handleClick(path));
    });

    return () => {
      paths.forEach((path) => path.removeEventListener("click", handleClick));
    };

  }, [handleClick]);

  useEffect(() => {
    updateDistrictStyles();
  }, [selectedDistrictId, updateDistrictStyles]);

  const renderInstitutionInfo = (institutionName) => {
    const institution = institutionsInDistrict.find(inst => inst.name === institutionName);
    return (
      <div className="more-info">
        <p><strong>Name:</strong> {institution.name}</p>
        <p><strong>Locality:</strong> {institution.locality}</p>
        <p><strong>Phone Number:</strong> {institution.phoneNumber}</p>
        <p><strong>Email Address:</strong> {institution.publicEmail}</p>
        <p><strong>Address:</strong> {institution.address}</p>
        <p><strong>Website Link:</strong>
          <a href={institution.officialSiteLink} target="_blank" rel="noopener noreferrer"> {institution.officialSiteLink}</a>
        </p>
      </div>
    );
  };

  return (
    <div className="map-container">
      <RomaniaSVG className="Ro-svg" />
      {(institutionsInDistrict.length > 0) ? (
        <div className="institutions-list">
          <ul>
            {institutionsInDistrict.map((institution) => (
              <li key={institution.name}>
                <span>
                  {institution.name}
                  <i>
                    <FontAwesomeIcon
                      icon={showMoreInfo[institution.name] ? faTimesCircle : faInfoCircle}
                      onClick={() => handleInfoClick(institution.name)}
                    />
                  </i>
                </span>
                {showMoreInfo[institution.name] ? (
                  renderInstitutionInfo(institution.name)
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        selectedDistrictId ?
          <p>No institutions found for <strong>{selectedDistrictName}</strong></p>
          : null
      )}
    </div>
  );
};

export default RomaniaMap;
