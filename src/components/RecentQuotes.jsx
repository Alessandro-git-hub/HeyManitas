import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  DashboardContainer, 
  DashboardSectionHeader, 
  DashboardCard 
} from './common/DashboardComponents';

const RecentQuotes = ({ quotes = [], onViewQuotes, showViewAll = true }) => {
  const navigate = useNavigate();

  const viewAllButton = showViewAll && (
    <button 
      onClick={onViewQuotes || (() => navigate('/worker/quotes'))}
      className="text-secondary-600 hover:text-secondary-700 text-sm font-medium"
    >
      View All →
    </button>
  );

  // Mock data for now - this should come from props or a hook in the future
  const defaultQuotes = [
    {
      id: 1,
      title: 'Bathroom Renovation',
      client: 'Luis Martín',
      price: '€2,400',
      status: 'Sent'
    },
    {
      id: 2,
      title: 'Kitchen Wiring',
      client: 'María González',
      price: '€850',
      status: 'Draft'
    },
    {
      id: 3,
      title: 'Office Lighting',
      client: 'Tech Solutions',
      price: '€1,200',
      status: 'Accepted'
    }
  ];

  const displayQuotes = quotes.length > 0 ? quotes : defaultQuotes;

  const getStatusStyles = (status) => {
    switch (status) {
      case 'Sent':
        return 'bg-secondary-600 text-primary-700';
      case 'Draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'Accepted':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardContainer fitContent={true}>
      <DashboardSectionHeader
        title="Recent Quotes"
        actionButton={viewAllButton}
      />
      
      <div className="space-y-3">
        {displayQuotes.map((quote) => (
          <DashboardCard 
            key={quote.id}
            className="border border-primary-700"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold text-primary-700">{quote.title}</p>
                <p className="text-sm text-gray-600">{quote.client} - {quote.price}</p>
              </div>
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusStyles(quote.status)}`}>
                {quote.status}
              </span>
            </div>
          </DashboardCard>
        ))}
      </div>
    </DashboardContainer>
  );
};

export default RecentQuotes;
