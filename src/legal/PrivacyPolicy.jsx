import React from "react";
import LegalPage from "./LegalPage";

/**
 * Privacy Policy Page
 * API: /api/legal/privacy-policy
 */
function PrivacyPolicy() {
  return <LegalPage apiPath="/api/legal/privacy-policy" />;
}

export default PrivacyPolicy;
