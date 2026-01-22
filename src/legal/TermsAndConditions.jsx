import React from "react";
import LegalPage from "./LegalPage";

/**
 * Terms and Conditions Page
 * Content is fetched dynamically from backend
 * API: /api/legal/terms-and-conditions
 */
function TermsAndConditions() {
  return <LegalPage apiPath="/api/legal/terms-and-conditions" />;
}

export default TermsAndConditions;
