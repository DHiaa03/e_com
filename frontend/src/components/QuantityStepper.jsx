import { Minus, Plus } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function QuantityStepper({ value, min = 1, max = 99, onChange, label }) {
  const { t } = useStore();

  return (
    <div className="stepper" role="group" aria-label={label || t('quantity')}>
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        aria-label={t('decrease')}
      >
        <Minus size={16} aria-hidden="true" />
      </button>
      <span className="stepper__value" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label={t('increase')}
      >
        <Plus size={16} aria-hidden="true" />
      </button>
    </div>
  );
}
