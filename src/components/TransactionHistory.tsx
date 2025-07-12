import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Transaction, apiService } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { useDevMode } from '@/hooks/useDevMode';
import { formatDistanceToNow } from 'date-fns';
import { ArrowUpCircle, ArrowDownCircle, Gift, CreditCard } from 'lucide-react';

const DEV_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    amount: 85,
    type: 'purchase',
    description: 'Gem Package - Small',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
  },
  {
    id: '2',
    amount: -20,
    type: 'spend',
    description: 'Premium Video - Isabella',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString()
  },
  {
    id: '3',
    amount: 10,
    type: 'reward',
    description: 'Daily Login Bonus',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString()
  },
  {
    id: '4',
    amount: -15,
    type: 'spend',
    description: 'Custom Image - Aria',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString()
  }
];

export const TransactionHistory = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { isDevMode } = useDevMode();

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      
      if (isDevMode) {
        // Use mock data in dev mode
        setTimeout(() => {
          setTransactions(DEV_TRANSACTIONS);
          setLoading(false);
        }, 500);
        return;
      }

      if (user?.id) {
        const data = await apiService.getTransactionHistory(user.id);
        setTransactions(data);
      }
      setLoading(false);
    };

    fetchTransactions();
  }, [user?.id, isDevMode]);

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'purchase':
        return <CreditCard className="w-4 h-4 text-green-500" />;
      case 'reward':
        return <Gift className="w-4 h-4 text-blue-500" />;
      case 'spend':
        return <ArrowDownCircle className="w-4 h-4 text-red-500" />;
      default:
        return <ArrowUpCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getAmountColor = (amount: number) => {
    return amount > 0 ? 'text-green-500' : 'text-red-500';
  };

  if (loading) {
    return (
      <div className="py-8">
        <LoadingSpinner text="Loading transaction history..." />
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <Card className="card-premium p-6 text-center">
        <p className="text-muted-foreground">No transactions yet</p>
        <p className="text-sm text-muted-foreground mt-1">
          Your gem purchases and spending will appear here
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.map((transaction) => (
        <Card key={transaction.id} className="card-premium p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getTransactionIcon(transaction.type)}
              <div>
                <div className="text-sm font-medium text-foreground">
                  {transaction.description}
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(transaction.created_at), { addSuffix: true })}
                </div>
              </div>
            </div>
            <div className={`text-sm font-bold ${getAmountColor(transaction.amount)}`}>
              {transaction.amount > 0 ? '+' : ''}{transaction.amount} gems
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};