/**
 * New Order Modal - Customer search, scan items, choose payment
 * Figma node: 397:31905
 */

import { useState, useCallback } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { AutoComplete } from 'primereact/autocomplete';
import { PrimeReactIcon } from '@/components/ui/Icon/PrimeReactIcon';
import { Icon } from '@/components/ui/Icon';
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

// Mock customer data — replaced by API in future
const mockCustomers: Customer[] = [
  { name: 'Angel Rosser', phone: '9876543210', avatar: 'assets/users/u2.jpg', id: '1' },
  { name: 'Tatiana Workman', phone: '9876543211', avatar: 'assets/users/u3.jpg', id: '2' },
  { name: 'James Geidt', phone: '9876543212', avatar: 'assets/users/u4.jpg', id: '3' },
  { name: 'Ahmad Franci', phone: '9876543213', avatar: 'assets/users/u5.jpg', id: '4' },
];

const defaultScannedItems: ScannedItem[] = [
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
];

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
  const [scannedItems, setScannedItems] = useState<ScannedItem[]>(defaultScannedItems);
  const [customerSuggestions, setCustomerSuggestions] = useState<Customer[]>([]);

  const resetState = useCallback(() => {
    setSelectedCustomer(null);
    setCustomerSearch('');
    setIsNewCustomer(false);
    setNewCustomerName('');
    setNewCustomerPhone('');
    setShowPaymentModal(false);
    setScannedItems(defaultScannedItems);
  }, []);

  const handleHide = useCallback(() => {
    resetState();
    onHide();
  }, [resetState, onHide]);

  const searchCustomers = useCallback((event: { query: string }) => {
    const query = event.query.toLowerCase();
    const filtered = mockCustomers.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.phone.includes(query) ||
        c.id?.includes(query),
    );
    setCustomerSuggestions(filtered);

    if (query && filtered.length === 0) {
      setIsNewCustomer(true);
      setNewCustomerPhone(event.query);
    } else if (filtered.length > 0) {
      setIsNewCustomer(false);
    }
  }, []);

  const handleCustomerSelect = useCallback((customer: Customer) => {
    setSelectedCustomer(customer);
    setCustomerSearch('');
    setIsNewCustomer(false);
    setNewCustomerName('');
    setNewCustomerPhone('');
  }, []);

  const handleCustomerSearchChange = useCallback(
    (value: string) => {
      setCustomerSearch(value);
      if (!value) {
        setIsNewCustomer(false);
        setNewCustomerName('');
        setNewCustomerPhone('');
        setSelectedCustomer(null);
      } else if (isNewCustomer) {
        setNewCustomerPhone(value);
      }
    },
    [isNewCustomer],
  );

  const handleRemoveItem = useCallback((itemId: string) => {
    setScannedItems((prev) => prev.filter((item) => item.id !== itemId));
  }, []);

  const handleBarcodeChange = useCallback((itemId: string, barcode: string) => {
    setScannedItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, barcode } : item)),
    );
  }, []);

  const handlePaymentConfirm = useCallback(
    (orderData: {
      customer: { name: string; phone: string; avatar?: string };
      items: Array<{ id: string; name: string; image: string; price: number; weight: string; barcode: string }>;
      paymentMethod: string;
      totalValue: number;
    }) => {
      if (onPaymentMethodSelect) {
        onPaymentMethodSelect(orderData);
      }
      setShowPaymentModal(false);
    },
    [onPaymentMethodSelect],
  );

  const totalValue = scannedItems.reduce((sum, item) => sum + item.price, 0);
  const stocksScanned = scannedItems.length;

  const isPaymentButtonEnabled =
    scannedItems.length > 0 &&
    (selectedCustomer !== null || (isNewCustomer && newCustomerName.trim().length > 0));

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
        <h2 className="text-xl-bold text-secondary-900 dark:text-white">
          New Order
        </h2>
      }
      visible={visible}
      onHide={handleHide}
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
            <label className="block text-sm-semibold text-secondary-900 dark:text-white mb-2">
              Customer Name, ID or Mobile Number
            </label>
          )}
          {!selectedCustomer && !isNewCustomer ? (
            <AutoComplete
              value={customerSearch}
              suggestions={customerSuggestions}
              completeMethod={searchCustomers}
              onChange={(e) => { handleCustomerSearchChange(e.value); }}
              onSelect={(e) => { handleCustomerSelect(e.value); }}
              placeholder="Enter id, mobile number or name"
              className="w-full"
              itemTemplate={(customer: Customer) => (
                <div className="flex items-center gap-3 p-2">
                  <img
                    src={customer.avatar}
                    alt={customer.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <div className="text-base-semibold">{customer.name}</div>
                    <div className="text-sm-normal text-secondary-500">{customer.phone}</div>
                  </div>
                </div>
              )}
            />
          ) : selectedCustomer ? (
            <div className="flex items-center gap-3 p-3 border border-border-default dark:border-secondary-700 rounded-lg bg-surface-ground dark:bg-secondary-800">
              <img
                src={selectedCustomer.avatar}
                alt={selectedCustomer.name}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div className="flex-1">
                <div className="text-base-semibold text-secondary-900 dark:text-white">
                  {selectedCustomer.name}
                </div>
                <div className="text-sm-normal text-secondary-500 dark:text-secondary-400">
                  {selectedCustomer.phone}
                </div>
              </div>
              <Button
                icon={<PrimeReactIcon name="close" size={20} />}
                text
                rounded
                onClick={() => {
                  setSelectedCustomer(null);
                  setCustomerSearch('');
                }}
                aria-label="Remove customer"
              />
            </div>
          ) : (
            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <label className="block text-sm-semibold text-secondary-900 dark:text-white mb-2">
                  Mobile Number or ID
                </label>
                <InputText
                  value={newCustomerPhone || customerSearch}
                  onChange={(e) => {
                    const value = e.target.value;
                    setNewCustomerPhone(value);
                    setCustomerSearch(value);
                    if (!value) {
                      setIsNewCustomer(false);
                      setNewCustomerName('');
                    }
                  }}
                  placeholder="Enter mobile number or ID"
                  className="w-full"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm-semibold text-secondary-900 dark:text-white mb-2">
                  Enter Customer Name
                </label>
                <InputText
                  value={newCustomerName}
                  onChange={(e) => { setNewCustomerName(e.target.value); }}
                  placeholder="Enter customer name"
                  className="w-full"
                />
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="flex justify-between items-center p-4 bg-surface-ground dark:bg-secondary-800 rounded-lg border border-border-default dark:border-secondary-700">
          <div>
            <div className="text-sm-normal text-secondary-600 dark:text-secondary-400">Stocks Scanned</div>
            <div className="text-xl-bold text-secondary-900 dark:text-white">
              {stocksScanned}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm-normal text-secondary-600 dark:text-secondary-400">
              Total Value (Excl. Taxes)
            </div>
            <div className="text-xl-bold text-secondary-900 dark:text-white">
              {formatCurrency(totalValue)}
            </div>
          </div>
        </div>

        {/* Scan Now Section */}
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center gap-3">
            <Icon name="qr_code_scanner" size={24} className="text-green-600 dark:text-green-400" />
            <div>
              <div className="text-base-semibold text-green-700 dark:text-green-300">
                Scan Now
              </div>
              <div className="text-sm-normal text-green-600 dark:text-green-400">
                Use the barcode scanner and scan the barcode on your product&apos;s tag
              </div>
            </div>
          </div>
        </div>

        {/* Scanned Items List */}
        <div>
          {scannedItems.map((item, index) => (
            <div key={item.id}>
              <div className="flex gap-4 py-4">
                <div className="shrink-0 w-8 text-lg-semibold text-secondary-900 dark:text-white">
                  {index + 1}.
                </div>
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 rounded-lg object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-lg-semibold text-secondary-900 dark:text-white mb-1">
                    {item.name}
                  </div>
                  <div className="text-sm-normal text-secondary-600 dark:text-secondary-400 mb-2">
                    {item.weight}
                  </div>
                  <div className="text-lg-bold text-secondary-900 dark:text-white mb-3">
                    {formatCurrency(item.price)}
                  </div>
                  <div className="relative">
                    <InputText
                      value={item.barcode}
                      onChange={(e) => { handleBarcodeChange(item.id, e.target.value); }}
                      placeholder="Enter barcode/SKU"
                      className="w-full pr-8"
                    />
                    {item.barcode && (
                      <Button
                        icon={<PrimeReactIcon name="close" size={20} />}
                        text
                        rounded
                        className="absolute right-1 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
                        onClick={() => { handleBarcodeChange(item.id, ''); }}
                        aria-label="Clear barcode"
                      />
                    )}
                  </div>
                </div>
                <Button
                  icon={<PrimeReactIcon name="remove" size={20} />}
                  rounded
                  severity="danger"
                  className="shrink-0"
                  onClick={() => { handleRemoveItem(item.id); }}
                  aria-label={`Remove ${item.name}`}
                />
              </div>
              {index < scannedItems.length - 1 && (
                <div className="h-px bg-border-default dark:bg-secondary-700 w-full" />
              )}
            </div>
          ))}
        </div>

        {/* Footer Button */}
        <div className="pt-4 border-t border-border-default dark:border-secondary-700">
          <Button
            label="Choose Payment Method"
            icon={<PrimeReactIcon name="account_balance_wallet" size={20} />}
            severity="warning"
            className="w-full"
            onClick={() => { setShowPaymentModal(true); }}
            disabled={!isPaymentButtonEnabled}
            aria-label="Choose payment method"
          />
        </div>
      </div>

      {/* Payment Method Modal */}
      <PaymentMethodModal
        visible={showPaymentModal}
        onHide={() => { setShowPaymentModal(false); }}
        customer={getCustomerForPayment()}
        totalUnits={stocksScanned}
        totalValue={totalValue}
        items={scannedItems}
        onConfirm={handlePaymentConfirm}
      />
    </Dialog>
  );
}
