import React, { useState } from 'react';
import ClientLayout from './ClientLayout';
import ClientDashboard from './ClientDashboard';
import ClientBudgets from './ClientBudgets';
import ClientServices from './ClientServices';
import ClientProjects from './ClientProjects';
import ClientSupport from './ClientSupport';
import ClientAnalytics from './ClientAnalytics';
import ClientProfile from './ClientProfile';

const ClientPortal = ({ onBack }) => {
  const [currentSection, setCurrentSection] = useState('dashboard');

  const renderSection = () => {
    switch (currentSection) {
      case 'dashboard':
        return <ClientDashboard />;
      case 'budgets':
        return <ClientBudgets />;
      case 'services':
        return <ClientServices />;
      case 'projects':
        return <ClientProjects />;
      case 'support':
        return <ClientSupport />;
      case 'analytics':
        return <ClientAnalytics />;
      case 'profile':
        return <ClientProfile />;
      default:
        return <ClientDashboard />;
    }
  };

  return (
    <ClientLayout
      onBack={onBack}
      currentSection={currentSection}
      onSectionChange={setCurrentSection}
    >
      {renderSection()}
    </ClientLayout>
  );
};

export default ClientPortal; 