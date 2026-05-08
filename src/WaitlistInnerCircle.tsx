import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Zap, Sparkles, Gift, Lock } from 'lucide-react';
import { WaitlistForm } from './components/Shared';

const WaitlistInnerCircle: React.FC = () => {
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
            <h1 className="gold-text" style={{ marginBottom: '24px' }}>Inner Circle</h1>
            <p className="headline-md" style={{ color: 'var(--primary)', margin: 0 }}>
              Batch 001 Priority Reservation
            </p>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="section-padding" style={{ backgroundColor: 'var(--surface-container-lowest)' }}>
        <div className="container">
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <h2 className="headline-md" style={{ marginBottom: '32px', color: 'var(--primary)' }}>The Batch 001 Waitlist</h2>
            <p className="body-lg" style={{ color: 'var(--on-surface-variant)', marginBottom: '48px' }}>
              Joining the waitlist for Batch 001 isn't just a newsletter signup—it's your reservation for the first-ever drop of Lotion From The Ocean. 
              Because our HPR Technology is produced in strictly limited quantities, this list is the only way to ensure you don't miss out when the tide comes in.
            </p>
            <div style={{ maxWidth: '400px', margin: '0 auto' }}>
              <WaitlistForm />
            </div>
          </div>
        </div>
      </section>

      {/* Member Advantage */}
      <section className="section-padding">
        <div className="container">
          <h2 className="headline-md" style={{ textAlign: 'center', marginBottom: '64px', color: 'var(--primary)' }}>Member Advantages</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '48px' }}>
            <AdvantageItem 
              icon={<Shield size={24} />}
              title="Guaranteed Allocation"
              description="You are reserved one (1) 100mL bottle of Batch 001. Depending on final stock levels, you may be offered the option to purchase additional bottles before the public launch."
            />
            <AdvantageItem 
              icon={<Zap size={24} />}
              title="Obligation-Free"
              description="Joining this list is a reservation of interest only. There is absolutely no obligation to purchase when the batch goes live."
            />
            <AdvantageItem 
              icon={<Lock size={24} />}
              title="No Upfront Payment"
              description="We do not require any credit card information or deposits to secure your spot. You only pay if and when you decide to complete your order."
            />
            <AdvantageItem 
              icon={<Sparkles size={24} />}
              title="Exclusive Intelligence"
              description="Receive 'members-only' access to behind-the-scenes news, formulation updates, and educational material regarding HPR Technology."
            />
            <AdvantageItem 
              icon={<Gift size={24} />}
              title="Inner Circle Giveaways"
              description="Every month, one random member of the Inner Circle will be selected to receive a free gift or early-access sample."
            />
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="section-padding" style={{ backgroundColor: 'var(--surface-container)' }}>
        <div className="container">
          <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
            <h2 className="headline-md" style={{ marginBottom: '48px', color: 'var(--primary)' }}>Secure Your Spot</h2>
            <WaitlistForm />
          </div>
        </div>
      </section>

      {/* Terms & Disclaimers */}
      <section className="section-padding" style={{ backgroundColor: 'var(--surface-container-low)' }}>
        <div className="container">
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 className="label-caps" style={{ textAlign: 'center', marginBottom: '48px', color: 'var(--primary)', fontSize: '14px' }}>Disclaimers & Terms of Reservation</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <TermItem 
                title="The 'Batch 001' Clause"
                content="In the unlikely event that unforeseen production or logistical issues prevent the release of Batch 001, Lotion From The Ocean reserves the right to cancel the drop. No compensation or product will be owed in such a case."
              />
              <TermItem 
                title="Artisanal Variability"
                content="Because we use active marine botanicals, physical characteristics may vary slightly between test batches (color from sea-foam white to ivory, or slight viscosity changes). These are signs of a raw, active formulation."
              />
              <TermItem 
                title="Packaging Evolution"
                content="Final bottle shape or label design may differ slightly from prototype images as we prioritize the quality of the HPR Technology inside over the container aesthetic."
              />
              <TermItem 
                title="Priority Window"
                content="Waitlist members will have a specific time window (usually 24-48 hours) to claim their allocation before stock is released to the general public."
              />
            </div>
            <p className="body-md" style={{ marginTop: '48px', textAlign: 'center', opacity: 0.7 }}>
              By entering your email on the following screen, you agree to these terms and the mission of Lotion From The Ocean.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

const AdvantageItem: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
  <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
    <div style={{ color: 'var(--surface-tint)', flexShrink: 0 }}>{icon}</div>
    <div>
      <h3 className="label-caps" style={{ fontSize: '13px', marginBottom: '8px', color: 'var(--primary)' }}>{title}</h3>
      <p className="body-md" style={{ color: 'var(--on-surface-variant)' }}>{description}</p>
    </div>
  </div>
);

const TermItem: React.FC<{ title: string; content: string }> = ({ title, content }) => (
  <div style={{ padding: '24px', border: '1px solid var(--outline-variant)', borderRadius: '4px' }}>
    <h4 className="label-caps" style={{ fontSize: '12px', marginBottom: '12px', color: 'var(--primary)' }}>{title}</h4>
    <p className="body-md" style={{ margin: 0, lineHeight: '1.6' }}>{content}</p>
  </div>
);

export default WaitlistInnerCircle;
