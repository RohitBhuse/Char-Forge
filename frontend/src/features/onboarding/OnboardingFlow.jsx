import React, { useState } from 'react';
import Step1Genre from './Step1Genre';
import Step2WritingStyle from './Step2WritingStyle';
import { api } from '../../services/api';

const OnboardingFlow = ({ onComplete, onLogout }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [genres, setGenres] = useState([]);
  const [architecturalStyle, setArchitecturalStyle] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canProceedStep1 = genres.length > 0;
  const canProceedStep2 = architecturalStyle.length > 0;

  const handleNext = async () => {
    if (currentStep === 1) {
      if (!canProceedStep1) return;
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!canProceedStep2) return;

      setIsSubmitting(true);
      try {
        await api.post('/auth/onboarding', {
          genres,
          architectural_style: architecturalStyle
        }); // architecturalStyle is now an array
        onComplete();
      } catch (error) {
        console.error('Failed to save onboarding data:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else if (onLogout) {
      onLogout();
    }
  };

  const stepConfig = [
    { label: 'Core Realms', subtitle: 'Select your genres', node: 'ALPHA' },
    { label: 'Writing Style', subtitle: 'Define your narrative voice', node: 'OMEGA' },
  ];

  const current = stepConfig[currentStep - 1];
  const isNextDisabled = isSubmitting
    || (currentStep === 1 && !canProceedStep1)
    || (currentStep === 2 && !canProceedStep2);

  return (
    <div className="bg-background text-on-background font-body selection:bg-primary selection:text-on-primary min-h-screen flex flex-col pt-24 pb-32 px-6 max-w-7xl mx-auto w-full">

      {/* Header / Progress */}
      <div className="mb-12 flex items-end justify-between">
        <div className="flex flex-col gap-1">
          <span className="font-label text-[10px] uppercase tracking-[0.25em] text-primary">
            {current.subtitle}
          </span>
          <h1 className="font-headline text-4xl font-bold tracking-tighter text-on-surface">
            {current.label}
          </h1>
        </div>

        {/* Step dots */}
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2">
            {stepConfig.map((_, i) => (
              <div
                key={`step-dot-${i}`}
                className={`rounded-full transition-all duration-300 ${i + 1 === currentStep
                  ? 'w-8 h-2 bg-primary shadow-[0_0_8px_rgba(89,222,155,0.5)]'
                  : i + 1 < currentStep
                    ? 'w-2 h-2 bg-primary/60'
                    : 'w-2 h-2 bg-outline-variant/40'
                  }`}
              />
            ))}
          </div>
          <span className="font-headline text-xl font-light text-outline-variant tracking-widest">
            {current.node}
          </span>
        </div>
      </div>

      {/* Step Content */}
      {currentStep === 1 && (
        <Step1Genre genres={genres} setGenres={setGenres} />
      )}
      {currentStep === 2 && (
        <Step2WritingStyle
          architecturalStyle={architecturalStyle}
          setArchitecturalStyle={setArchitecturalStyle}
          multiSelect={true}
        />
      )}

      {/* Bottom NavBar */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-between items-center px-8 py-4 bg-[#161d1a] shadow-[0px_-24px_48px_rgba(0,57,33,0.2)]">
        <button
          onClick={handleBack}
          disabled={isSubmitting}
          className="flex flex-col items-center justify-center px-8 py-2 transition-all text-[#2f3633] hover:bg-[#2f3633] hover:text-[#59de9b] active:scale-95"
        >
          <span className="material-symbols-outlined mb-1">arrow_back</span>
          <span className="font-['Space_Grotesk'] uppercase tracking-[0.1em] text-[10px]">Back</span>
        </button>

        {/* Progress bar */}
        <div className="flex-grow flex justify-center">
          <div className="h-1 w-48 bg-surface-container-highest rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${(currentStep / 2) * 100}%` }}
            />
          </div>
        </div>

        <button
          onClick={handleNext}
          disabled={isNextDisabled}
          className={`flex flex-col items-center justify-center rounded-md px-8 py-2 transition-all ${isNextDisabled
            ? 'bg-[#242c28] text-outline-variant cursor-not-allowed opacity-40'
            : 'bg-[#242c28] text-[#59de9b] hover:bg-[#2f3633] active:scale-95'
            }`}
        >
          <span className="material-symbols-outlined mb-1">
            {isSubmitting ? 'hourglass_empty' : 'arrow_forward'}
          </span>
          <span className="font-['Space_Grotesk'] uppercase tracking-[0.1em] text-[10px]">
            {currentStep === 1 ? 'Next' : isSubmitting ? 'Weaving…' : 'Complete'}
          </span>
        </button>
      </nav>
    </div>
  );
};

export default OnboardingFlow;
