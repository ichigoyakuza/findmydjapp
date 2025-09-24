import React, { useState, useEffect } from 'react';
import { DollarSign, Save, Plus, Trash2, Edit3, Music, Tag } from 'lucide-react';
import { useMarketplace } from '../contexts/MarketplaceContext';
import { useNotification } from './NotificationSystem';
import { useLanguage } from '../contexts/LanguageContext';

interface PriceRule {
  id: string;
  name: string;
  type: 'single' | 'album' | 'remix' | 'exclusive';
  basePrice: number;
  currency: 'EUR' | 'USD';
  description?: string;
}

interface TrackPricing {
  trackId: string;
  trackTitle: string;
  currentPrice: number;
  priceRuleId?: string;
  customPrice?: number;
}

export const PricingManager: React.FC = () => {
  const { tracks, updateTrackPrice } = useMarketplace();
  const { addNotification } = useNotification();
  const { t } = useLanguage();
  const [priceRules, setPriceRules] = useState<PriceRule[]>([
    {
      id: '1',
      name: t('pricing.singleStandard'),
      type: 'single',
      basePrice: 1.99,
      currency: 'EUR',
      description: t('pricing.singleStandardDesc')
    },
    {
      id: '2',
      name: t('pricing.remixPremium'),
      type: 'remix',
      basePrice: 2.99,
      currency: 'EUR',
      description: t('pricing.remixPremiumDesc')
    }
  ]);

  const [trackPricing, setTrackPricing] = useState<TrackPricing[]>([]);
  const [newRule, setNewRule] = useState<Partial<PriceRule>>({
    name: '',
    type: 'single',
    basePrice: 1.99,
    currency: 'EUR',
    description: ''
  });
  const [isAddingRule, setIsAddingRule] = useState(false);
  const [editingRule, setEditingRule] = useState<string | null>(null);

  // Initialiser les prix des tracks
  useEffect(() => {
    if (tracks.length > 0) {
      const pricing = tracks.map(track => ({
        trackId: track.id,
        trackTitle: track.title,
        currentPrice: track.price || 1.99,
        priceRuleId: '1' // Règle par défaut
      }));
      setTrackPricing(pricing);
    }
  }, [tracks]);

  const handleAddRule = () => {
    if (newRule.name && newRule.basePrice) {
      const rule: PriceRule = {
        id: Date.now().toString(),
        name: newRule.name,
        type: newRule.type || 'single',
        basePrice: newRule.basePrice,
        currency: newRule.currency || 'EUR',
        description: newRule.description
      };
      setPriceRules([...priceRules, rule]);
      setNewRule({
        name: '',
        type: 'single',
        basePrice: 1.99,
        currency: 'EUR',
        description: ''
      });
      setIsAddingRule(false);
    }
  };

  const handleDeleteRule = (ruleId: string) => {
    setPriceRules(priceRules.filter(rule => rule.id !== ruleId));
    // Réinitialiser les tracks qui utilisaient cette règle
    setTrackPricing(prev => 
      prev.map(tp => 
        tp.priceRuleId === ruleId 
          ? { ...tp, priceRuleId: '1', currentPrice: 1.99 }
          : tp
      )
    );
  };

  const handleUpdateRule = (ruleId: string, updates: Partial<PriceRule>) => {
    setPriceRules(prev => 
      prev.map(rule => 
        rule.id === ruleId ? { ...rule, ...updates } : rule
      )
    );
    setEditingRule(null);
  };

  const handleTrackPriceChange = (trackId: string, priceRuleId?: string, customPrice?: number) => {
    const rule = priceRules.find(r => r.id === priceRuleId);
    const finalPrice = customPrice || rule?.basePrice || 1.99;

    setTrackPricing(prev =>
      prev.map(tp =>
        tp.trackId === trackId
          ? { ...tp, priceRuleId, customPrice, currentPrice: finalPrice }
          : tp
      )
    );

    // Mettre à jour le contexte marketplace
    updateTrackPrice(trackId, finalPrice);
  };

  const handleSaveAllPrices = () => {
    trackPricing.forEach(tp => {
      updateTrackPrice(tp.trackId, tp.currentPrice);
    });
    addNotification('success', t('notifications.pricesSaved'));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'single': return <Music className="w-4 h-4" />;
      case 'album': return <Music className="w-4 h-4" />;
      case 'remix': return <Edit3 className="w-4 h-4" />;
      case 'exclusive': return <Tag className="w-4 h-4" />;
      default: return <Music className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <DollarSign className="w-6 h-6 text-primary-500" />
          <h2 className="text-2xl font-bold text-white">{t('pricing.title')}</h2>
        </div>
        <button
          onClick={handleSaveAllPrices}
          className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>{t('pricing.saveAll')}</span>
        </button>
      </div>

      {/* Règles de Prix */}
      <div className="bg-dark-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">{t('pricing.priceRules')}</h3>
          <button
            onClick={() => setIsAddingRule(true)}
            className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-3 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>{t('pricing.newRule')}</span>
          </button>
        </div>

        {/* Formulaire d'ajout */}
        {isAddingRule && (
          <div className="bg-dark-700 rounded-lg p-4 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder={t('pricing.ruleName')}
                value={newRule.name}
                onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                className="bg-dark-600 text-white rounded-lg px-3 py-2 border border-dark-500 focus:border-primary-500 focus:outline-none"
              />
              <select
                value={newRule.type}
                onChange={(e) => setNewRule({ ...newRule, type: e.target.value as any })}
                className="bg-dark-600 text-white rounded-lg px-3 py-2 border border-dark-500 focus:border-primary-500 focus:outline-none"
              >
                <option value="single">{t('pricing.single')}</option>
                <option value="album">{t('pricing.album')}</option>
                <option value="remix">{t('pricing.remix')}</option>
                <option value="exclusive">{t('pricing.exclusive')}</option>
              </select>
              <div className="flex space-x-2">
                <input
                  type="number"
                  step="0.01"
                  placeholder={t('pricing.price')}
                  value={newRule.basePrice}
                  onChange={(e) => setNewRule({ ...newRule, basePrice: parseFloat(e.target.value) })}
                  className="bg-dark-600 text-white rounded-lg px-3 py-2 border border-dark-500 focus:border-primary-500 focus:outline-none flex-1"
                />
                <select
                  value={newRule.currency}
                  onChange={(e) => setNewRule({ ...newRule, currency: e.target.value as any })}
                  className="bg-dark-600 text-white rounded-lg px-3 py-2 border border-dark-500 focus:border-primary-500 focus:outline-none"
                >
                  <option value="EUR">EUR</option>
                  <option value="USD">USD</option>
                </select>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleAddRule}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  {t('pricing.add')}
                </button>
                <button
                  onClick={() => setIsAddingRule(false)}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  {t('pricing.cancel')}
                </button>
              </div>
            </div>
            <input
              type="text"
              placeholder={t('pricing.descriptionOptional')}
              value={newRule.description}
              onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
              className="bg-dark-600 text-white rounded-lg px-3 py-2 border border-dark-500 focus:border-primary-500 focus:outline-none w-full mt-2"
            />
          </div>
        )}

        {/* Liste des règles */}
        <div className="space-y-3">
          {priceRules.map((rule) => (
            <div key={rule.id} className="bg-dark-700 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {getTypeIcon(rule.type)}
                <div>
                  <h4 className="text-white font-medium">{rule.name}</h4>
                  <p className="text-gray-400 text-sm">{rule.description}</p>
                </div>
                <div className="text-primary-400 font-semibold">
                  {rule.basePrice.toFixed(2)} {rule.currency}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setEditingRule(rule.id)}
                  className="text-blue-400 hover:text-blue-300 p-2"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteRule(rule.id)}
                  className="text-red-400 hover:text-red-300 p-2"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Prix par Track */}
      <div className="bg-dark-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">{t('pricing.musicPricing')}</h3>
        <div className="space-y-3">
          {trackPricing.map((tp) => (
            <div key={tp.trackId} className="bg-dark-700 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Music className="w-5 h-5 text-primary-400" />
                <div>
                  <h4 className="text-white font-medium">{tp.trackTitle}</h4>
                  <p className="text-gray-400 text-sm">{t('pricing.currentPrice')}: {tp.currentPrice.toFixed(2)} EUR</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <select
                  value={tp.priceRuleId || ''}
                  onChange={(e) => handleTrackPriceChange(tp.trackId, e.target.value)}
                  className="bg-dark-600 text-white rounded-lg px-3 py-2 border border-dark-500 focus:border-primary-500 focus:outline-none"
                >
                  <option value="">{t('pricing.customPrice')}</option>
                  {priceRules.map((rule) => (
                    <option key={rule.id} value={rule.id}>
                      {rule.name} ({rule.basePrice.toFixed(2)} {rule.currency})
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  step="0.01"
                  placeholder={t('pricing.customPricePlaceholder')}
                  value={tp.customPrice || ''}
                  onChange={(e) => handleTrackPriceChange(tp.trackId, tp.priceRuleId, parseFloat(e.target.value) || undefined)}
                  className="bg-dark-600 text-white rounded-lg px-3 py-2 border border-dark-500 focus:border-primary-500 focus:outline-none w-24"
                  disabled={!!tp.priceRuleId}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-dark-800 rounded-xl p-6">
          <h4 className="text-white font-medium mb-2">{t('pricing.averagePrice')}</h4>
          <p className="text-2xl font-bold text-primary-400">
            {trackPricing.length > 0 
              ? (trackPricing.reduce((sum, tp) => sum + tp.currentPrice, 0) / trackPricing.length).toFixed(2)
              : '0.00'
            } EUR
          </p>
        </div>
        <div className="bg-dark-800 rounded-xl p-6">
          <h4 className="text-white font-medium mb-2">{t('pricing.estimatedRevenue')}</h4>
          <p className="text-2xl font-bold text-green-400">
            {(trackPricing.reduce((sum, tp) => sum + tp.currentPrice, 0) * 0.98).toFixed(2)} EUR
          </p>
          <p className="text-gray-400 text-sm">{t('pricing.afterCommission')}</p>
        </div>
        <div className="bg-dark-800 rounded-xl p-6">
          <h4 className="text-white font-medium mb-2">{t('pricing.configuredMusic')}</h4>
          <p className="text-2xl font-bold text-blue-400">{trackPricing.length}</p>
        </div>
      </div>
    </div>
  );
};