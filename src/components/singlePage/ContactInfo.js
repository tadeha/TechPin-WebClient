import React, { PropTypes } from "react";

import CommunicationEmail from "material-ui/svg-icons/communication/email";
import FileCloud from "material-ui/svg-icons/file/cloud";

import LinkedLogo from "../../../images/linkedin-logo.svg";
import InstagramLogo from "../../../images/instagram-logo.svg";
import TwitterLogo from "../../../images/twitter-logo.svg";

const styles = {
  svgIcon: {
    width: "20px",
    color: "#0D47A1"
  }
};

const ContactInfo = ({ contactData }) => {
  return (
    <div className="">
      <div className="contact-info-row">
        <a href={contactData.website || "#"} target="_blank">
          <FileCloud style={styles.svgIcon} />
          <div className="contact-info-title">
            {contactData.website || "No website"}
          </div>
        </a>
      </div>
      {contactData.extraUrl && (
        <div className="contact-info-row">
          <FileCloud style={styles.svgIcon} />
          <span className="contact-info-title">
            <a
              href={contactData.extraUrl || ""}
              target="_blank"
              className={!contactData.extraUrl && "link-disabled"}
            >
              {contactData.extraUrl || "No extra url"}
            </a>
          </span>
        </div>
      )}
      <div className="contact-info-row">
        <CommunicationEmail style={styles.svgIcon} />
        <span className="contact-info-title">
          {contactData.email || "No email"}
        </span>
      </div>
    </div>
  );
};

export default ContactInfo;
