import React from "react";
import Navbar from "../components/layout/Navbar";
import CypherRayWorkflow from "../components/ui/CypherRayWorkflow";
import { Helmet } from "react-helmet-async";

const CypherRayWebsiteWorkflow = () => {
  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Analysis Workflow | CypherRay</title>
        <meta 
          name="description" 
          content="Explore the secure, AI-powered analysis pipeline of CypherRay. From upload to detailed insights." 
        />
      </Helmet>
      <Navbar />
      <div className="pt-20"> {/* Add padding for fixed navbar */}
        <CypherRayWorkflow />
      </div>
    </div>
  );
};

export default CypherRayWebsiteWorkflow;
