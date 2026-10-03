'use client';

import React, { useState } from 'react';
import { BookOpen, Sparkles, Award, ArrowRight, ShieldCheck, HeartPulse, ExternalLink } from 'lucide-react';
import { useDoctorContext } from '@/context/DoctorContext';

const BLOG_POSTS = [
  {
    id: 'paracetamol',
    category: 'Medication Guide',
    date: 'Oct 2026',
    title: 'Paracetamol for Fever & Body Pain: Effects & Side Effects',
    excerpt: 'As soon as the flu season starts, many turn to over-the-counter drugs like Paracetamol. Learn about safe dosages, liver safety, and potential side effects before choosing fever tablets.',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80',
    tag: 'Trending',
  },
  {
    id: 'dementia',
    category: 'Neurology Insights',
    date: 'Sep 2026',
    title: 'Early Signs of Dementia: Symptoms & Cognitive Changes',
    excerpt: 'Dementia does not always begin with obvious memory loss. Early subtle changes often appear in routine decision-making, language retrieval, and emotional regulation.',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=500&auto=format&fit=crop&q=80',
    tag: 'Clinical Guide',
  },
  {
    id: 'cerebral-palsy',
    category: 'Pediatric Care',
    date: 'Oct 2026',
    title: 'World Cerebral Palsy Day: Challenging Barriers & Inclusive Care',
    excerpt: 'Celebrating resilience and exploring modern neuro-rehabilitation therapies, robotic gait training, and personalized pediatric physical support.',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=500&auto=format&fit=crop&q=80',
    tag: 'Awareness',
  },
];

const RARE_CASES = [
  {
    title: 'World’s 1ˢᵗ Same-Day Discharge Bilateral Total Knee Replacement',
    hospital: 'Doctor Demo Speciality Centre, New Delhi',
    lead: 'Dr. Sujoy Bhattacharjee (Chairman Robotic Joints Replacement)',
    story: 'Successfully completed the world’s first same-day discharge of both knee replacement surgeries for a 65-year-old patient from Agra with next-day independent walking.',
    badge: 'World Record',
  },
  {
    title: 'Rare Aortic Arch Replacement Using Frozen Elephant Trunk Technique',
    hospital: 'Doctor Demo Super Speciality Hospital, Mohali',
    lead: 'Department of Cardiovascular & Thoracic Surgery',
    story: 'Complex surgical repair of a life-threatening aortic arch dissection involving high-risk arterial branching into brain and spinal cord.',
    badge: 'Advanced CTVS',
  },
  {
    title: 'Bilateral Hand Transplantation from Female Donor to Male Recipient',
    hospital: 'Doctor Demo Hospital, Mumbai',
    lead: 'Plastic & Reconstructive Microsurgery Team',
    story: '18-year-old trauma amputee restored with bilateral vascularized composite allotransplantation with 98% nerve re-innervation.',
    badge: 'Micro Surgery',
  },
  {
    title: 'Young Man Recovers After Rare and Complex Liver Surgery',
    hospital: 'Doctor Demo Super Speciality Hospital, Lucknow',
    lead: 'Liver Transplant & Biliary Sciences Team',
    story: '27-year-old patient with months of severe abdominal pain and recurrent sepsis successfully cured via precision biliary reconstruction.',
    badge: 'Transplant Care',
  }
];

export default function HealthBlogs() {
  const [activeBlogTab, setActiveBlogTab] = useState<'blogs' | 'rare-cases' | 'updates'>('blogs');
  const { openBooking } = useDoctorContext();

  return (
    <section className="health-blogs-section" id="health-blogs">
      <div className="blogs-container">
        {/* Section Heading & Subtabs */}
        <div className="section-title-wrap">
          <div>
            <span className="section-eyebrow">Medical Knowledge & Breakthroughs</span>
            <h2 className="section-main-title">Health Blogs & Clinical Updates</h2>
          </div>

          <div className="subtabs-toggle">
            <button
              type="button"
              className={`subtab-btn ${activeBlogTab === 'blogs' ? 'active' : ''}`}
              onClick={() => setActiveBlogTab('blogs')}
            >
              Health Blogs
            </button>
            <button
              type="button"
              className={`subtab-btn ${activeBlogTab === 'rare-cases' ? 'active' : ''}`}
              onClick={() => setActiveBlogTab('rare-cases')}
            >
              Rare Cases
            </button>
            <button
              type="button"
              className={`subtab-btn ${activeBlogTab === 'updates' ? 'active' : ''}`}
              onClick={() => setActiveBlogTab('updates')}
            >
              Hospital Innovations
            </button>
          </div>
        </div>

        {/* Content according to selected tab */}
        {activeBlogTab === 'blogs' && (
          <div className="blogs-cards-grid">
            {BLOG_POSTS.map((blog) => (
              <article key={blog.id} className="blog-article-card">
                <div className="blog-img-wrapper">
                  <img src={blog.image} alt={blog.title} className="blog-img" />
                  <span className="blog-tag-pill">{blog.tag}</span>
                </div>

                <div className="blog-card-content">
                  <div className="blog-meta-line">
                    <span className="blog-category">{blog.category}</span>
                    <span className="blog-dot">•</span>
                    <span className="blog-read-time">{blog.readTime}</span>
                  </div>

                  <h3 className="blog-title">{blog.title}</h3>
                  <p className="blog-excerpt">{blog.excerpt}</p>

                  <button 
                    type="button" 
                    className="read-more-btn"
                    onClick={() => openBooking()}
                  >
                    <span>Consult a Doctor on this</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        {activeBlogTab === 'rare-cases' && (
          <div className="rare-cases-grid">
            {RARE_CASES.map((rc, i) => (
              <div key={i} className="rare-case-card">
                <div className="case-header-row">
                  <span className="case-badge">{rc.badge}</span>
                  <span className="case-hosp">{rc.hospital}</span>
                </div>
                <h4 className="case-title">{rc.title}</h4>
                <p className="case-lead"><strong>Lead Team:</strong> {rc.lead}</p>
                <p className="case-story">{rc.story}</p>
              </div>
            ))}
          </div>
        )}

        {activeBlogTab === 'updates' && (
          <div className="updates-cards-grid">
            <div className="update-highlight-card">
              <span className="update-tag">Technology Milestone</span>
              <h3>Introducing Focal One: North India&apos;s 1st Robotic HIFU System for Prostate Cancer</h3>
              <p>
                Focal One is an advanced robotic platform using High-Intensity Focused Ultrasound (HIFU) to deliver precise, non-invasive treatment for localized prostate cancer with zero radiation and minimum hospital stay.
              </p>
              <button type="button" className="consult-tech-btn" onClick={() => openBooking()}>
                Book Consultation with Robotic Uro-Oncology
              </button>
            </div>

            <div className="update-highlight-card">
              <span className="update-tag">Specialized Care</span>
              <h3>Comprehensive Colorectal Care Clinic at Saket</h3>
              <p>
                Specialized state-of-the-art center dedicated to comprehensive care, advanced 3D endo-laparoscopic surgery, and multidisciplinary treatment of diseases affecting the lower GI tract.
              </p>
              <button type="button" className="consult-tech-btn" onClick={() => openBooking()}>
                Book Colorectal Consultation
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
