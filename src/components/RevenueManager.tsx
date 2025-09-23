import React, { useState, useEffect } from 'react';
import { Euro, TrendingUp, Calendar, ArrowUpRight, Download, Settings } from 'lucide-react';
import { useMarketplace } from '../contexts/MarketplaceContext';
import { COMMISSION_CONFIG, STRIPE_CONNECT_CONFIG } from '../config/stripe';

interface RevenueManagerProps {
  isAdmin?: boolean;
}

interface BankTransfer {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  scheduledDate: Date;
  completedDate?: Date;
  description: string;
}

export const RevenueManager: React.FC<RevenueManagerProps> = ({ isAdmin = false }) => {
  const { totalRevenue, monthlyRevenue, transactions, isLoading } = useMarketplace();
  const [transfers, setTransfers] = useState<BankTransfer[]>([]);
  const [autoTransferEnabled, setAutoTransferEnabled] = useState(true);
  const [nextTransferDate, setNextTransferDate] = useState<Date>(new Date());

  // Calculer la prochaine date de transfert
  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    setNextTransferDate(tomorrow);
  }, []);

  // Simuler les transferts bancaires
  useEffect(() => {
    const mockTransfers: BankTransfer[] = [
      {
        id: 'transfer_1',
        amount: 15.67,
        currency: 'eur',
        status: 'completed',
        scheduledDate: new Date('2024-01-15'),
        completedDate: new Date('2024-01-16'),
        description: 'Transfert automatique - Commissions marketplace',
      },
      {
        id: 'transfer_2',
        amount: 23.45,
        currency: 'eur',
        status: 'completed',
        scheduledDate: new Date('2024-01-16'),
        completedDate: new Date('2024-01-17'),
        description: 'Transfert automatique - Commissions marketplace',
      },
      {
        id: 'transfer_3',
        amount: 8.92,
        currency: 'eur',
        status: 'processing',
        scheduledDate: new Date(),
        description: 'Transfert automatique - Commissions marketplace',
      },
    ];

    setTransfers(mockTransfers);
  }, []);

  // Déclencher un transfert manuel
  const triggerManualTransfer = async () => {
    if (totalRevenue <= 0) return;

    const newTransfer: BankTransfer = {
      id: `transfer_${Date.now()}`,
      amount: totalRevenue,
      currency: 'eur',
      status: 'pending',
      scheduledDate: new Date(),
      description: 'Transfert manuel - Commissions marketplace',
    };

    setTransfers(prev => [newTransfer, ...prev]);

    // Simuler le traitement
    setTimeout(() => {
      setTransfers(prev => 
        prev.map(t => 
          t.id === newTransfer.id 
            ? { ...t, status: 'processing' as const }
            : t
        )
      );
    }, 1000);

    setTimeout(() => {
      setTransfers(prev => 
        prev.map(t => 
          t.id === newTransfer.id 
            ? { ...t, status: 'completed' as const, completedDate: new Date() }
            : t
        )
      );
    }, 3000);
  };

  // Exporter les données de revenus
  const exportRevenueData = () => {
    const data = {
      totalRevenue,
      monthlyRevenue,
      commissionRate: COMMISSION_CONFIG.platformFeePercent,
      transactions: transactions.map(t => ({
        date: t.createdAt,
        amount: t.amount,
        commission: t.platformFee,
        track: t.trackId,
      })),
      transfers,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `revenus-findmydj-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: BankTransfer['status']) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'processing': return 'text-blue-600 bg-blue-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: BankTransfer['status']) => {
    switch (status) {
      case 'completed': return 'Terminé';
      case 'processing': return 'En cours';
      case 'pending': return 'En attente';
      case 'failed': return 'Échec';
      default: return 'Inconnu';
    }
  };

  if (!isAdmin) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-8">
          <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Accès Administrateur Requis
          </h3>
          <p className="text-gray-600">
            Cette section est réservée aux administrateurs de la plateforme.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistiques de revenus */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Revenus Totaux</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalRevenue.toFixed(2)} €
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Euro className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <TrendingUp className="h-4 w-4 mr-1" />
            Commission {COMMISSION_CONFIG.platformFeePercent}% sur toutes les ventes
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ce Mois</p>
              <p className="text-2xl font-bold text-gray-900">
                {monthlyRevenue.toFixed(2)} €
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-gray-600">
            <span>Prochain transfert: {nextTransferDate.toLocaleDateString()}</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Transferts Auto</p>
              <p className="text-2xl font-bold text-gray-900">
                {autoTransferEnabled ? 'Activé' : 'Désactivé'}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <ArrowUpRight className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={autoTransferEnabled}
                onChange={(e) => setAutoTransferEnabled(e.target.checked)}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="ml-2 text-sm text-gray-600">
                Transferts quotidiens automatiques
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Actions</h3>
          <div className="flex space-x-3">
            <button
              onClick={exportRevenueData}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </button>
            <button
              onClick={triggerManualTransfer}
              disabled={totalRevenue <= 0 || isLoading}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowUpRight className="h-4 w-4 mr-2" />
              Transfert Manuel
            </button>
          </div>
        </div>
        <p className="text-sm text-gray-600">
          Les transferts automatiques sont programmés quotidiennement vers votre compte bancaire Revolut Business.
          Délai de traitement: {STRIPE_CONNECT_CONFIG.transferSettings.delay_days} jours ouvrés.
        </p>
      </div>

      {/* Historique des transferts */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Historique des Transferts
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Montant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transfers.map((transfer) => (
                <tr key={transfer.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transfer.scheduledDate.toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {transfer.amount.toFixed(2)} €
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(transfer.status)}`}>
                      {getStatusText(transfer.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {transfer.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};