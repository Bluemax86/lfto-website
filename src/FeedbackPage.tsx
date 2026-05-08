import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Input } from './components/Shared';
import { submitFeedback } from './services/firebase';

const questions = [
  {
    id: 'hydrate_surface',
    question: '[H] HYDRATE: Surface Texture',
    subText: 'How does your skin feel 5 minutes after application?',
    options: [
      { label: 'Baseline: No noticeable change in smoothness.', value: 'Baseline' },
      { label: 'Improved: Skin feels noticeably softer to the touch.', value: 'Improved' },
      { label: 'Optimal: Significant transformation; skin feels deeply hydrated and supple.', value: 'Optimal' }
    ]
  },
  {
    id: 'protect_barrier',
    question: '[P] PROTECT: Environmental Barrier',
    subText: 'How did the lotion feel during/after exposure to elements (wind, salt, or sun)? Does it feel like an effective "shield" for your skin?',
    options: [
      { label: 'Ineffective: My skin still felt raw or vulnerable to the elements.', value: 'Ineffective' },
      { label: 'Resilient: I felt a noticeable protective layer that kept my skin from drying out.', value: 'Resilient' },
      { label: 'Fortified: My skin felt completely shielded; no "tightness" or environmental fatigue even after hours outside.', value: 'Fortified' }
    ]
  },
  {
    id: 'revive_recovery',
    question: '[R] REVIVE: Post-Sun Recovery',
    subText: 'If applied after sun exposure, how did the formula affect redness or heat-dryness?',
    options: [
      { label: 'No Impact: Redness and dryness remained the same.', value: 'No Impact' },
      { label: 'Effective: Noticeable reduction in heat and visible redness.', value: 'Effective' },
      { label: 'Elite Recovery: Redness vanished; skin remained soft, cool, and smooth.', value: 'Elite Recovery' }
    ]
  },
  {
    id: 'repair_trouble',
    question: 'REPAIR: Dry & Flaky Areas',
    subText: 'How did the lotion perform on specific "trouble spots" that were already dry or flaky?',
    options: [
      { label: 'No Change: Flakiness persisted.', value: 'No Change' },
      { label: 'Refined: Visible reduction in dry patches and flakiness.', value: 'Refined' },
      { label: 'Restored: Flakiness eliminated; skin texture feels completely healthy.', value: 'Restored' },
      { label: 'N/A: I did not have dry/flaky skin during this test.', value: 'N/A' }
    ]
  },
  {
    id: 'sensory_finish',
    question: 'SENSORY: Absorption & Finish',
    subText: 'Which best describes the "Final Feel" of the formula on your skin?',
    options: [
      { label: 'Heavy: Felt oily, sticky, or sat on top of the skin.', value: 'Heavy' },
      { label: 'Balanced: Initial residue that absorbed after a few minutes.', value: 'Balanced' },
      { label: 'Silk-Tech: Instant absorption with a completely dry, silky-smooth finish.', value: 'Silk-Tech' }
    ]
  }
];

const FeedbackPage: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [comments, setComments] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleOptionChange = (questionId: string, option: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: option }));
  };

  const isFormValid = firstName.trim() !== '' && email.trim() !== '' && Object.keys(answers).length === questions.length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setStatus('loading');
    const result = await submitFeedback({
      firstName,
      email,
      answers,
      comments
    });

    if (result.success) {
      setStatus('success');
    } else {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  if (status === 'success') {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div className="container">
          <h2 className="headline-md" style={{ color: 'var(--primary)', marginBottom: '24px' }}>Submission Received!</h2>
          <p className="body-lg" style={{ color: 'var(--on-surface-variant)', marginBottom: '48px', maxWidth: '600px', margin: '0 auto 48px auto' }}>
            Thank you, {firstName}. Your performance feedback for Lotion From The Ocean has been recorded. This data is critical to our final formulation process.
          </p>
          <Link to="/" className="lfto-btn lfto-btn-primary" style={{ textDecoration: 'none' }}>
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', color: 'var(--on-surface)' }}>
      {/* Hero Section */}
      <section
        className="section-padding"
        style={{
          minHeight: '40vh',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80vw',
          height: '80vw',
          background: 'radial-gradient(circle, rgba(163,207,207,0.2) 0%, rgba(249,249,249,0) 70%)',
          zIndex: -1,
          borderRadius: '50%'
        }}></div>

        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: 'url(/assets/hero-image.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: -2
        }}></div>

        <div className="container" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Link to="/" className="label-caps" style={{ color: 'var(--primary)', textDecoration: 'none', marginBottom: '32px', opacity: 0.6 }}>
            ← Back to Home
          </Link>
          <div style={{ textAlign: 'center', maxWidth: '800px', width: '100%' }}>
            <h1 className="gold-text" style={{ marginBottom: '24px' }}>Performance</h1>
            <p className="headline-md" style={{ color: 'var(--primary)', margin: 0 }}>
              Lotion From The Ocean Feedback Form
            </p>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="section-padding" style={{ backgroundColor: 'var(--surface-container-lowest)' }}>
        <div className="container">
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <p className="body-lg" style={{ color: 'var(--on-surface-variant)' }}>
              Help us perfect the HPR Technology. This form is designed to capture high-resolution feedback on the hydration, protection, and recovery metrics of our first batch.
              Completion time: &lt; 60 seconds.
            </p>
          </div>
        </div>
      </section>

      {/* Questionnaire Form */}
      <section className="section-padding">
        <div className="container">
          <form onSubmit={handleSubmit} style={{ maxWidth: '800px', margin: '0 auto' }}>
            {/* User Info */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '32px', marginBottom: '64px' }}>
              <div>
                <label className="label-caps" style={{ display: 'block', marginBottom: '16px', color: 'var(--primary)' }}>First Name</label>
                <Input
                  placeholder="Your Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="label-caps" style={{ display: 'block', marginBottom: '16px', color: 'var(--primary)' }}>Email Address</label>
                <Input
                  type="email"
                  placeholder="Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Questions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '80px' }}>
              {questions.map((q, idx) => (
                <div key={q.id}>
                  <div style={{ marginBottom: '32px' }}>
                    <h3 className="label-caps" style={{ fontSize: '14px', marginBottom: '8px', color: 'var(--primary)', display: 'flex', gap: '16px' }}>
                      <span style={{ opacity: 0.4 }}>0{idx + 1}</span> {q.question}
                    </h3>
                    <p className="body-md" style={{ color: 'var(--on-surface-variant)', opacity: 0.8 }}>{q.subText}</p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {q.options.map(opt => (
                      <label
                        key={opt.value}
                        style={{
                          padding: '24px',
                          border: '1px solid',
                          borderColor: answers[q.id] === opt.value ? 'var(--secondary)' : 'var(--outline-variant)',
                          backgroundColor: answers[q.id] === opt.value ? 'rgba(212, 175, 55, 0.05)' : 'transparent',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '16px',
                          transition: 'all 200ms ease'
                        }}
                      >
                        <input
                          type="radio"
                          name={q.id}
                          value={opt.value}
                          checked={answers[q.id] === opt.value}
                          onChange={() => handleOptionChange(q.id, opt.value)}
                          style={{ accentColor: 'var(--secondary)', transform: 'scale(1.2)' }}
                        />
                        <span className="body-md" style={{ color: answers[q.id] === opt.value ? 'var(--primary)' : 'var(--on-surface-variant)', lineHeight: '1.5' }}>
                          {opt.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Comments */}
            <div style={{ marginTop: '80px' }}>
              <label className="label-caps" style={{ display: 'block', marginBottom: '16px', color: 'var(--primary)' }}>
                Additional Thoughts (Optional but would really help us!)
              </label>
              <textarea
                style={{
                  width: '100%',
                  minHeight: '180px',
                  padding: '24px',
                  backgroundColor: 'transparent',
                  border: '1px solid var(--outline-variant)',
                  fontFamily: 'inherit',
                  fontSize: '16px',
                  outline: 'none',
                  color: 'var(--on-surface)',
                  lineHeight: '1.6',
                  borderRadius: 0
                }}
                placeholder="Anything else you'd like to share about your experience with Batch 001?"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
              />
            </div>

            {/* Submit */}
            <div style={{ marginTop: '80px', textAlign: 'center', paddingBottom: '80px' }}>
              <Button
                type="submit"
                disabled={status === 'loading' || !isFormValid}
                style={{ minWidth: '320px' }}
              >
                {status === 'loading' ? 'TRANSMITTING DATA...' : 'Submit Performance Feedback'}
              </Button>
              {!isFormValid && (
                <p className="body-md" style={{ color: 'var(--on-surface-variant)', opacity: 0.6, marginTop: '24px' }}>
                  Please enter your name, email and answer all questions to unlock submission.
                </p>
              )}
              {status === 'error' && (
                <p className="body-md" style={{ color: '#ba1a1a', marginTop: '16px' }}>
                  Something went wrong. Please check your connection and try again.
                </p>
              )}
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default FeedbackPage;
