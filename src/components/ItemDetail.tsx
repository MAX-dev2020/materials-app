import React from 'react';
import { 
  ArrowLeft, 
  Package, 
  History, 
  Warehouse, 
  AlertTriangle, 
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Info,
  Building2,
  Store,
  Home
} from 'lucide-react';
import { ITEMS, STORE_INVENTORY, STORES, TRANSACTIONS, DEPARTMENTS } from '../constants';

interface ItemDetailProps {
  itemId: string;
  onBack: () => void;
  onGoToHub: () => void;
}

export default function ItemDetail({ itemId, onBack, onGoToHub }: ItemDetailProps) {
  const item = ITEMS.find(i => i.id === itemId);
  const itemInventory = STORE_INVENTORY.filter(si => si.itemId === itemId);
  const itemTransactions = TRANSACTIONS.filter(t => t.itemId === itemId);
  const department = DEPARTMENTS.find(d => d.id === item?.departmentId);

  if (!item) return null;

  const isLowStock = item.totalStock <= item.minThreshold;

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-white rounded-xl text-sage-400 hover:text-sage-600 transition-all border border-transparent hover:border-sage-100"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-3xl font-bold text-sage-900">{item.name}</h2>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                isLowStock ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
              }`}>
                {isLowStock ? 'Low Stock' : 'Healthy Stock'}
              </span>
            </div>
            <p className="text-sage-500">{item.category} • {item.unit}</p>
          </div>
        </div>
        <button 
          onClick={onGoToHub}
          className="flex items-center gap-2 text-xs font-bold text-sage-400 hover:text-sage-900 transition-colors uppercase tracking-widest"
        >
          <Home size={16} /> Back to Hub
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Stats & Info */}
        <div className="space-y-6">
          <div className="card-zen p-6 space-y-6">
            <div className="aspect-square bg-sage-50 rounded-2xl flex items-center justify-center overflow-hidden">
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <Package size={80} className="text-sage-200" />
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-sage-50 rounded-2xl">
                <p className="text-[10px] font-bold text-sage-400 uppercase tracking-widest mb-1">Total Stock</p>
                <p className="text-2xl font-bold text-sage-900">{item.totalStock}</p>
                <p className="text-xs text-sage-500">{item.unit}</p>
              </div>
              <div className="p-4 bg-sage-50 rounded-2xl">
                <p className="text-[10px] font-bold text-sage-400 uppercase tracking-widest mb-1">Min Threshold</p>
                <p className="text-2xl font-bold text-sage-900">{item.minThreshold}</p>
                <p className="text-xs text-sage-500">{item.unit}</p>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-sage-50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-sage-50 rounded-lg flex items-center justify-center text-sage-400">
                  <Building2 size={16} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-sage-400 uppercase tracking-widest">Department</p>
                  <p className="text-sm font-medium text-sage-700">{department?.name || 'Not assigned'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-sage-50 rounded-lg flex items-center justify-center text-sage-400">
                  <Store size={16} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-sage-400 uppercase tracking-widest">Primary Store</p>
                  <p className="text-sm font-medium text-sage-700">{item.store || 'Not assigned'}</p>
                </div>
              </div>
            </div>
          </div>

          {isLowStock && (
            <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex gap-3">
              <AlertTriangle className="text-amber-600 flex-shrink-0" size={20} />
              <div>
                <p className="text-sm font-bold text-amber-900">Low Stock Alert</p>
                <p className="text-xs text-amber-700 mt-1">
                  Current stock level is below the minimum threshold of {item.minThreshold} {item.unit}. Consider restocking soon.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Store Inventory */}
        <div className="lg:col-span-2 space-y-8">
          {/* Store Inventory */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-sage-900 flex items-center gap-2">
                <Warehouse size={20} className="text-sage-400" />
                Inventory by Store
              </h3>
            </div>
            <div className="card-zen overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-sage-50/50 border-b border-sage-100">
                    <th className="px-6 py-4 text-xs font-bold text-sage-400 uppercase tracking-widest">Store</th>
                    <th className="px-6 py-4 text-xs font-bold text-sage-400 uppercase tracking-widest text-right">Quantity</th>
                    <th className="px-6 py-4 text-xs font-bold text-sage-400 uppercase tracking-widest">Last Updated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sage-50">
                  {itemInventory.length > 0 ? itemInventory.map((si) => {
                    const store = STORES.find(s => s.id === si.storeId);
                    return (
                      <tr key={si.storeId} className="hover:bg-sage-50/30 transition-colors">
                        <td className="px-6 py-4">
                          <span className="font-bold text-sage-900">{store?.name || si.storeId}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="font-mono font-bold text-sage-700">{si.quantity}</span>
                          <span className="text-xs text-sage-400 ml-1">{item.unit}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs text-sage-400">{new Date(si.lastUpdated).toLocaleDateString()}</span>
                        </td>
                      </tr>
                    );
                  }) : (
                    <tr>
                      <td colSpan={3} className="px-6 py-8 text-center text-sage-400 italic">
                        No stock found in any store.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Transaction History */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-sage-900 flex items-center gap-2">
                <History size={20} className="text-sage-400" />
                Recent History
              </h3>
            </div>
            <div className="card-zen overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-sage-50/50 border-b border-sage-100">
                    <th className="px-6 py-4 text-xs font-bold text-sage-400 uppercase tracking-widest">Type</th>
                    <th className="px-6 py-4 text-xs font-bold text-sage-400 uppercase tracking-widest text-right">Qty</th>
                    <th className="px-6 py-4 text-xs font-bold text-sage-400 uppercase tracking-widest">User</th>
                    <th className="px-6 py-4 text-xs font-bold text-sage-400 uppercase tracking-widest">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sage-50">
                  {itemTransactions.length > 0 ? itemTransactions.map((t) => (
                    <tr key={t.id} className="hover:bg-sage-50/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded flex items-center justify-center ${
                            t.type === 'adjustment' ? 'bg-amber-50 text-amber-600' :
                            t.type === 'transfer' ? 'bg-blue-50 text-blue-600' :
                            'bg-emerald-50 text-emerald-600'
                          }`}>
                            {t.quantity > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                          </div>
                          <span className="text-sm font-bold text-sage-700 capitalize">{t.type}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`font-mono font-bold ${t.quantity > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                          {t.quantity > 0 ? '+' : ''}{t.quantity}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-sage-700">{t.user}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-sage-400">{new Date(t.timestamp).toLocaleDateString()}</span>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-sage-400 italic">
                        No transactions recorded for this item.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
