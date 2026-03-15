/**
 * Scan Stock Modal - Barcode scanning for order items
 * Figma nodes: 397:28722, 397:32485, 397:31905
 */

import { useState, useMemo, useCallback } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Icon } from '@/components/ui/Icon';
import { PrimeReactIcon } from '@/components/ui/Icon/PrimeReactIcon';
import { formatCurrency } from '@/utils/format';
import type { Order } from '@/features/orders/types';

interface ScannedStock {
  id: string;
  barcode: string;
}

interface ScanStockModalProps {
  order: Order;
  visible: boolean;
  onHide: () => void;
  onDone: (stockIds: string[]) => void;
}

export function ScanStockModal({
  order,
  visible,
  onHide,
  onDone,
}: ScanStockModalProps) {
  // Component is conditionally rendered (mounted/unmounted) by parent,
  // so initializing from order.items on mount is safe
  const initialStocks = useMemo(() => {
    const existing: ScannedStock[] = [];
    order.items?.forEach((item) => {
      item.stockIds?.forEach((stockId) => {
        existing.push({ id: `${item.id}-${stockId}`, barcode: stockId });
      });
    });
    return existing;
  }, [order.items]);

  const [scannedStocks, setScannedStocks] = useState<ScannedStock[]>(initialStocks);
  const [currentBarcode, setCurrentBarcode] = useState('');

  const handleAddBarcode = useCallback(() => {
    if (!currentBarcode.trim()) { return; }
    setScannedStocks((prev) => [
      ...prev,
      { id: `scan-${Date.now()}`, barcode: currentBarcode.trim() },
    ]);
    setCurrentBarcode('');
  }, [currentBarcode]);

  const handleRemoveStock = useCallback((id: string) => {
    setScannedStocks((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const handleBarcodeKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleAddBarcode();
      }
    },
    [handleAddBarcode],
  );

  const handleDone = useCallback(() => {
    const stockIds = scannedStocks.map((s) => s.barcode);
    onDone(stockIds);
    onHide();
  }, [scannedStocks, onDone, onHide]);

  const totalItems = order.items?.length ?? 0;
  const totalValue = order.items?.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0,
  ) ?? 0;

  return (
    <Dialog
      header={
        <h2 className="text-xl-bold text-secondary-900 dark:text-white">
          Scan Stock — {order.orderId}
        </h2>
      }
      visible={visible}
      onHide={onHide}
      style={{ width: '90vw', maxWidth: '700px' }}
      className="scan-stock-modal"
      modal
      draggable={false}
      resizable={false}
      dismissableMask
      blockScroll
    >
      <div className="space-y-6">
        {/* Customer Info */}
        <div className="flex items-center gap-3 p-4 bg-surface-ground dark:bg-secondary-800 rounded-lg">
          <img
            src={order.customer.avatar}
            alt={order.customer.name}
            className="w-12 h-12 rounded-lg border-2 border-success object-cover"
          />
          <div className="flex-1">
            <div className="text-base-semibold text-secondary-900 dark:text-white">
              {order.customer.name}
            </div>
            <div className="text-sm-normal text-secondary-500 dark:text-secondary-400">
              {order.customer.phone}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm-normal text-secondary-600 dark:text-secondary-400">
              {totalItems} {totalItems === 1 ? 'Item' : 'Items'}
            </div>
            <div className="text-base-semibold text-secondary-900 dark:text-white">
              {formatCurrency(totalValue)}
            </div>
          </div>
        </div>

        {/* Stocks Scanned Count */}
        <div className="flex items-center justify-between px-4 py-3 bg-surface-ground dark:bg-secondary-800 rounded-lg">
          <span className="text-sm-semibold text-secondary-700 dark:text-secondary-300">
            Stocks Scanned
          </span>
          <span className="text-xl-bold text-secondary-900 dark:text-white">
            {scannedStocks.length}
          </span>
        </div>

        {/* Scan Now Banner */}
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center gap-3">
            <Icon
              name="qr_code_scanner"
              size={24}
              className="text-green-600 dark:text-green-400"
            />
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

        {/* Manual Barcode Input */}
        <div className="flex items-center gap-3">
          <InputText
            value={currentBarcode}
            onChange={(e) => { setCurrentBarcode(e.target.value); }}
            onKeyDown={handleBarcodeKeyDown}
            placeholder="Enter barcode / SKU manually"
            className="flex-1"
            aria-label="Enter barcode"
          />
          <Button
            icon={<PrimeReactIcon name="add" size={20} />}
            onClick={handleAddBarcode}
            disabled={!currentBarcode.trim()}
            aria-label="Add barcode"
          />
        </div>

        {/* Scanned Items List */}
        {scannedStocks.length > 0 && (
          <div className="space-y-2">
            {scannedStocks.map((stock, idx) => (
              <div
                key={stock.id}
                className="flex items-center gap-3 p-3 rounded-lg border border-border-default dark:border-secondary-700 bg-white dark:bg-secondary-800"
              >
                <span className="text-sm-normal text-secondary-500 dark:text-secondary-400 w-6 shrink-0">
                  {idx + 1}
                </span>
                <span className="flex-1 text-sm-medium text-secondary-900 dark:text-white font-mono">
                  {stock.barcode}
                </span>
                <Button
                  icon={<PrimeReactIcon name="remove" size={18} />}
                  text
                  rounded
                  severity="danger"
                  onClick={() => { handleRemoveStock(stock.id); }}
                  aria-label={`Remove barcode ${stock.barcode}`}
                />
              </div>
            ))}
          </div>
        )}

        {/* Done Button */}
        <div className="flex justify-end pt-4 border-t border-border-default dark:border-secondary-700">
          <Button
            label="Done"
            icon={<PrimeReactIcon name="check" size={20} />}
            severity="success"
            onClick={handleDone}
            aria-label="Done scanning"
          />
        </div>
      </div>
    </Dialog>
  );
}
