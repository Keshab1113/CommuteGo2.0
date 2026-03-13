import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Check, 
  X, 
  Zap, 
  Rocket, 
  Crown, 
  Diamond,
  Star,
  ArrowRight,
  Users,
  Building,
  Briefcase,
  Mail,
  Phone,
  Clock,
  Shield,
  BarChart3,
  HeadphonesIcon,
  Globe,
  Sparkles,
  Gift,
  Wallet,
  CreditCard,
  Minus
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Switch } from '../components/ui/switch';
import { Separator } from '../components/ui/separator';

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(true);

  const plans = [
    {
      name: 'Free',
      description: 'Perfect for getting started',
      price: { monthly: 0, annual: 0 },
      icon: Gift,
      color: 'from-slate-500 to-zinc-500',
      features: [
        { name: 'Basic route planning', included: true },
        { name: 'Up to 3 saved routes', included: true },
        { name: 'Real-time traffic data', included: true },
        { name: 'Transit directions', included: true },
        { name: 'Dark mode', included: true },
        { name: 'Basic notifications', included: true },
        { name: 'AI route optimization', included: false },
        { name: 'Commute analytics', included: false },
        { name: 'Carpool matching', included: false },
        { name: 'Priority support', included: false },
        { name: 'API access', included: false }
      ],
      cta: 'Get Started',
      popular: false
    },
    {
      name: 'Pro',
      description: 'For daily commuters',
      price: { monthly: 9.99, annual: 7.99 },
      icon: Rocket,
      color: 'from-blue-500 to-cyan-500',
      features: [
        { name: 'Everything in Free', included: true },
        { name: 'Unlimited saved routes', included: true },
        { name: 'AI route optimization', included: true },
        { name: 'Commute analytics', included: true },
        { name: 'Carpool matching', included: true },
        { name: 'Advanced notifications', included: true },
        { name: 'Schedule planning', included: true },
        { name: 'Weather integration', included: true },
        { name: 'Priority support', included: true },
        { name: 'API access', included: false },
        { name: 'Custom branding', included: false }
      ],
      cta: 'Start Free Trial',
      popular: true
    },
    {
      name: 'Enterprise',
      description: 'For teams & organizations',
      price: { monthly: 49.99, annual: 39.99 },
      icon: Building,
      color: 'from-violet-500 to-purple-500',
      features: [
        { name: 'Everything in Pro', included: true },
        { name: 'Unlimited users', included: true },
        { name: 'API access', included: true },
        { name: 'Custom branding', included: true },
        { name: 'Team analytics', included: true },
        { name: 'Admin dashboard', included: true },
        { name: 'SSO integration', included: true },
        { name: 'Dedicated support', included: true },
        { name: 'Custom integrations', included: true },
        { name: 'SLA guarantee', included: true },
        { name: 'On-premise option', included: true }
      ],
      cta: 'Contact Sales',
      popular: false
    }
  ];

  const faqs = [
    {
      question: 'Can I switch plans at any time?',
      answer: "Yes! You can upgrade or downgrade your plan at any time. When upgrading, you'll get immediate access to new features. When downgrading, the change takes effect at the end of your billing cycle."
    },
    {
      question: 'Is there a free trial for the Pro plan?',
      answer: 'Absolutely! We offer a 14-day free trial for the Pro plan. No credit card required. You can explore all premium features risk-free.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and bank transfers for annual Enterprise plans.'
    },
    {
      question: 'Can I cancel my subscription?',
      answer: "Yes, you can cancel your subscription at any time from your account settings. You'll continue to have access until the end of your billing period."
    },
    {
      question: "Do you offer refunds?",
      answer: "We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied, contact us for a full refund."
    },
    {
      question: 'What happens to my data if I downgrade?',
      answer: 'Your data is always yours. When downgrading, we archive excess data but never delete it. You can upgrade again anytime to restore full access.'
    }
  ];

  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-purple-950/20">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 dark:from-purple-500/5 dark:to-blue-500/5" />
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Badge variant="outline" className="mb-4 px-4 py-1 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800">
              <Crown className="w-4 h-4 mr-2" />
              Pricing
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-900 via-purple-700 to-blue-600 dark:from-white dark:via-purple-200 dark:to-blue-200 bg-clip-text text-transparent">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-8">
              Choose the plan that fits your commute needs. All plans include a 14-day free trial.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <span className={`text-sm ${!isAnnual ? 'text-slate-900 dark:text-white font-medium' : 'text-slate-500'}`}>Monthly</span>
              <Switch 
                checked={isAnnual} 
                onCheckedChange={setIsAnnual}
                className="data-[state=checked]:bg-purple-600"
              />
              <span className={`text-sm ${isAnnual ? 'text-slate-900 dark:text-white font-medium' : 'text-slate-500'}`}>
                Annual
                <Badge className="ml-2 bg-green-500 text-white border-0 text-xs">Save 20%</Badge>
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`h-full bg-white dark:bg-slate-800 border-2 transition-all hover:shadow-xl ${
                  plan.popular 
                    ? 'border-purple-500 dark:border-purple-500 relative overflow-visible' 
                    : 'border-slate-200 dark:border-slate-700'
                }`}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-1">
                        <Star className="w-3 h-3 mr-1" />
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="text-center pb-4">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center mx-auto mb-4`}>
                      <plan.icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl text-slate-900 dark:text-white">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="mb-6">
                      <span className="text-4xl font-bold text-slate-900 dark:text-white">
                        ${isAnnual ? plan.price.annual : plan.price.monthly}
                      </span>
                      <span className="text-slate-500 dark:text-slate-400">/month</span>
                      {isAnnual && plan.price.monthly > 0 && (
                        <div className="text-sm text-green-600 dark:text-green-400 mt-1">
                          Billed ${plan.price.annual * 12}/year
                        </div>
                      )}
                    </div>
                    <Button 
                      className={`w-full mb-6 ${
                        plan.popular 
                          ? 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white' 
                          : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800'
                      }`}
                    >
                      {plan.cta}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                    <Separator className="mb-6" />
                    <div className="space-y-3">
                      {plan.features.map((feature, fIndex) => (
                        <div key={fIndex} className="flex items-center gap-3 text-sm">
                          {feature.included ? (
                            <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                          ) : (
                            <X className="w-4 h-4 text-slate-300 dark:text-slate-600 flex-shrink-0" />
                          )}
                          <span className={feature.included ? 'text-slate-700 dark:text-slate-300' : 'text-slate-400'}>
                            {feature.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise Section */}
      <section className="py-16 px-4 bg-white/50 dark:bg-slate-800/30">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Card className="bg-gradient-to-r from-violet-600 to-purple-600 border-0 overflow-hidden">
              <CardContent className="p-8 md:p-12">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-4">Need a Custom Solution?</h3>
                    <p className="text-violet-100 mb-6">
                      Get a tailored plan for your organization with custom integrations, dedicated support, and flexible pricing.
                    </p>
                    <ul className="space-y-2 text-violet-100">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4" /> Custom integrations
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4" /> Dedicated account manager
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4" /> SLA guarantee
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4" /> On-premise deployment
                      </li>
                    </ul>
                  </div>
                  <div className="text-center">
                    <Button size="lg" variant="secondary" className="bg-white text-purple-600 hover:bg-violet-50">
                      <Building className="w-5 h-5 mr-2" />
                      Contact Sales
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Frequently Asked Questions</h2>
            <p className="text-slate-600 dark:text-slate-300">
              Have questions? We're here to help.
            </p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                  <CardContent className="p-0">
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full p-4 flex items-center justify-between text-left"
                    >
                      <span className="font-medium text-slate-900 dark:text-white pr-4">{faq.question}</span>
                      {openFaq === index ? (
                        <Minus className="w-5 h-5 text-slate-500 flex-shrink-0" />
                      ) : (
                        <ArrowRight className="w-5 h-5 text-slate-500 flex-shrink-0 rotate-90" />
                      )}
                    </button>
                    {openFaq === index && (
                      <div className="px-4 pb-4">
                        <p className="text-slate-600 dark:text-slate-300">{faq.answer}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">Still Have Questions?</h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              Our team is here to help you find the perfect plan for your needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
                <Mail className="w-4 h-4 mr-2" />
                Email Us
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20">
                <Phone className="w-4 h-4 mr-2" />
                Schedule a Call
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;