import React, { PropTypes } from "react";
import { Link } from "react-router";

import { footerText } from "../../helpers/staticText";
import gitRepo from "../../helpers/links";

const Footer = props => {
  return (
    <div className="footer">
      <section className="footer-about">
        <span>TechPin, Dynamic list of startups & accelerators in Iran</span>
        <p>{footerText}</p>
      </section>
      <section className="copyright">
        <ul>
          <li>
            TechPin © 2017. &nbsp;{" "}
            <a href={gitRepo}>TechPin is an Open Source</a>
            , Crowd Sourced Project &nbsp;
            <a href="http://www.mozilla.org/en-US/MPL/2.0/">Under MPL 2.0</a>
          </li>
          <li>
            <Link to="about">About</Link>
          </li>
          <li>
            <Link to="contribute">Contribute</Link>
          </li>
          <li>
            <a href="http://blog.techpin.ir" target="_blank">
              Blog
            </a>
          </li>
        </ul>
      </section>
      <section className='passion'>
        Made with passion & Powered by{" "}
        <a href="http://www.idearun.co" target="_blank">
          Idearun Start-up Studio
        </a>
      </section>
    </div>
  );
};

Footer.propTypes = {};

export default Footer;
