import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import AutoScroll from 'embla-carousel-auto-scroll';
import Button from './Button';
import Badge from './Badge';
import { paymentService } from '../../services/paymentService';
import { ROUTES } from '../../config/constants';
import { cn } from '../../lib/utils';

const PricingCard = ({ plan, featured = false }) => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate(ROUTES.LOGIN);
  };

  return (
    <div
      className={cn(
        'flex flex-col rounded-2xl border p-6 text-left transition-all duration-300 h-full',
        'bg-gradient-to-br backdrop-blur-lg',
        featured
          ? 'border-[#c084fc] shadow-lg shadow-purple-500/20 ring-2 ring-[#c084fc]/20 from-purple-900/40 to-purple-800/30'
          : 'border-purple-500/30 from-purple-900/20 to-purple-950/20 hover:border-purple-400/50'
      )}
    >
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

        <h4 className="mb-2 text-4xl font-bold bg-gradient-to-r from-[#7c3aed] to-[#c084fc] bg-clip-text text-transparent">
          ₹{(plan.amount / 100).toLocaleString()}
        </h4>

        <p className="text-sm text-purple-300 mb-2">
          {plan.credits.toLocaleString()} Credits
        </p>

        <p className="text-xs text-purple-400/70">
          ₹{(plan.amount / plan.credits / 100).toFixed(2)} per credit
        </p>
      </div>

      <div className="my-6 border-t border-purple-500/20" />

      <ul className="space-y-3 flex-grow">
        <li className="flex items-start text-sm text-gray-200">
          <CheckCircle className="mr-3 h-5 w-5 text-[#c084fc] flex-shrink-0 mt-0.5" />
          <span>{plan.credits.toLocaleString()} malware analysis credits</span>
        </li>
        <li className="flex items-start text-sm text-gray-200">
          <CheckCircle className="mr-3 h-5 w-5 text-[#c084fc] flex-shrink-0 mt-0.5" />
          <span>Advanced threat detection</span>
        </li>
        <li className="flex items-start text-sm text-gray-200">
          <CheckCircle className="mr-3 h-5 w-5 text-[#c084fc] flex-shrink-0 mt-0.5" />
          <span>Detailed security reports</span>
        </li>
        <li className="flex items-start text-sm text-gray-200">
          <CheckCircle className="mr-3 h-5 w-5 text-[#c084fc] flex-shrink-0 mt-0.5" />
          <span>API access & integration</span>
        </li>
        {featured && (
          <li className="flex items-start text-sm text-gray-200">
            <CheckCircle className="mr-3 h-5 w-5 text-[#c084fc] flex-shrink-0 mt-0.5" />
            <span>Priority email support</span>
          </li>
        )}
        {plan.name === 'Ultimate' && (
          <>
            <li className="flex items-start text-sm text-gray-200">
              <CheckCircle className="mr-3 h-5 w-5 text-[#c084fc] flex-shrink-0 mt-0.5" />
              <span>Dedicated account manager</span>
            </li>
            <li className="flex items-start text-sm text-gray-200">
              <CheckCircle className="mr-3 h-5 w-5 text-[#c084fc] flex-shrink-0 mt-0.5" />
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

  // Continuous auto-scroll plugin
  const autoScroll = useCallback(
    () =>
      AutoScroll({
        speed: 1.2,
        startDelay: 0,
        stopOnMouseEnter: true,
        stopOnInteraction: false,
      }),
    []
  );

  // Embla
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: 'start',
      dragFree: true,
      containScroll: false,
    },
    [autoScroll()]
  );

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const response = await paymentService.getPlans();
        const allPlans = response.plans || [];

     
        const sortedPlans = allPlans.sort((a, b) => a.amount - b.amount);

        setPlans(sortedPlans);
      } catch (err) {
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
        <div className="w-12 h-12 border-4 border-[#7c3aed] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-400 py-20">{error}</div>;
  }

  if (plans.length === 0) {
    return (
      <div className="text-center text-purple-300 py-20">
        No pricing plans available at the moment.
      </div>
    );
  }

  const featuredPlanId = 'premium';

  return (
    <section className="py-12 md:py-16">
      {/* Carousel section width - Change max-w-7xl to adjust overall carousel width */}
      {/* Options: max-w-7xl (1280px), max-w-[90rem] (1440px), max-w-[100rem] (1600px) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Pricing Plans
          </h2>
          <p className="text-lg text-purple-300">
            Select the plan that best suits your security needs.
          </p>
        </div>

        {/* Outer container holds gradients */}
        <div className="relative overflow-hidden">

          {/* Left fade */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#060010] to-transparent z-10 pointer-events-none" />

          {/* Right fade */}
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#060010] to-transparent z-10 pointer-events-none" />

          {/* Actual Embla viewport (no gradients inside) */}
          <div ref={emblaRef} className="overflow-hidden">
            <div className="flex will-change-transform -ml-3">
              {plans.map((plan, idx) => (
                // Card width container - Adjust these values to change individual card width
                // Current: full width on mobile, 1/2 on sm/md, 280px fixed on lg+
                // To customize: change 'lg:w-[280px]' to your desired width (e.g., lg:w-[320px], lg:w-1/4)
                <div
                  key={`${plan.id}-${idx}`}
                  className="flex-shrink-0 w-full sm:w-1/2 md:w-1/2 lg:w-[350px] px-3"
                >
                  <PricingCard
                    plan={plan}
                    featured={plan.id.toLowerCase() === featuredPlanId}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingCards;
