import React, { useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Leaf, Droplets, Shield } from 'lucide-react';
import FishSwarm from './FishSwarm';
import WaitlistInnerCircle from './WaitlistInnerCircle';
import FeedbackPage from './FeedbackPage';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './components/admin/AdminDashboard';
import InfluencerTracker from './components/admin/InfluencerTracker';
import TaskBoard from './components/admin/TaskBoard';
import AdminLoginPage from './components/admin/AdminLoginPage';
import { AuthProvider, ProtectedRoute } from './components/admin/ProtectedRoute';

// --- Scroll Management ---

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// --- Page Components ---

const HomePage: React.FC = () => {
  return (
    <>
      {/* Hero Section */}
      <section
        className="section-padding"
        style={{
          minHeight: '50vh',
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

        <div className="container" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', maxWidth: '800px', width: '100%' }}>
            <h1 className="gold-text" style={{ marginBottom: '24px' }}>Lotion From The Ocean</h1>
            <p className="headline-md" style={{ color: 'var(--primary)', margin: 0 }}>
              Ocean-Powered Hydration in A Bottle.
            </p>
          </div>
        </div>
      </section>

      {/* Waitlist Section */}
      <section className="section-padding" style={{ backgroundColor: 'var(--surface-container)' }}>
        <div className="container">
          <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
            <h2 className="headline-md" style={{ marginBottom: '24px', color: 'var(--primary)' }}>Join the Waitlist</h2>
            <p className="body-lg" style={{ color: 'var(--on-surface-variant)', marginBottom: '48px' }}>
              Batch 001 is almost here. Join the inner circle for priority access to our very first drop. Once these bottles are gone, they’re gone.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Link to="/waitlist" className="lfto-btn lfto-btn-primary" style={{ textDecoration: 'none' }}>
                Join the Waitlist
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="section-padding" style={{ backgroundColor: 'var(--surface-container-lowest)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: 'var(--gutter)', alignItems: 'center' }}>
            <div>
              <img src="/assets/product-image.jpg" alt="Lotion From The Ocean Product" style={{ width: '100%', borderRadius: '16px', objectFit: 'cover' }} />
            </div>

            <div>
              <h2 className="headline-md" style={{ marginBottom: '24px', color: 'var(--primary)' }}>More than a Moisturizer</h2>
              <div className="thin-divider" style={{ margin: '0 0 24px 0' }}></div>
              <p className="body-lg" style={{ color: 'var(--on-surface-variant)' }}>
                This isn’t just another step in your routine—it’s a daily essential that should be part of your kit.
                Engineered for those who live under the sun and in the elements, our formula utilizes proprietary <strong>HPR Technology</strong> (Hydrate, Protect, Revive) to act as a precision tool for skin recovery.
                <br /><br />
                Standard lotions only sit on the surface; HPR Technology works in three phases. It floods the skin with deep-cell Hydration, builds a breathable barrier to Protect against environmental stressors,
                and triggers the natural process to Revive weathered or sun-damaged tissue. Whether you’re recovering from an afternoon on the water or maintaining your baseline in the off-season,
                it is the definitive must-have for total skin resilience. Batch 001 drops early 2027.
              </p>
              <div className="thin-divider" style={{ margin: '24px 0 0 0' }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Ingredients Section */}
      <section className="section-padding">
        <div className="container">
          <h2 className="headline-md" style={{ textAlign: 'center', marginBottom: '64px', color: 'var(--primary)' }}>The HPR Profile</h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: 'var(--gutter)', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <IngredientItem icon={<Droplets color="var(--surface-tint)" size={24} />} title="Flaxseed Gel" description={'Forms a breathable, protective "bio-shield" that locks in moisture for 24 hours while improving skin elasticity and texture.'} />
                <div className="thin-divider" style={{ margin: '0' }}></div>
                <IngredientItem icon={<Droplets color="var(--surface-tint)" size={24} />} title="Sodium Hyaluronate" description="A high-performance humectant that penetrates deeper than standard hyaluronic acid to instantly plump cells and smooth fine lines." />
                <div className="thin-divider" style={{ margin: '0' }}></div>
                <IngredientItem icon={<Leaf color="var(--surface-tint)" size={24} />} title="Aloe Barbadensis" description="A pharmaceutical-grade botanical that accelerates cellular repair and provides immediate cooling relief to heat-stressed or sun-exposed skin." />
                <div className="thin-divider" style={{ margin: '0' }}></div>
                <IngredientItem icon={<Shield color="var(--surface-tint)" size={24} />} title="Tocotrienols" description="The most potent form of Vitamin E available, neutralizing free radicals and preventing the oxidative damage that leads to premature aging." />
                <div className="thin-divider" style={{ margin: '0' }}></div>
                <IngredientItem icon={<Leaf color="var(--surface-tint)" size={24} />} title="Olive Squalane" description="A skin-identical lipid that mimics your body’s natural oils to deliver an elegant, silk-like finish without clogging pores." />
                <div className="thin-divider" style={{ margin: '0' }}></div>
                <IngredientItem icon={<Droplets color="var(--surface-tint)" size={24} />} title="MCT Oil" description="A clean, stable lipid that deeply nourishes the skin barrier, ensuring the HPR Technology is delivered efficiently and comfortably." />
              </div>
            </div>

            <div>
              <img src="/assets/ingredients-image.jpg" alt="Scientist formulating in lab" style={{ width: '100%', borderRadius: '16px', objectFit: 'cover' }} />
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="section-padding" style={{ backgroundColor: 'var(--surface-container-highest)', textAlign: 'center' }}>
        <div className="container">
          <h2 className="headline-md" style={{ marginBottom: '32px', color: 'var(--primary)' }}>Ready to Join the Inner Circle?</h2>
          <p className="body-lg" style={{ color: 'var(--on-surface-variant)', marginBottom: '48px', maxWidth: '600px', margin: '0 auto 48px auto' }}>
            Don't miss the first drop. Secure your priority reservation for Batch 001 today.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Link to="/waitlist" className="lfto-btn lfto-btn-primary" style={{ textDecoration: 'none' }}>
              Reserve Your Bottle
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

const IngredientItem: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
  <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
    <div style={{ flexShrink: 0 }}>{icon}</div>
    <div>
      <h3 className="label-caps" style={{ fontSize: '14px', marginBottom: '8px', color: 'var(--primary)' }}>{title}</h3>
      <p className="body-md" style={{ color: 'var(--on-surface-variant)', margin: 0 }}>{description}</p>
    </div>
  </div>
);

// --- Main App ---

function App() {
  return (
    <AuthProvider>
      <div style={{ minHeight: '100vh' }}>
        <ScrollToTop />
        <FishSwarm />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/waitlist" element={<WaitlistInnerCircle />} />
          <Route path="/feedback" element={<FeedbackPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="influencers" element={<InfluencerTracker />} />
            <Route path="tasks" element={<TaskBoard />} />
          </Route>
        </Routes>
        <footer style={{ padding: '64px 0', backgroundColor: 'var(--primary)', color: 'var(--on-primary)', textAlign: 'center' }}>
          <p className="label-caps" style={{ marginBottom: '24px' }}>© 2027 Lotion From The Ocean. All Rights Reserved.</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '32px' }}>
            <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '11px' }} className="label-caps">Home</Link>
            <Link to="/waitlist" style={{ color: 'white', textDecoration: 'none', fontSize: '11px' }} className="label-caps">Waitlist</Link>
            <Link to="/feedback" style={{ color: 'white', textDecoration: 'none', fontSize: '11px' }} className="label-caps">Share Feedback</Link>
          </div>
        </footer>
      </div>
    </AuthProvider>
  );
}

export default App;
