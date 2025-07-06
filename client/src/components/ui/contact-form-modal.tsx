import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UnifiedButton } from './unified-button';
import { useToast } from '@/hooks/use-toast';


const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  projectAssistance: z.string().min(10, 'Please describe your project needs (minimum 10 characters)'),
  telegram: z.string().optional(),
  xTwitter: z.string().optional(),
  discord: z.string().optional(),
  contactPreference: z.enum(['email', 'telegram', 'x', 'discord'], {
    required_error: 'Please select your preferred contact method'
  })
});

type ContactFormData = z.infer<typeof contactFormSchema>;

interface ContactFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContactFormModal({ isOpen, onClose }: ContactFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema)
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      toast({
        title: "Success!",
        description: "Thank you for trusting us! We will reach out to the email you provided soon to set up a consult!",
        duration: 5000,
      });

      reset();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an issue submitting your form. Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg mx-auto my-8"
            onClick={(e) => e.stopPropagation()}
          >
              <div className="absolute -inset-1 bg-gradient-to-r from-accent via-primary to-purple-500 rounded-2xl blur opacity-30"></div>
              <div className="relative bg-card/95 backdrop-blur-sm border border-border/50 rounded-2xl p-6 md:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-3 right-3 z-10 bg-gray-800/80 hover:bg-gray-700 text-gray-300 hover:text-white transition-all duration-200 rounded-full p-2"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Header */}
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">Get Started Today</h2>
                  <p className="text-gray-300 text-sm">
                    Tell us about your project and we'll reach out to discuss how we can help.
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {/* Name Field */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                      Name *
                    </label>
                    <input
                      {...register('name')}
                      type="text"
                      id="name"
                      className="w-full px-3 py-2 bg-background/50 border border-border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Enter your name"
                    />
                    {errors.name && (
                      <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                      Email *
                    </label>
                    <input
                      {...register('email')}
                      type="email"
                      id="email"
                      className="w-full px-3 py-2 bg-background/50 border border-border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Enter your email"
                    />
                    {errors.email && (
                      <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  {/* Secondary Contact Information */}
                  <div className="border-t border-border/30 pt-4">
                    <h3 className="text-sm font-medium text-white mb-3">Additional Contact Options (Optional)</h3>
                    
                    {/* Telegram Field */}
                    <div className="mb-3">
                      <label htmlFor="telegram" className="block text-sm font-medium text-gray-300 mb-1">
                        Telegram Username
                      </label>
                      <input
                        {...register('telegram')}
                        type="text"
                        id="telegram"
                        className="w-full px-3 py-2 bg-background/50 border border-border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="@yourusername"
                      />
                    </div>

                    {/* X (Twitter) Field */}
                    <div className="mb-3">
                      <label htmlFor="xTwitter" className="block text-sm font-medium text-gray-300 mb-1">
                        X (Twitter) Handle
                      </label>
                      <input
                        {...register('xTwitter')}
                        type="text"
                        id="xTwitter"
                        className="w-full px-3 py-2 bg-background/50 border border-border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="@yourusername"
                      />
                    </div>

                    {/* Discord Field */}
                    <div className="mb-4">
                      <label htmlFor="discord" className="block text-sm font-medium text-gray-300 mb-1">
                        Discord Username
                      </label>
                      <input
                        {...register('discord')}
                        type="text"
                        id="discord"
                        className="w-full px-3 py-2 bg-background/50 border border-border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="username#1234"
                      />
                    </div>

                    {/* Contact Preference */}
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Preferred Contact Method *
                      </label>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            {...register('contactPreference')}
                            type="radio"
                            value="email"
                            className="w-4 h-4 text-primary bg-background/50 border-border focus:ring-primary focus:ring-2"
                          />
                          <span className="ml-2 text-sm text-gray-300">Email</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            {...register('contactPreference')}
                            type="radio"
                            value="telegram"
                            className="w-4 h-4 text-primary bg-background/50 border-border focus:ring-primary focus:ring-2"
                          />
                          <span className="ml-2 text-sm text-gray-300">Telegram</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            {...register('contactPreference')}
                            type="radio"
                            value="x"
                            className="w-4 h-4 text-primary bg-background/50 border-border focus:ring-primary focus:ring-2"
                          />
                          <span className="ml-2 text-sm text-gray-300">X (Twitter)</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            {...register('contactPreference')}
                            type="radio"
                            value="discord"
                            className="w-4 h-4 text-primary bg-background/50 border-border focus:ring-primary focus:ring-2"
                          />
                          <span className="ml-2 text-sm text-gray-300">Discord</span>
                        </label>
                      </div>
                      {errors.contactPreference && (
                        <p className="text-red-400 text-xs mt-1">{errors.contactPreference.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Project Assistance Field */}
                  <div>
                    <label htmlFor="projectAssistance" className="block text-sm font-medium text-white mb-2">
                      What project do you need assistance with? *
                    </label>
                    <textarea
                      {...register('projectAssistance')}
                      id="projectAssistance"
                      rows={4}
                      className="w-full px-3 py-2 bg-background/50 border border-border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                      placeholder="Describe your project needs, blockchain infrastructure requirements, or services you're interested in..."
                    />
                    {errors.projectAssistance && (
                      <p className="text-red-400 text-xs mt-1">{errors.projectAssistance.message}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <UnifiedButton
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90 mt-6"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                  </UnifiedButton>
                </form>
              </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}