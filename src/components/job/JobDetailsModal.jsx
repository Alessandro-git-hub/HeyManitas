import React from 'react';
import { getStatusStyles, formatDateTimeDetailed, formatDateDetailed } from '../../utils/formatters';
import Modal from '../common/Modal';
import { 
  InfoField, 
  InfoGrid, 
  InfoSection, 
  StatusBadgeField, 
  PriceField, 
  ConditionalField 
} from '../common/InfoComponents';
import { 
  extractCustomerInfo, 
  extractServiceInfo, 
  extractSchedulingInfo, 
  extractSystemInfo,
  formatTimeValue 
} from '../../utils/jobDataExtractors';

export default function JobDetailsModal({ isOpen, onClose, job }) {
  if (!isOpen || !job) return null;

  // Check if this is a booking or a job
  const isBooking = job.itemType === 'booking';
  const title = isBooking ? 'Booking Details' : 'Job Details';

  // Extract data using utility functions
  const customerInfo = extractCustomerInfo(job);
  const serviceInfo = extractServiceInfo(job);
  const schedulingInfo = extractSchedulingInfo(job);
  const systemInfo = extractSystemInfo(job);

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={title}
      size="lg"
      noPadding={true}
    >
      {/* Content with our own padding */}
      <div className="p-6 space-y-6 bg-secondary-600">
          {/* Customer Information */}
          <InfoSection title="Customer Information">
            <InfoGrid>
              <InfoField 
                label="Name" 
                value={customerInfo.name || 'Not specified'} 
              />
              <ConditionalField condition={customerInfo.email}>
                <InfoField label="Email" value={customerInfo.email} />
              </ConditionalField>
              <ConditionalField condition={customerInfo.phone}>
                <InfoField label="Phone" value={customerInfo.phone} />
              </ConditionalField>
              <StatusBadgeField status={job.status} getStatusStyles={getStatusStyles} />
            </InfoGrid>
          </InfoSection>

          {/* Job/Booking Details */}
          <InfoSection title={isBooking ? 'Service Request Details' : 'Job Details'}>
            <div className="space-y-4">
              <InfoField 
                label="Description" 
                value={serviceInfo.description || 'No description provided'} 
              />
              
              {/* Service Information */}
              <ConditionalField condition={serviceInfo.name}>
                <InfoGrid>
                  <InfoField label="Service" value={serviceInfo.name} />
                  <ConditionalField condition={serviceInfo.basePrice}>
                    <PriceField label="Base Price" amount={serviceInfo.basePrice} />
                  </ConditionalField>
                </InfoGrid>
                <ConditionalField condition={isBooking && serviceInfo.budget}>
                  <InfoField label="Budget" value={serviceInfo.budget} className="mt-2" />
                </ConditionalField>
              </ConditionalField>

              <InfoGrid>
                <PriceField 
                  label={isBooking ? 'Hourly Rate' : 'Final Price'}
                  amount={serviceInfo.finalPrice || 'Not specified'}
                  large={true}
                />
                <ConditionalField condition={serviceInfo.serviceId}>
                  <InfoField 
                    label="Service ID" 
                    value={serviceInfo.serviceId} 
                    valueClassName="text-sm"
                  />
                </ConditionalField>
                <ConditionalField condition={isBooking && serviceInfo.duration}>
                  <InfoField label="Duration" value={serviceInfo.duration} />
                </ConditionalField>
              </InfoGrid>
              
              {/* Location for bookings */}
              <ConditionalField condition={isBooking && serviceInfo.location}>
                <InfoField label="Location" value={serviceInfo.location} />
              </ConditionalField>
            </div>
          </InfoSection>

          {/* Scheduling Information */}
          <InfoSection title="Scheduling">
            <InfoGrid>
              <InfoField 
                label="Scheduled Date"
                value={schedulingInfo.scheduledDate
                  ? formatDateDetailed(schedulingInfo.scheduledDate + 'T00:00:00')
                  : 'Not scheduled'}
              />
              <InfoField 
                label="Appointment Time"
                value={formatTimeValue(schedulingInfo.scheduledTime)}
              />
              <ConditionalField condition={isBooking && schedulingInfo.originalDateTime}>
                <InfoField 
                  label="Original Booking Time"
                  value={formatDateTimeDetailed(schedulingInfo.originalDateTime)}
                />
              </ConditionalField>
            </InfoGrid>
          </InfoSection>

          {/* System Information */}
          <InfoSection title="System Information" showBorder={false}>
            <InfoGrid>
              <InfoField 
                label="Created"
                value={formatDateTimeDetailed(systemInfo.created)}
              />
              <InfoField 
                label={isBooking ? 'Booking ID' : 'Job ID'}
                value={systemInfo.id}
                valueClassName="font-mono text-sm"
              />
              <InfoField 
                label="Type"
                value={systemInfo.type}
                valueClassName="capitalize"
              />
              <ConditionalField condition={systemInfo.originalBookingId}>
                <InfoField 
                  label="Original Booking ID"
                  value={systemInfo.originalBookingId}
                  valueClassName="font-mono text-sm"
                />
              </ConditionalField>
            </InfoGrid>
          </InfoSection>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-secondary-600">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-primary-700 bg-white rounded-2xl cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
    </Modal>
  );
}
