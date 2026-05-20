import React, { useEffect, useState } from 'react';
import { getWaitlist, getFeedback, WaitlistData, FeedbackData } from '../../services/firebase';
import { Eye, X, BarChart3 } from 'lucide-react';

const QUESTIONS_MAP: Record<string, { question: string; subText: string; options: Record<string, string> }> = {
  hydrate_surface: {
    question: '[H] HYDRATE: Surface Texture',
    subText: 'How does skin feel 5 minutes after application?',
    options: {
      Baseline: 'Baseline: No noticeable change in smoothness.',
      Improved: 'Improved: Skin feels noticeably softer.',
      Optimal: 'Optimal: Supple, deeply hydrated transformation.'
    }
  },
  protect_barrier: {
    question: '[P] PROTECT: Environmental Barrier',
    subText: 'How did the lotion feel as a protective shield?',
    options: {
      Ineffective: 'Ineffective: My skin still felt raw or vulnerable.',
      Resilient: 'Resilient: Noticeable layer that kept skin protected.',
      Fortified: 'Fortified: Completely shielded; no environmental fatigue.'
    }
  },
  revive_recovery: {
    question: '[R] REVIVE: Post-Sun Recovery',
    subText: 'How did the formula affect redness or heat-dryness?',
    options: {
      'No Impact': 'No Impact: Redness and dryness remained the same.',
      Effective: 'Effective: Noticeable reduction in heat and redness.',
      'Elite Recovery': 'Elite Recovery: Redness vanished; cool, smooth skin.'
    }
  },
  repair_trouble: {
    question: 'REPAIR: Dry & Flaky Areas',
    subText: 'How did it perform on trouble spots that were flaky?',
    options: {
      'No Change': 'No Change: Flakiness persisted.',
      Refined: 'Refined: Visible reduction in dry patches.',
      Restored: 'Restored: Flakiness eliminated; healthy texture.',
      'N/A': 'N/A: No dry/flaky skin during this test.'
    }
  },
  sensory_finish: {
    question: 'SENSORY: Absorption & Finish',
    subText: 'Which best describes the final feel on skin?',
    options: {
      Heavy: 'Heavy: Felt oily, sticky, or sat on top.',
      Balanced: 'Balanced: Initial residue that absorbed in minutes.',
      'Silk-Tech': 'Silk-Tech: Instant absorption; silky-smooth finish.'
    }
  }
};

const AdminDashboard: React.FC = () => {
  const [waitlist, setWaitlist] = useState<(WaitlistData & { id: string })[]>([]);
  const [feedback, setFeedback] = useState<(FeedbackData & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Selected survey feedback details in the Q&A viewer modal
  const [selectedSurvey, setSelectedSurvey] = useState<(FeedbackData & { id: string }) | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [waitlistData, feedbackData] = await Promise.all([
          getWaitlist(),
          getFeedback(),
        ]);
        setWaitlist(waitlistData as (WaitlistData & { id: string })[]);
        setFeedback(feedbackData as (FeedbackData & { id: string })[]);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatsForQuestion = (qId: string) => {
    const counts: Record<string, number> = {};
    let total = 0;
    
    feedback.forEach(item => {
      const answer = item.answers?.[qId];
      if (answer) {
        counts[answer] = (counts[answer] || 0) + 1;
        total++;
      }
    });

    return { counts, total };
  };

  const getOptionColor = (val: string): string => {
    const v = val.toUpperCase();
    if (v.includes('OPTIMAL') || v.includes('FORTIFIED') || v.includes('ELITE') || v.includes('RESTORED') || v.includes('SILK')) {
      return '#2e7d32'; // Premium Green
    }
    if (v.includes('IMPROVED') || v.includes('RESILIENT') || v.includes('EFFECTIVE') || v.includes('REFINED') || v.includes('BALANCED')) {
      return '#b8860b'; // Gold/Amber
    }
    return '#757575'; // Slate/Gray
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '40px', color: 'var(--outline)' }}>Loading Dashboard...</div>;
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
      {/* Premium Compact Header */}
      <h1 style={{ margin: '0 0 6px 0', fontSize: '24px', fontWeight: 700, color: 'var(--primary)', fontFamily: "'Montserrat', sans-serif" }}>
        Dashboard Overview
      </h1>
      <p style={{ margin: '0 0 32px 0', fontSize: '14px', color: 'var(--on-surface-variant)', fontFamily: "'Inter', sans-serif" }}>
        Real-time metrics, product survey responses, and waitlist signups.
      </p>

      {/* Redesigned Sleek Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px', marginBottom: '48px' }}>
        <div style={{ 
          backgroundColor: 'rgba(0, 122, 255, 0.015)', 
          border: '1px solid rgba(0, 122, 255, 0.12)', 
          padding: '24px', 
          borderRadius: '12px',
          boxShadow: '0 2px 10px rgba(0, 122, 255, 0.01)'
        }}>
          <h3 style={{ margin: '0 0 6px 0', fontSize: '11px', fontWeight: 700, color: '#0066cc', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Total Waitlist
          </h3>
          <p style={{ fontSize: '32px', fontWeight: 700, color: 'var(--primary)', margin: 0, lineHeight: 1 }}>
            {waitlist.length}
          </p>
        </div>

        <div style={{ 
          backgroundColor: 'rgba(76, 175, 80, 0.015)', 
          border: '1px solid rgba(76, 175, 80, 0.12)', 
          padding: '24px', 
          borderRadius: '12px',
          boxShadow: '0 2px 10px rgba(76, 175, 80, 0.01)'
        }}>
          <h3 style={{ margin: '0 0 6px 0', fontSize: '11px', fontWeight: 700, color: '#2e7d32', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Total Surveys Completed
          </h3>
          <p style={{ fontSize: '32px', fontWeight: 700, color: 'var(--primary)', margin: 0, lineHeight: 1 }}>
            {feedback.length}
          </p>
        </div>
      </div>

      {/* Waitlist Section */}
      <div style={{ marginBottom: '48px' }}>
        <h2 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: "'Montserrat', sans-serif" }}>
          Recent Waitlist Signups
        </h2>
        <div style={{ overflowX: 'auto', backgroundColor: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--outline-variant)', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--surface-container-highest)', textAlign: 'left' }}>
                <th style={{ padding: '14px 16px', borderBottom: '1px solid var(--outline-variant)', color: 'var(--on-surface-variant)', fontWeight: 600 }}>Name</th>
                <th style={{ padding: '14px 16px', borderBottom: '1px solid var(--outline-variant)', color: 'var(--on-surface-variant)', fontWeight: 600 }}>Email</th>
                <th style={{ padding: '14px 16px', borderBottom: '1px solid var(--outline-variant)', color: 'var(--on-surface-variant)', fontWeight: 600 }}>Source</th>
              </tr>
            </thead>
            <tbody>
              {waitlist.slice(0, 10).map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--outline-variant)' }}>
                  <td style={{ padding: '14px 16px', color: 'var(--on-surface)' }}>{item.fullName}</td>
                  <td style={{ padding: '14px 16px', color: 'var(--on-surface)' }}>{item.email}</td>
                  <td style={{ padding: '14px 16px', color: 'var(--on-surface-variant)' }}>{item.source}</td>
                </tr>
              ))}
              {waitlist.length === 0 && (
                <tr>
                  <td colSpan={3} style={{ padding: '24px', textAlign: 'center', color: 'var(--outline)' }}>No waitlist signups recorded yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Survey Performance Analytics Charts */}
      <div style={{ marginBottom: '48px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <BarChart3 size={18} style={{ color: 'var(--primary)' }} />
          <h2 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: "'Montserrat', sans-serif" }}>
            Product Performance Analytics
          </h2>
        </div>
        
        {feedback.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px', 
            border: '1px dashed var(--outline-variant)', 
            borderRadius: '12px', 
            backgroundColor: 'var(--surface)',
            color: 'var(--outline)',
            fontSize: '14px',
            fontFamily: "'Inter', sans-serif"
          }}>
            Collect surveys to unlock detailed graphical performance analytics.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
            {Object.entries(QUESTIONS_MAP).map(([qId, q]) => {
              const { counts, total } = getStatsForQuestion(qId);
              return (
                <div key={qId} style={{ 
                  backgroundColor: 'var(--surface)', 
                  border: '1px solid var(--outline-variant)', 
                  borderRadius: '12px', 
                  padding: '20px', 
                  boxShadow: '0 2px 8px rgba(0,0,0,0.015)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  <h3 style={{ margin: 0, fontSize: '12.5px', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: "'Montserrat', sans-serif", borderBottom: '1px solid var(--outline-variant)', paddingBottom: '8px' }}>
                    {q.question}
                  </h3>
                  <p style={{ margin: '2px 0 6px 0', fontSize: '11px', color: 'var(--on-surface-variant)', fontStyle: 'italic', fontFamily: "'Inter', sans-serif", minHeight: '28px', lineHeight: '1.4' }}>
                    {q.subText}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '4px' }}>
                    {Object.entries(q.options).map(([optVal, optLabel]) => {
                      const count = counts[optVal] || 0;
                      const percent = total > 0 ? Math.round((count / total) * 100) : 0;
                      const barColor = getOptionColor(optVal);
                      
                      return (
                        <div key={optVal} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', color: 'var(--on-surface)', fontFamily: "'Inter', sans-serif" }}>
                            <span style={{ fontWeight: 500, maxWidth: '75%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={optLabel}>
                              {optLabel}
                            </span>
                            <span style={{ fontWeight: 600, color: barColor }}>
                              {percent}% ({count})
                            </span>
                          </div>
                          {/* Custom Progress Bar Capsule */}
                          <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--surface-container-highest)', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ 
                              width: `${percent}%`, 
                              height: '100%', 
                              backgroundColor: barColor, 
                              borderRadius: '4px',
                              transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
                            }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Feedback Section */}
      <div style={{ marginBottom: '56px' }}>
        <h2 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: "'Montserrat', sans-serif" }}>
          Recent Customer Surveys & Feedback
        </h2>
        <div style={{ overflowX: 'auto', backgroundColor: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--outline-variant)', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--surface-container-highest)', textAlign: 'left' }}>
                <th style={{ padding: '14px 16px', borderBottom: '1px solid var(--outline-variant)', color: 'var(--on-surface-variant)', fontWeight: 600 }}>Respondent</th>
                <th style={{ padding: '14px 16px', borderBottom: '1px solid var(--outline-variant)', color: 'var(--on-surface-variant)', fontWeight: 600 }}>Email Address</th>
                <th style={{ padding: '14px 16px', borderBottom: '1px solid var(--outline-variant)', color: 'var(--on-surface-variant)', fontWeight: 600 }}>General Comments</th>
                <th style={{ padding: '14px 16px', borderBottom: '1px solid var(--outline-variant)', color: 'var(--on-surface-variant)', fontWeight: 600, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {feedback.slice(0, 10).map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--outline-variant)' }}>
                  <td style={{ padding: '14px 16px', color: 'var(--on-surface)', fontWeight: 500 }}>{item.firstName}</td>
                  <td style={{ padding: '14px 16px', color: 'var(--on-surface)' }}>{item.email}</td>
                  <td style={{ padding: '14px 16px', color: 'var(--on-surface-variant)', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.comments || '-'}
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                    <button 
                      onClick={() => setSelectedSurvey(item)}
                      style={{ 
                        background: 'none', 
                        border: 'none', 
                        cursor: 'pointer', 
                        color: 'var(--primary)', 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: '6px',
                        fontWeight: 600,
                        fontSize: '13px',
                        padding: '4px 8px',
                        borderRadius: '4px'
                      }}
                      title="View Survey Q&A"
                    >
                      <Eye size={15} /> View Q&A
                    </button>
                  </td>
                </tr>
              ))}
              {feedback.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ padding: '24px', textAlign: 'center', color: 'var(--outline)' }}>No surveys recorded yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Survey Q&A Overlay Modal */}
      {selectedSurvey && (
        <div style={{ 
          position: 'fixed', 
          top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: 'rgba(0,0,0,0.5)', 
          backdropFilter: 'blur(8px)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          zIndex: 1000,
          padding: '16px'
        }}>
          <div style={{ 
            backgroundColor: 'var(--surface)', 
            borderRadius: '16px', 
            border: '1px solid var(--outline-variant)', 
            width: '100%', 
            maxWidth: '640px', 
            maxHeight: '90vh', 
            display: 'flex', 
            flexDirection: 'column',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
            animation: 'fadeIn 0.2s ease-out'
          }}>
            {/* Modal Header */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              padding: '20px 24px', 
              borderBottom: '1px solid var(--outline-variant)'
            }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: 'var(--primary)', fontFamily: "'Montserrat', sans-serif" }}>
                  Product Performance Survey
                </h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--on-surface-variant)' }}>
                  Submitted by {selectedSurvey.firstName} ({selectedSurvey.email})
                </p>
              </div>
              <button 
                onClick={() => setSelectedSurvey(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--on-surface-variant)', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body (Scrollable Questions list) */}
            <div style={{ padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {Object.entries(QUESTIONS_MAP).map(([key, q]) => {
                const answerKey = selectedSurvey.answers?.[key];
                const fullAnswer = q.options[answerKey] || answerKey || 'Not Answered';
                return (
                  <div key={key} style={{ borderBottom: '1px solid var(--outline-variant)', paddingBottom: '16px' }}>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '13px', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: "'Montserrat', sans-serif" }}>
                      {q.question}
                    </h4>
                    <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: 'var(--on-surface-variant)', fontStyle: 'italic', fontFamily: "'Inter', sans-serif" }}>
                      {q.subText}
                    </p>
                    <div style={{ 
                      backgroundColor: 'rgba(212, 175, 55, 0.05)', 
                      borderLeft: '3px solid var(--secondary)', 
                      padding: '10px 14px', 
                      borderRadius: '4px', 
                      fontSize: '13px', 
                      color: 'var(--on-surface)',
                      fontWeight: 500
                    }}>
                      {fullAnswer}
                    </div>
                  </div>
                );
              })}

              {/* Comments Box */}
              {selectedSurvey.comments && (
                <div style={{ 
                  backgroundColor: 'var(--surface-container-low)', 
                  padding: '16px', 
                  borderRadius: '10px', 
                  border: '1px solid var(--outline-variant)' 
                }}>
                  <h4 style={{ margin: '0 0 6px 0', fontSize: '11px', fontWeight: 700, color: 'var(--on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Additional Comments & Thoughts
                  </h4>
                  <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--on-surface)', lineHeight: '1.6', fontStyle: 'italic' }}>
                    "{selectedSurvey.comments}"
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div style={{ 
              padding: '16px 24px', 
              borderTop: '1px solid var(--outline-variant)', 
              display: 'flex', 
              justifyContent: 'flex-end',
              backgroundColor: 'var(--surface-container-lowest)',
              borderBottomLeftRadius: '16px',
              borderBottomRightRadius: '16px'
            }}>
              <button 
                onClick={() => setSelectedSurvey(null)}
                className="lfto-btn"
                style={{ padding: '8px 16px', fontSize: '13px' }}
              >
                Close Survey View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
