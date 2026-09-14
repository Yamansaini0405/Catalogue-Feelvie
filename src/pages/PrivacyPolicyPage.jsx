import feelVieLogo from '../assets/feelVie.png'

const sections = [
  { id: 'intro', title: '1. Introduction' },
  { id: 'collect', title: '2. Information We Collect' },
  { id: 'use', title: '3. How We Use Information' },
  { id: 'share', title: '4. Sharing Information' },
  { id: 'security', title: '5. Data Security' },
  { id: 'rights', title: '6. Your Rights' },
  { id: 'cookies', title: '7. Cookies & Tracking' },
  { id: 'thirdparty', title: '8. Third-Party Links' },
  { id: 'children', title: '9. Children\'s Privacy' },
  { id: 'retention', title: '10. Data Retention' },
  { id: 'international', title: '11. International Transfers' },
  { id: 'changes', title: '12. Policy Changes' },
  { id: 'contact', title: '13. Contact Us' },
];

function PrivacyPolicyPage() {
  return (
    <div className='min-h-screen bg-white font-sans text-slate-900'>
      {/* Refined Header */}
      <header className='sticky top-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-md'>
        <div className='mx-auto flex max-w-7xl items-center justify-between px-6 py-4'>
          <img src={feelVieLogo} alt='FeelVie' className='h-8 w-auto' />
          <div className='flex items-center gap-8'>
            <nav className='hidden space-x-6 text-sm font-medium md:flex'>
              <a href="#" className='hover:text-[#803385]'>Shop</a>
              <a href="#" className='hover:text-[#803385]'>Catalog</a>
              <a href="#" className='text-[#803385]'>Legal</a>
            </nav>
            <button className='rounded-full bg-slate-900 px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-white transition-all hover:bg-[#803385]'>
              Get the App
            </button>
          </div>
        </div>
      </header>

      <main className='mx-auto max-w-7xl px-6 py-16 md:py-'>
        <div className='flex flex-col gap-16 lg:flex-row'>
          
          {/* Left: Sticky Sidebar Navigation */}
          <aside className='hidden w-64 lg:block'>
            <div className='sticky top-32'>
              <h3 className='mb-6 text-xs font-bold uppercase tracking-widest text-slate-400'>Contents</h3>
              <nav className='space-y-4'>
                {sections.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className='block text-sm text-slate-500 transition-colors hover:text-[#803385]'
                  >
                    {item.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Right: Content Section */}
          <article className='max-w-3xl'>
            <div className='mb-16 border-b border-slate-100 pb-12'>
              <h1 className='text-5xl font-light tracking-tight text-slate-900 md:text-6xl'>
                Privacy <span className='font-serif italic'>Policy</span>
              </h1>
              <p className='mt-6 text-lg text-slate-500'>
                Your privacy is our priority. This policy outlines how we handle your data with transparency and care.
              </p>
              <p className='mt-4 text-xs font-medium uppercase tracking-widest text-slate-400'>
                Effective: March 23, 2026
              </p>
            </div>

            <div className='prose prose-slate prose-sm max-w-none space-y-16'>
              <section id='intro'>
                <h2 className='text-2xl font-semibold text-slate-900'>1. Introduction</h2>
                <p className='mt-4 leading-relaxed text-slate-600'>
                  Welcome to FeelVie. We are committed to protecting your privacy and ensuring you have a positive experience on our platform. 
                  This Privacy Policy explains our practices regarding the collection, use, and protection of information when you use our 
                  website, mobile application, and related services. By accessing and using FeelVie, you acknowledge that you have read, understood, 
                  and agree to be bound by all the terms of this Privacy Policy.
                </p>
              </section>

              <section id='collect'>
                <h2 className='text-2xl font-semibold text-slate-900'>2. Information We Collect</h2>
                <p className='mt-4 leading-relaxed text-slate-600 mb-4'>
                  We may collect basic information to provide and improve our service:
                </p>
                <div className='mt-6 grid gap-6 md:grid-cols-2'>
                  <div className='border-l-2 border-[#803385] pl-4'>
                    <h4 className='font-bold text-slate-900'>Account Information</h4>
                    <p className='mt-1 text-sm text-slate-600'>Information you provide when registering for our service.</p>
                  </div>
                  <div className='border-l-2 border-[#803385] pl-4'>
                    <h4 className='font-bold text-slate-900'>Usage Information</h4>
                    <p className='mt-1 text-sm text-slate-600'>Information about how you interact with our application.</p>
                  </div>
                </div>
              </section>

              <section id='use'>
                <h2 className='text-2xl font-semibold text-slate-900'>3. How We Use Your Information</h2>
                <p className='mt-4 leading-relaxed text-slate-600 mb-4'>
                  We use your information to:
                </p>
                <ul className='mt-4 list-none space-y-3 p-0 text-slate-600'>
                  {[
                    'Provide and maintain our service',
                    'Process transactions',
                    'Respond to your requests',
                    'Improve our application'
                  ].map((text) => (
                    <li key={text} className='flex items-start gap-3'>
                      <span className='h-1.5 w-1.5 rounded-full bg-[#803385] mt-1.5 flex-shrink-0'></span>
                      <span>{text}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section id='share'>
                <h2 className='text-2xl font-semibold text-slate-900'>4. Sharing Information</h2>
                <p className='mt-4 leading-relaxed text-slate-600 mb-4'>
                  We do not sell your personal information. We may share information with:
                </p>
                <div className='mt-6 space-y-4'>
                  <div className='border-l-4 border-[#803385] bg-slate-50 p-4 pl-4'>
                    <h4 className='font-bold text-slate-900'>Service Providers</h4>
                    <p className='mt-2 text-sm text-slate-600'>Third parties who help us provide our service.</p>
                  </div>
                  <div className='border-l-4 border-[#803385] bg-slate-50 p-4 pl-4'>
                    <h4 className='font-bold text-slate-900'>Legal Requirements</h4>
                    <p className='mt-2 text-sm text-slate-600'>When required by law or legal process.</p>
                  </div>
                </div>
              </section>

              <section id='security'>
                <h2 className='text-2xl font-semibold text-slate-900'>5. Data Security</h2>
                <p className='mt-4 leading-relaxed text-slate-600 mb-4'>
                  We take reasonable steps to protect your information. However, no online platform is completely secure. We implement standard security measures to protect your data.
                </p>
              </section>

              <section id='rights'>
                <h2 className='text-2xl font-semibold text-slate-900'>6. Your Rights and Choices</h2>
                <p className='mt-4 leading-relaxed text-slate-600 mb-4'>
                  You have the right to:
                </p>
                <ul className='mt-4 list-none space-y-3 p-0 text-slate-600'>
                  {[
                    'Access your account information',
                    'Update or delete your account',
                    'Opt out of communications'
                  ].map((text) => (
                    <li key={text} className='flex items-start gap-3'>
                      <span className='h-1.5 w-1.5 rounded-full bg-[#803385] mt-1.5 flex-shrink-0'></span>
                      <span>{text}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section id='cookies'>
                <h2 className='text-2xl font-semibold text-slate-900'>7. Cookies and Tracking Technologies</h2>
                <p className='mt-4 leading-relaxed text-slate-600'>
                  Our service may use cookies and similar technologies to enhance your experience. You can control cookie settings through your browser.
                </p>
              </section>

              <section id='thirdparty'>
                <h2 className='text-2xl font-semibold text-slate-900'>8. Third-Party Links</h2>
                <p className='mt-4 leading-relaxed text-slate-600'>
                  Our service may contain links to third-party websites. We are not responsible for their privacy practices.
                </p>
              </section>

              <section id='children'>
                <h2 className='text-2xl font-semibold text-slate-900'>9. Children's Privacy</h2>
                <p className='mt-4 leading-relaxed text-slate-600'>
                  Our service is not intended for children under 13. We do not knowingly collect information from children under 13.
                </p>
              </section>

              <section id='retention'>
                <h2 className='text-2xl font-semibold text-slate-900'>10. Data Retention</h2>
                <p className='mt-4 leading-relaxed text-slate-600'>
                  We retain your information for as long as necessary to provide our service or as required by law.
                </p>
              </section>

              <section id='international'>
                <h2 className='text-2xl font-semibold text-slate-900'>11. International Data Transfers</h2>
                <p className='mt-4 leading-relaxed text-slate-600'>
                  Your information may be transferred to other countries that may have different privacy laws.
                </p>
              </section>

              <section id='changes'>
                <h2 className='text-2xl font-semibold text-slate-900'>12. Changes to This Privacy Policy</h2>
                <p className='mt-4 leading-relaxed text-slate-600'>
                  We may update this policy from time to time. We will notify you of any material changes by updating the date at the top of this page.
                </p>
              </section>
              
              <section id='contact' className='rounded-2xl bg-slate-50 p-8 border border-slate-200'>
                <h2 className='text-2xl font-semibold text-slate-900'>13. Contact Us</h2>
                <p className='mt-4 text-slate-600'>
                  For any privacy-related inquiries, concerns, or requests regarding this Privacy Policy or our privacy practices, please reach out to our legal team.
                </p>
                
                <p className='mt-6 text-sm text-slate-600'>
                  We will respond to your inquiry within 30 days. Please note that we may require you to verify your identity before processing your request.
                </p>
              </section>

              <div className='mt-16 rounded-2xl bg-gradient-to-r from-[#D6448B] to-[#803385] p-8 text-white'>
                <h3 className='text-xl font-semibold'>Your Privacy Matters</h3>
                <p className='mt-3 text-sm text-white/90'>
                  By using FeelVie, you acknowledge that you have read and understood this Privacy Policy and agree to its terms. 
                  Your continued use of our Service constitutes your acceptance of this policy. We appreciate your trust and are committed 
                  to safeguarding your personal information.
                </p>
              </div>
            </div>
          </article>
        </div>
      </main>

      {/* Modern High-End Footer */}
      <footer className='bg-slate-900 py-20 text-white'>
        <div className='mx-auto max-w-7xl px-6'>
          <div className='grid grid-cols-1 gap-12 border-b border-slate-800 pb-20 lg:grid-cols-2'>
            <div>
              <h2 className='text-4xl font-light tracking-tight md:text-5xl'>Join the <span className='italic font-serif text-slate-400'>FeelVie</span> movement.</h2>
              <p className='mt-6 max-w-md text-slate-400'>
                Experience the next generation of fashion curation. 
                Download the app for exclusive access to upcoming collections.
              </p>
            </div>
            <div className='flex flex-col justify-end lg:items-end'>
              <button className='w-fit rounded-full border border-slate-700 px-8 py-4 text-xs font-bold uppercase tracking-widest transition-colors hover:bg-white hover:text-black'>
                Follow on Instagram
              </button>
            </div>
          </div>
          
          <div className='mt-20 grid grid-cols-2 gap-8 md:grid-cols-4'>
            {['General', 'Products', 'Support', 'Social'].map((cat) => (
              <div key={cat}>
                <h4 className='mb-6 text-xs font-bold uppercase tracking-[0.2em] text-slate-500'>{cat}</h4>
                <ul className='space-y-4 text-sm text-slate-300'>
                  <li className='cursor-pointer hover:text-white'>Link Item</li>
                  <li className='cursor-pointer hover:text-white'>Link Item</li>
                  <li className='cursor-pointer hover:text-white'>Link Item</li>
                </ul>
              </div>
            ))}
          </div>
          
          <div className='mt-24 text-[12vw] font-black leading-none text-slate-800/50'>
            FEELVIE
          </div>
        </div>
      </footer>
    </div>
  )
}

export default PrivacyPolicyPage