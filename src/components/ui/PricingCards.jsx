import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import Button from './Button';
import Badge from './Badge';
import { paymentService } from '../../services/paymentService';
import { ROUTES } from '../../config/constants';
import { cn } from '../../lib/utils';

const PricingCard = ({ plan, featured = false }) => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    // Navigate to login page - user needs to be authenticated to purchase
    navigate(ROUTES.LOGIN);
  };

  return (
    <div
      className={cn(
        'flex flex-col rounded-2xl border p-6 text-left transition-all duration-300',
        'bg-gradient-to-br backdrop-blur-lg',
        featured
          ? 'border-[#c084fc] shadow-lg shadow-purple-500/20 ring-2 ring-[#c084fc]/20 from-purple-900/40 to-purple-800/30'
          : 'border-purple-500/30 from-purple-900/20 to-purple-950/20 hover:border-purple-400/50'
      )}
      aria-label={`${plan.name} plan`}
    >
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 mb-4">
          <Badge variant={featured ? 'primary' : 'neutral'} size="md">
            {plan.name}
          </Badge>
          {featured && (
            <span className="rounded-full bg-[#7c3aed]/20 px-3 py-1 text-xs font-semibold text-[#c084fc] border border-[#c084fc]/30">
              Most Popular
            </span>
          )}
        </div>

        {/* Price */}
        <h4 className="mb-2 text-4xl font-bold bg-gradient-to-r from-[#7c3aed] to-[#c084fc] bg-clip-text text-transparent">
          ₹{(plan.amount / 100).toLocaleString()}
        </h4>
        
        {/* Credits */}
        <p className="text-sm text-purple-300 mb-2">
          {plan.credits.toLocaleString()} Credits
        </p>

        {/* Price per credit */}
        <p className="text-xs text-purple-400/70">
          ₹{(plan.amount / plan.credits / 100).toFixed(2)} per credit
        </p>
      </div>

      {/* Divider */}
      <div className="my-6 border-t border-purple-500/20" />

      {/* Features */}
      <ul className="space-y-3 flex-grow">
        <li className="flex items-start text-sm text-gray-200">
          <CheckCircle className="mr-3 h-5 w-5 text-[#c084fc] flex-shrink-0 mt-0.5" aria-hidden />
          <span>{plan.credits.toLocaleString()} malware analysis credits</span>
        </li>
        <li className="flex items-start text-sm text-gray-200">
          <CheckCircle className="mr-3 h-5 w-5 text-[#c084fc] flex-shrink-0 mt-0.5" aria-hidden />
          <span>Advanced threat detection</span>
        </li>
        <li className="flex items-start text-sm text-gray-200">
          <CheckCircle className="mr-3 h-5 w-5 text-[#c084fc] flex-shrink-0 mt-0.5" aria-hidden />
          <span>Detailed security reports</span>
        </li>
        <li className="flex items-start text-sm text-gray-200">
          <CheckCircle className="mr-3 h-5 w-5 text-[#c084fc] flex-shrink-0 mt-0.5" aria-hidden />
          <span>API access & integration</span>
        </li>
        {featured && (
          <li className="flex items-start text-sm text-gray-200">
            <CheckCircle className="mr-3 h-5 w-5 text-[#c084fc] flex-shrink-0 mt-0.5" aria-hidden />
            <span>Priority email support</span>
          </li>
        )}
        {plan.name === 'Ultimate' && (
          <>
            <li className="flex items-start text-sm text-gray-200">
              <CheckCircle className="mr-3 h-5 w-5 text-[#c084fc] flex-shrink-0 mt-0.5" aria-hidden />
              <span>Dedicated account manager</span>
            </li>
            <li className="flex items-start text-sm text-gray-200">
              <CheckCircle className="mr-3 h-5 w-5 text-[#c084fc] flex-shrink-0 mt-0.5" aria-hidden />
              <span>Custom enterprise features</span>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

const PricingCards = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const response = await paymentService.getPlans();
        
        // Extract plans from response
        const allPlans = response.plans || [];
        
        // Filter only Basic, Premium, and Ultimate
        const selectedPlans = allPlans.filter((plan) =>
          ['basic', 'premium', 'ultimate'].includes(plan.id.toLowerCase())
        );

        // Sort by price: Basic, Premium, Ultimate
        const sortedPlans = selectedPlans.sort((a, b) => a.amount - b.amount);
        
        setPlans(sortedPlans);
      } catch (err) {
        console.error('Failed to fetch pricing plans:', err);
        setError('Failed to load pricing plans. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#7c3aed] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-purple-300 text-sm">Loading pricing plans...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-purple-300">No pricing plans available at the moment.</p>
      </div>
    );
  }

  // Premium (middle plan) is featured
  const featuredPlanId = 'premium';

  return (
    <section className="py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4 text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Pricing Plans
          </h2>
          <p className="text-lg md:text-xl text-purple-300 max-w-2xl">
            Select the plan that best suits your security needs.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:gap-8 min-[900px]:grid-cols-3">
          {plans.map((plan) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              featured={plan.id.toLowerCase() === featuredPlanId}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingCards;
