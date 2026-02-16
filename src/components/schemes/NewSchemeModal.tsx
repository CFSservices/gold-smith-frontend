/**
 * New Scheme Modal Component
 */

import { useState, useEffect, useMemo, useRef } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { AutoComplete } from 'primereact/autocomplete';
import { Avatar } from 'primereact/avatar';
import { Dropdown } from 'primereact/dropdown';
import { VerifyKYCModal } from './VerifyKYCModal';

interface Customer {
  name: string;
  phone: string;
  avatar: string;
  email?: string;
  id?: string;
  kycVerified?: boolean;
}

interface Plan {
  name: string;
  code: string;
  tenure: number; // in months
  minMonthlyInvestment: number;
  rules: string[];
}

interface NewSchemeModalProps {
  visible: boolean;
  onHide: () => void;
  onCreateScheme?: (schemeData: {
    customer: Customer;
    plan: Plan;
    monthlyDeposit: number;
  }) => void;
}

// Mock plans data with scheme types and their rules
const availablePlans: Plan[] = [
  {
    name: 'Golden 11',
    code: 'GS001',
    tenure: 11,
    minMonthlyInvestment: 100,
    rules: [
      'Minimum Monthly Investment - ₹100',
      'Tenure - 11 months',
      'Redeem gold only for the value accumulated at current market rate on the 12th month',
      'No Pre-closure allowed',
      'In case if unable to pay for any month, contact support, so relevant grace period can be offered',
    ],
  },
  {
    name: 'Golden 11 Flexi',
    code: 'GS002',
    tenure: 11,
    minMonthlyInvestment: 100,
    rules: [
      'Minimum Monthly Investment - ₹100',
      'Tenure - 11 months',
      'Flexible monthly payment amounts',
      'Redeem gold only for the value accumulated at current market rate on the 12th month',
      'No Pre-closure allowed',
    ],
  },
  {
    name: 'Monthly Gold Savings Scheme',
    code: 'MGSS',
    tenure: 11, // Default, can be 6, 10, 11, or 12 months
    minMonthlyInvestment: 100,
    rules: [
      'Customer must pay a fixed amount every month',
      'Duration is usually 6 / 10 / 11 / 12 months',
      'Missing installments may cancel benefits',
      'On maturity, jewellery must be purchased',
      'Store may give bonus (e.g., last installment free or making charge discount)',
    ],
  },
  {
    name: 'Gold Weight Accumulation Scheme',
    code: 'GWAS',
    tenure: 12,
    minMonthlyInvestment: 100,
    rules: [
      'Monthly payment is converted into gold grams',
      'Gold rate is fixed based on payment date',
      'At maturity, customer receives accumulated gold weight',
      'Cannot withdraw money before maturity',
      'Making charges may apply during purchase',
    ],
  },
  {
    name: 'Flexible Gold Savings Scheme',
    code: 'FGSS',
    tenure: 12,
    minMonthlyInvestment: 100,
    rules: [
      'No fixed monthly amount',
      'Customer can pay any amount during scheme period',
      'Total paid amount can be used for jewellery purchase',
      'No bonus if payments are irregular',
      'Must complete minimum duration',
    ],
  },
  {
    name: 'Gold SIP (Systematic Investment Plan)',
    code: 'GSIP',
    tenure: 12,
    minMonthlyInvestment: 100,
    rules: [
      'Fixed amount auto-debited monthly',
      'Gold is purchased digitally',
      'Can redeem as cash or physical gold',
      'Early withdrawal may have charges',
      'Based on live gold rate',
    ],
  },
  {
    name: 'Digital Gold Purchase Scheme',
    code: 'DGPS',
    tenure: 0, // No fixed tenure
    minMonthlyInvestment: 100,
    rules: [
      'Buy gold online anytime',
      'Stored in secured vaults',
      'Can sell instantly at market rate',
      'Minimum purchase amount required',
      'Delivery charges apply for physical gold',
    ],
  },
  {
    name: 'Advance Jewellery Booking Scheme',
    code: 'AJBS',
    tenure: 3, // Rate protection period
    minMonthlyInvestment: 100,
    rules: [
      'Pay advance to lock current gold rate',
      'Full payment required before delivery',
      'Rate protection for a limited period',
      'Cancellation charges may apply',
      'Making charges not included in rate lock',
    ],
  },
];

// Mock customers data
const mockCustomers: Customer[] = [
  {
    name: 'Angel Rosser',
    phone: '9876543210',
    avatar: 'assets/users/u2.jpg',
    email: 'angel.rosser@gmail.com',
    id: '1',
    kycVerified: false,
  },
  {
    name: 'Tatiana Workman',
    phone: '9876543211',
    avatar: 'assets/users/u3.jpg',
    email: 'tatiana@email.com',
    id: '2',
    kycVerified: true,
  },
  {
    name: 'James Geidt',
    phone: '9876543212',
    avatar: 'assets/users/u4.jpg',
    email: 'james.geidt@email.com',
    id: '3',
    kycVerified: true,
  },
  {
    name: 'Ahmad Franci',
    phone: '9876543213',
    avatar: 'assets/users/u5.jpg',
    email: 'ahmad.franci@email.com',
    id: '4',
    kycVerified: false,
  },
];

export function NewSchemeModal({
  visible,
  onHide,
  onCreateScheme,
}: NewSchemeModalProps) {
  const [customerSearch, setCustomerSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerSuggestions, setCustomerSuggestions] = useState<Customer[]>([]);
  const [isNewCustomer, setIsNewCustomer] = useState(false);
  
  // New customer fields
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerPhone, setNewCustomerPhone] = useState('');
  const [newCustomerEmail, setNewCustomerEmail] = useState('');
  const [verificationLinkSent, setVerificationLinkSent] = useState(false);
  const [verificationCompleted, setVerificationCompleted] = useState(false);
  
  const [planSearch, setPlanSearch] = useState('');
  const [planSuggestions, setPlanSuggestions] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [monthlyDeposit, setMonthlyDeposit] = useState<number | null>(null);
  const planAutoCompleteRef = useRef<any>(null);
  const [showVerifyKYCModal, setShowVerifyKYCModal] = useState(false);
  const [kycCustomer, setKycCustomer] = useState<Customer | null>(null);

  // Calculate final expected amount
  const finalExpectedAmount = useMemo(() => {
    if (!selectedPlan || !monthlyDeposit) return 0;
    return selectedPlan.tenure * monthlyDeposit;
  }, [selectedPlan, monthlyDeposit]);

  // Search plans
  const searchPlans = (event: { query: string }) => {
    const query = event.query.trim().toLowerCase();
    if (query.length === 0) {
      setPlanSuggestions(availablePlans);
      return;
    }
    
    const filtered = availablePlans.filter(
      (plan) =>
        plan.name.toLowerCase().includes(query) ||
        plan.code.toLowerCase().includes(query)
    );
    setPlanSuggestions(filtered);
  };

  const handlePlanSelect = (plan: Plan) => {
    setSelectedPlan(plan);
    setPlanSearch(`${plan.name} (${plan.code})`);
    setPlanSuggestions([]);
    // Automatically set monthly deposit to the plan's minimum monthly investment
    setMonthlyDeposit(plan.minMonthlyInvestment);
  };

  // Search customers - more responsive, triggers on any input
  const searchCustomers = (event: { query: string }) => {
    const query = event.query.trim().toLowerCase();
    if (query.length === 0) {
      setCustomerSuggestions([]);
      return;
    }
    
    const filtered = mockCustomers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(query) ||
        customer.phone.includes(query) ||
        customer.id?.includes(query) ||
        customer.email?.toLowerCase().includes(query)
    );
    setCustomerSuggestions(filtered);
  };

  const handleCustomerSelect = (customer: Customer) => {
    setSelectedCustomer(customer);
    setCustomerSearch(customer.phone);
    setIsNewCustomer(false);
    // Clear all new customer fields since we're using an existing customer
    setNewCustomerName('');
    setNewCustomerPhone('');
    setNewCustomerEmail('');
    setVerificationLinkSent(false);
    setVerificationCompleted(false);
  };

  // Helper function to detect input type
  const detectInputType = (value: string): 'phone' | 'email' | 'name' | null => {
    const trimmed = value.trim();
    if (!trimmed) return null;
    
    // Check if it's a phone number (digits only, 10+ digits)
    const phoneRegex = /^[\d\s\-+()]{10,}$/;
    if (phoneRegex.test(trimmed.replace(/\s/g, ''))) {
      return 'phone';
    }
    
    // Check if it's an email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(trimmed)) {
      return 'email';
    }
    
    // Otherwise, treat as name
    return 'name';
  };

  // Check if customer exists when search changes - show new customer form only when no suggestions and user has typed enough
  useEffect(() => {
    if (!customerSearch || customerSearch.trim().length === 0) {
      setIsNewCustomer(false);
      setNewCustomerName('');
      setNewCustomerPhone('');
      setNewCustomerEmail('');
      // Don't clear selectedCustomer here - let user explicitly clear it
      return;
    }

    // If a customer is already selected, don't show new customer form
    if (selectedCustomer) {
      setIsNewCustomer(false);
      return;
    }

    // If there are suggestions available, don't show new customer form
    if (customerSuggestions.length > 0) {
      setIsNewCustomer(false);
      return;
    }

    // Only show new customer form if user has typed at least 3 characters and no suggestions found
    // Use a small delay to avoid flickering
    const timeoutId = setTimeout(() => {
      if (customerSearch.trim().length >= 3 && customerSuggestions.length === 0 && !selectedCustomer) {
        setIsNewCustomer(true);
        setSelectedCustomer(null);
        
        // Detect input type and populate the corresponding field
        const inputType = detectInputType(customerSearch);
        if (inputType === 'phone') {
          setNewCustomerPhone(customerSearch.trim());
          setNewCustomerName('');
          setNewCustomerEmail('');
        } else if (inputType === 'email') {
          setNewCustomerEmail(customerSearch.trim());
          setNewCustomerName('');
          setNewCustomerPhone('');
        } else {
          setNewCustomerName(customerSearch.trim());
          setNewCustomerPhone('');
          setNewCustomerEmail('');
        }
      } else {
        setIsNewCustomer(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [customerSearch, customerSuggestions.length, selectedCustomer]);


  const handleDone = () => {
    if (selectedPlan && monthlyDeposit) {
      let customer: Customer;
      
      if (selectedCustomer) {
        customer = selectedCustomer;
      } else if (isNewCustomer && newCustomerName && newCustomerPhone && verificationCompleted) {
        customer = {
          name: newCustomerName,
          phone: newCustomerPhone,
          email: newCustomerEmail || undefined,
          avatar: '', // Will be generated or uploaded later
          kycVerified: verificationCompleted,
        };
      } else {
        return; // Invalid form
      }
      
      if (onCreateScheme) {
        onCreateScheme({
          customer,
          plan: selectedPlan,
          monthlyDeposit,
        });
      }
      // Reset form
      handleReset();
      onHide();
    }
  };

  const handleSendVerificationLink = () => {
    // Simulate sending verification link
    console.log('Sending verification link to:', newCustomerPhone || newCustomerEmail);
    setVerificationLinkSent(true);
    // For this mock flow, treat link sent as customer-side verification complete
    // so that we can directly show the "Verify Now" button.
    setVerificationCompleted(true);
    // In real app, this would call an API to send verification link
  };

  const handleKYCVerification = () => {
    // Simulate KYC verification completion
    console.log('Initiating KYC verification for new customer');
    setVerificationCompleted(true);
    // In real app, this would call an API to verify KYC
  };

  const handleReset = () => {
    setCustomerSearch('');
    setSelectedCustomer(null);
    setIsNewCustomer(false);
    setNewCustomerName('');
    setNewCustomerPhone('');
    setNewCustomerEmail('');
    setVerificationLinkSent(false);
    setVerificationCompleted(false);
    setPlanSearch('');
    setSelectedPlan(null);
    setMonthlyDeposit(null);
    setCustomerSuggestions([]);
    setPlanSuggestions([]);
  };

  // Initialize plan suggestions when modal opens
  useEffect(() => {
    if (visible) {
      setPlanSuggestions(availablePlans);
    }
  }, [visible]);

  // Reset state when modal closes
  useEffect(() => {
    if (!visible) {
      handleReset();
    }
  }, [visible]);

  const isFormValid = useMemo(() => {
    const hasValidCustomer = selectedCustomer || (isNewCustomer && newCustomerName && newCustomerPhone && verificationCompleted);
    return hasValidCustomer && selectedPlan && monthlyDeposit && monthlyDeposit >= (selectedPlan?.minMonthlyInvestment || 0);
  }, [selectedCustomer, isNewCustomer, newCustomerName, newCustomerPhone, verificationCompleted, selectedPlan, monthlyDeposit]);

  return (
    <Dialog
      header={
        <div className="flex justify-between items-center w-full">
          <h2 className="text-xl font-bold text-secondary-900 dark:text-white">
            New Scheme
          </h2>
        </div>
      }
      visible={visible}
      onHide={onHide}
      style={{ width: '90vw', maxWidth: '900px' }}
      className="new-scheme-modal"
      modal
      draggable={false}
      resizable={false}
      dismissableMask
      blockScroll
      closable
    >
      <div className="space-y-6">
        {/* Customer Information Section */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-secondary-900 dark:text-white">
            Customer Name, ID or Mobile Number
          </label>
          
          {/* Always show search field */}
          <span className="p-input-icon-left p-input-icon-right w-full relative">
            <i className="pi pi-search absolute left-3 top-8 -translate-y-1/2 text-gray-400 z-10 pointer-events-none" />
            <AutoComplete
              value={customerSearch}
              suggestions={customerSuggestions}
              completeMethod={searchCustomers}
              onChange={(e) => {
                const newValue = e.value;
                setCustomerSearch(newValue);
                
                // If user changes the search value and a customer was selected, clear the selection
                // unless the new value matches the selected customer's phone/name/id
                if (selectedCustomer && newValue) {
                  const matchesSelected = 
                    selectedCustomer.phone === newValue ||
                    selectedCustomer.name.toLowerCase() === newValue.toLowerCase() ||
                    selectedCustomer.id === newValue ||
                    selectedCustomer.email?.toLowerCase() === newValue.toLowerCase();
                  
                  if (!matchesSelected) {
                    setSelectedCustomer(null);
                    setIsNewCustomer(false);
                  }
                }
                
                // Trigger search immediately on input change
                if (newValue && newValue.length > 0) {
                  searchCustomers({ query: newValue });
                } else {
                  setCustomerSuggestions([]);
                  setSelectedCustomer(null);
                  setIsNewCustomer(false);
                }
              }}
              onSelect={(e) => handleCustomerSelect(e.value)}
              placeholder="Search by name, phone, ID, or email"
              className="w-full"
              inputClassName="w-full pl-10 pr-10 text-sm sm:text-base"
              panelClassName="max-h-60 overflow-y-auto"
              minLength={0}
              delay={0}
              showEmptyMessage={false}
              itemTemplate={(customer: Customer) => (
                <div className="flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-secondary-700 cursor-pointer">
                  <Avatar
                    image={customer.avatar}
                    label={customer.name.charAt(0)}
                    shape="circle"
                    className="w-8 h-8 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm sm:text-base truncate">{customer.name}</div>
                    <div className="text-xs sm:text-sm text-gray-500 truncate">{customer.phone}</div>
                    {customer.email && (
                      <div className="text-xs text-gray-400 truncate">{customer.email}</div>
                    )}
                  </div>
                </div>
              )}
              emptyMessage="No customers found"
            />
            {customerSearch && !selectedCustomer && (
              <i className="pi pi-angle-down absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 z-10 pointer-events-none" />
            )}
            {selectedCustomer && (
              <Button
                icon="pi pi-times"
                text
                rounded
                className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 w-6 h-6 z-20"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedCustomer(null);
                  setCustomerSearch('');
                  setIsNewCustomer(false);
                  setNewCustomerName('');
                  setNewCustomerPhone('');
                  setNewCustomerEmail('');
                  setVerificationLinkSent(false);
                  setVerificationCompleted(false);
                }}
              />
            )}
          </span>
          
          {/* Show profile card when customer exists */}
          {selectedCustomer && (
            <div className="flex items-center gap-3 p-4 border border-gray-200 dark:border-secondary-700 rounded-lg bg-gray-50 dark:bg-secondary-800">
              <Avatar
                image={selectedCustomer.avatar}
                label={selectedCustomer.name.charAt(0)}
                shape="circle"
                className="w-14 h-14"
              />
              <div className="flex-1">
                <div className="font-semibold text-base text-secondary-900 dark:text-white">
                  {selectedCustomer.name}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {selectedCustomer.phone}
                </div>
                {selectedCustomer.kycVerified ? (
                  <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 mt-2">
                    <i className="pi pi-check-circle text-xs" />
                    <span>KYC Verification Complete</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 mt-2">
                    <i className="pi pi-exclamation-circle text-xs" />
                    <span>KYC Not Verified</span>
                  </div>
                )}
              </div>
              {!selectedCustomer.kycVerified && (
                <Button
                  label="Verify Now"
                  severity="warning"
                  className="text-sm px-4 py-2 h-auto"
                  onClick={() => {
                    setKycCustomer(selectedCustomer);
                    setShowVerifyKYCModal(true);
                  }}
                />
              )}
            </div>
          )}
          
          {/* Show input fields only when customer doesn't exist */}
          {isNewCustomer && !selectedCustomer && (
            // New Customer Form - Conditional fields
            <div className="space-y-3">
              <div className="flex items-center justify-end">
                <Button
                  icon="pi pi-times"
                  text
                  rounded
                  size="small"
                  className="text-gray-400  hover:text-gray-600"
                  onClick={() => {
                    setIsNewCustomer(false);
                    setCustomerSearch('');
                    setNewCustomerName('');
                    setNewCustomerPhone('');
                    setNewCustomerEmail('');
                    setVerificationLinkSent(false);
                    setVerificationCompleted(false);
                  }}
                  tooltip="Clear and return to search"
                  tooltipOptions={{ position: 'top' }}
                />
              </div>
              
              {/* If phone is entered → show Name and Email */}
              {newCustomerPhone && !newCustomerName && !newCustomerEmail && (
                <>
                  <InputText
                    value={newCustomerName}
                    onChange={(e) => setNewCustomerName(e.target.value)}
                    placeholder="Customer Name"
                    className="w-full"
                  />
                  <InputText
                    value={newCustomerEmail}
                    onChange={(e) => setNewCustomerEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full"
                  />
                </>
              )}
              
              {/* If email is entered → show Name and Phone */}
              {newCustomerEmail && !newCustomerName && !newCustomerPhone && (
                <>
                  <InputText
                    value={newCustomerName}
                    onChange={(e) => setNewCustomerName(e.target.value)}
                    placeholder="Customer Name"
                    className="w-full"
                  />
                  <InputText
                    value={newCustomerPhone}
                    onChange={(e) => setNewCustomerPhone(e.target.value)}
                    placeholder="Phone Number"
                    className="w-full"
                  />
                </>
              )}
              
              {/* If name is entered → show Phone and Email */}
              {newCustomerName && !newCustomerPhone && !newCustomerEmail && (
                <>
                  <InputText
                    value={newCustomerPhone}
                    onChange={(e) => setNewCustomerPhone(e.target.value)}
                    placeholder="Phone Number"
                    className="w-full"
                  />
                  <InputText
                    value={newCustomerEmail}
                    onChange={(e) => setNewCustomerEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full"
                  />
                </>
              )}
              
              {/* Once multiple fields are filled, show all fields */}
              {((newCustomerName && (newCustomerPhone || newCustomerEmail)) ||
                (newCustomerPhone && (newCustomerName || newCustomerEmail)) ||
                (newCustomerEmail && (newCustomerName || newCustomerPhone))) && (
                <>
                  <InputText
                    value={newCustomerName}
                    onChange={(e) => setNewCustomerName(e.target.value)}
                    placeholder="Customer Name"
                    className="w-full"
                  />
                  <InputText
                    value={newCustomerPhone}
                    onChange={(e) => setNewCustomerPhone(e.target.value)}
                    placeholder="Phone Number"
                    className="w-full"
                  />
                  <InputText
                    value={newCustomerEmail}
                    onChange={(e) => setNewCustomerEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full"
                  />
                </>
              )}
              
              {!verificationLinkSent ? (
                <Button
                  label="Send Verification Link"
                  icon="pi pi-send"
                  severity="info"
                  className="text-sm px-4 py-2 w-full"
                  onClick={handleSendVerificationLink}
                  disabled={!newCustomerName || (!newCustomerPhone && !newCustomerEmail)}
                />
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                    <i className="pi pi-check-circle text-sm" />
                    <span className="text-sm">Verification link sent</span>
                  </div>
                  <Button
                    label="Verify Now"
                    icon="pi pi-verified"
                    severity="success"
                    className="text-sm px-4 py-2 w-full"
                    onClick={() => {
                      if (!newCustomerName || !newCustomerPhone) return;
                      setKycCustomer({
                        name: newCustomerName,
                        phone: newCustomerPhone,
                        email: newCustomerEmail || undefined,
                        avatar: '', // placeholder, can be updated later
                        kycVerified: false,
                      });
                      setShowVerifyKYCModal(true);
                    }}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-200 dark:bg-secondary-700 w-full" />

        {/* Scheme Details Section - Split Left and Right */}
        <div className="grid grid-cols-2 gap-6">
          {/* Left Side - Plan/Code and Monthly Deposit */}
          <div className="space-y-4 pr-6 border-r border-gray-200 dark:border-secondary-700">
            {/* Plan / Code */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-secondary-900 dark:text-white">
                Plan / Code<span className="text-red-500">*</span>
              </label>
              <span className="p-input-icon-left p-input-icon-right w-full relative">
                <i className="pi pi-search absolute left-3 top-8 -translate-y-1/2 text-gray-400 z-10 pointer-events-none" />
                <AutoComplete
                  ref={planAutoCompleteRef}
                  value={planSearch}
                  suggestions={planSuggestions}
                  completeMethod={searchPlans}
                  onChange={(e) => {
                    setPlanSearch(e.value);
                    if (e.value && e.value.length > 0) {
                      searchPlans({ query: e.value });
                    } else {
                      setPlanSuggestions(availablePlans);
                    }
                    if (!e.value) {
                      setSelectedPlan(null);
                    }
                  }}
                  onFocus={(e) => {
                    // Show all plans when field is focused/clicked
                    setPlanSuggestions(availablePlans);
                    // Trigger search with empty query to show all plans
                    searchPlans({ query: '' });
                  }}
                  onSelect={(e) => handlePlanSelect(e.value)}
                  placeholder="Search Plan / Code"
                  className="w-full"
                  inputClassName="w-full pl-10 pr-10 text-sm sm:text-base"
                  panelClassName="max-h-60 overflow-y-auto"
                  minLength={0}
                  delay={0}
                  showEmptyMessage={false}
                  itemTemplate={(plan: Plan) => (
                    <div className="p-2 hover:bg-gray-100 dark:hover:bg-secondary-700 cursor-pointer">
                      <div className="font-semibold text-sm">{plan.name} ({plan.code})</div>
                    </div>
                  )}
                  emptyMessage="No plans found"
                />
                {selectedPlan && (
                  <Button
                    icon="pi pi-times"
                    text
                    rounded
                    className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 w-6 h-6 z-20"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPlan(null);
                      setPlanSearch('');
                      setPlanSuggestions([]);
                      // Clear monthly deposit when plan is cleared
                      setMonthlyDeposit(null);
                    }}
                  />
                )}
                {!selectedPlan && (
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 z-10 cursor-pointer hover:text-gray-600 bg-transparent border-0 p-0 flex items-center justify-center w-6 h-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      
                      // Set suggestions first
                      setPlanSuggestions(availablePlans);
                      searchPlans({ query: '' });
                      
                      // Find and click the input field to trigger focus and show panel
                      const input = e.currentTarget.parentElement?.querySelector('input') as HTMLInputElement;
                      if (input) {
                        // Use requestAnimationFrame to ensure state is updated
                        requestAnimationFrame(() => {
                          // Click the input to trigger focus
                          input.click();
                          input.focus();
                        });
                      }
                    }}
                  >
                    <i className="pi pi-angle-down" />
                  </button>
                )}
              </span>
            </div>

            {/* Monthly Deposit Amount */}
            <div>
              <label className="block text-sm font-medium text-secondary-900 dark:text-white mb-2">
                Monthly Deposit Amount<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <InputNumber
                  value={monthlyDeposit}
                  onValueChange={(e) => setMonthlyDeposit(e.value)}
                  mode="currency"
                  currency="INR"
                  locale="en-IN"
                  min={selectedPlan?.minMonthlyInvestment || 100}
                  className="w-full"
                  inputClassName="w-full pr-10"
                  placeholder=""
                  useGrouping={true}
                />
                {monthlyDeposit && (
                  <Button
                    icon="pi pi-times"
                    text
                    rounded
                    className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 w-6 h-6"
                    onClick={() => setMonthlyDeposit(null)}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Right Side - Tenure and Final Amount */}
          <div className="space-y-4 pl-6">
            {/* Tenure */}
            <div>
              <label className="block text-sm font-medium text-secondary-900 dark:text-white mb-2">
                Tenure (Months)
              </label>
              <div className="text-5xl font-bold text-secondary-900 dark:text-white">
                {selectedPlan ? selectedPlan.tenure : '-'}
              </div>
            </div>

            {/* Final Expected Amount */}
            <div>
              <label className="block text-sm font-medium text-secondary-900 dark:text-white mb-2">
                Final Expected Amount
              </label>
              <div className="text-5xl font-bold text-secondary-900 dark:text-white">
                {finalExpectedAmount > 0
                  ? `₹${finalExpectedAmount.toLocaleString('en-IN')}`
                  : '-'}
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-200 dark:bg-secondary-700 w-full" />

        {/* Scheme Rules Section */}
        {selectedPlan && (
          <div className="space-y-3">
            <div className="font-semibold text-lg text-secondary-900 dark:text-white">
              {selectedPlan.name}
            </div>
            <div className="font-medium text-sm text-secondary-700 dark:text-secondary-300">
              Scheme Rules:
            </div>
            <ol className="space-y-1.5 list-decimal list-inside text-sm text-secondary-600 dark:text-secondary-400 pl-4">
              {selectedPlan.rules.map((rule, index) => (
                <li key={index} className="ml-2">{rule}</li>
              ))}
            </ol>
          </div>
        )}

        {/* Footer Button */}
        <div className="flex justify-end pt-4">
          <Button
            label="Done"
            icon="pi pi-check"
            severity="success"
            onClick={handleDone}
            disabled={!isFormValid}
            className="px-6 py-2"
          />
        </div>
      </div>

      {/* KYC Verification Modal */}
      {kycCustomer && (
        <VerifyKYCModal
          customer={kycCustomer}
          visible={showVerifyKYCModal}
          onHide={() => {
            setShowVerifyKYCModal(false);
            setKycCustomer(null);
          }}
          onVerifyComplete={(verified) => {
            if (verified) {
              // If this is an existing selected customer, update their KYC status
              if (selectedCustomer && kycCustomer.id === selectedCustomer.id) {
                setSelectedCustomer({
                  ...selectedCustomer,
                  kycVerified: true,
                });
              }
              // For new customers, verificationCompleted is already true once link is done,
              // so no extra state update is required here.
            }
            setShowVerifyKYCModal(false);
            setKycCustomer(null);
          }}
        />
      )}
    </Dialog>
  );
}
