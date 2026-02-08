/**
 * New Order Modal Component
 */

import { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { AutoComplete } from 'primereact/autocomplete';
import { formatCurrency } from '@/utils/format';
import { PaymentMethodModal } from './PaymentMethodModal';

interface Customer {
  name: string;
  phone: string;
  avatar: string;
  id?: string;
}

interface ScannedItem {
  id: string;
  name: string;
  image: string;
  price: number;
  weight: string;
  barcode: string;
}

interface NewOrderModalProps {
  visible: boolean;
  onHide: () => void;
  onPaymentMethodSelect?: (orderData: {
    customer: { name: string; phone: string; avatar?: string };
    items: Array<{ id: string; name: string; image: string; price: number; weight: string; barcode: string }>;
    paymentMethod: string;
    totalValue: number;
  }) => void;
}

export function NewOrderModal({
  visible,
  onHide,
  onPaymentMethodSelect,
}: NewOrderModalProps) {
  const [customerSearch, setCustomerSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerPhone, setNewCustomerPhone] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [scannedItems, setScannedItems] = useState<ScannedItem[]>([
    {
      id: '1',
      name: 'Rose Gold Chain with Infinity Pendant Coral Embed',
      image: 'assets/jewels/j1.png',
      price: 2500,
      weight: '5g',
      barcode: '202511051133001',
    },
    {
      id: '2',
      name: 'Rose Gold Chain with Infinity Pendant Coral Embed',
      image: 'assets/jewels/j1.png',
      price: 2500,
      weight: '5g',
      barcode: '202511051133001',
    },
  ]);
  const [customerSuggestions, setCustomerSuggestions] = useState<Customer[]>([]);

  // Mock customer data - in real app, this would come from an API
  const mockCustomers: Customer[] = [
    {
      name: 'Angel Rosser',
      phone: '9876543210',
      avatar: 'assets/users/u2.jpg',
      id: '1',
    },
    {
      name: 'Tatiana Workman',
      phone: '9876543211',
      avatar: 'assets/users/u3.jpg',
      id: '2',
    },
    {
      name: 'James Geidt',
      phone: '9876543212',
      avatar: 'assets/users/u4.jpg',
      id: '3',
    },
    {
      name: 'Ahmad Franci',
      phone: '9876543213',
      avatar: 'assets/users/u5.jpg',
      id: '4',
    },
  ];

  const searchCustomers = (event: { query: string }) => {
    const query = event.query.toLowerCase();
    const filtered = mockCustomers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(query) ||
        customer.phone.includes(query) ||
        customer.id?.includes(query)
    );
    setCustomerSuggestions(filtered);
    
    // Check if query doesn't match any existing customer
    // Only set as new customer if there's a query and no matches
    if (query && filtered.length === 0) {
      setIsNewCustomer(true);
      // Update newCustomerPhone with the full query value
      setNewCustomerPhone(event.query); // Use original query, not lowercased
    } else if (filtered.length > 0) {
      // If matches found, reset new customer state
      setIsNewCustomer(false);
    }
  };

  const handleCustomerSelect = (customer: Customer) => {
    setSelectedCustomer(customer);
    setCustomerSearch('');
    setIsNewCustomer(false);
    setNewCustomerName('');
    setNewCustomerPhone('');
  };

  const handleCustomerSearchChange = (value: string) => {
    setCustomerSearch(value);
    if (!value) {
      setIsNewCustomer(false);
      setNewCustomerName('');
      setNewCustomerPhone('');
      setSelectedCustomer(null);
    } else {
      // Update newCustomerPhone when user is typing in search field
      // This ensures the full mobile number is captured
      if (isNewCustomer) {
        setNewCustomerPhone(value);
      }
    }
  };

  const handleChoosePayment = () => {
    setShowPaymentModal(true);
  };

  const handlePaymentConfirm = (orderData: {
    customer: { name: string; phone: string; avatar?: string };
    items: Array<{ id: string; name: string; image: string; price: number; weight: string; barcode: string }>;
    paymentMethod: string;
    totalValue: number;
  }) => {
    // Pass order data to parent component
    if (onPaymentMethodSelect) {
      onPaymentMethodSelect(orderData);
    }
    
    setShowPaymentModal(false);
  };

  // Reset state when modal closes
  useEffect(() => {
    if (!visible) {
      setSelectedCustomer(null);
      setCustomerSearch('');
      setIsNewCustomer(false);
      setNewCustomerName('');
      setNewCustomerPhone('');
      setShowPaymentModal(false);
    }
  }, [visible]);

  const handleRemoveItem = (itemId: string) => {
    setScannedItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const handleBarcodeChange = (itemId: string, barcode: string) => {
    setScannedItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, barcode } : item))
    );
  };

  const totalValue = scannedItems.reduce((sum, item) => sum + item.price, 0);
  const stocksScanned = scannedItems.length;

  // Determine if payment button should be enabled
  const isPaymentButtonEnabled = 
    scannedItems.length > 0 && 
    (selectedCustomer !== null || (isNewCustomer && newCustomerName.trim().length > 0));

  // Get customer info for payment modal
  const getCustomerForPayment = (): { name: string; phone: string; avatar?: string } => {
    if (selectedCustomer) {
      return {
        name: selectedCustomer.name,
        phone: selectedCustomer.phone,
        avatar: selectedCustomer.avatar,
      };
    }
    return {
      name: newCustomerName,
      phone: newCustomerPhone || customerSearch,
      avatar: undefined,
    };
  };

  return (
    <Dialog
      header={
        <div className="flex justify-between items-center w-full">
          <h2 className="text-xl font-bold text-secondary-900 dark:text-white">
            New Order
          </h2>
        </div>
      }
      visible={visible}
      onHide={onHide}
      style={{ width: '90vw', maxWidth: '800px' }}
      className="new-order-modal"
      modal
      draggable={false}
      resizable={false}
      dismissableMask
      blockScroll
    >
      <div className="space-y-6">
        {/* Customer Information */}
        <div>
          {!isNewCustomer && (
            <label className="block text-sm font-medium text-secondary-900 dark:text-white mb-2">
              Customer Name, ID or Mobile Number
            </label>
          )}
          {!selectedCustomer && !isNewCustomer ? (
            <span className="p-input-icon-right w-full">
              <AutoComplete
                value={customerSearch}
                suggestions={customerSuggestions}
                completeMethod={searchCustomers}
                onChange={(e) => handleCustomerSearchChange(e.value)}
                onSelect={(e) => handleCustomerSelect(e.value)}
                placeholder="Enter id,mobile number or name"
                className="w-full"
                itemTemplate={(customer: Customer) => (
                  <div className="flex items-center gap-3 p-2">
                    <img
                      src={customer.avatar}
                      alt={customer.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <div className="font-semibold">{customer.name}</div>
                      <div className="text-sm text-gray-500">{customer.phone}</div>
                    </div>
                  </div>
                )}
              />
            </span>
          ) : selectedCustomer ? (
            <div className="flex items-center gap-3 p-3 border border-gray-200 dark:border-secondary-700 rounded-lg bg-gray-50 dark:bg-secondary-800">
              <img
                src={selectedCustomer.avatar}
                alt={selectedCustomer.name}
                className="w-12 h-12 rounded-full"
              />
              <div className="flex-1">
                <div className="font-semibold text-secondary-900 dark:text-white">
                  {selectedCustomer.name}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedCustomer.phone}
                </div>
              </div>
              <Button
                icon="pi pi-times"
                text
                rounded
                onClick={() => {
                  setSelectedCustomer(null);
                  setCustomerSearch('');
                  setIsNewCustomer(false);
                  setNewCustomerName('');
                  setNewCustomerPhone('');
                }}
                className="text-gray-500 hover:text-gray-700"
              />
            </div>
          ) : (
            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-secondary-900 dark:text-white mb-2">
                  Mobile Number or ID
                </label>
                <InputText
                  value={newCustomerPhone || customerSearch}
                  onChange={(e) => {
                    const value = e.target.value;
                    setNewCustomerPhone(value);
                    setCustomerSearch(value);
                    
                    if (!value) {
                      // If field is cleared, reset to initial search state
                      setIsNewCustomer(false);
                      setNewCustomerName('');
                      setCustomerSuggestions([]);
                    } else {
                      // Check if this value matches any existing customer
                      const query = value.toLowerCase();
                      const filtered = mockCustomers.filter(
                        (customer) =>
                          customer.name.toLowerCase().includes(query) ||
                          customer.phone.includes(query) ||
                          customer.id?.includes(query)
                      );
                      if (filtered.length > 0) {
                        // Matches found - switch back to autocomplete mode
                        setIsNewCustomer(false);
                        setCustomerSuggestions(filtered);
                      } else {
                        // No matches - stay in new customer mode
                        setIsNewCustomer(true);
                        setCustomerSuggestions([]);
                      }
                    }
                  }}
                  placeholder="Enter mobile number or ID"
                  className="w-full"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-secondary-900 dark:text-white mb-2">
                  Enter Customer Name
                </label>
                <InputText
                  value={newCustomerName}
                  onChange={(e) => setNewCustomerName(e.target.value)}
                  placeholder="Enter customer name"
                  className="w-full"
                />
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-secondary-800 rounded-lg border border-gray-200 dark:border-secondary-700">
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Stocks Scanned</div>
            <div className="text-xl font-bold text-secondary-900 dark:text-white">
              {stocksScanned}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total Value (Excl. Taxes)
            </div>
            <div className="text-xl font-bold text-secondary-900 dark:text-white">
              {formatCurrency(totalValue)}
            </div>
          </div>
        </div>

        {/* Scan Now Section */}
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center gap-3">
            <i className="pi pi-qrcode text-2xl text-green-600 dark:text-green-400" />
            <div>
              <div className="font-semibold text-green-700 dark:text-green-300">
                Scan Now
              </div>
              <div className="text-sm text-green-600 dark:text-green-400">
                Use the barcode scanner and scan the barcode on your product's tag
              </div>
            </div>
          </div>
        </div>

        {/* Scanned Items List */}
        <div>
          {scannedItems.map((item, index) => (
            <div key={item.id}>
              <div className="flex gap-4 py-4">
                {/* Item Number */}
                <div className="flex-shrink-0 w-8 text-lg font-semibold text-secondary-900 dark:text-white">
                  {index + 1}.
                </div>

                {/* Item Image */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                />

                {/* Item Details */}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-lg text-secondary-900 dark:text-white mb-1">
                    {item.name}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {item.weight}
                  </div>
                  <div className="text-lg font-bold text-secondary-900 dark:text-white mb-3">
                    {formatCurrency(item.price)}
                  </div>

                  {/* Barcode Input */}
                  <div className="relative">
                    <InputText
                      value={item.barcode}
                      onChange={(e) => handleBarcodeChange(item.id, e.target.value)}
                      placeholder="Enter barcode/SKU"
                      className="w-full pr-8"
                    />
                    {item.barcode && (
                      <Button
                        icon="pi pi-times"
                        text
                        rounded
                        className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        onClick={() => handleBarcodeChange(item.id, '')}
                      />
                    )}
                  </div>
                </div>

                {/* Remove Button */}
                <Button
                  icon="pi pi-minus"
                  rounded
                  severity="danger"
                  className="flex-shrink-0"
                  onClick={() => handleRemoveItem(item.id)}
                />
              </div>
              {index < scannedItems.length - 1 && (
                <div className="h-px bg-gray-200 dark:bg-secondary-700 w-full" />
              )}
            </div>
          ))}
        </div>

        {/* Footer Button */}
        <div className="pt-4 border-t border-gray-200 dark:border-secondary-700">
          <Button
            label="Choose Payment Method"
            icon="pi pi-wallet"
            severity="warning"
            className="w-full"
            onClick={handleChoosePayment}
            disabled={!isPaymentButtonEnabled}
          />
        </div>
      </div>

      {/* Payment Method Modal */}
      <PaymentMethodModal
        visible={showPaymentModal}
        onHide={() => setShowPaymentModal(false)}
        customer={getCustomerForPayment()}
        totalUnits={stocksScanned}
        totalValue={totalValue}
        items={scannedItems}
        onConfirm={handlePaymentConfirm}
      />
    </Dialog>
  );
}
