import { useState } from 'react';
import Button from '../components/common/Button';

const defaultSteps = {
  ket: [
    'Register for the KET exam on the official website.',
    'Download your admit card when available.',
    'Appear for the KET exam at your designated center.',
    'Check your results online.',
    'Participate in the counseling process and select your preferred colleges.',
    'Complete document verification and pay the admission fee.'
  ],
  comedk: [
    'Register for COMEDK UGET on the official portal.',
    'Fill out the application form and upload required documents.',
    'Download your admit card.',
    'Take the COMEDK UGET exam.',
    'Check your results and download your rank card.',
    'Attend online counseling and select colleges/courses.',
    'Complete admission formalities at the allotted college.'
  ],
  management: [
    'Contact the college admission office directly.',
    'Fill out the management quota application form.',
    'Submit required documents and pay the application fee.',
    'Attend the interview/counseling if required.',
    'Receive admission offer and pay the admission fee.',
    'Complete document verification and join the college.'
  ]
};

export function StepEditor({ type, label }: { type: 'ket' | 'comedk' | 'management', label: string }) {
  const [steps, setSteps] = useState<string[]>(() => {
    const saved = localStorage.getItem(`admissionSteps_${type}`);
    return saved ? JSON.parse(saved) : defaultSteps[type];
  });
  const [newStep, setNewStep] = useState('');

  const saveSteps = (updated: string[]) => {
    setSteps(updated);
    localStorage.setItem(`admissionSteps_${type}`, JSON.stringify(updated));
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-blue-950 to-pink-950 rounded-2xl shadow-xl border-2 border-blue-900 p-8 w-full max-w-2xl mx-auto mb-8">
      <h2 className="text-2xl font-bold text-gradient mb-4 text-center">Edit {label} Steps</h2>
      <ol className="list-decimal text-gray-200 pl-6 mb-4">
        {steps.map((step, idx) => (
          <li key={idx} className="mb-2 flex items-center">
            <input
              className="w-full bg-gray-800 text-gray-100 rounded px-2 py-1 mr-2 border border-blue-900"
              value={step}
              onChange={e => {
                const updated = [...steps];
                updated[idx] = e.target.value;
                saveSteps(updated);
              }}
            />
            <Button
              className="bg-red-800 text-white px-2 py-1 ml-2"
              onClick={() => {
                const updated = steps.filter((_, i) => i !== idx);
                saveSteps(updated);
              }}
            >
              Delete
            </Button>
          </li>
        ))}
      </ol>
      <div className="flex gap-2 mb-4">
        <input
          className="flex-1 bg-gray-800 text-gray-100 rounded px-2 py-1 border border-blue-900"
          value={newStep}
          onChange={e => setNewStep(e.target.value)}
          placeholder="Add new step"
        />
        <Button
          className="bg-blue-900 text-white px-4 py-1"
          onClick={() => {
            if (newStep.trim()) {
              const updated = [...steps, newStep.trim()];
              saveSteps(updated);
              setNewStep('');
            }
          }}
        >
          Add
        </Button>
      </div>
    </div>
  );
}
